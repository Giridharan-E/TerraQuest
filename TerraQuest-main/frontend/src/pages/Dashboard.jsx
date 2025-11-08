import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../App';
import { useData } from '../contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Search, Scan, Trophy, Award, Home, Gift, User, Leaf, Recycle, Sprout, TrendingUp, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { calculateLevel } from '../data/mockData';

const Dashboard = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { 
    challenges, 
    recentScans, 
    getActiveChallenges,
    getUserRank 
  } = useData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const activeChallenges = getActiveChallenges();

  useEffect(() => {
    // Initialize user data if needed
    if (user && !user.scans) {
      const initialUser = {
        ...user,
        scans: [],
        ecoScore: user.ecoScore || 0,
        totalScans: 0,
        level: calculateLevel(user.ecoScore || 0).name
      };
      updateUser(initialUser);
    }
  }, [user, updateUser]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/scan?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/scan');
    }
  };

  const handleChallengeClick = (challenge) => {
    toast.info(`Challenge: ${challenge.title}`, {
      description: `${challenge.progress || 0}/${challenge.target} completed`
    });
    navigate('/challenges');
  };

  const handleScanClick = (scan) => {
    navigate(`/scan?product=${encodeURIComponent(scan.productName)}`);
  };

  const getLevelProgress = () => {
    const levels = [
      { name: 'Eco Rookie', min: 0, max: 200 },
      { name: 'Green Explorer', min: 200, max: 500 },
      { name: 'Eco Guardian', min: 500, max: 1000 },
      { name: 'Planet Protector', min: 1000, max: 2000 },
      { name: 'Earth Champion', min: 2000, max: 5000 },
      { name: 'Sustainability Master', min: 5000, max: Infinity }
    ];
    
    const currentLevel = calculateLevel(user?.ecoScore || 0);
    const levelIndex = levels.findIndex(l => l.name === currentLevel.name);
    const levelData = levels[levelIndex] || levels[0];
    const prevMax = levelIndex > 0 ? levels[levelIndex - 1].max : 0;
    const progress = ((user?.ecoScore || 0) - prevMax) / (levelData.max - prevMax) * 100;
    
    return Math.min(Math.max(progress, 0), 100);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getChallengeIcon = (iconName) => {
    const icons = {
      'leaf': <Leaf className="w-6 h-6" />,
      'recycle': <Recycle className="w-6 h-6" />,
      'trophy': <Trophy className="w-6 h-6" />,
      'sprout': <Sprout className="w-6 h-6" />,
      'wind': <TrendingUp className="w-6 h-6" />
    };
    return icons[iconName] || <Leaf className="w-6 h-6" />;
  };

  // Calculate progress chapters
  const currentLevel = calculateLevel(user?.ecoScore || 0);
  const progressData = {
    title: "Sustainability Journey",
    chapters: Math.min(Math.floor((user?.ecoScore || 0) / 200), 5),
    total: 6
  };

  // Fallback user data for display
  const displayUser = user || {
    name: 'User',
    ecoScore: 1240,
    level: 'Eco Guardian',
    totalScans: 34,
    id: 'demo-user'
  };

  const levelProgress = getLevelProgress();
  const userRank = getUserRank();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fefcfb] via-[#f5f8f6] to-[#e9f8ec] pb-20" data-testid="dashboard-page">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-br from-green-100 via-green-50 to-emerald-50 pt-8 pb-6 px-4 md:px-6"
      >
        {/* Decorative background illustration */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
          <motion.svg 
            viewBox="0 0 200 200" 
            className="w-full h-full"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M100 20 Q120 40 140 20 T180 20 Q160 60 180 100 T160 180 Q140 160 100 180 T20 160 Q40 140 20 100 T40 20 Q60 40 100 20 Z" 
                  fill="#3bb273" opacity="0.3"/>
          </motion.svg>
        </div>
        
        <div className="relative z-10 flex items-center justify-between mb-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-1">
              {getGreeting()}, {displayUser.name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-sm text-gray-600">Continue your sustainability journey</p>
          </motion.div>
          
          {/* Points Badge */}
          <motion.div 
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500 flex items-center justify-center shadow-lg animate-pulse-subtle">
              <span className="text-white font-bold text-lg">{displayUser.ecoScore || 0}</span>
            </div>
            <motion.div 
              className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div 
          className="relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full pl-12 pr-32 py-3 bg-white rounded-2xl border-2 border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-200 focus:outline-none shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Button
                type="button"
                onClick={() => navigate('/scan')}
                className="bg-gradient-to-r from-[#3bb273] to-[#2d9a5f] text-white rounded-xl px-4 py-2 shadow-md hover:shadow-lg transition-all"
              >
                <Scan className="w-4 h-4 mr-2" />
                Scan
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>

      <div className="px-4 md:px-6 pt-6">
        {/* My Progress Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative mb-6 rounded-2xl bg-gradient-to-br from-green-100 via-emerald-50 to-green-200 p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden"
        >
          {/* Decorative illustration */}
          <div className="absolute right-0 top-0 w-32 h-32 opacity-30">
            <motion.svg 
              viewBox="0 0 100 100" 
              className="w-full h-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <circle cx="50" cy="30" r="20" fill="#3bb273" opacity="0.4"/>
              <path d="M30 60 Q50 40 70 60 Q50 80 30 60" fill="#2d9a5f" opacity="0.3"/>
              <rect x="45" y="50" width="10" height="30" fill="#3bb273" opacity="0.4"/>
            </motion.svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">{progressData.title}</h2>
                <p className="text-sm text-gray-600">Level: {currentLevel.name}</p>
              </div>
              <div className="text-right">
                <motion.span 
                  className="text-2xl font-bold text-[#3bb273]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                >
                  {progressData.chapters}
                </motion.span>
                <span className="text-sm text-gray-500">/{progressData.total}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress to next level</span>
                <span>{Math.round(levelProgress)}%</span>
              </div>
              <div className="h-3 bg-white/50 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>{displayUser.totalScans || 0} scans</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>{displayUser.level || 'Eco Rookie'}</span>
              </div>
              {userRank && (
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-500" />
                  <span>Rank #{userRank}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Active Challenges Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Challenges</h3>
          <AnimatePresence>
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
                  <p>Loading challenges...</p>
                </div>
              ) : activeChallenges.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Leaf className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No active challenges yet</p>
                </div>
              ) : (
                activeChallenges.slice(0, 3).map((challenge, idx) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChallengeClick(challenge)}
                    className="bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center gap-4 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all cursor-pointer group"
                  >
                    <motion.div 
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-green-600"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {getChallengeIcon(challenge.icon || 'leaf')}
                    </motion.div>
                    
                    <div className="flex-1">
                      <h4 className="text-md font-medium text-gray-800 mb-1">{challenge.title}</h4>
                      <p className="text-sm text-gray-600">{challenge.description}</p>
                      {challenge.progress !== undefined && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{challenge.progress}/{challenge.target}</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                              transition={{ delay: 0.9 + idx * 0.1, duration: 0.8 }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <motion.div 
                      className="bg-gradient-to-br from-orange-400 to-amber-500 text-white px-3 py-1.5 rounded-xl font-semibold text-sm shadow-md"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      +{challenge.reward || challenge.points || 0} pts
                    </motion.div>
                  </motion.div>
                ))
              )}
            </div>
          </AnimatePresence>
        </motion.div>

        {/* Recent Activity Section */}
        {recentScans.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <AnimatePresence>
              <div className="space-y-2">
                {recentScans.slice(0, 3).map((scan, idx) => (
                  <motion.div
                    key={scan.id || idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: 0.9 + idx * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleScanClick(scan)}
                    className="bg-white/80 rounded-xl p-3 flex items-center justify-between shadow-sm hover:shadow-md hover:bg-white transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Scan className="w-5 h-5 text-green-600" />
                      </motion.div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{scan.productName || scan.name}</p>
                        <p className="text-xs text-gray-500">
                          {scan.scannedAt 
                            ? new Date(scan.scannedAt).toLocaleDateString()
                            : new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <motion.span 
                        className="text-lg font-bold text-[#3bb273]"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1 + idx * 0.1, type: "spring" }}
                      >
                        {scan.score || scan.sustainabilityScore || 0}
                      </motion.span>
                      <p className="text-xs text-gray-500">score</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1 }}
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

export default Dashboard;
