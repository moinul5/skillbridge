'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { aiService } from '@/lib/api';
import { Spinner } from '../../../components/ui/Loader';
import ErrorState from '../../../components/ui/ErrorState';
import EmptyState from '../../../components/ui/EmptyState';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Sparkles, MapPin, Compass, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

export default function RecommendationsPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Query AI Smart Recommendations
  const { data: recommendations = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['userAiRecommendationsFull'],
    queryFn: () => aiService.getRecommendations()
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
        message="Failed to load personalized recommendations." 
        onRetry={() => refetch()} 
      />
    );
  }

  return (
    <div className="space-y-8 text-xs sm:text-sm transition-colors duration-200">
      
      {/* Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400">
          <Sparkles className="w-3.5 h-3.5" /> AI Engine Active
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Personalized Recommendations</h1>
        <p className="text-xs text-slate-500">Curated suggestions matching your budget and travel style preferences</p>
      </div>

      {/* Preferences Pill Displays */}
      <div className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl flex flex-wrap gap-4 items-center justify-between shadow-sm">
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800 dark:text-slate-200">Your Preference Profile</h4>
          <p className="text-xs text-slate-400">Modify these settings in your Profile Tab to update suggestions</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {user?.preferences?.interests?.map(i => (
            <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-850 rounded-xl text-slate-700 dark:text-slate-350 capitalize font-medium">{i}</span>
          )) || <span className="text-slate-400">No interests selected</span>}
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold capitalize">Budget: {user?.preferences?.budget || 'moderate'}</span>
        </div>
      </div>

      {/* Recommendations listing */}
      {recommendations.length === 0 ? (
        <EmptyState
          title="No recommendations matched"
          message="Complete your interest profile inside settings to generate custom packages."
          actionLabel="Edit Settings"
          onAction={() => router.push('/dashboard/profile')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recommendations.map((rec: any) => (
            <div 
              key={rec._id} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-150">
                <img src={rec.images?.[0]} alt={rec.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 dark:bg-slate-950/95 text-slate-850 dark:text-white uppercase tracking-wider">{rec.category}</span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{rec.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3.5 h-3.5 text-primary-500" /> {rec.location}</p>
                  </div>
                  
                  {rec.recommendationReason && (
                    <div className="p-4 bg-primary-500/5 dark:bg-primary-500/5 rounded-2xl border border-primary-500/10 space-y-1">
                      <p className="text-[10px] font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1 uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" /> AI Recommendation Reasoning
                      </p>
                      <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed italic">
                        "{rec.recommendationReason}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-4 mt-auto">
                  <div>
                    <p className="text-[10px] text-slate-450 uppercase font-semibold">Total Price</p>
                    <p className="font-extrabold text-sm text-slate-900 dark:text-white">৳{rec.price.toLocaleString()} BDT</p>
                  </div>
                  <Link href={`/items/${rec._id}`}>
                    <Button variant="primary" size="sm" className="rounded-xl flex items-center gap-1">
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
