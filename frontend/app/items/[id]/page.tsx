'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemService, bookingService, reviewService } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Loader';
import { 
  Star, MapPin, Calendar, Clock, Compass, CheckCircle2, XCircle, 
  Share2, Heart, Award, ArrowLeft, Send, Sparkles, User 
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

const bookingSchema = zod.object({
  startDate: zod.string().min(1, 'Select a starting date'),
  endDate: zod.string().min(1, 'Select an ending date'),
  guests: zod.number().min(1, 'At least 1 guest required').max(10, 'Maximum 10 guests permitted'),
  contactName: zod.string().min(2, 'Name must be at least 2 characters'),
  contactEmail: zod.string().email('Invalid email address'),
  contactPhone: zod.string().min(6, 'Invalid phone number'),
  notes: zod.string().optional()
});

type BookingFormValues = zod.infer<typeof bookingSchema>;

export default function ItemDetailsPage() {
  const { id } = useParams() as { id: string };
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'reviews'>('overview');
  const [favorite, setFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  // Review Form States
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch package details
  const { data: item, isLoading, isError } = useQuery({
    queryKey: ['itemDetails', id],
    queryFn: () => itemService.getById(id)
  });

  // Fetch reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ['itemReviews', id],
    queryFn: () => reviewService.getByItem(id),
    enabled: !!id
  });

  // Fetch related/all items
  const { data: allItemsData } = useQuery({
    queryKey: ['relatedItems'],
    queryFn: () => itemService.getAll({ limit: 4 })
  });

  // Booking Form hook
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    formState: { errors } 
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guests: 1,
      contactName: user?.name || '',
      contactEmail: user?.email || '',
      contactPhone: user?.phoneNumber || ''
    }
  });

  // Watch guests to compute total pricing
  const guestCount = watch('guests') || 1;

  // React Hook Form effects to prefill details when user state loads
  React.useEffect(() => {
    if (user) {
      setValue('contactName', user.name);
      setValue('contactEmail', user.email);
      setValue('contactPhone', user.phoneNumber || '');
    }
  }, [user, setValue]);

  // Booking Mutation
  const bookingMutation = useMutation({
    mutationFn: (data: BookingFormValues) => bookingService.create({
      itemId: id,
      ...data
    }),
    onSuccess: () => {
      toast('Your travel booking has been placed! Keep track inside your bookings tab.', 'success', 'Booking Confirmed!');
      router.push('/dashboard/bookings');
    },
    onError: (err: any) => {
      toast(err?.response?.data?.message || 'Failed to place booking request. Please check inputs.', 'error', 'Booking Error');
    }
  });

  const onSubmitBooking = (data: BookingFormValues) => {
    if (!user) {
      toast('You must be signed in to place booking requests.', 'info', 'Authentication Required');
      router.push('/login');
      return;
    }
    bookingMutation.mutate(data);
  };

  // Submit Review Mutation
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast('You must be signed in to submit reviews.', 'info', 'Authentication Required');
      router.push('/login');
      return;
    }
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      await reviewService.create({
        itemId: id,
        rating: reviewRating,
        comment: reviewComment
      });
      toast('Thank you for sharing your feedback! Rating updated.', 'success', 'Review Shared');
      setReviewComment('');
      queryClient.invalidateQueries({ queryKey: ['itemDetails', id] });
      queryClient.invalidateQueries({ queryKey: ['itemReviews', id] });
    } catch (err: any) {
      toast(err?.response?.data?.message || 'Failed to post review. Try again.', 'error', 'Error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const shareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast('Link copied to clipboard! Share with friends.', 'success', 'Link Copied');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex-1 flex items-center justify-center min-h-[500px]">
          <Spinner size={36} />
        </div>
        <Footer />
      </>
    );
  }

  if (isError || !item) {
    return (
      <>
        <Navbar />
        <div className="flex-1 max-w-md mx-auto py-16 px-4 text-center">
          <h2 className="text-xl font-bold mb-2">Package Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">The travel package does not exist or has been removed.</p>
          <Button onClick={() => router.push('/explore')} variant="primary">Return to Explore</Button>
        </div>
        <Footer />
      </>
    );
  }

  const relatedItems = allItemsData?.data?.filter((i: any) => i._id !== id).slice(0, 3) || [];

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-200">
        
        {/* Back link */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-primary-600 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>

        {/* Title Grid */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 uppercase tracking-wider mb-2 inline-block">
              {item.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{item.name}</h1>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-4 h-4 text-primary-500" /> {item.location}
              </span>
              <span className="flex items-center gap-1 font-bold text-amber-500">
                <Star className="w-4 h-4 fill-current" /> {item.rating.toFixed(1)}{' '}
                <span className="text-slate-400 font-normal">({item.reviewsCount} reviews)</span>
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={shareLink}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-slate-600 dark:text-slate-400"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {user && (
              <button
                onClick={() => {
                  setFavorite(!favorite);
                  toast(favorite ? 'Removed from favorites.' : 'Saved to your profile favorites.', 'info');
                }}
                className={`p-2.5 rounded-xl border transition-colors ${
                  favorite 
                    ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
                title="Save Favorite"
              >
                <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Media Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 rounded-3xl overflow-hidden shadow-sm">
          <div className="md:col-span-2 aspect-[16/10] bg-slate-100 overflow-hidden">
            <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'} alt="Cover" className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:flex flex-col gap-4 aspect-[8/10]">
            <div className="flex-1 bg-slate-100 overflow-hidden rounded-r-3xl">
              <img src={item.images?.[1] || item.images?.[0] || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'} alt="Sub-cover" className="w-full h-full object-cover" />
            </div>
            {item.images?.[2] && (
              <div className="flex-1 bg-slate-100 overflow-hidden rounded-r-3xl">
                <img src={item.images[2]} alt="Gallery Detail" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Details Tabs */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex border-b border-slate-200 dark:border-slate-800">
              {['overview', 'itinerary', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-3 text-xs sm:text-sm font-bold border-b-2 capitalize transition-all ${
                    activeTab === tab
                      ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENTS */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Long Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-250 mb-3">About this experience</h3>
                  <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                    {item.longDescription || item.description}
                  </p>
                </div>

                {/* Highlights */}
                {item.highlights?.length > 0 && (
                  <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 space-y-3">
                    <h4 className="font-bold text-xs sm:text-sm flex items-center gap-1 text-slate-800 dark:text-slate-150">
                      <Award className="w-5 h-5 text-emerald-500" /> Tour Highlights
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
                      {item.highlights.map((hl: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Included Services */}
                {item.included?.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-250 mb-3">Included Services</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
                      {item.included.map((inc: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-450" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-850 pt-6 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col gap-1 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl">
                    <span className="font-medium opacity-60">Duration</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                      <Clock className="w-4 h-4 text-primary-500" /> {item.duration} Days
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl">
                    <span className="font-medium opacity-60">Category</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                      <Compass className="w-4 h-4 text-primary-500" /> {item.category}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl col-span-2 sm:col-span-1">
                    <span className="font-medium opacity-60">Seasons</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-primary-500" /> Flexible
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ITINERARY */}
            {activeTab === 'itinerary' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-250 mb-4">Tour Itinerary Plan</h3>
                {item.itinerary?.length > 0 ? (
                  <div className="space-y-4 relative border-l-2 border-slate-250 dark:border-slate-850 ml-3.5 pl-6">
                    {item.itinerary.map((dayPlan: any, idx: number) => (
                      <div key={idx} className="relative group">
                        {/* Dot indicator */}
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-primary-600 bg-white dark:bg-slate-950 group-hover:bg-primary-600 transition-colors" />
                        
                        <div className="space-y-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            Day {dayPlan.day}: {dayPlan.title}
                          </h4>
                          <ul className="list-disc pl-4 text-xs text-slate-550 dark:text-slate-400 space-y-1.5">
                            {dayPlan.activities.map((act: string, actIdx: number) => (
                              <li key={actIdx}>{act}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">No itinerary details available.</p>
                )}
              </div>
            )}

            {/* TAB: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-850">
                  <h3 className="text-base font-bold text-slate-850 dark:text-slate-250">Customer Reviews</h3>
                  <div className="flex items-center gap-1 font-bold text-amber-500 text-sm">
                    <Star className="w-4 h-4 fill-current" /> {item.rating.toFixed(1)}{' '}
                    <span className="text-slate-400 font-normal">({reviews.length} total)</span>
                  </div>
                </div>

                {/* Review items */}
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((rev: any) => (
                      <div key={rev._id} className="p-4 border border-slate-200 dark:border-slate-850 rounded-2xl space-y-3 bg-white dark:bg-slate-900/20">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-250 text-slate-400 flex items-center justify-center">
                              {rev.userAvatar ? (
                                <img src={rev.userAvatar} alt={rev.userName} className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <h5 className="font-semibold text-xs text-slate-900 dark:text-white">{rev.userName}</h5>
                              <p className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex text-amber-400 gap-0.5">
                            {Array.from({ length: rev.rating }).map((_, rIdx) => (
                              <Star key={rIdx} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed italic">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 py-4">No reviews written yet. Be the first to leave a review!</p>
                )}

                {/* Write a review Form */}
                <div className="p-5 border border-slate-200 dark:border-slate-850 rounded-3xl bg-slate-50/50 dark:bg-slate-900/10 space-y-4">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-primary-500" /> Share your experience
                  </h4>
                  
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Your Rating</label>
                      <div className="flex gap-1.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="focus:outline-none hover:scale-110 transition-transform"
                          >
                            <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'text-slate-350 dark:text-slate-700'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Your Comment</label>
                      <textarea
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Write details of hotel rooms, local food, guides..."
                        required
                        className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      loading={submittingReview}
                      className="rounded-xl text-xs font-semibold"
                    >
                      Post Review
                    </Button>
                  </form>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Dynamic Booking Form widget */}
          <div className="lg:col-span-4 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 bg-white dark:bg-slate-900 shadow-lg space-y-5 sticky top-24">
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold tracking-wider">Plan Your Adventure</p>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                ৳{item.price.toLocaleString()}{' '}
                <span className="text-xs font-medium text-slate-400">/ person</span>
              </h3>
            </div>

            <form onSubmit={handleSubmit(onSubmitBooking)} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Start Date</label>
                  <input
                    type="date"
                    min={item.availability.startDate}
                    max={item.availability.endDate}
                    {...register('startDate')}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  {errors.startDate && <p className="text-[10px] text-red-500 mt-1">{errors.startDate.message}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">End Date</label>
                  <input
                    type="date"
                    min={item.availability.startDate}
                    max={item.availability.endDate}
                    {...register('endDate')}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  {errors.endDate && <p className="text-[10px] text-red-500 mt-1">{errors.endDate.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Number of Guests</label>
                <select
                  {...register('guests', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Traveler' : 'Travelers'}</option>
                  ))}
                </select>
                {errors.guests && <p className="text-[10px] text-red-500 mt-1">{errors.guests.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Contact Name</label>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  {...register('contactName')}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                {errors.contactName && <p className="text-[10px] text-red-500 mt-1">{errors.contactName.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-1">
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Contact Email</label>
                  <input
                    type="email"
                    placeholder="name@email.com"
                    {...register('contactEmail')}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  {errors.contactEmail && <p className="text-[10px] text-red-500 mt-1">{errors.contactEmail.message}</p>}
                </div>
                <div className="col-span-1">
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+880..."
                    {...register('contactPhone')}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  {errors.contactPhone && <p className="text-[10px] text-red-500 mt-1">{errors.contactPhone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Special requests / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Need helper services, dietary needs..."
                  {...register('notes')}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-850 rounded-xl bg-slate-50 dark:bg-slate-950 dark:text-white focus:outline-none"
                />
              </div>

              {/* Price Calculation Box */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 flex justify-between items-center mt-3">
                <span className="font-semibold text-slate-500">Total Price ({guestCount} guests):</span>
                <span className="font-extrabold text-base text-slate-900 dark:text-white">
                  ৳{(item.price * guestCount).toLocaleString()} BDT
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={bookingMutation.isPending}
                className="w-full py-3 font-semibold rounded-xl"
              >
                {user ? 'Request Booking' : 'Sign In to Book'}
              </Button>
              
            </form>

            <p className="text-[10px] text-center text-slate-400">
              No immediate charges. Manager will confirm availability and contact you.
            </p>
          </div>

        </div>

        {/* SECTION: Related / Similar Tours */}
        {relatedItems.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-850 pt-12 mt-16 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-850 dark:text-slate-150">Related Packages</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Explore other beautiful experiences you might enjoy</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedItems.map((relItem: any) => (
                <div 
                  key={relItem._id} 
                  className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-850 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between h-[420px]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img src={relItem.images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'} alt={relItem.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-primary-500">{relItem.category}</span>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-1 mt-1 mb-1">{relItem.name}</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{relItem.location}</p>
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-850 pt-4">
                      <div>
                        <p className="text-[10px] text-slate-450 uppercase font-semibold">Price</p>
                        <p className="font-extrabold text-sm text-slate-900 dark:text-white">৳{relItem.price.toLocaleString()} BDT</p>
                      </div>
                      <Link href={`/items/${relItem._id}`}>
                        <Button variant="outline" size="sm" className="rounded-xl text-[10px]">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
      <Footer />
    </>
  );
}
