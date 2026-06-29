'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../hooks/useToast';
import Button from '@/components/ui/Button';
import { User, Sparkles, Save, Check } from 'lucide-react';

const profileSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: zod.string().optional(),
  avatarUrl: zod.string().url('Must be a valid URL starting with http/https').or(zod.literal('')).optional(),
  budget: zod.enum(['budget', 'moderate', 'luxury']),
  travelStyle: zod.string().min(1, 'Travel style required')
});

type ProfileFormValues = zod.infer<typeof profileSchema>;

export default function UserProfilePage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [interests, setInterests] = useState<string[]>(user?.preferences?.interests || []);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phoneNumber: user?.phoneNumber || '',
      avatarUrl: user?.avatarUrl || '',
      budget: user?.preferences?.budget || 'moderate',
      travelStyle: user?.preferences?.travelStyle || 'Relaxed'
    }
  });

  const availableInterests = ['Adventure', 'Beach', 'Nature', 'Cultural', 'History', 'Wildlife', 'Eco-tourism', 'Food Tour'];

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(prev => prev.filter(i => i !== interest));
    } else {
      setInterests(prev => [...prev, interest]);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true);
    try {
      await updateProfile({
        name: data.name,
        phoneNumber: data.phoneNumber,
        avatarUrl: data.avatarUrl || undefined,
        preferences: {
          interests,
          budget: data.budget,
          travelStyle: data.travelStyle
        }
      });
      toast('Your profile information and AI preference metrics have been updated.', 'success', 'Profile Saved');
    } catch (err: any) {
      toast('Failed to save profile modifications. Try again.', 'error', 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-xs sm:text-sm">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Profile Information</h1>
        <p className="text-xs text-slate-500">Edit your credentials and configure your AI travel recommendations profile</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Editor Form */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-6">
          <h3 className="font-bold text-xs uppercase text-slate-400">Account Details</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none dark:text-white text-sm"
                />
                {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  placeholder="+880..."
                  {...register('phoneNumber')}
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none dark:text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Profile Image URL</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/photo-..."
                {...register('avatarUrl')}
                className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none dark:text-white text-sm"
              />
              {errors.avatarUrl && <p className="text-[10px] text-red-500 mt-1">{errors.avatarUrl.message}</p>}
            </div>

            {/* AI Preferences */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="font-bold text-slate-850 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary-500 animate-pulse" /> AI Recommendations Settings
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Preferred Budget Class</label>
                  <select
                    {...register('budget')}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none"
                  >
                    <option value="budget">Budget (Eco-tourism focus)</option>
                    <option value="moderate">Moderate (Standard)</option>
                    <option value="luxury">Luxury (Premium cruise/hotel)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Your Travel Style</label>
                  <select
                    {...register('travelStyle')}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white rounded-xl focus:outline-none"
                  >
                    <option value="Backpacker">Backpacker (Active Hiking)</option>
                    <option value="Relaxed">Relaxed (Beach sunsets)</option>
                    <option value="Solo Traveler">Solo Explorer</option>
                    <option value="Family Friendly">Family Oriented</option>
                    <option value="Luxury Explorer">Luxury Getaway</option>
                  </select>
                </div>
              </div>

              {/* Interests multi-select */}
              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Select Travel Interests</label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {availableInterests.map(int => {
                    const active = interests.includes(int);
                    return (
                      <button
                        key={int}
                        type="button"
                        onClick={() => toggleInterest(int)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                          active
                            ? 'border-primary-500 bg-primary-500/5 text-primary-600 dark:text-primary-400'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {active && <Check className="w-3.5 h-3.5" />}
                        <span>{int}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full sm:w-auto font-semibold rounded-xl"
              >
                Save Profile Changes <Save className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Mini Card preview */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm text-center space-y-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-primary-500 mx-auto flex items-center justify-center">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-slate-400" />
            )}
          </div>

          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{user?.name}</h4>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">{user?.role}</p>
          </div>

          <div className="text-left text-xs bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-2">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Email Address</p>
            <p className="font-medium text-slate-850 dark:text-slate-200 truncate">{user?.email}</p>
            <p className="text-[10px] text-slate-400 font-semibold uppercase pt-2">Member Since</p>
            <p className="font-medium text-slate-850 dark:text-slate-200">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>

      </div>

    </div>
  );
}
