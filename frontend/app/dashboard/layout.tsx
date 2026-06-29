'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Spinner } from '../../components/ui/Loader';
import Button from '@/components/ui/Button';
import { 
  Compass, Star, Calendar, User, Settings, Sparkles, LogOut, 
  Menu, X, Sun, Moon, LayoutDashboard, FolderKanban, ShieldCheck, 
  FileSpreadsheet, MessageSquare, AlertOctagon, HelpCircle
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Protected Route Check
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner size={40} />
      </div>
    );
  }

  if (!user) {
    return null; // Redirecting to login
  }

  // Check RBAC Permissions for Subroutes
  const isAdminRoute = pathname.startsWith('/dashboard/admin');
  const isManagerRoute = pathname.startsWith('/dashboard/manager');

  if (isAdminRoute && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-8 bg-slate-50 dark:bg-slate-950 text-center text-xs">
        <AlertOctagon className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-slate-500 mb-6 max-w-sm">
          Forbidden: Admin authorization required. Your current role is listed as "{user.role}".
        </p>
        <Button onClick={() => router.push('/dashboard')} variant="primary">Return to Dashboard</Button>
      </div>
    );
  }

  if (isManagerRoute && user.role !== 'manager' && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-8 bg-slate-50 dark:bg-slate-950 text-center text-xs">
        <AlertOctagon className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-slate-500 mb-6 max-w-sm">
          Forbidden: Manager authorization required. Your current role is listed as "{user.role}".
        </p>
        <Button onClick={() => router.push('/dashboard')} variant="primary">Return to Dashboard</Button>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Nav configuration
  const userLinks = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Bookings', path: '/dashboard/bookings', icon: Calendar },
    { name: 'AI Planner', path: '/dashboard/ai-assistant', icon: Sparkles },
    { name: 'Recommendations', path: '/dashboard/recommendations', icon: Compass },
    { name: 'Profile Settings', path: '/dashboard/profile', icon: User },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const managerLinks = [
    { name: 'Manage Listings', path: '/dashboard/manager', icon: FolderKanban },
    { name: 'Listing Bookings', path: '/dashboard/manager/bookings', icon: FileSpreadsheet },
  ];

  const adminLinks = [
    { name: 'System Analytics', path: '/dashboard/admin', icon: ShieldCheck },
    { name: 'User Directory', path: '/dashboard/admin/users', icon: User },
    { name: 'System Listings', path: '/dashboard/admin/items', icon: FolderKanban },
    { name: 'System Bookings', path: '/dashboard/admin/bookings', icon: FileSpreadsheet },
    { name: 'Review Audit', path: '/dashboard/admin/reviews', icon: MessageSquare },
  ];

  const isLinkActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  const renderNavGroup = (title: string, links: typeof userLinks) => (
    <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
      <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider px-3">{title}</p>
      <div className="flex flex-col gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isLinkActive(link.path);
          return (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                active
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/10'
                  : 'text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-200 text-xs sm:text-sm">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col justify-between w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shrink-0">
        <div className="space-y-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900 dark:text-white px-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-500 to-emerald-600 flex items-center justify-center text-white font-extrabold text-lg">T</span>
            <span>TravelMate<span className="text-primary-600 font-medium">AI</span></span>
          </Link>

          {/* User links */}
          {renderNavGroup('Traveler Menu', userLinks)}

          {/* Manager links */}
          {(user.role === 'manager' || user.role === 'admin') && renderNavGroup('Manager Menu', managerLinks)}

          {/* Admin links */}
          {user.role === 'admin' && renderNavGroup('System Admin Menu', adminLinks)}
        </div>

        {/* User profile section at bottom */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
              {user.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <User className="w-4 h-4 text-slate-500" />}
            </div>
            <div className="truncate flex-1">
              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{user.name}</h5>
              <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-2 py-2 rounded-xl text-xs font-semibold text-rose-650 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. MOBILE MENU DRAWER */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          
          <aside className="relative flex flex-col justify-between w-64 max-w-xs bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-4 z-10 animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <X className="w-5 h-5 text-slate-550" />
            </button>

            <div className="space-y-6 mt-6 overflow-y-auto pr-1 flex-1">
              {renderNavGroup('Traveler Menu', userLinks)}
              {(user.role === 'manager' || user.role === 'admin') && renderNavGroup('Manager Menu', managerLinks)}
              {user.role === 'admin' && renderNavGroup('System Admin Menu', adminLinks)}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 mt-auto">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
                  {user.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <User className="w-4 h-4 text-slate-500" />}
                </div>
                <div className="truncate flex-1">
                  <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">{user.name}</h5>
                  <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-2 py-2 rounded-xl text-xs font-semibold text-rose-650 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all text-left">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 3. MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Dashboard Header */}
        <header className="sticky top-0 z-30 h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 capitalize">
              <span>{pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <Link href="/">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex rounded-xl font-semibold">View Website</Button>
            </Link>
          </div>
        </header>

        {/* Dashboard Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1200px] mx-auto w-full">
            {children}
          </div>
        </div>

      </div>

    </div>
  );
}
