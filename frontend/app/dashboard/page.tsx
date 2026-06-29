'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService, bookingService, aiService } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { 
  Calendar, CreditCard, Sparkles, MapPin, Star, Compass, 
  ArrowRight, CheckCircle2, AlertCircle, Clock 
} from 'lucide-react';

export default function UserDashboardPage() {
  const { user } = useAuth();

  // Fetch overview metrics
  const { data: metrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ['userMetrics'],
    queryFn: () => analyticsService.getOverview()
  });

  // Fetch bookings list
  const { data: bookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ['userBookings'],
    queryFn: () => bookingService.getAll()
  });

  // Fetch AI Recommendations
  const { data: aiRecs = [], isLoading: loadingRecs } = useQuery({
    queryKey: ['userAiRecommendations'],
    queryFn: () => aiService.getRecommendations()
  });

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

  const recentBookings = bookings.slice(0, 3);

  return (
    <div className="space-y-8 text-xs sm:text-sm transition-colors duration-200">
      
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
        {/* Lights */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl" />
        <div className="space-y-1 relative z-10">
          <h1 className="text-xl sm:text-2xl font-extrabold">Welcome back, {user?.name}!</h1>
          <p className="text-slate-400 text-xs max-w-md">Discover your next travel destination, track ongoing booking approvals, or start customized AI plans.</p>
        </div>
        <Link href="/dashboard/ai-assistant">
          <Button variant="primary" size="sm" className="relative z-10 shadow-lg flex items-center gap-1 text-xs">
            <Sparkles className="w-3.5 h-3.5" /> Plan New Trip
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      {loadingMetrics ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-28 bg-white dark:bg-slate-900 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Reservations</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{metrics?.totalBookings || 0}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl"><Calendar className="w-6 h-6" /></div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Active Trips</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{metrics?.activeBookings || 0}</h3>
            </div>
            <div className="p-3 bg-primary-500/10 text-primary-600 rounded-2xl"><Compass className="w-6 h-6" /></div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Expenditures</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                ৳{(metrics?.totalSpend || 0).toLocaleString()}{' '}
                <span className="text-[10px] font-normal text-slate-400">BDT</span>
              </h3>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl"><CreditCard className="w-6 h-6" /></div>
          </div>
        </div>
      )}

      {/* Main Grid: Bookings on Left, AI Recommendations on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Recent Reservations */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-850 dark:text-slate-200 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary-600" /> Recent Bookings
            </h3>
            <Link href="/dashboard/bookings" className="text-[10px] font-semibold text-primary-500 hover:underline">
              See All
            </Link>
          </div>

          {loadingBookings ? (
            <div className="space-y-2 py-4">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="h-16 bg-slate-50 dark:bg-slate-950 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs text-slate-400">No bookings placed yet.</p>
              <Link href="/explore">
                <Button variant="outline" size="sm" className="mt-4 rounded-xl text-xs">Explore Travel Packages</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking: any) => (
                <div 
                  key={booking._id} 
                  className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-850 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                      <img src={booking.itemDetails?.image} alt={booking.itemDetails?.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{booking.itemDetails?.name}</h4>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {booking.itemDetails?.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-xs text-slate-900 dark:text-white">৳{booking.totalPrice.toLocaleString()}</p>
                    <div className="mt-1">{getStatusBadge(booking.status)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: AI Smart Recommendations */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-850 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary-500 animate-pulse" /> AI Recommendations
            </h3>
            <Link href="/dashboard/recommendations" className="text-[10px] font-semibold text-primary-500 hover:underline">
              See Custom
            </Link>
          </div>

          {loadingRecs ? (
            <div className="space-y-4 py-4">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="h-28 bg-slate-50 dark:bg-slate-950 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : aiRecs.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-xs text-slate-400">Save interests inside settings to get AI matches.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {aiRecs.slice(0, 2).map((rec: any) => (
                <div 
                  key={rec._id} 
                  className="border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/20 group hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-200">
                    <img src={rec.images?.[0]} alt={rec.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/95 dark:bg-slate-950/95 text-slate-850 dark:text-white uppercase tracking-wider">{rec.category}</div>
                  </div>
                  <div className="p-4 space-y-2.5">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{rec.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{rec.location}</p>
                    </div>
                    {rec.recommendationReason && (
                      <p className="text-[10px] leading-relaxed text-slate-500 dark:text-slate-450 italic bg-primary-500/5 p-2 rounded-lg border border-primary-500/10">
                        "{rec.recommendationReason}"
                      </p>
                    )}
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200">৳{rec.price.toLocaleString()} BDT</span>
                      <Link href={`/items/${rec._id}`}>
                        <Button variant="outline" size="sm" className="rounded-xl text-[10px] py-1">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
