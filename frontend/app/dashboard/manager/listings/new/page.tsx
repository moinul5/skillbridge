'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { itemService, aiService } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Loader';
import { 
  Sparkles, Save, ArrowLeft, Plus, Trash2, 
  CheckCircle, HelpCircle, FileText, Clipboard 
} from 'lucide-react';

const listingSchema = zod.object({
  name: zod.string().min(3, 'Package name must be at least 3 characters'),
  category: zod.string().min(2, 'Category required'),
  location: zod.string().min(3, 'Location details required'),
  price: zod.number().min(500, 'Minimum price must be 500 BDT'),
  duration: zod.number().min(1, 'Minimum duration is 1 day'),
  startDate: zod.string().min(1, 'Start availability date required'),
  endDate: zod.string().min(1, 'End availability date required'),
  description: zod.string().min(10, 'Short description must be at least 10 characters'),
  longDescription: zod.string().min(20, 'Long description must be at least 20 characters'),
  // Helper text inputs for lists
  includedText: zod.string().min(2, 'Enter at least one service, separated by commas'),
  highlightsText: zod.string().min(2, 'Enter at least one highlight, separated by commas'),
  tagsText: zod.string().min(2, 'Enter at least one tag, separated by commas'),
  imageUrl1: zod.string().url('Provide a valid cover image URL'),
  imageUrl2: zod.string().optional()
});

type ListingFormValues = zod.infer<typeof listingSchema>;

