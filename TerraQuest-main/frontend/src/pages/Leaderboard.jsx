import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../App';
import { useData } from '../contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Medal, Award, Crown, Home, Scan, Gift, User, Leaf, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const Leaderboard = () => {
  const { user } = useContext(AuthContext);
  const { leaderboard, getUserRank } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const userRank = getUserRank();
  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3, 10);
  const isUserInTopThree = topThree.some(u => (u.uid && user?.uid && u.uid === user.uid) || (u.name && user?.name && u.name === user.name));
  const userLeaderboardEntry = leaderboard.find(u => 
    (u.uid && user?.uid && u.uid === user.uid) || 
    (u.name && user?.name && u.name === user.name)
  );

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <motion.div 
          className="relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 flex items-center justify-center shadow-lg border-4 border-white">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <motion.div 
            className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            1
          </motion.div>
        </motion.div>
      );
    }
    if (rank === 2) {
      return (
        <motion.div 
          className="relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 flex items-center justify-center shadow-lg border-4 border-white">
            <Medal className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
            2
          </div>
        </motion.div>
      );
    }
    if (rank === 3) {
      return (
        <motion.div 
          className="relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-300 via-amber-300 to-orange-400 flex items-center justify-center shadow-lg border-4 border-white">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
            3
          </div>
        </motion.div>
      );
    }
    return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center border-2 border-green-200">
        <span className="text-lg font-bold text-green-700">#{rank}</span>
      </div>
    );
  };

  const getAvatar = (entry) => {
    if (entry.avatar) return entry.avatar;
    const name = entry.name || 'U';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return initials;
  };

  const getMaxScore = () => {
    return leaderboard.length > 0 ? leaderboard[0].ecoScore : 1000;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d8f3dc] via-[#b7e4c7] to-[#95d5b2] pb-20" data-testid="leaderboard-page">
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
          <Trophy className="w-full h-full text-green-600" />
        </motion.div>
        
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
            Top EcoWarriors 🌱
          </h1>
          <p className="text-sm text-gray-600">See who's leading the green movement this week!</p>
        </div>
      </motion.div>

      <div className="px-4 md:px-6 pt-6">
        {/* Top 3 Podium */}
        {topThree.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex items-end justify-center gap-2 md:gap-4 mb-6">
              {/* 2nd Place */}
              {topThree[1] && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex-1 max-w-[120px] text-center"
                >
                  <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-300 mb-2">
                    {getRankBadge(2)}
                    <div className="mt-3">
                      <p className="font-semibold text-gray-800 text-sm">{topThree[1].name}</p>
                      <p className="text-xs text-gray-600">{topThree[1].level}</p>
                      <p className="text-lg font-bold text-gray-700 mt-1">{topThree[1].ecoScore}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 1st Place */}
              {topThree[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex-1 max-w-[140px] text-center"
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-white rounded-2xl p-4 shadow-xl border-2 border-yellow-400 mb-2"
                  >
                    {getRankBadge(1)}
                    <div className="mt-3">
                      <p className="font-semibold text-gray-800">{topThree[0].name}</p>
                      <p className="text-xs text-gray-600">{topThree[0].level}</p>
                      <p className="text-xl font-bold text-gray-700 mt-1">{topThree[0].ecoScore}</p>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex-1 max-w-[120px] text-center"
                >
                  <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-orange-300 mb-2">
                    {getRankBadge(3)}
                    <div className="mt-3">
                      <p className="font-semibold text-gray-800 text-sm">{topThree[2].name}</p>
                      <p className="text-xs text-gray-600">{topThree[2].level}</p>
                      <p className="text-lg font-bold text-gray-700 mt-1">{topThree[2].ecoScore}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Rest of Leaderboard */}
        {rest.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Other Eco Warriors</h3>
            <div className="space-y-3">
              <AnimatePresence>
                {rest.map((entry, idx) => {
                  const rank = idx + 4;
                  const isCurrentUser = (entry.uid && user?.uid && entry.uid === user.uid) || 
                                      (entry.name && user?.name && entry.name === user.name);
                  const maxScore = getMaxScore();
                  const progress = (entry.ecoScore / maxScore) * 100;

                  return (
                    <motion.div
                      key={entry.uid || entry.name || idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: 0.7 + idx * 0.05 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className={`bg-white rounded-xl p-5 shadow-sm flex items-center gap-4 ${
                        isCurrentUser ? 'ring-2 ring-green-400 bg-green-50' : ''
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center border-2 border-green-200 flex-shrink-0">
                        <span className="text-sm font-bold text-green-700">#{rank}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getAvatar(entry)}</span>
                            <div>
                              <p className="font-medium text-gray-800 text-sm">
                                {entry.name}
                                {isCurrentUser && <span className="ml-2 text-xs text-green-600">(You)</span>}
                              </p>
                              <p className="text-xs text-gray-500">{entry.level}</p>
                            </div>
                          </div>
                          <p className="text-lg font-bold text-green-600">{entry.ecoScore}</p>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ delay: 0.8 + idx * 0.05, duration: 0.8 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Personal Rank Section */}
        {user && userRank && !isUserInTopThree && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-6 shadow-lg border-2 border-green-300 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Your Rank</h3>
                <p className="text-3xl font-bold text-green-700">#{userRank}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">EcoScore</p>
                <p className="text-2xl font-bold text-gray-800">{userLeaderboardEntry?.ecoScore || user.ecoScore || 0}</p>
              </div>
            </div>
            
            {userLeaderboardEntry && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress to next rank</span>
                  <span>{userRank > 1 ? `${leaderboard[userRank - 2]?.ecoScore - (userLeaderboardEntry.ecoScore || 0)} pts away` : 'Top rank!'}</span>
                </div>
                <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((userLeaderboardEntry.ecoScore || 0) / getMaxScore()) * 100}%` }}
                    transition={{ delay: 1.2, duration: 1 }}
                  />
                </div>
              </div>
            )}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate('/scan')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl py-3 font-semibold shadow-md hover:shadow-lg"
              >
                <Scan className="mr-2 h-4 w-4" />
                Keep Going! Scan More Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}
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

export default Leaderboard;
