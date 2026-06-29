import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Loader2 className="animate-spin text-primary-600" style={{ width: size, height: size }} />
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-pulse">
      {/* Aspect Ratio Box (Same as Image) */}
      <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 w-full" />
      <div className="p-5 flex flex-col justify-between h-[200px]">
        <div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-3" />
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-4" />
        </div>
        <div className="flex justify-between items-center mt-auto">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <CardSkeleton key={idx} />
      ))}
    </div>
  );
};

export const PageLoader: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center min-h-[400px]">
      <Spinner size={40} />
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading information...</p>
    </div>
  );
};