export default function NewListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [generatingAI, setGeneratingAI] = useState(false);
  const [itinerary, setItinerary] = useState<{ day: number; title: string; activities: string }[]>([
    { day: 1, title: 'Arrival & Welcome', activities: 'Pick up from transit, check-in, orientation dinner.' }
  ]);

  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors }
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      category: 'Adventure',
      price: 10000,
      duration: 3,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31'
    }
  });

  // Load existing details for Edit mode
  const { data: existingItem, isLoading: loadingItem } = useQuery({
    queryKey: ['editItem', editId],
    queryFn: () => itemService.getById(editId || ''),
    enabled: !!editId
  });

  useEffect(() => {
    if (existingItem) {
      reset({
        name: existingItem.name,
        category: existingItem.category,
        location: existingItem.location,
        price: existingItem.price,
        duration: existingItem.duration,
        startDate: existingItem.availability?.startDate || '',
        endDate: existingItem.availability?.endDate || '',
        description: existingItem.description,
        longDescription: existingItem.longDescription,
        includedText: existingItem.included?.join(', ') || '',
        highlightsText: existingItem.highlights?.join(', ') || '',
        tagsText: existingItem.tags?.join(', ') || '',
        imageUrl1: existingItem.images?.[0] || '',
        imageUrl2: existingItem.images?.[1] || ''
      });
      if (existingItem.itinerary?.length > 0) {
        setItinerary(existingItem.itinerary.map((d: any) => ({
          day: d.day,
          title: d.title,
          activities: d.activities?.join(', ') || ''
        })));
      }
    }
  }, [existingItem, reset]);

  // AI Description Generator Mutation
  const handleAIGeneration = async () => {
    const name = getValues('name');
    const category = getValues('category');
    const location = getValues('location');
    const duration = getValues('duration');

    if (!name || !category || !location || !duration) {
      toast('Please fill Name, Category, Location, and Duration first to generate AI descriptions.', 'info', 'Missing Inputs');
      return;
    }

    setGeneratingAI(true);
    try {
      const generated = await aiService.generateListingDescription({
        name,
        category,
        location,
        duration: Number(duration)
      });

      setValue('description', generated.shortDescription);
      setValue('longDescription', generated.longDescription);
      setValue('highlightsText', generated.highlights?.join(', ') || '');
      setValue('tagsText', generated.tags?.join(', ') || '');
      
      if (generated.suggestedItinerary?.length > 0) {
        setItinerary(generated.suggestedItinerary.map((d: any) => ({
          day: d.day,
          title: d.title,
          activities: d.activities?.join(', ') || ''
        })));
      }

      toast('SEO descriptions, highlights, and itinerary drafts have been generated!', 'success', 'AI Suggestions Injected');
    } catch (err: any) {
      toast('Failed to reach AI copywriting server. Using offline fallback.', 'error', 'AI Offline');
      // Offline fallback locally
      const fallback = {
        shortDescription: `Escape to the ultimate ${category} adventure in ${location} with curated itineraries.`,
        longDescription: `Experience the trip of a lifetime with our premium ${name} tour package. Located in the beautiful ${location}, this ${duration}-day package is designed to offer a perfect balance of excitement and relaxation.`,
        highlights: ['Fully guided local tours', 'Scenic hilltop cottage rooms', 'Fresh traditional cuisines included'],
        tags: [category.toLowerCase(), 'travel', 'vacation']
      };
      setValue('description', fallback.shortDescription);
      setValue('longDescription', fallback.longDescription);
      setValue('highlightsText', fallback.highlights.join(', '));
      setValue('tagsText', fallback.tags.join(', '));
    } finally {
      setGeneratingAI(false);
    }
  };

  // Submit Listing Mutation (Create or Update)
  const submitMutation = useMutation({
    mutationFn: (payload: any) => {
      if (editId) {
        return itemService.update(editId, payload);
      }
      return itemService.create(payload);
    },
    onSuccess: () => {
      toast(editId ? 'Listing updated successfully.' : 'New travel package listing published!', 'success', 'Success');
      queryClient.invalidateQueries({ queryKey: ['managerItems'] });
      queryClient.invalidateQueries({ queryKey: ['managerMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['managerCharts'] });
      queryClient.invalidateQueries({ queryKey: ['exploreItems'] });
      router.push('/dashboard/manager');
    },
    onError: (err: any) => {
      toast(err?.response?.data?.message || 'Failed to submit listing.', 'error', 'Submission Error');
    }
  });

  const onSubmit = (data: ListingFormValues) => {
    // Process text fields to arrays
    const included = data.includedText.split(',').map(s => s.trim()).filter(Boolean);
    const highlights = data.highlightsText.split(',').map(s => s.trim()).filter(Boolean);
    const tags = data.tagsText.split(',').map(s => s.trim()).filter(Boolean);
    const images = [data.imageUrl1];
    if (data.imageUrl2) images.push(data.imageUrl2);

    const formattedItinerary = itinerary.map(day => ({
      day: day.day,
      title: day.title,
      activities: day.activities.split(',').map(s => s.trim()).filter(Boolean)
    }));

    const payload = {
      name: data.name,
      category: data.category,
      location: data.location,
      price: data.price,
      duration: data.duration,
      availability: {
        startDate: data.startDate,
        endDate: data.endDate
      },
      description: data.description,
      longDescription: data.longDescription,
      included,
      highlights,
      tags,
      images,
      itinerary: formattedItinerary
    };

    submitMutation.mutate(payload);
  };

  // Itinerary helpers
  const handleAddDay = () => {
    const nextDay = itinerary.length + 1;
    setItinerary([...itinerary, { day: nextDay, title: `Day ${nextDay} Activity`, activities: 'Sightseeing, tour guides, dinner.' }]);
  };

  const handleRemoveDay = (dayNum: number) => {
    if (itinerary.length === 1) return;
    const filtered = itinerary.filter(d => d.day !== dayNum);
    // Reset day counts sequentially
    const sequential = filtered.map((d, index) => ({
      ...d,
      day: index + 1
    }));
    setItinerary(sequential);
  };

  const handleItineraryChange = (index: number, field: 'title' | 'activities', value: string) => {
    const updated = [...itinerary];
    updated[index][field] = value;
    setItinerary(updated);
  };

  if (editId && loadingItem) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      
      {/* Back button */}
      <button 
        onClick={() => router.push('/dashboard/manager')}
        className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary-600 font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Listings
      </button>

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          {editId ? 'Edit Travel Package' : 'Publish New Package'}
        </h1>
        <p className="text-xs text-slate-500">List custom travel destinations and local experiences</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-xs">
          
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-850 dark:text-slate-200">Listing Specifications</h3>
            <button
              type="button"
              onClick={handleAIGeneration}
              disabled={generatingAI}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-400 hover:bg-primary-200 border border-primary-500/10 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {generatingAI ? <Spinner size={14} /> : <Sparkles className="w-4 h-4" />}
              <span>Generate with AI Copywriter</span>
            </button>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Package Title</label>
              <input
                type="text"
                placeholder="e.g. Sajek Valley Cloud Getaway"
                {...register('name')}
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none dark:text-white text-sm"
              />
              {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Category</label>
              <select
                {...register('category')}
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 dark:text-white focus:outline-none text-sm"
              >
                <option value="Beach">Beach</option>
                <option value="Nature">Nature</option>
                <option value="Adventure">Adventure</option>
                <option value="Cultural">Cultural</option>
                <option value="Eco-tourism">Eco-tourism</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Location</label>
              <input
                type="text"
                placeholder="e.g. Sajek Valley, Rangamati"
                {...register('location')}
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none dark:text-white text-sm"
              />
              {errors.location && <p className="text-[10px] text-red-500 mt-1">{errors.location.message}</p>}
            </div>

            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Price (BDT)</label>
              <input
                type="number"
                {...register('price', { valueAsNumber: true })}
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-955 focus:outline-none dark:text-white text-sm"
              />
              {errors.price && <p className="text-[10px] text-red-500 mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Duration (Days)</label>
              <input
                type="number"
                {...register('duration', { valueAsNumber: true })}
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none dark:text-white text-sm"
              />
              {errors.duration && <p className="text-[10px] text-red-500 mt-1">{errors.duration.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Availability Start Date</label>
              <input
                type="date"
                {...register('startDate')}
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-955 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Availability End Date</label>
              <input
                type="date"
                {...register('endDate')}
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-955 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Short Description</label>
            <input
              type="text"
              placeholder="A catchy one-line snippet describing the tour..."
              {...register('description')}
              className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none dark:text-white text-sm"
            />
            {errors.description && <p className="text-[10px] text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Long Overview</label>
            <textarea
              rows={4}
              placeholder="Multi-paragraph detailed sales/itinerary descriptions..."
              {...register('longDescription')}
              className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none dark:text-white text-sm"
            />
            {errors.longDescription && <p className="text-[10px] text-red-500 mt-1">{errors.longDescription.message}</p>}
          </div>

          {/* List specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Included Services (comma separated)</label>
              <textarea
                rows={2}
                placeholder="Daily Breakfast, Local Tour Guide, Hotel Stays"
                {...register('includedText')}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
              />
              {errors.includedText && <p className="text-[10px] text-red-500 mt-1">{errors.includedText.message}</p>}
            </div>

            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Highlights (comma separated)</label>
              <textarea
                rows={2}
                placeholder="Walk on Laboni Beach, Sunset from Inani Beach"
                {...register('highlightsText')}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
              />
              {errors.highlightsText && <p className="text-[10px] text-red-500 mt-1">{errors.highlightsText.message}</p>}
            </div>

            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Search Tags (comma separated)</label>
              <textarea
                rows={2}
                placeholder="beach, sunset, adventure"
                {...register('tagsText')}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
              />
              {errors.tagsText && <p className="text-[10px] text-red-500 mt-1">{errors.tagsText.message}</p>}
            </div>
          </div>

          {/* Image URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Primary Cover Image URL</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                {...register('imageUrl1')}
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none dark:text-white text-sm"
              />
              {errors.imageUrl1 && <p className="text-[10px] text-red-500 mt-1">{errors.imageUrl1.message}</p>}
            </div>

            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Secondary Gallery Image URL (optional)</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                {...register('imageUrl2')}
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none dark:text-white text-sm"
              />
            </div>
          </div>

          {/* ITINERARY DAYS BUILDER */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-850 dark:text-slate-200 uppercase text-xs">Day-by-Day Itinerary Planner</h4>
              <button
                type="button"
                onClick={handleAddDay}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Day
              </button>
            </div>

            <div className="space-y-4">
              {itinerary.map((dayPlan, index) => (
                <div key={dayPlan.day} className="p-4 border border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl relative space-y-3">
                  <button
                    type="button"
                    onClick={() => handleRemoveDay(dayPlan.day)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg border border-red-200 dark:border-red-950 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <h5 className="font-bold text-xs text-primary-655 dark:text-primary-400">Day {dayPlan.day}</h5>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Day Focus/Title</label>
                      <input
                        type="text"
                        value={dayPlan.title}
                        onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs rounded-xl focus:outline-none dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Day Activities (comma separated)</label>
                      <input
                        type="text"
                        value={dayPlan.activities}
                        onChange={(e) => handleItineraryChange(index, 'activities', e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs rounded-xl focus:outline-none dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="submit"
              variant="primary"
              loading={submitMutation.isPending}
              className="w-full py-3 font-semibold rounded-xl"
            >
              {editId ? 'Update Listing Details' : 'Publish Travel Package'} <Save className="w-4 h-4 ml-1.5" />
            </Button>
          </div>

        </form>

      </div>

    </div>
  );
}
