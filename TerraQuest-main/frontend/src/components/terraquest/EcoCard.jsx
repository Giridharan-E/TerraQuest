import React from 'react';
import { cn } from '@/lib/utils';

const EcoCard = ({ 
  title, 
  subtitle, 
  icon, 
  variant = 'default', 
  children, 
  className,
  ...props 
}) => {
  const variants = {
    default: 'bg-white border border-eco-100',
    highlight: 'bg-white border-2 border-eco-300 shadow-eco',
    gradient: 'bg-gradient-to-r from-eco-50 to-eco-100 border border-eco-200',
  };

  return (
    <div
      className={cn(
        'rounded-2xl shadow-sm shadow-eco-100 p-4 md:p-6',
        variants[variant],
        className
      )}
      {...props}
    >
      {(title || subtitle || icon) && (
        <div className="mb-4">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-eco-100 to-eco-200 flex items-center justify-center mb-2">
              {icon}
            </div>
          )}
          {title && (
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default EcoCard;

