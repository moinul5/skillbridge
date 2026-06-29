'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { Spinner } from '@/components/ui/Loader';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import { Search, User, ShieldCheck, Mail, Phone, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  // Fetch all platform users
  const { data: users = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['adminUsersList'],
    queryFn: () => userService.getAll()
  });

  // Update Role Mutation
  const roleMutation = useMutation({
    mutationFn: (params: { id: string; role: string }) => userService.updateRole(params.id, params.role),
    onSuccess: (data) => {
      toast(`User role updated to ${data.role.toUpperCase()} successfully.`, 'success', 'Role Saved');
      queryClient.invalidateQueries({ queryKey: ['adminUsersList'] });
    },
    onError: (err: any) => {
      toast(err?.response?.data?.message || 'Failed to modify role.', 'error', 'Error');
    }
  });

  const handleRoleChange = (id: string, role: string) => {
    if (id === currentUser?.uid) {
      toast('Cannot modify your own administrator role to prevent lockout.', 'error', 'Action Prohibited');
      return;
    }
    if (window.confirm(`Are you sure you want to change this user's role to ${role.toUpperCase()}?`)) {
      roleMutation.mutate({ id, role });
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u: any) => {
    const name = u.name?.toLowerCase() || '';
    const email = u.email?.toLowerCase() || '';
    return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
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
        message="Could not load users list from database." 
        onRetry={() => refetch()} 
      />
    );
  }

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">User Directory</h1>
        <p className="text-xs text-slate-500 font-medium">Manage user profiles and update administrative roles</p>
      </div>

      {/* Filter panel */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-405" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email address..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 text-xs dark:text-white"
          />
        </div>
      </div>

      {/* Data Table */}
      {filteredUsers.length === 0 ? (
        <EmptyState
          title="No users matched"
          message="Try adjusting search parameters or clear search term."
          actionLabel="Clear Search"
          onAction={() => setSearch('')}
        />
      ) : (
        <div className="border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-850 font-bold text-slate-450 uppercase tracking-wider">
                  <th className="p-4">User</th>
                  <th className="p-4">Role Claim</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Role Manager</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {filteredUsers.map((u: any) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                          {u.avatarUrl ? <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" /> : <User className="w-4 h-4 text-slate-400 mx-auto" />}
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900 dark:text-white">{u.name}</h5>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                        u.role === 'admin' 
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400' 
                          : u.role === 'manager' 
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400' 
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350'
                      }`}>{u.role}</span>
                    </td>
                    <td className="p-4 font-medium text-slate-500">
                      {u.phoneNumber || 'N/A'}
                    </td>
                    <td className="p-4 font-medium text-slate-450">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={u._id === currentUser?.uid || roleMutation.isPending}
                        className="px-2 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-semibold focus:outline-none dark:text-white"
                      >
                        <option value="user">User</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
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
