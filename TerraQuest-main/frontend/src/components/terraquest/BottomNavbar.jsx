import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Scan, Trophy, Gift, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/scan', icon: Scan, label: 'Scan' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/rewards', icon: Gift, label: 'Rewards' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-50">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all relative',
                  isActive
                    ? 'text-eco-500 bg-eco-50'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <item.icon className={cn(
                  'w-5 h-5 transition-transform',
                  isActive && 'scale-110'
                )} />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-eco-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavbar;

