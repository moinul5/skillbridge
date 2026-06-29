'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/lib/api';
import { Spinner } from '../../../components/ui/Loader';
import ErrorState from '../../../components/ui/ErrorState';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Users, Layers, DollarSign, Star, Calendar, 
  TrendingUp, BarChart3, ShieldCheck 
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch admin platform analytics
  const { data: metrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ['adminMetrics'],
    queryFn: () => analyticsService.getOverview()
  });

  // Fetch chart payload
  const { data: chartPayload, isLoading: loadingCharts } = useQuery({
    queryKey: ['adminCharts'],
    queryFn: () => analyticsService.getCharts()
  });

  if (loadingMetrics || loadingCharts || !mounted) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spinner size={32} />
      </div>
    );
  }

  const categoryData = chartPayload?.categoryChart || [];
  const monthlyData = chartPayload?.monthlyChart || [];

  return (
    <div className="space-y-8 text-xs sm:text-sm">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-primary-655" /> System Analytics
        </h1>
        <p className="text-xs text-slate-500">Platform-wide statistics, revenue lines, and category distribution maps</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Users</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{metrics?.totalUsers || 0}</h3>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl"><Users className="w-6 h-6" /></div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Active Packages</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{metrics?.totalPackages || 0}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl"><Layers className="w-6 h-6" /></div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">All Reservations</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{metrics?.totalBookings || 0}</h3>
          </div>
          <div className="p-3 bg-primary-500/10 text-primary-650 rounded-2xl"><Calendar className="w-6 h-6" /></div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Gross Revenue</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              ৳{(metrics?.totalRevenue || 0).toLocaleString()}
            </h3>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl"><DollarSign className="w-6 h-6" /></div>
        </div>
      </div>

      {/* Recharts Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Line Chart */}
        <div className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-slate-250 flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-emerald-500" /> Platform Transaction Growth</h3>
          <div className="h-64 w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-slate-250 flex items-center gap-1.5"><BarChart3 className="w-4 h-4 text-primary-500" /> Bookings Distribution by Category</h3>
          <div className="h-64 w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff', borderRadius: '12px' }} />
                <Bar dataKey="bookings" radius={[8, 8, 0, 0]}>
                  {categoryData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
