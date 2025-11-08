import React from 'react';
import { cn } from '@/lib/utils';

const EcoButton = React.forwardRef(({ 
  children, 
  variant = 'primary', 
  icon, 
  className, 
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-gradient-to-r from-eco-500 to-eco-600 hover:from-eco-600 hover:to-eco-700 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white shadow-md hover:shadow-lg',
    outline: 'border-2 border-eco-500 text-eco-600 bg-transparent hover:bg-eco-50',
    ghost: 'text-eco-600 hover:bg-eco-50',
  };

  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-eco-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      {...props}
    >
      {icon && <span className="text-base">{icon}</span>}
      {children}
    </button>
  );
});

EcoButton.displayName = 'EcoButton';

export default EcoButton;

