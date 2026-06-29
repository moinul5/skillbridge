'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/lib/api';
import { useToast } from '../../../hooks/useToast';
import { Spinner } from '../../../components/ui/Loader';
import EmptyState from '../../../components/ui/EmptyState';
import ErrorState from '../../../components/ui/ErrorState';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { 
  Calendar, CheckCircle2, AlertCircle, Clock, 
  MapPin, RefreshCw, XCircle, Search, ArrowUpDown 
} from 'lucide-react';

export default function UserBookingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch all user bookings
  const { data: bookings = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['userBookingsList'],
    queryFn: () => bookingService.getAll()
  });

  // Cancel Booking Mutation
  const cancelMutation = useMutation({
    mutationFn: (id: string) => bookingService.updateStatus(id, 'cancelled'),
    onSuccess: () => {
      toast('Booking request has been cancelled.', 'info', 'Reservation Cancelled');
      queryClient.invalidateQueries({ queryKey: ['userBookingsList'] });
      queryClient.invalidateQueries({ queryKey: ['userMetrics'] });
    },
    onError: (err: any) => {
      toast(err?.response?.data?.message || 'Failed to cancel reservation.', 'error', 'Error');
    }
  });

  const handleCancelBooking = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this booking request? This action is irreversible.')) {
      cancelMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450"><CheckCircle2 className="w-3 h-3" /> Confirmed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-450"><AlertCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-450"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  // Filter Bookings
  const filteredBookings = bookings.filter((b: any) => {
    const itemName = b.itemDetails?.name?.toLowerCase() || '';
    const itemLocation = b.itemDetails?.location?.toLowerCase() || '';
    const matchSearch = itemName.includes(searchTerm.toLowerCase()) || itemLocation.includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' ? true : b.status === statusFilter;
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
        message="Could not load bookings list from server." 
        onRetry={() => refetch()} 
      />
    );
  }

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">My Travel Bookings</h1>
          <p className="text-xs text-slate-500">Monitor approvals and cancel pending trip requests</p>
        </div>
        <Link href="/explore">
          <Button variant="primary" size="sm" className="rounded-xl font-semibold text-xs">Explore More Tours</Button>
        </Link>
      </div>

      {/* Filter panel */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by package name or location..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 text-xs dark:text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-40 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-xs dark:text-white font-medium"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Bookings Table / Grid */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          title="No bookings found"
          message={searchTerm || statusFilter !== 'all' ? 'Try adjusting filters or clear search term.' : 'You have not reserved any packages. Book one on our Explore page.'}
          actionLabel={searchTerm || statusFilter !== 'all' ? 'Reset Filters' : 'Explore Packages'}
          onAction={() => { setSearchTerm(''); setStatusFilter('all'); }}
        />
      ) : (
        <div className="border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-850 font-bold text-slate-450 uppercase tracking-wider">
                  <th className="p-4">Package</th>
                  <th className="p-4">Date Range</th>
                  <th className="p-4">Guests</th>
                  <th className="p-4">Total Cost</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {filteredBookings.map((b: any) => (
                  <tr key={b._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-250 shrink-0">
                          <img src={b.itemDetails?.image} alt={b.itemDetails?.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900 dark:text-white line-clamp-1">{b.itemDetails?.name}</h5>
                          <p className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-0.5">
                            <MapPin className="w-3 h-3 text-primary-500" /> {b.itemDetails?.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-350">
                      {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold text-slate-850 dark:text-slate-250">
                      {b.guests} {b.guests === 1 ? 'Guest' : 'Guests'}
                    </td>
                    <td className="p-4 font-extrabold text-slate-900 dark:text-white">
                      ৳{b.totalPrice.toLocaleString()} BDT
                    </td>
                    <td className="p-4">
                      {getStatusBadge(b.status)}
                    </td>
                    <td className="p-4 text-right">
                      {b.status === 'pending' ? (
                        <Button
                          onClick={() => handleCancelBooking(b._id)}
                          variant="danger"
                          size="sm"
                          loading={cancelMutation.isPending && cancelMutation.variables === b._id}
                          className="rounded-xl text-[10px] py-1 bg-red-600 hover:bg-red-700 font-semibold"
                        >
                          Cancel
                        </Button>
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-slate-600 font-semibold px-2">Locked</span>
                      )}
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
