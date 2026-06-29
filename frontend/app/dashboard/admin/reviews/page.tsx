'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService, itemService } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { Spinner } from '@/components/ui/Loader';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import { Search, Star, Trash2, User, MessageSquare } from 'lucide-react';

export default function AdminReviewsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  // Fetch all reviews (Express returns all reviews if no itemId filter is passed)
  const { data: reviews = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['adminReviewsList'],
    queryFn: () => reviewService.getByItem('')
  });

  // Fetch all items for mapping titles
  const { data: itemsResponse } = useQuery({
    queryKey: ['adminReviewsItems'],
    queryFn: () => itemService.getAll()
  });

  const items = itemsResponse?.data || [];

  // Delete Review Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => reviewService.delete(id),
    onSuccess: () => {
      toast('Review removed successfully.', 'info', 'Review Deleted');
      queryClient.invalidateQueries({ queryKey: ['adminReviewsList'] });
      queryClient.invalidateQueries({ queryKey: ['itemDetails'] });
    },
    onError: (err: any) => {
      toast(err?.response?.data?.message || 'Failed to remove review.', 'error', 'Error');
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer review? Package rating statistics will be recalculated.')) {
      deleteMutation.mutate(id);
    }
  };

  // Enriched reviews with package titles
  const enrichedReviews = reviews.map((rev: any) => {
    const matchedItem = items.find((i: any) => i._id === rev.itemId);
    return {
      ...rev,
      itemTitle: matchedItem ? matchedItem.name : 'Unknown Package'
    };
  });

  // Filtered
  const filteredReviews = enrichedReviews.filter((r: any) => {
    const comment = r.comment?.toLowerCase() || '';
    const name = r.userName?.toLowerCase() || '';
    const title = r.itemTitle?.toLowerCase() || '';
    return comment.includes(search.toLowerCase()) || name.includes(search.toLowerCase()) || title.includes(search.toLowerCase());
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
        message="Could not load platform review audits." 
        onRetry={() => refetch()} 
      />
    );
  }

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Review Audit</h1>
        <p className="text-xs text-slate-500 font-medium">Audit guest ratings and moderate comments across all tour listings</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-405" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by comments, package name or reviewer name..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 text-xs dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      {filteredReviews.length === 0 ? (
        <EmptyState
          title="No reviews found"
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
                  <th className="p-4">Listing Package</th>
                  <th className="p-4">Reviewer</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Customer Comment</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {filteredReviews.map((rev: any) => (
                  <tr key={rev._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {rev.itemTitle}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-200 shrink-0">
                          {rev.userAvatar ? <img src={rev.userAvatar} alt="Avatar" className="w-full h-full object-cover" /> : <User className="w-4 h-4 text-slate-450 mx-auto" />}
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-250">{rev.userName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" /> {rev.rating}★
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 italic max-w-xs truncate" title={rev.comment}>
                      "{rev.comment}"
                    </td>
                    <td className="p-4 font-medium text-slate-450">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(rev._id)}
                        className="p-2 border border-red-200 dark:border-red-950 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-red-655"
                        title="Delete Review"
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
