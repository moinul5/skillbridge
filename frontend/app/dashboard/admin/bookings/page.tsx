'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { Spinner } from '@/components/ui/Loader';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import { 
  CheckCircle2, XCircle, Search, Mail, 
  Phone, User, Trash2, Calendar, Clock 
} from 'lucide-react';

export default function AdminBookingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  // Fetch all bookings (Express endpoint returns all bookings for Admin)
  const { data: bookings = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['adminBookingsList'],
    queryFn: () => bookingService.getAll()
  });

  // Delete BookingMutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => bookingService.delete(id),
    onSuccess: () => {
      toast('Booking record deleted from the system.', 'info', 'Record Removed');
      queryClient.invalidateQueries({ queryKey: ['adminBookingsList'] });
      queryClient.invalidateQueries({ queryKey: ['adminMetrics'] });
    },
    onError: (err: any) => {
      toast(err?.response?.data?.message || 'Failed to remove reservation log.', 'error', 'Error');
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking log from the system? This removes the booking record permanently.')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450"><CheckCircle2 className="w-3 h-3" /> Confirmed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-450"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-450"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  // Filtered
  const filteredBookings = bookings.filter((b: any) => {
    const packageName = b.itemDetails?.name?.toLowerCase() || '';
    const name = b.contactName?.toLowerCase() || '';
    const email = b.contactEmail?.toLowerCase() || '';
    const matchSearch = packageName.includes(search.toLowerCase()) || name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
    const matchStatus = status === 'all' ? true : b.status === status;
    return matchSearch && matchStatus;
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
        message="Could not load bookings list." 
        onRetry={() => refetch()} 
      />
    );
  }

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">System Bookings</h1>
        <p className="text-xs text-slate-500 font-medium">View, analyze, and remove transaction booking logs across the platform</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, email or package title..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 text-xs dark:text-white"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full sm:w-40 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-xs dark:text-white font-medium"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          title="No bookings recorded"
          message="Try adjusting filters or search term."
          actionLabel="Clear Filters"
          onAction={() => { setSearch(''); setStatus('all'); }}
        />
      ) : (
        <div className="border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-850 font-bold text-slate-450 uppercase tracking-wider">
                  <th className="p-4">Package details</th>
                  <th className="p-4">Client Contact</th>
                  <th className="p-4">Dates & Guests</th>
                  <th className="p-4">Inquiry Value</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {filteredBookings.map((b: any) => (
                  <tr key={b._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="p-4">
                      <div>
                        <h5 className="font-bold text-slate-900 dark:text-white line-clamp-1">{b.itemDetails?.name}</h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">{b.itemDetails?.location}</p>
                      </div>
                    </td>
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{b.contactName}</span>
                      </div>
                      <div className="text-[10px] text-slate-450 space-y-0.5">
                        <p className="flex items-center gap-1"><Mail className="w-3 h-3" /> {b.contactEmail}</p>
                        <p className="flex items-center gap-1"><Phone className="w-3 h-3" /> {b.contactPhone}</p>
                      </div>
                    </td>
                    <td className="p-4 space-y-1 text-slate-700 dark:text-slate-350">
                      <p className="font-medium">{new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}</p>
                      <p className="text-[10px] font-bold text-primary-600 dark:text-primary-400">{b.guests} {b.guests === 1 ? 'Guest' : 'Guests'}</p>
                    </td>
                    <td className="p-4 font-extrabold text-slate-900 dark:text-white">
                      ৳{b.totalPrice.toLocaleString()} BDT
                    </td>
                    <td className="p-4">
                      {getStatusBadge(b.status)}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(b._id)}
                        className="p-2 border border-red-200 dark:border-red-950 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-red-650"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
