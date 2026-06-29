import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6 transition-colors duration-200">
        
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Last updated: June 28, 2026</p>
        
        <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-slate-650 dark:text-slate-400 space-y-4 leading-relaxed">
          <p>
            At TravelMate AI, we prioritize the privacy and security of our guests and operators. This policy details how we gather, utilize, store, and protect your information when using our travel packages and AI planner tools.
          </p>
          
          <h3 className="text-base font-bold text-slate-900 dark:text-white pt-4">1. Information We Collect</h3>
          <p>
            We collect profile credentials (name, email address, telephone numbers), preference metrics (budget profiles, interests), and reservation details (travel dates, guest counts, note guidelines) to process transactions.
          </p>

          <h3 className="text-base font-bold text-slate-900 dark:text-white pt-4">2. AI Data Processing</h3>
          <p>
            When utilizing our AI Trip Planner, the input preferences (interests, locations, budgets) are processed via our secure backend services utilizing Google Gemini API. We do not transmit your login passwords or private personal credentials to external artificial intelligence APIs.
          </p>

          <h3 className="text-base font-bold text-slate-900 dark:text-white pt-4">3. Cookies and Session Data</h3>
          <p>
            We utilize cookies to maintain dark/light mode configurations and preserve local authentication credentials. You can configure your browser to disable cookies, though this may sign you out of dashboard segments.
          </p>
        </div>

      </main>
      <Footer />
    </>
  );
}
