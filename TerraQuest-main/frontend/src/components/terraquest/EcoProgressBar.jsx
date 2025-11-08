import React from 'react';
import { cn } from '@/lib/utils';

const EcoProgressBar = ({ 
  value, 
  max = 100, 
  label, 
  showLabel = false,
  className,
  ...props 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getColor = (val) => {
    if (val >= 70) return 'bg-eco-500';
    if (val >= 50) return 'bg-amber-400';
    return 'bg-red-500';
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showLabel && (
            <span className="text-xs text-gray-500">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className="w-full h-2 bg-eco-100 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            getColor(percentage)
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && !label && (
        <p className="text-xs text-gray-500 mt-1 text-right">
          {Math.round(percentage)}% sustainable
        </p>
      )}
    </div>
  );
};

export default EcoProgressBar;

