'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemService } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { Spinner } from '@/components/ui/Loader';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Search, Edit, Trash2, Star, MapPin, Tag } from 'lucide-react';

export default function AdminItemsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  // Fetch all items
  const { data: itemsResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminItemsList'],
    queryFn: () => itemService.getAll()
  });

  // Delete Listing Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => itemService.delete(id),
    onSuccess: () => {
      toast('Listing package deleted successfully.', 'info', 'Package Removed');
      queryClient.invalidateQueries({ queryKey: ['adminItemsList'] });
      queryClient.invalidateQueries({ queryKey: ['adminMetrics'] });
    },
    onError: (err: any) => {
      toast(err?.response?.data?.message || 'Failed to remove listing.', 'error', 'Error');
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing from the system? This action will affect related bookings.')) {
      deleteMutation.mutate(id);
    }
  };

  const items = itemsResponse?.data || [];

  // Filtered
  const filteredItems = items.filter((i: any) => {
    const name = i.name?.toLowerCase() || '';
    const loc = i.location?.toLowerCase() || '';
    return name.includes(search.toLowerCase()) || loc.includes(search.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spinner size={32} />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState 
        message="Could not load package listings." 
        onRetry={() => refetch()} 
      />
    );
  }

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">System Listings</h1>
          <p className="text-xs text-slate-500">Monitor and manage all travel packages listed on the platform</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-450" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by package title or location..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 text-xs dark:text-white"
          />
        </div>
      </div>

      {/* Listings Table */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title="No packages found"
          message="Try adjusting search terms."
          actionLabel="Clear Search"
          onAction={() => setSearch('')}
        />
      ) : (
        <div className="border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-850 font-bold text-slate-450 uppercase tracking-wider">
                  <th className="p-4">Package</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-855">
                {filteredItems.map((item: any) => (
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
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-805 text-slate-700 dark:text-slate-350 font-semibold">{item.category}</span>
                    </td>
                    <td className="p-4 font-medium text-slate-500">
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
                          <button className="p-2 border border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-950 rounded-lg text-slate-500" title="Edit Package">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="p-2 border border-red-200 dark:border-red-950 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-red-650"
                          title="Delete Package"
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
  );
}
