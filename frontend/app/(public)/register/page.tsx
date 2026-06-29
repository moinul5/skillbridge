'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../hooks/useToast';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Button from '../../../components/ui/Button';
import { Clipboard, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

const registerSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  email: zod.string().email('Please enter a valid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters')
});

type RegisterFormValues = zod.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: authRegister, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    try {
      await authRegister(data.email, data.password, data.name);
      toast('Welcome to TravelMate! Explore packages and build your trip itinerary.', 'success', 'Account Created Successfully');
      router.push('/dashboard');
    } catch (err: any) {
      toast(err?.response?.data?.message || 'Email address already registered.', 'error', 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast('Welcome back to TravelMate AI!', 'success', 'Logged In Successfully');
      router.push('/dashboard');
    } catch (err: any) {
      toast(err?.response?.data?.message || err?.message || 'Google Sign-in failed.', 'error', 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Create your Account</h1>
            <p className="text-xs text-slate-500 mt-1">Start planning smart travel experiences today</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-5">
            
            {/* Google Sign In Button */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-semibold transition-all text-slate-750 dark:text-white hover:scale-[1.01] active:scale-[0.99] shadow-sm hover:shadow-md cursor-pointer duration-150"
              >
                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.6h3.28c1.92,-1.77 3.03,-4.38 3.03,-7.4C21.65,11.8 21.55,11.4 21.35,11.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12,20.6c2.43,0 4.47,-0.8 5.96,-2.2l-3.28,-2.6c-0.89,0.6 -2.03,0.96 -3.28,0.96 -2.36,0 -4.36,-1.59 -5.08,-3.73H2.96v2.7C4.43,18.33 7.97,20.6 12,20.6z"
                    fill="#34A853"
                  />
                  <path
                    d="M6.92,13.03c-0.18,-0.53 -0.28,-1.1 -0.28,-1.68s0.1,-1.15 0.28,-1.68V6.94H2.96C2.35,8.16 2,9.54 2,11c0,1.46 0.35,2.84 0.96,4.06l3.96,-3.03z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12,5.04c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58C16.46,2.33 14.43,1.4 12,1.4c-4.03,0 -7.57,2.27 -9.04,5.54l3.96,3.03c0.72,-2.14 2.72,-3.73 5.08,-3.73z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="relative text-center">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
              <span className="relative bg-white dark:bg-slate-900 px-3 text-[10px] font-semibold text-slate-400 uppercase">Or Sign Up With Email</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahat Ahmed"
                  {...register('name')}
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none dark:text-white text-sm"
                />
                {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="rahat@example.com"
                  {...register('email')}
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none dark:text-white text-sm"
                />
                {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none dark:text-white text-sm"
                />
                {errors.password && <p className="text-[10px] text-red-500 mt-1">{errors.password.message}</p>}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={loading}
                  className="w-full font-semibold rounded-xl"
                >
                  Register Account <Clipboard className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </form>

            <p className="text-center text-xs text-slate-550">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
