import React from 'react';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

const EcoBadge = ({ 
  children, 
  variant = 'points', 
  locked = false,
  icon,
  className,
  ...props 
}) => {
  const variants = {
    points: 'bg-amber-400 text-white',
    level: 'bg-eco-200 text-eco-800',
    locked: 'bg-gray-200 text-gray-400',
    success: 'bg-eco-500 text-white',
    warning: 'bg-amber-500 text-white',
  };

  const baseStyles = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold';

  return (
    <span
      className={cn(
        baseStyles,
        locked ? variants.locked : variants[variant],
        className
      )}
      {...props}
    >
      {locked && <Lock className="w-3 h-3" />}
      {icon && !locked && <span>{icon}</span>}
      {children}
    </span>
  );
};

export default EcoBadge;

