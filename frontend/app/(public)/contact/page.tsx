'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../hooks/useToast';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const contactSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  email: zod.string().email('Provide a valid email address'),
  subject: zod.string().min(4, 'Subject must be at least 4 characters'),
  message: zod.string().min(10, 'Message must contain at least 10 characters')
});

type ContactFormValues = zod.infer<typeof contactSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = (data: ContactFormValues) => {
    setLoading(true);
    // Simulate API registration
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast('Your message has been delivered. Our support desk will reply within 24 hours.', 'success', 'Message Transmitted');
      reset();
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-colors duration-200">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Column 1: Info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-105 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 uppercase mb-2 inline-block">
                Contact Desk
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Get in Touch</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Have questions about our travel packages, AI customization planner, or interested in registry partnerships? Send us a message!
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-805 text-sm text-slate-650 dark:text-slate-400">
              <div className="flex gap-3">
                <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-primary-600 dark:text-primary-400"><Mail className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Email Address</h4>
                  <p className="text-xs opacity-80 mt-0.5">support@travelmate.ai</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-primary-600 dark:text-primary-400"><Phone className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Customer Hotlines</h4>
                  <p className="text-xs opacity-80 mt-0.5">+880 1711-223344</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-primary-600 dark:text-primary-400"><MapPin className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Business Location</h4>
                  <p className="text-xs opacity-80 mt-0.5">Gulshan-2, Dhaka 1212, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            
            {success ? (
              <div className="text-center py-12 space-y-4 max-w-sm mx-auto animate-in fade-in duration-300">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Message Delivered</h3>
                <p className="text-xs text-slate-500">
                  Thank you for contacting us. Your response ticket is registered. Our staff will update you shortly.
                </p>
                <Button onClick={() => setSuccess(false)} variant="secondary" size="sm" className="rounded-xl">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Your Name</label>
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
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Query about Sajek Tour dates"
                    {...register('subject')}
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none dark:text-white text-sm"
                  />
                  {errors.subject && <p className="text-[10px] text-red-500 mt-1">{errors.subject.message}</p>}
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1.5">Detailed Message</label>
                  <textarea
                    rows={5}
                    placeholder="Write details of your inquiries here..."
                    {...register('message')}
                    className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:outline-none dark:text-white text-sm"
                  />
                  {errors.message && <p className="text-[10px] text-red-500 mt-1">{errors.message.message}</p>}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={loading}
                    className="w-full font-semibold rounded-xl"
                  >
                    Send Message <Send className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>
              </form>
            )}

          </div>

        </div>

      </main>
      <Footer />
    </>
  );
}
