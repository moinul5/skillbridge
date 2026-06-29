'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemService, analyticsService } from '@/lib/api';
import { useToast } from '../../../hooks/useToast';
import { Spinner } from '../../../components/ui/Loader';
import EmptyState from '../../../components/ui/EmptyState';
import ErrorState from '../../../components/ui/ErrorState';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  FolderPlus, Edit, Trash2, Star, Calendar, 
  MapPin, RefreshCw, BarChart3, LineChart as LineChartIcon,
  Tag, Clock, Coins
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

export default function ManagerDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Manager Analytics overview
  const { data: metrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ['managerMetrics'],
    queryFn: () => analyticsService.getOverview()
  });

  // Fetch charts payloads
  const { data: chartPayload, isLoading: loadingCharts } = useQuery({
    queryKey: ['managerCharts'],
    queryFn: () => analyticsService.getCharts()
  });

  // Fetch Manager's listings (we query all, then filter by managerId = user.uid on client)
  const { data: itemsResponse, isLoading: loadingItems, isError, refetch } = useQuery({
    queryKey: ['managerItems'],
    queryFn: () => itemService.getAll()
  });

  const myItems = itemsResponse?.data?.filter((i: any) => i.managerId === user?.uid) || [];

  // Delete Listing Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => itemService.delete(id),
    onSuccess: () => {
      toast('Travel package listing removed successfully.', 'info', 'Package Deleted');
      queryClient.invalidateQueries({ queryKey: ['managerItems'] });
      queryClient.invalidateQueries({ queryKey: ['managerMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['managerCharts'] });
    },
    onError: (err: any) => {
      toast(err?.response?.data?.message || 'Failed to remove package.', 'error', 'Error');
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this travel package listing? This will also affect bookings matching this package ID.')) {
      deleteMutation.mutate(id);
    }
  };

  if (loadingItems || loadingMetrics || loadingCharts || !mounted) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spinner size={32} />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState 
        message="Could not retrieve listings directory." 
        onRetry={() => refetch()} 
      />
    );
  }

  const categoryData = chartPayload?.categoryChart || [];
  const monthlyData = chartPayload?.monthlyChart || [];

  return (
    <div className="space-y-8 text-xs sm:text-sm">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Manager Dashboard</h1>
          <p className="text-xs text-slate-500">Monitor inquiries, review monthly revenue charts, and publish travel packages</p>
        </div>
        <Link href="/dashboard/manager/listings/new">
          <Button variant="primary" size="sm" className="rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-sm">
            <FolderPlus className="w-4 h-4" /> Create Listing
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-1">
          <p className="text-[10px] text-slate-400 font-semibold uppercase">My Packages</p>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{metrics?.totalPackages || 0}</h3>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-1">
          <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Bookings</p>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{metrics?.totalBookings || 0}</h3>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-1">
          <p className="text-[10px] text-slate-400 font-semibold uppercase">Revenue Confirmed</p>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            ৳{(metrics?.totalRevenue || 0).toLocaleString()}
          </h3>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-1">
          <p className="text-[10px] text-slate-400 font-semibold uppercase">Average Rating</p>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" /> {metrics?.avgRating?.toFixed(1) || '5.0'}
          </h3>
        </div>
      </div>

      {/* Visual Analytics Graphs using Recharts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Line Chart: Monthly Revenue */}
        <div className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-slate-250 flex items-center gap-1.5"><LineChartIcon className="w-4 h-4 text-primary-500" /> Monthly Revenue Trend</h3>
          <div className="h-60 w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Bookings by Destination Category */}
        <div className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-slate-250 flex items-center gap-1.5"><BarChart3 className="w-4 h-4 text-primary-500" /> Bookings Distribution by Category</h3>
          <div className="h-60 w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff', borderRadius: '12px' }} />
                <Bar dataKey="bookings" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                  {categoryData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#059669' : '#0d9488'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Listings Table */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-850 dark:text-slate-200">Active Listing Packages</h3>

        {myItems.length === 0 ? (
          <EmptyState
            title="No packages published"
            message="Publish your first travel package using the create listing form."
            actionLabel="Publish Listing"
            onAction={() => router.push('/dashboard/manager/listings/new')}
          />
        ) : (
          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-850 font-bold text-slate-450 uppercase tracking-wider">
                    <th className="p-4">Package Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Base Price</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {myItems.map((item: any) => (
                    <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-250 shrink-0">
                            <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <h5 className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</h5>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 font-semibold">{item.category}</span>
                      </td>
                      <td className="p-4 font-medium text-slate-500 dark:text-slate-400">
                        {item.location}
                      </td>
                      <td className="p-4 font-extrabold text-slate-900 dark:text-white">
                        ৳{item.price.toLocaleString()} BDT
                      </td>
                      <td className="p-4 font-medium text-slate-600">
                        {item.duration} Days
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1 font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" /> {item.rating.toFixed(1)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/manager/listings/new?id=${item._id}`}>
                            <button className="p-2 border border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-950 rounded-lg text-slate-500" title="Edit Listing">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDelete(item._id)}
                            className="p-2 border border-red-200 dark:border-red-950 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-red-650"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
