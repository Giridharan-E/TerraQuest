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
    <nav className="glass-card mx-4 my-4 p-4" data-testid="navigation">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Leaf className="w-8 h-8 text-green-700" />
          <span className="text-2xl font-bold text-green-800" style={{fontFamily: 'Space Grotesk'}}>TerraQuest</span>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                variant="ghost"
                className={`nav-link ${isActive ? 'text-green-700 bg-green-50' : 'text-green-800'}`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm text-green-600">EcoScore</p>
            <p className="text-xl font-bold text-green-800">{user?.ecoScore}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-green-500 text-green-700 hover:bg-green-50"
            data-testid="logout-button"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden mt-4 flex justify-around border-t border-green-200 pt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 ${isActive ? 'text-green-700' : 'text-green-600'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;