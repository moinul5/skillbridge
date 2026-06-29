import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { Compass, Sparkles, Shield, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 transition-colors duration-200">
        
        {/* Intro */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 uppercase tracking-wider">
            Our Journey
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
            Connecting People through Smart Travel
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            TravelMate AI is an advanced, AI-powered travel discovery platform designed to curate experiences, organize itineraries, and support tour operator management.
          </p>
        </div>

        {/* Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-6">
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Our Vision</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              We believe travel is the ultimate catalyst for human connection and self-discovery. By combining modern artificial intelligence with local expertise, we empower travelers to bypass hours of planning research and access highly personalized, context-aware itineraries matching their budget.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              We also support local tour operators (Managers) by equipping them with AI-powered SEO copywriting tools and dashboard stats to manage reservations, and coordinate guest requirements smoothly.
            </p>
          </div>
          <div className="aspect-[16/10] rounded-3xl overflow-hidden shadow-sm bg-slate-100">
            <img 
              src="https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80" 
              alt="Tea Valley Landscape" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="pt-12 border-t border-slate-200 dark:border-slate-850">
          <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-8">Our Core Pillars</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 bg-white dark:bg-slate-900/10">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl w-fit"><Sparkles className="w-5 h-5" /></div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">AI-Powered Planning</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Skip the generic lists. Get personalized day-by-day itineraries, custom packing suggestions, and localized advice in seconds.
              </p>
            </div>

            <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 bg-white dark:bg-slate-900/10">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl w-fit"><Shield className="w-5 h-5" /></div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Verified Operator Network</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We work strictly with registered local tour managers to guarantee tourist safety, expert guidance, and authentic cultural hospitality.
              </p>
            </div>

            <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 bg-white dark:bg-slate-900/10">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl w-fit"><Heart className="w-5 h-5" /></div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Sustainable Tourism</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We promote low-impact eco-tours in places like Srimangal, Paharpur, and Saint Martin to preserve biodiversity and fund communities.
              </p>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
