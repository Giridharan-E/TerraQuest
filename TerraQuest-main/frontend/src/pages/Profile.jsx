import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../App';
import { useData } from '../contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Home, Scan, Trophy, Gift, User, Settings, LogOut, Leaf, Recycle, 
  Droplet, Sun, Shield, Map, Globe, Award, TrendingUp, Sparkles, TreePine, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { calculateLevel, mockLevels } from '../data/mockData';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const { getUserBadges, getLockedBadges } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const userBadges = getUserBadges();
  const lockedBadges = getLockedBadges();
  const currentLevel = calculateLevel(user?.ecoScore || 0);
  const levelIndex = mockLevels.findIndex(l => l.name === currentLevel.name);
  const nextLevel = mockLevels[levelIndex + 1] || mockLevels[mockLevels.length - 1];
  const levelProgress = nextLevel 
    ? ((user?.ecoScore || 0) - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints) * 100
    : 100;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getBadgeIcon = (icon) => {
    // Return emoji or icon component
    return <span className="text-3xl">{icon}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#dcfce7] to-[#bbf7d0] pb-20" data-testid="profile-page">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-green-100 via-green-200 to-green-300 pt-8 pb-6 px-4 md:px-6"
      >
        {/* Decorative background */}
        <motion.div 
          className="absolute top-0 right-0 w-64 h-64 opacity-20"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        >
          <Leaf className="w-full h-full text-green-600" />
        </motion.div>
        
        <div className="relative z-10 text-center">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3 shadow-lg border-4 border-white"
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </motion.div>
          
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-1">
            {user?.name || 'User'}
          </h1>
          <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-1.5 rounded-full shadow-md mb-2">
            <Globe className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-green-700">{currentLevel.name}</span>
          </div>
          <p className="text-sm text-gray-600">Making small choices for a big impact</p>
        </div>
      </motion.div>

      <div className="px-4 md:px-6 pt-6">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {[
            { icon: Sparkles, label: 'EcoPoints', value: user?.ecoScore || 0, color: 'amber' },
            { icon: Scan, label: 'Scanned', value: user?.totalScans || 0, color: 'green' },
            { icon: Globe, label: 'CO₂ Saved', value: user?.co2Reduced || '0 kg', color: 'blue' }
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + idx * 0.1, type: "spring" }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-white rounded-xl p-5 shadow-sm border border-${stat.color}-100`}
            >
              <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center mb-2`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
              <p className="text-lg font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Badges & Achievements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Achievements 🏅</h3>
          <div className="grid grid-cols-3 gap-3">
            {userBadges.map((badge, idx) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + idx * 0.05, type: "spring" }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 text-center border-2 border-green-200 shadow-sm"
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <p className="text-xs font-semibold text-gray-800">{badge.name}</p>
              </motion.div>
            ))}
            {lockedBadges.slice(0, 6 - userBadges.length).map((badge, idx) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + idx * 0.05 }}
                className="bg-gray-100 rounded-xl p-5 text-center border-2 border-gray-200 opacity-60 relative"
              >
                <div className="text-3xl mb-2 grayscale">{badge.icon}</div>
                <p className="text-xs font-semibold text-gray-500">{badge.name}</p>
                <div className="absolute top-2 right-2">
                  <span className="text-xs">🔒</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Eco Journey Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] mb-6 border border-green-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Eco Journey 🌾</h3>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>{currentLevel.name}</span>
              <span>{nextLevel ? `${Math.round(levelProgress)}% to ${nextLevel.name}` : 'Max Level!'}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(levelProgress, 100)}%` }}
                transition={{ delay: 1, duration: 1 }}
              />
            </div>
          </div>

          {/* Level Timeline */}
          <div className="relative">
            <div className="flex justify-between items-center">
              {mockLevels.slice(0, 4).map((level, idx) => {
                const isCurrent = level.name === currentLevel.name;
                const isCompleted = user?.ecoScore >= level.minPoints;
                
                return (
                  <div key={level.name} className="flex flex-col items-center flex-1">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.1 + idx * 0.1 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                        isCurrent 
                          ? 'bg-green-500 ring-4 ring-green-200' 
                          : isCompleted 
                          ? 'bg-green-400' 
                          : 'bg-gray-200'
                      }`}
                    >
                      {isCompleted && <CheckCircle className="w-5 h-5 text-white" />}
                    </motion.div>
                    <p className={`text-xs text-center ${isCurrent ? 'font-semibold text-green-700' : 'text-gray-600'}`}>
                      {level.name.split(' ')[0]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Impact Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] mb-6 border border-green-200"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Total Contribution</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: TreePine, label: 'Trees Planted', value: user?.treesPlanted || 0, color: 'green' },
              { icon: Recycle, label: 'Plastic Recycled', value: `${user?.plasticSaved || 0} kg`, color: 'blue' },
              { icon: Globe, label: 'CO₂ Reduced', value: user?.co2Reduced || '0 kg', color: 'amber' }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 + idx * 0.1, type: "spring" }}
                whileHover={{ scale: 1.1 }}
                className="text-center"
              >
                <div className={`w-12 h-12 rounded-full bg-${stat.color}-100 flex items-center justify-center mx-auto mb-2`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Settings & Log Out */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="space-y-3"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full border-2 border-gray-200 text-gray-700 rounded-xl py-3"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl py-3"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Navigation Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-50"
      >
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex justify-around items-center">
            {[
              { path: '/', icon: Home, label: 'Home' },
              { path: '/scan', icon: Scan, label: 'Scan' },
              { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
              { path: '/rewards', icon: Gift, label: 'Rewards' },
              { path: '/profile', icon: User, label: 'Profile' }
            ].map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all relative ${
                    isActive
                      ? 'text-[#3bb273] bg-green-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                  <span className="text-xs font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div 
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-[#3bb273] rounded-full"
                      layoutId="activeTab"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
