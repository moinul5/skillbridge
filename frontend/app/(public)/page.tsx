'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { itemService } from '../../lib/api';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ItemCard from '../../components/cards/ItemCard';
import Button from '../../components/ui/Button';
import { 
  Sparkles, Compass, MapPin, Shield, Star, Users, Award, HelpCircle, 
  ArrowRight, Search, Landmark, ChevronDown, Trees, Waves
} from 'lucide-react';

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  // React Query to fetch popular items
  const { data: itemsData, isLoading } = useQuery({
    queryKey: ['popularItems', activeCategory],
    queryFn: () => itemService.getAll({ category: activeCategory !== 'All' ? activeCategory : undefined, limit: 4 })
  });

  const categories = [
    { name: 'All', icon: Compass },
    { name: 'Beach', icon: Waves },
    { name: 'Nature', icon: Trees },
    { name: 'Adventure', icon: Compass },
    { name: 'Cultural', icon: Landmark },
    { name: 'Eco-tourism', icon: Trees }
  ];

  const featuredDestinations = [
    { name: 'Sajek Valley', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80', count: '10+ tours', location: 'Rangamati' },
    { name: 'Cox\'s Bazar', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=400&q=80', count: '15+ tours', location: 'Chittagong' },
    { name: 'Sylhet Gardens', image: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=400&q=80', count: '8+ tours', location: 'Sylhet' },
    { name: 'Sundarbans Mangrove', image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=400&q=80', count: '5+ tours', location: 'Khulna' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'How AI Can Help You Plan Better Trips',
      excerpt: 'Discover how generative AI is transforming travel itinerary creation, matching budgets, and finding local experiences.',
      category: 'AI Travel',
      date: 'June 18, 2026',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      title: 'Top Budget-Friendly Destinations in Bangladesh',
      excerpt: 'Explore stunning getaways like Srimangal, Paharpur, and Bandarban without breaking the bank.',
      category: 'Budget Travel',
      date: 'May 24, 2026',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 3,
      title: 'Best Time to Visit Cox\'s Bazar, Sylhet, and Sajek',
      excerpt: 'A complete weather and seasonal guide to planning your trips to the beach, hills, and tea estates of Bangladesh.',
      category: 'Trip Guides',
      date: 'April 10, 2026',
      image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const faqs = [
    { q: 'How does the AI Trip Planner work?', a: 'You enter your destination, dates, budget style, and interests. Our built-in Gemini AI model processes your request and creates a customized, day-by-day itinerary with budget recommendations and packing tips.' },
    { q: 'Can I customize the pre-built packages?', a: 'Yes! When viewing any package, you can request an AI customization overlay to adapt it to your specific guest count, travel pace, and interests.' },
    { q: 'What is the role of a Manager on the platform?', a: 'Managers are verified travel operators who list packages, manage client bookings, generate AI-optimized copy, and view revenue analytics directly from their specialized dashboard.' },
    { q: 'What happens if the AI service fails or key is missing?', a: 'We have built a deterministic fallback engine that matches your location and category keywords to return realistic travel details. The application remains fully functional at all times.' }
  ];

  const fallbackItems = [
    {
      _id: 'item_coxsbazar_001',
      name: 'Cox\'s Bazar Beach Escape',
      description: 'Experience the world\'s longest natural sandy sea beach in Cox\'s Bazar. Relax, swim, and enjoy sunsets.',
      category: 'Beach',
      location: 'Cox\'s Bazar, Chittagong',
      price: 15000,
      duration: 3,
      rating: 4.8,
      reviewsCount: 3,
      availability: { startDate: '2026-07-01', endDate: '2026-12-31' },
      images: ['https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80']
    },
    {
      _id: 'item_sylhet_002',
      name: 'Sylhet Tea Valley Retreat',
      description: 'Immerse yourself in the lush green tea gardens of Srimangal and explore the scenic lakes of Sylhet.',
      category: 'Nature',
      location: 'Srimangal & Sylhet Sadar',
      price: 12000,
      duration: 2,
      rating: 4.7,
      reviewsCount: 2,
      availability: { startDate: '2026-07-01', endDate: '2026-12-31' },
      images: ['https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80']
    },
    {
      _id: 'item_sajek_003',
      name: 'Sajek Valley Cloud Tour',
      description: 'Travel above the clouds to Sajek Valley, surrounded by misty hills and vibrant indigenous culture.',
      category: 'Adventure',
      location: 'Sajek Valley, Rangamati',
      price: 14000,
      duration: 3,
      rating: 4.9,
      reviewsCount: 2,
      availability: { startDate: '2026-07-01', endDate: '2026-12-31' },
      images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80']
    },
    {
      _id: 'item_sundarbans_004',
      name: 'Sundarbans Wildlife Expedition',
      description: 'Cruise through the world\'s largest mangrove forest, home of the majestic Royal Bengal Tiger.',
      category: 'Nature',
      location: 'Sundarbans, Khulna',
      price: 25000,
      duration: 4,
      rating: 4.9,
      reviewsCount: 1,
      availability: { startDate: '2026-07-01', endDate: '2026-12-31' },
      images: ['https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80']
    }
  ];

  const items = itemsData?.data?.length ? itemsData.data : fallbackItems;

  return (
    <>
      <Navbar />
      <main className="flex-1 transition-colors duration-200">
        
        {/* SECTION 1: Hero Section */}
        <section className="relative overflow-hidden bg-slate-900 text-white min-h-[550px] max-h-[700px] flex items-center justify-center">
          {/* Background overlay image */}
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80" 
              alt="Travel Hero Background" 
              className="w-full h-full object-cover" 
            />
          </div>
          {/* Accent light spots */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]" />

          <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10 w-full">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-400 border border-primary-500/30">
                <Sparkles className="w-3.5 h-3.5" /> Next-Gen Travel Discovery
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Plan Smarter Trips with <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-primary-400 to-emerald-400 bg-clip-text text-transparent">AI-Powered</span> Recommendations
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover curated destinations, compare local experiences, and get personalized AI travel suggestions based on your budget, interests, and travel style.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/explore">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto font-semibold">Explore Packages</Button>
                </Link>
                <Link href="/dashboard/ai-assistant">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold border-slate-700 hover:bg-slate-800 text-white">
                    Try AI Planner
                  </Button>
                </Link>
              </div>
            </div>

            {/* Interactive Preview Card */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="glass p-6 rounded-3xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-md shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary-500/20 text-primary-400 rounded-xl">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">AI Planner Live</h4>
                      <p className="text-[10px] text-slate-400">Generate instantly</p>
                    </div>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850">
                    <p className="text-slate-400 text-[10px] font-medium">PREFERENCE</p>
                    <p className="font-semibold text-slate-200">3 Days Adventure in Sajek Valley</p>
                  </div>
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850">
                    <p className="text-slate-400 text-[10px] font-medium">BUDGET RANGE</p>
                    <p className="font-semibold text-slate-200">Moderate (14,000 BDT per guest)</p>
                  </div>
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850">
                    <p className="text-slate-400 text-[10px] font-medium">AI SUGGESTION PREVIEW</p>
                    <p className="italic text-slate-350 line-clamp-2">"Enjoy hilltop cottage with deck cloud views, traditional bamboo meals, and sunrise hike to Konglak Para..."</p>
                  </div>
                </div>

                <Link href="/dashboard/ai-assistant" className="block w-full">
                  <Button variant="secondary" size="md" className="w-full text-xs font-semibold rounded-xl">
                    Launch Assistant <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Categories Section */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Explore by Category</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Filter popular experiences to match your travel vibes</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 3: Featured Destinations */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Featured Destinations</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Our traveler's most favorited locations across Bangladesh</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredDestinations.map((dest, idx) => (
              <div 
                key={idx} 
                className="group relative h-48 sm:h-64 rounded-3xl overflow-hidden shadow-sm cursor-pointer"
              >
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="flex items-center gap-1 text-[10px] text-primary-400 font-semibold mb-0.5">
                    <MapPin className="w-3 h-3" /> {dest.location}
                  </span>
                  <h4 className="font-bold text-sm sm:text-base">{dest.name}</h4>
                  <p className="text-[10px] text-slate-350 opacity-90">{dest.count}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: Popular Travel Experiences */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Popular Travel Packages</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Handcrafted tours featuring verified itineraries and ratings</p>
            </div>
            <Link href="/explore" className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1">
              See All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-[480px] bg-slate-100 dark:bg-slate-900 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item: any) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* SECTION 5: AI Travel Planner Preview */}
        <section className="bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-800/50 py-16">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400">
                <Sparkles className="w-3.5 h-3.5" /> Artificial Intelligence Assistant
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Plan Your Customized Travel <br className="hidden sm:inline" />
                Itinerary in Seconds
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
                Enter your travel requirements and our intelligent advisor generates tailored day-by-day itineraries, packing lists, safety warnings, and budget hacks instantly.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5"><Shield className="w-4 h-4" /></div>
                  <div>
                    <h4 className="font-semibold text-xs text-slate-900 dark:text-white">Safety Advisories</h4>
                    <p className="text-[10px] text-slate-400">Real-time alerts customized to the terrain.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5"><Star className="w-4 h-4" /></div>
                  <div>
                    <h4 className="font-semibold text-xs text-slate-900 dark:text-white">Intelligent Pricing</h4>
                    <p className="text-[10px] text-slate-400">Itinerary suggestions that respect your budget bracket.</p>
                  </div>
                </div>
              </div>

              <Link href="/dashboard/ai-assistant" className="inline-block">
                <Button variant="primary" size="md" className="font-semibold">
                  Open AI Travel Assistant
                </Button>
              </Link>
            </div>

            <div className="lg:col-span-6 border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-950 p-6 shadow-xl relative overflow-hidden">
              {/* Corner shine */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl" />
              
              <h3 className="font-bold text-base mb-4 flex items-center gap-1.5">
                <Compass className="w-5 h-5 text-primary-500" /> Start Planning Now
              </h3>
              
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1.5">Where do you want to go?</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Srimangal Tea Estates" 
                    disabled
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 cursor-not-allowed text-slate-400"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1.5">Budget Class</label>
                    <select disabled className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 cursor-not-allowed text-slate-400">
                      <option>Moderate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1.5">Guests</label>
                    <select disabled className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 cursor-not-allowed text-slate-400">
                      <option>2 Travelers</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/dashboard/ai-assistant">
                    <Button variant="secondary" size="md" className="w-full font-semibold rounded-xl">
                      Generate With AI <Sparkles className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: How It Works */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">How It Works</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Get ready for your dream trip in three quick steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-lg">1</div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Discover & Search</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                Browse our premium pre-built packages or filter using our advanced explore tool.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-lg">2</div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Customize With AI</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                Launch the AI assistant to tailor the daily tasks, budgets, packing lists, and activities to your travel style.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-lg">3</div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">Book and Travel</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                Place secure bookings, manage reservations inside your dashboard, and start packing.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 7: Statistics Section */}
        <section className="bg-slate-900 text-white py-12">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-extrabold text-primary-400">12+</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1"> Bangladesh Destinations</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-primary-400">99.2%</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Customer Satisfaction</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-primary-400">50K+</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Experiences Booked</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-primary-400">24/7</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Support Available</p>
            </div>
          </div>
        </section>

        {/* SECTION 8: Testimonials */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">What Travelers Say</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Read stories from verified platform guests</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex gap-1 text-amber-500"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">
                "The Sajek Valley trip was absolutely incredible. Booking through the platform was simple, and the AI-generated packing list was spot-on for the mountain climate!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Reviewer" /></div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white">Zubair Karim</h4>
                  <p className="text-[10px] text-slate-400">Dhaka, BD</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex gap-1 text-amber-500"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">
                "Ratargul swamp forest tour organized by Rahat was superb. The dynamic itinerary recommendations saved us from visiting during dry seasons. Very professional platform!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Reviewer" /></div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white">Fahmida Sultana</h4>
                  <p className="text-[10px] text-slate-400">Chittagong, BD</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex gap-1 text-amber-500"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">
                "As a Manager, generating SEO titles and descriptions using the AI generator saved me hours of copywriting. TravelMate is a game-changer for tour operators."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden"><img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80" alt="Reviewer" /></div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white">Imran Khan</h4>
                  <p className="text-[10px] text-slate-400">Tour Director</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9: Blog Preview */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Latest Travel Articles</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Read helpful travel hacks and guides from our expert editors</p>
            </div>
            <Link href="/blog" className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1">
              Read All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <div 
                key={post.id} 
                className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-800 dark:text-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {post.category}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium">{post.date}</span>
                    <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-150 line-clamp-2 mt-1 mb-2 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer">
                      <Link href="/blog">{post.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  
                  <div className="pt-4 mt-auto">
                    <Link href="/blog" className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1">
                      Read Article <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 10: FAQ */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-4 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Frequently Asked <br className="hidden lg:inline" /> Questions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto lg:mx-0">
                Can't find the answers you're looking for? Reach out to our 24/7 client support line.
              </p>
              <Link href="/contact" className="inline-block">
                <Button variant="outline" size="sm">Contact Support</Button>
              </Link>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-3">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div 
                    key={idx} 
                    className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50 overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 opacity-60 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3 animate-in fade-in duration-200">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 11: Final CTA Section */}
        <section className="bg-gradient-to-tr from-primary-900 to-emerald-800 text-white py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80" 
              alt="Background pattern" 
              className="w-full h-full object-cover" 
            />
          </div>
          
          <div className="relative max-w-xl mx-auto px-4 space-y-6 z-10">
            <h2 className="text-3xl font-extrabold tracking-tight">Embark on Your Next Journey</h2>
            <p className="text-sm text-slate-350 opacity-90 leading-relaxed">
              Create an account to save favorite packages, retrieve custom AI recommendations, review bookings, and plan customized itineraries.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register">
                <Button variant="primary" size="lg" className="w-full sm:w-auto font-semibold bg-white hover:bg-slate-100 text-slate-900 shadow-lg">
                  Join TravelMate
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold border-white/20 hover:bg-white/10 text-white">
                  Browse Packages
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
