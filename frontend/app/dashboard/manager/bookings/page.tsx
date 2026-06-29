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
  Phone, User, ArrowUpDown, RefreshCw, Calendar 
} from 'lucide-react';

export default function ManagerBookingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch all bookings (Express endpoint returns filtered bookings depending on manager role)
  const { data: bookings = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['managerBookingsList'],
    queryFn: () => bookingService.getAll()
  });

  // Action Mutation (Confirm / Cancel)
  const statusMutation = useMutation({
    mutationFn: (params: { id: string; status: string }) => bookingService.updateStatus(params.id, params.status),
    onSuccess: (data) => {
      toast(`Reservation status updated to ${data.status.toUpperCase()} successfully.`, 'success', 'Status Saved');
      queryClient.invalidateQueries({ queryKey: ['managerBookingsList'] });
      queryClient.invalidateQueries({ queryKey: ['managerMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['managerCharts'] });
    },
    onError: (err: any) => {
      toast(err?.response?.data?.message || 'Failed to update reservation status.', 'error', 'Error');
    }
  });

  const handleUpdateStatus = (id: string, status: 'confirmed' | 'cancelled') => {
    if (window.confirm(`Are you sure you want to mark this booking as ${status.toUpperCase()}?`)) {
      statusMutation.mutate({ id, status });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450"><CheckCircle2 className="w-3 h-3" /> Confirmed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-450"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-450"><Calendar className="w-3 h-3 animate-pulse" /> Pending</span>;
    }
  };

  // Filters
  const filteredBookings = bookings.filter((b: any) => {
    const packageName = b.itemDetails?.name?.toLowerCase() || '';
    const contactName = b.contactName?.toLowerCase() || '';
    const contactEmail = b.contactEmail?.toLowerCase() || '';
    const matchSearch = packageName.includes(searchTerm.toLowerCase()) || 
                        contactName.includes(searchTerm.toLowerCase()) || 
                        contactEmail.includes(searchTerm.toLowerCase());
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
        message="Could not retrieve booking logs from server." 
        onRetry={() => refetch()} 
      />
    );
  }

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Listing Bookings</h1>
        <p className="text-xs text-slate-500">Manage client inquiries and update reservation states</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client name, email or package title..."
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

      {/* Bookings Table */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          title="No bookings recorded"
          message={searchTerm || statusFilter !== 'all' ? 'Try adjusting filters or clear search term.' : 'No users have booked your travel packages yet.'}
          actionLabel="Clear Filters"
          onAction={() => { setSearchTerm(''); setStatusFilter('all'); }}
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
                      <div className="text-[10px] text-slate-400 space-y-0.5">
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
                      {b.status === 'pending' ? (
                        <div className="flex justify-end gap-1.5">
                          <Button
                            onClick={() => handleUpdateStatus(b._id, 'confirmed')}
                            variant="primary"
                            size="sm"
                            loading={statusMutation.isPending && statusMutation.variables?.id === b._id}
                            className="rounded-xl text-[10px] py-1 bg-emerald-600 hover:bg-emerald-700 font-semibold"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleUpdateStatus(b._id, 'cancelled')}
                            variant="danger"
                            size="sm"
                            loading={statusMutation.isPending && statusMutation.variables?.id === b._id}
                            className="rounded-xl text-[10px] py-1 font-semibold"
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-slate-600 font-semibold px-2">Processed</span>
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
