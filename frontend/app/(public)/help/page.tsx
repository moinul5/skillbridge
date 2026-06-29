import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { HelpCircle, Phone, Mail, FileText, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  const categories = [
    { name: 'Bookings & Cancellations', count: '8 articles', desc: 'Manage reservations, guest counts, dates, and refund cycles.' },
    { name: 'AI Planner Help', count: '5 articles', desc: 'Tips on using Gemini to generate packing suggestions and itineraries.' },
    { name: 'Partner operators', count: '6 articles', desc: 'Listing guidelines, dashboard charts, and AI copywriting tips.' },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 transition-colors duration-200">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <HelpCircle className="w-12 h-12 text-primary-500 mx-auto" />
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Help & Support Center</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Find immediate answers to questions about travel booking, role permissions, and AI assistants.
          </p>
        </div>

        {/* Support Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="p-6 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 bg-white dark:bg-slate-900/10 hover:shadow-md transition-shadow"
            >
              <span className="text-[10px] uppercase font-bold text-primary-500">{cat.count}</span>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{cat.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {cat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="p-8 border border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/10 text-center max-w-2xl mx-auto space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Still need assistance?</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Our specialized client help desk is online 24/7 to resolve booking disputes, weather disruptions, or system permissions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-xs text-slate-650 dark:text-slate-400 pt-2">
            <span className="flex items-center gap-1.5 justify-center"><Phone className="w-4 h-4 text-primary-500" /> +880 1711-223344</span>
            <span className="flex items-center gap-1.5 justify-center"><Mail className="w-4 h-4 text-primary-500" /> support@travelmate.ai</span>
            <Link href="/contact" className="text-primary-500 font-bold hover:underline flex items-center gap-1 justify-center">
              <MessageSquare className="w-4 h-4" /> Open Support Ticket
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
