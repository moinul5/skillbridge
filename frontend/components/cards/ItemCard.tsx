import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Calendar, Clock } from 'lucide-react';
import Button from '../ui/Button';

export interface ItemCardProps {
  item: {
    _id: string;
    name: string;
    description: string;
    category: string;
    location: string;
    price: number;
    duration: number;
    rating: number;
    reviewsCount: number;
    availability: {
      startDate: string;
      endDate: string;
    };
    images: string[];
  };
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const {
    _id,
    name,
    description,
    category,
    location,
    price,
    duration,
    rating,
    reviewsCount,
    availability,
    images
  } = item;

  // Formatting date range: e.g. "Jul - Dec"
  const formatDateRange = (startStr: string, endStr: string) => {
    try {
      const start = new Date(startStr);
      const end = new Date(endStr);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[start.getMonth()]} - ${months[end.getMonth()]} ${end.getFullYear().toString().substr(-2)}`;
    } catch {
      return 'Flexible';
    }
  };

  const coverImage = images?.[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group flex flex-col justify-between w-full h-[480px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-slate-950/50 transition-all duration-300 transform hover:-translate-y-1">
      
      {/* Aspect Ratio Box for Cover Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={coverImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-850 dark:text-slate-100 shadow-sm border border-slate-100/10 uppercase tracking-wider">
          {category}
        </div>
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-900/80 backdrop-blur-sm text-white flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{rating.toFixed(1)}</span>
          <span className="opacity-75 font-normal">({reviewsCount})</span>
        </div>
      </div>

      {/* Card Content body */}
      <div className="flex-1 flex flex-col justify-between p-5">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs mb-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-primary-500" />
            <span className="truncate max-w-[200px]">{location}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-150 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1.5">
            {name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {description}
          </p>
        </div>

        <div>
          {/* Details Row */}
          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3.5 mb-4">
            <div className="flex items-center gap-1 font-medium">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{duration} Days</span>
            </div>
            <div className="flex items-center gap-1 font-medium">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{formatDateRange(availability.startDate, availability.endDate)}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between mt-auto">
            <div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Starting From</p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">
                ৳{price.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400 dark:text-slate-500">BDT</span>
              </p>
            </div>
            
            <Link href={`/items/${_id}`}>
              <Button variant="primary" size="sm" className="rounded-xl font-semibold shadow-sm text-xs">
                View Details
              </Button>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ItemCard;
