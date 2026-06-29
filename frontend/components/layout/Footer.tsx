'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Send, Check } from 'lucide-react';
import Button from '../ui/Button';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    // Simulate API registration
    setSubscribed(true);
    setEmail('');
    setTimeout(() => {
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="w-full bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-500 to-emerald-600 flex items-center justify-center text-white font-extrabold text-lg">T</span>
              <span>TravelMate<span className="text-primary-600 font-medium">AI</span></span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Discover, plan, and book smart curated travel experiences powered by customized AI suggestions.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-slate-600 dark:text-slate-400 text-sm">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-500" />
                <a href="mailto:support@travelmate.ai" className="hover:text-primary-600 transition-colors">support@travelmate.ai</a>
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-500" />
                <a href="tel:+8801711223344" className="hover:text-primary-600 transition-colors">+880 1711-223344</a>
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span>Gulshan-2, Dhaka 1212, Bangladesh</span>
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-slate-900 dark:text-white">Quick Links</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/" className="hover:text-primary-500 transition-colors">Home</Link></li>
              <li><Link href="/explore" className="hover:text-primary-500 transition-colors">Explore Packages</Link></li>
              <li><Link href="/about" className="hover:text-primary-500 transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-primary-500 transition-colors">Travel Blog</Link></li>
              <li><Link href="/contact" className="hover:text-primary-500 transition-colors">Contact Support</Link></li>
              <li><Link href="/help" className="hover:text-primary-500 transition-colors">FAQ & Help Center</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal & Admin */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-slate-900 dark:text-white">Legal & Resources</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/privacy" className="hover:text-primary-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="/login" className="hover:text-primary-500 transition-colors">User Login</Link></li>
              <li><Link href="/register" className="hover:text-primary-500 transition-colors">Partner Registry</Link></li>
            </ul>
            <div className="flex gap-3 pt-2 text-slate-500 dark:text-slate-400">
              <a href="#" className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-primary-500 dark:hover:bg-primary-500 hover:text-white rounded-xl transition-all"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-primary-500 dark:hover:bg-primary-500 hover:text-white rounded-xl transition-all"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-primary-500 dark:hover:bg-primary-500 hover:text-white rounded-xl transition-all"><Instagram className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-slate-900 dark:text-white">Travel Newsletters</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Subscribe to get seasonal discount codes and AI travel updates.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-2.5 pr-10 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white"
                />
                <button
                  type="submit"
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-primary-500 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium animate-in fade-in duration-200">
                  <Check className="w-3.5 h-3.5" />
                  <span>Subscribed! Check your inbox.</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-800 my-8"></div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <span>&copy; {new Date().getFullYear()} TravelMate AI. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary-500 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary-500 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
