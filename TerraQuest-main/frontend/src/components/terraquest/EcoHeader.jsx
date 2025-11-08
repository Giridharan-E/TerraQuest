import React from 'react';
import { cn } from '@/lib/utils';

const EcoHeader = ({ 
  title, 
  subtitle, 
  points, 
  icon, 
  className,
  ...props 
}) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gradient-to-br from-eco-100 via-eco-200 to-eco-300 pt-8 pb-6 px-4 md:px-6',
        className
      )}
      {...props}
    >
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-48 h-48 opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full text-eco-500">
          <path
            d="M100 20 Q120 40 140 20 T180 20 Q160 60 180 100 T160 180 Q140 160 100 180 T20 160 Q40 140 20 100 T40 20 Q60 40 100 20 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div>
          {title && (
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>

        {/* Points Badge */}
        {points !== undefined && (
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-orange-400 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">{points}</span>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-eco-500 rounded-full border-2 border-white"></div>
          </div>
        )}

        {/* Optional Icon */}
        {icon && !points && (
          <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoHeader;

