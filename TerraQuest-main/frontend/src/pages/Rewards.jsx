import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../App';
import { useData } from '../contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Gift, TreePine, ShoppingBag, Waves, Sprout, Home, Scan, Trophy, User, Sparkles, Leaf, Recycle, Globe, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const Rewards = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { rewards, redeemReward } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const getIcon = (iconName) => {
    const icons = {
      'tree': <TreePine className="w-8 h-8" />,
      'shopping': <ShoppingBag className="w-8 h-8" />,
      'waves': <Waves className="w-8 h-8" />,
      'gift': <Gift className="w-8 h-8" />,
      'sun': <Sparkles className="w-8 h-8" />,
      'droplet': <Globe className="w-8 h-8" />
    };
    return icons[iconName] || <Gift className="w-8 h-8" />;
  };

  const handleRedeem = (reward) => {
    const result = redeemReward(reward.id);
    
    if (!result.success) {
      toast.error(result.error || 'Failed to redeem reward');
      return;
    }

    toast.success(`Redeemed: ${reward.reward}! 🎉`, {
      description: `You now have ${result.newEcoScore} EcoPoints remaining`,
      duration: 4000
    });
  };

  const isRedeemed = (rewardId) => {
    return user?.redeemedRewards?.includes(rewardId) || false;
  };

  const canAfford = (points) => {
    return (user?.ecoScore || 0) >= points;
  };

  const impactStats = {
    treesPlanted: user?.treesPlanted || 0,
    plasticSaved: user?.plasticSaved || 0,
    co2Reduced: user?.co2Reduced || '0 kg'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eafaf1] via-[#d1fae5] to-[#b7e4c7] pb-20" data-testid="rewards-page">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-green-50 via-green-100 to-emerald-100 pt-8 pb-6 px-4 md:px-6"
      >
        {/* Decorative background */}
        <motion.div 
          className="absolute top-0 right-0 w-48 h-48 opacity-15"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        >
          <Gift className="w-full h-full text-green-600" />
        </motion.div>
        
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
            Your Rewards 🎁
          </h1>
          <p className="text-sm text-gray-600 mb-4">Turn your EcoPoints into real impact!</p>
          
          {/* Points Summary */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-xl shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-bold text-lg">{user?.ecoScore || 0} EcoPoints</span>
          </motion.div>
        </div>
      </motion.div>

      <div className="px-4 md:px-6 pt-6">
        {/* Rewards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Rewards</h3>
          <div className="grid grid-cols-2 gap-4">
            <AnimatePresence>
              {rewards.map((reward, idx) => {
                const redeemed = isRedeemed(reward.id);
                const affordable = canAfford(reward.points);
                
                return (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`bg-white rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-2 ${
                      redeemed 
                        ? 'border-green-400 bg-green-50' 
                        : affordable 
                        ? 'border-green-200 hover:border-green-400' 
                        : 'border-gray-200 opacity-75'
                    } relative`}
                  >
                    {redeemed && (
                      <div className="absolute top-2 right-2">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + idx * 0.1, type: "spring" }}
                          className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <CheckCircle className="w-5 h-5 text-white" />
                        </motion.div>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold mb-2 ${
                      reward.category === 'NGO' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {reward.category}
                    </div>

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                      reward.category === 'NGO' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      {getIcon(reward.icon)}
                    </div>

                    {/* Reward Info */}
                    <h4 className="font-semibold text-gray-800 mb-1 text-sm">{reward.name}</h4>
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">{reward.reward}</p>
                    <p className="text-xs text-gray-500 mb-3">{reward.description}</p>

                    {/* Points Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-lg">
                        <Sparkles className="w-3 h-3" />
                        <span className="text-xs font-bold">{reward.points} pts</span>
                      </div>
                    </div>

                    {/* Redeem Button */}
                    {redeemed ? (
                      <div className="w-full bg-green-500 text-white text-center py-2 rounded-xl text-sm font-semibold">
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        Redeemed
                      </div>
                    ) : (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => handleRedeem(reward)}
                          disabled={!affordable}
                          className={`w-full rounded-xl py-2 text-sm font-semibold ${
                            affordable
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {affordable ? 'Redeem Now' : `Need ${reward.points - (user?.ecoScore || 0)} more pts`}
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Impact Tracker Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-green-100 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Impact So Far</h3>
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                <TreePine className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{impactStats.treesPlanted}</p>
              <p className="text-xs text-gray-600">Trees Planted</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <Recycle className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{impactStats.plasticSaved} kg</p>
              <p className="text-xs text-gray-600">Plastic Saved</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
                <Globe className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{impactStats.co2Reduced}</p>
              <p className="text-xs text-gray-600">CO₂ Reduced</p>
            </motion.div>
          </div>
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

export default Rewards;
