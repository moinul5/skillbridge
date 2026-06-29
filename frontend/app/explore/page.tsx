'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { itemService } from '../../lib/api';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ItemCard from '../../components/cards/ItemCard';
import { Spinner, SkeletonGrid } from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import Button from '@/components/ui/Button';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, Star, MapPin } from 'lucide-react';

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter States synced with URL
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [rating, setRating] = useState(searchParams.get('rating') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'recommended');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Debouncing search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 450);
    return () => clearTimeout(handler);
  }, [search]);

  // Sync state changes with URL query parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (category && category !== 'All') params.set('category', category);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (rating) params.set('rating', rating);
    if (location) params.set('location', location);
    if (sort) params.set('sort', sort);
    if (page > 1) params.set('page', page.toString());

    router.replace(`/explore?${params.toString()}`);
  }, [debouncedSearch, category, minPrice, maxPrice, rating, location, sort, page, router]);

  // Query database items
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['exploreItems', debouncedSearch, category, minPrice, maxPrice, rating, location, sort, page],
    queryFn: () => itemService.getAll({
      search: debouncedSearch || undefined,
      category: category !== 'All' ? category : undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      rating: rating || undefined,
      location: location || undefined,
      sort: sort !== 'recommended' ? sort : undefined,
      page,
      limit: 8
    })
  });

  const categories = ['All', 'Beach', 'Nature', 'Adventure', 'Cultural', 'Eco-tourism'];
  const locations = ['All', 'Cox\'s Bazar', 'Sylhet', 'Sajek', 'Bandarban', 'Sundarbans', 'Dhaka'];

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setRating('');
    setLocation('');
    setSort('recommended');
    setPage(1);
  };

  const items = data?.data || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 8, pages: 1 };

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-200">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Explore Experiences</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Discover and customize your dream travel itinerary</p>
          </div>
          <Button
            onClick={handleResetFilters}
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 text-xs font-semibold rounded-xl"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Clear Filters
          </Button>
        </div>

        {/* Search & Sort Panel */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by package name, location or tags..."
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white text-sm"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {/* Mobile Filters Toggle */}
            <Button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              variant="outline"
              className="flex-1 md:hidden flex items-center justify-center gap-1.5 rounded-2xl"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </Button>

            {/* Sorting Select */}
            <div className="relative flex-1 md:flex-initial">
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="w-full md:w-56 pl-3 pr-8 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none text-xs sm:text-sm dark:text-white font-medium appearance-none"
              >
                <option value="recommended">Recommended (Rating)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Packages</option>
                <option value="duration">Shortest Duration</option>
              </select>
              <ArrowUpDown className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filters and Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Sidebar filters for desktop */}
          <aside className={`lg:col-span-3 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'} p-6 lg:p-0 border lg:border-0 border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-950/20 lg:bg-transparent`}>
            
            {/* Category Filter */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</h3>
              <div className="flex flex-col gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setPage(1); }}
                    className={`text-left text-xs sm:text-sm py-1.5 px-3 rounded-xl transition-all ${
                      category === cat
                        ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Price Range (BDT)</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-450 mb-1">Min Price</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl focus:outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-450 mb-1">Max Price</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl focus:outline-none dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Location Selector */}
            <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</h3>
              <div className="relative">
                <select
                  value={location}
                  onChange={(e) => { setLocation(e.target.value === 'All' ? '' : e.target.value); setPage(1); }}
                  className="w-full pl-3 pr-8 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-xs dark:text-white font-medium appearance-none"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <MapPin className="absolute right-3 top-3 w-4 h-4 text-slate-450 pointer-events-none" />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Minimum Rating</h3>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = rating === star.toString();
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => { setRating(isActive ? '' : star.toString()); setPage(1); }}
                      className={`p-2 border rounded-xl flex items-center justify-center gap-1 transition-all ${
                        isActive
                          ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/20 text-amber-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isActive ? 'fill-current' : ''}`} />
                      <span className="text-[10px] font-bold">{star}★</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </aside>

          {/* RIGHT: Listing Grid */}
          <section className="lg:col-span-9 space-y-8">
            
            {isLoading ? (
              <SkeletonGrid count={6} />
            ) : isError ? (
              <ErrorState 
                message="We encountered an issue downloading travel packages from the server. Please check your network." 
                onRetry={() => refetch()} 
              />
            ) : items.length === 0 ? (
              <EmptyState
                title="No packages match your search"
                message="Try adjusting filters, reducing min-ratings, widening price boundaries, or reset search terms."
                actionLabel="Reset Filters"
                onAction={handleResetFilters}
              />
            ) : (
              <>
                {/* Results Grid - responsive cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item: any) => (
                    <ItemCard key={item._id} item={item} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-6 border-t border-slate-200 dark:border-slate-850">
                    <Button
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                    >
                      Previous
                    </Button>
                    <span className="text-xs text-slate-500">
                      Page {page} of {pagination.pages}
                    </span>
                    <Button
                      onClick={() => setPage(prev => Math.min(prev + 1, pagination.pages))}
                      disabled={page === pagination.pages}
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}

          </section>

        </div>

      </main>
      <Footer />
    </>
  );
}
