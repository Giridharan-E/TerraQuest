import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { Button } from '@/components/ui/button';
import { Home, Scan, Trophy, Target, Gift, LogOut, Leaf } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/scan', icon: Scan, label: 'Scan' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/challenges', icon: Target, label: 'Challenges' },
    { path: '/rewards', icon: Gift, label: 'Rewards' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Top Header - Desktop Only */}
      <nav className="hidden md:block bg-white shadow-sm" data-testid="navigation">
        <div className="max-w-md mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6" style={{color: '#3bb273'}} />
            <span className="text-lg font-semibold" style={{color: '#111827'}}>TerraQuest</span>
          </div>

          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-sm text-gray-600 hover:text-gray-900"
            data-testid="logout-button"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>
        </div>
      </nav>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50" style={{boxShadow: '0 -4px 10px rgba(0,0,0,0.05)'}}>
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
                  isActive ? 'bg-green-100' : ''
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <item.icon
                  className="w-5 h-5"
                  style={{color: isActive ? '#3bb273' : '#6b7280'}}
                />
                <span
                  className="text-xs font-medium"
                  style={{color: isActive ? '#3bb273' : '#6b7280'}}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navigation;