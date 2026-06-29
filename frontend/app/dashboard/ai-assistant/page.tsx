'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useMutation } from '@tanstack/react-query';
import { aiService } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Loader';
import { 
  Sparkles, Calendar, User, Compass, HelpCircle, MapPin, 
  CheckCircle, ShieldAlert, Award, FileText, Clipboard, Printer 
} from 'lucide-react';

const plannerSchema = zod.object({
  destination: zod.string().min(2, 'Enter a valid destination name'),
  budget: zod.enum(['budget', 'moderate', 'luxury']),
  startDate: zod.string().min(1, 'Select a starting date'),
  endDate: zod.string().min(1, 'Select an ending date'),
  guests: zod.number().min(1).max(10),
  interests: zod.array(zod.string()).min(1, 'Select at least one interest'),
  travelStyle: zod.string().min(1, 'Select a travel style')
});

type PlannerFormValues = zod.infer<typeof plannerSchema>;

interface ItineraryItem {
  day: number;
  title: string;
  activities: string[];
}

interface TripPlanResponse {
  itinerary: ItineraryItem[];
  recommendedDestinations: string[];
  budgetTips: string[];
  packingSuggestions: string[];
  safetyTips: string[];
}

export default function AIAssistantPage() {
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<'itinerary' | 'budget' | 'packing' | 'safety'>('itinerary');
  const [tripPlan, setTripPlan] = useState<TripPlanResponse | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PlannerFormValues>({
    resolver: zodResolver(plannerSchema),
    defaultValues: {
      guests: 2,
      budget: 'moderate',
      interests: ['Adventure'],
      travelStyle: 'Standard'
    }
  });

  const selectedInterests = watch('interests') || [];

  const handleInterestCheckbox = (interest: string) => {
    const current = [...selectedInterests];
    if (current.includes(interest)) {
      setValue('interests', current.filter(i => i !== interest));
    } else {
      setValue('interests', [...current, interest]);
    }
  };

  // Planner Mutation
  const plannerMutation = useMutation({
    mutationFn: (data: PlannerFormValues) => aiService.generateTripPlan(data),
    onSuccess: (data) => {
      setTripPlan(data);
      toast('Custom itinerary generated successfully!', 'success', 'Trip Plan Ready');
    },
    onError: (err: any) => {
      toast(err?.response?.data?.message || 'Failed to generate itinerary. Try again.', 'error', 'Generation Error');
    }
  });

  const onSubmit = (data: PlannerFormValues) => {
    // Validate dates
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (end < start) {
      toast('Ending date cannot be before starting date.', 'error', 'Invalid Dates');
      return;
    }
    plannerMutation.mutate(data);
  };

  const copyToClipboard = () => {
    if (!tripPlan) return;
    navigator.clipboard.writeText(JSON.stringify(tripPlan, null, 2));
    toast('Plan JSON copied to clipboard.', 'success', 'Copied');
  };

  const printPlan = () => {
    window.print();
  };

  const interestsList = ['Adventure', 'Beach', 'Nature', 'Cultural', 'History', 'Wildlife', 'Eco-tourism', 'Food Tour'];
  const travelStyles = ['Backpacker', 'Relaxed', 'Solo Traveler', 'Family Friendly', 'Photography focus', 'Luxury Explorer'];

  return (
    <div className="space-y-8 text-xs sm:text-sm transition-colors duration-200">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary-500 fill-current" /> AI Travel Assistant
        </h1>
        <p className="text-xs text-slate-500">Provide preferences below to draft bespoke day-by-day itineraries and travel packs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Input Form */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-5">
          <h3 className="font-bold text-xs uppercase text-slate-400">Configure Trip Parameters</h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-semibold text-slate-405 uppercase mb-1.5">Where do you want to explore?</label>
              <input
                type="text"
                placeholder="e.g. Srimangal or Cox's Bazar"
                {...register('destination')}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-850 bg-slate-55 dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 text-xs font-medium"
              />
              {errors.destination && <p className="text-[10px] text-red-500 mt-1">{errors.destination.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1.5">Start Date</label>
                <input
                  type="date"
                  {...register('startDate')}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 text-xs"
                />
                {errors.startDate && <p className="text-[10px] text-red-500 mt-1">{errors.startDate.message}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1.5">End Date</label>
                <input
                  type="date"
                  {...register('endDate')}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 text-xs"
                />
                {errors.endDate && <p className="text-[10px] text-red-500 mt-1">{errors.endDate.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1.5">Budget Bracket</label>
                <select
                  {...register('budget')}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none"
                >
                  <option value="budget">Budget (Economical)</option>
                  <option value="moderate">Moderate (Standard)</option>
                  <option value="luxury">Luxury (Premium)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1.5">Travelers</label>
                <select
                  {...register('guests', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Traveler' : 'Travelers'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1.5">Travel Style</label>
              <select
                {...register('travelStyle')}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none"
              >
                {travelStyles.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1.5">Select Interests</label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                {interestsList.map(int => {
                  const checked = selectedInterests.includes(int);
                  return (
                    <button
                      key={int}
                      type="button"
                      onClick={() => handleInterestCheckbox(int)}
                      className={`text-left p-2 rounded-xl border text-[11px] font-medium transition-all ${
                        checked 
                          ? 'border-primary-500 bg-primary-500/5 text-primary-600 dark:text-primary-400 font-semibold' 
                          : 'border-slate-200 dark:border-slate-800 text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-905'
                      }`}
                    >
                      {int}
                    </button>
                  );
                })}
              </div>
              {errors.interests && <p className="text-[10px] text-red-500 mt-1">{errors.interests.message}</p>}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                loading={plannerMutation.isPending}
                className="w-full py-3 font-semibold rounded-xl"
              >
                Generate Itinerary <Sparkles className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </form>

        </div>

        {/* RIGHT COLUMN: Results Display */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm min-h-[500px] flex flex-col">
          
          {plannerMutation.isPending ? (
            <div className="flex-1 flex flex-col justify-center items-center py-16">
              <Spinner size={36} />
              <p className="mt-4 text-xs text-slate-405 font-medium animate-pulse">Generative AI model is rendering your itinerary details...</p>
            </div>
          ) : !tripPlan ? (
            <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
              <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
              <h4 className="font-bold text-slate-800 dark:text-slate-200">Itinerary Pending</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1">Configure your destination criteria on the left and trigger generation.</p>
            </div>
          ) : (
            <div className="space-y-6 flex-1 flex flex-col animate-in fade-in duration-300">
              
              {/* Output Actions Bar */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-850 dark:text-slate-100 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-primary-500" /> AI Draft Complete
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={copyToClipboard}
                    className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl text-slate-500"
                    title="Copy Plan"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={printPlan}
                    className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl text-slate-500"
                    title="Print Plan"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Subtabs selectors */}
              <div className="flex border-b border-slate-100 dark:border-slate-850 text-xs">
                {['itinerary', 'budget', 'packing', 'safety'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSubTab(tab as any)}
                    className={`px-4 py-2 border-b-2 capitalize font-semibold transition-all ${
                      activeSubTab === tab
                        ? 'border-primary-650 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-slate-400 hover:text-slate-650'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Day-by-Day Itinerary */}
              {activeSubTab === 'itinerary' && (
                <div className="space-y-4">
                  <div className="space-y-4 border-l-2 border-slate-200 dark:border-slate-800 ml-2.5 pl-5 relative">
                    {tripPlan.itinerary?.map((dayPlan, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-primary-600 border border-white dark:border-slate-900" />
                        <div className="space-y-1.5">
                          <h4 className="font-bold text-slate-900 dark:text-white">Day {dayPlan.day}: {dayPlan.title}</h4>
                          <ul className="list-disc pl-4 text-xs text-slate-500 dark:text-slate-400 space-y-1 leading-relaxed">
                            {dayPlan.activities?.map((act, actIdx) => <li key={actIdx}>{act}</li>)}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                  {tripPlan.recommendedDestinations?.length > 0 && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-2xl space-y-2 mt-4">
                      <h5 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary-500" /> Top Spots Recommended</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{tripPlan.recommendedDestinations.join(', ')}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Budget Tips */}
              {activeSubTab === 'budget' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1"><Award className="w-4 h-4 text-emerald-500" /> Budget Maximizer Suggestions</h4>
                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {tripPlan.budgetTips?.map((tip, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Packing Suggestions */}
              {activeSubTab === 'packing' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1"><Compass className="w-4 h-4 text-primary-500" /> Recommended Packing Checklist</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    {tripPlan.packingSuggestions?.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-primary-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Safety Tips */}
              {activeSubTab === 'safety' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1"><ShieldAlert className="w-4 h-4 text-rose-500" /> Terrain & Travel Safety Advisories</h4>
                  <ul className="space-y-2.5 text-xs text-slate-605 dark:text-slate-400 leading-relaxed">
                    {tripPlan.safetyTips?.map((tip, idx) => (
                      <li key={idx} className="flex gap-2 items-start bg-rose-500/5 p-3 border border-rose-500/10 rounded-xl text-rose-900 dark:text-rose-400">
                        <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
