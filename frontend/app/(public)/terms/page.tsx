import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6 transition-colors duration-200">
        
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Terms & Conditions</h1>
        <p className="text-xs text-slate-400">Last updated: June 28, 2026</p>
        
        <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-slate-650 dark:text-slate-400 space-y-4 leading-relaxed">
          <p>
            Welcome to TravelMate AI. By registering, listing, searching, or booking travel packages on this platform, you agree to comply with the terms set forth below.
          </p>
          
          <h3 className="text-base font-bold text-slate-900 dark:text-white pt-4">1. Booking and Financial Policies</h3>
          <p>
            All booking requests placed on TravelMate AI are sent directly to verified package Managers. A booking is considered confirmed only after the Manager changes its status to "Confirmed" in the dashboard and coordinates with you.
          </p>

          <h3 className="text-base font-bold text-slate-900 dark:text-white pt-4">2. Role Responsibilities</h3>
          <p>
            Users are responsible for supplying accurate contact details. Managers/Tour Operators must ensure listed package pricing, itineraries, and inclusions are correct. Admins reserve the right to modify user roles and remove packages.
          </p>

          <h3 className="text-base font-bold text-slate-900 dark:text-white pt-4">3. AI Recommendations Limitation</h3>
          <p>
            AI-generated trip plans and recommendations are intended as suggestions. TravelMate AI is not liable for weather disruptions, road closures, or guide discrepancies arising during your travel activities.
          </p>
        </div>

      </main>
      <Footer />
    </>
  );
}
