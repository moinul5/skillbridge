import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { ArrowRight, Trees, Compass, Waves, Landmark } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: 'How AI Can Help You Plan Better Trips',
      excerpt: 'Generative AI is changing the landscape of travel planning. Discover how models like Gemini analyze budgets, construct day-by-day itineraries, and pre-filter safety alerts based on seasonal weather.',
      category: 'AI Travel',
      date: 'June 18, 2026',
      author: 'Tasnim Ahmed',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80',
      icon: Compass
    },
    {
      id: 2,
      title: 'Top Budget-Friendly Destinations in Bangladesh',
      excerpt: 'Think travel requires breaking the bank? Explore the hidden hills of Bandarban, historical ruins of Sonargaon, and calm tea gardens in Srimangal with cost-effective accommodation guides.',
      category: 'Budget Travel',
      date: 'May 24, 2026',
      author: 'Moinul Islam',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
      icon: Trees
    },
    {
      id: 3,
      title: 'Best Time to Visit Cox\'s Bazar, Sylhet, and Sajek',
      excerpt: 'Planning seasonal trips can make or break the experience. Explore why winter is perfect for Sajek Valley cloud gazing, whereas late monsoon is ideal to see the waterfalls of Sylhet and Bandarban.',
      category: 'Trip Guides',
      date: 'April 10, 2026',
      author: 'Rahat Khan',
      image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
      icon: Waves
    },
    {
      id: 4,
      title: 'Exploring the Rich Mughal History of Old Dhaka',
      excerpt: 'Walk through narrow rikshaw alleys to explore Mughal legacy. From Lalbagh Fort and Ahsan Manzil to historical star mosques, Old Dhaka is a paradise for heritage lovers and biryani foodies.',
      category: 'Cultural',
      date: 'March 15, 2026',
      author: 'Fahmida Sultana',
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a523?auto=format&fit=crop&w=800&q=80',
      icon: Landmark
    }
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-colors duration-200">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-105 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 uppercase tracking-wider">
            Travelmate Blog
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Travel Guides & AI Tips</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Read helpful travel advice, destination highlights, packing checklist hacks, and AI technology updates.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => {
            const Icon = post.icon;
            return (
              <article 
                key={post.id} 
                className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-800 dark:text-slate-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Icon className="w-3.5 h-3.5 text-primary-500" />
                    <span>{post.category}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>By {post.author}</span>
                    </div>
                    
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1 cursor-pointer">
                      Read Complete Article <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

      </main>
      <Footer />
    </>
  );
}
