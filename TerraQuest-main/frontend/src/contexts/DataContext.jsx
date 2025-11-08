import { createContext, useContext, useState, useEffect } from 'react';
import {
  mockProducts,
  mockChallenges,
  mockRewards,
  mockBadges,
  mockLeaderboard,
  getInitialUser,
  calculateLevel,
  calculatePointsFromScan,
  generateAIFeedback,
  getProductByBarcode,
  getProductByName
} from '../data/mockData';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children, user, updateUser }) => {
  const [products] = useState(mockProducts);
  const [challenges, setChallenges] = useState(mockChallenges);
  const [rewards] = useState(mockRewards);
  const [badges] = useState(mockBadges);
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);
  const [recentScans, setRecentScans] = useState([]);

  // Initialize user data if not exists
  useEffect(() => {
    if (user && !user.scans) {
      const initialUser = getInitialUser();
      updateUser({ ...user, ...initialUser });
    }
  }, [user, updateUser]);

  // Update recent scans from user data
  useEffect(() => {
    if (user?.scans) {
      setRecentScans(user.scans.slice(0, 5).reverse());
    }
  }, [user]);

  // Scan a product
  const scanProduct = (barcodeOrName) => {
    let product = getProductByBarcode(barcodeOrName);
    if (!product) {
      product = getProductByName(barcodeOrName);
    }
    
    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    const pointsEarned = calculatePointsFromScan(product.sustainabilityScore);
    const newEcoScore = (user?.ecoScore || 0) + pointsEarned;
    const newLevel = calculateLevel(newEcoScore);
    
    const newScan = {
      id: `scan_${Date.now()}`,
      productName: product.name,
      score: product.sustainabilityScore,
      scannedAt: new Date().toISOString(),
      barcode: product.barcode
    };

    const updatedScans = [newScan, ...(user?.scans || [])];
    const newTotalScans = updatedScans.length;

    // Update challenges progress
    const updatedChallenges = challenges.map(challenge => {
      if (challenge.id === 'challenge_001' && challenge.progress === 0) {
        return { ...challenge, progress: 1, status: 'completed' };
      }
      if (challenge.id === 'challenge_002') {
        const newProgress = Math.min(challenge.progress + 1, challenge.target);
        return { 
          ...challenge, 
          progress: newProgress,
          status: newProgress >= challenge.target ? 'completed' : 'active'
        };
      }
      if (challenge.id === 'challenge_005' && product.carbonFootprint < 30) {
        const newProgress = Math.min(challenge.progress + 1, challenge.target);
        return { 
          ...challenge, 
          progress: newProgress,
          status: newProgress >= challenge.target ? 'completed' : 'active'
        };
      }
      return challenge;
    });
    setChallenges(updatedChallenges);

    // Check for badge unlocks
    const unlockedBadges = [];
    if (newTotalScans === 1 && !user?.badges?.includes('badge_001')) {
      unlockedBadges.push('badge_001');
    }
    if (newEcoScore >= 1000 && !user?.badges?.includes('badge_006')) {
      unlockedBadges.push('badge_006');
    }
    if (newTotalScans >= 25 && !user?.badges?.includes('badge_007')) {
      unlockedBadges.push('badge_007');
    }

    // Update user
    const updatedUser = {
      ...user,
      ecoScore: newEcoScore,
      level: newLevel.name,
      totalScans: newTotalScans,
      scans: updatedScans,
      badges: [...(user?.badges || []), ...unlockedBadges]
    };

    updateUser(updatedUser);

    // Update leaderboard
    updateLeaderboard(updatedUser);

    return {
      success: true,
      product,
      pointsEarned,
      newEcoScore,
      newLevel,
      unlockedBadges: unlockedBadges.map(id => badges.find(b => b.id === id)),
      aiFeedback: generateAIFeedback(product)
    };
  };

  // Update leaderboard
  const updateLeaderboard = (updatedUser) => {
    const updatedLeaderboard = [...leaderboard];
    const userIndex = updatedLeaderboard.findIndex(u => u.uid === updatedUser.uid || u.name === updatedUser.name);
    
    if (userIndex >= 0) {
      updatedLeaderboard[userIndex] = {
        ...updatedLeaderboard[userIndex],
        ecoScore: updatedUser.ecoScore,
        level: updatedUser.level
      };
    } else {
      updatedLeaderboard.push({
        uid: updatedUser.uid || `user_${Date.now()}`,
        name: updatedUser.name,
        ecoScore: updatedUser.ecoScore,
        level: updatedUser.level,
        avatar: "🌱"
      });
    }

    // Sort by ecoScore descending
    updatedLeaderboard.sort((a, b) => b.ecoScore - a.ecoScore);
    setLeaderboard(updatedLeaderboard);
  };

  // Redeem a reward
  const redeemReward = (rewardId) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) {
      return { success: false, error: 'Reward not found' };
    }

    if ((user?.ecoScore || 0) < reward.points) {
      return { success: false, error: 'Insufficient points' };
    }

    const newEcoScore = (user?.ecoScore || 0) - reward.points;
    const newLevel = calculateLevel(newEcoScore);

    // Update impact stats based on reward
    let impactUpdate = {};
    if (reward.category === 'NGO') {
      if (reward.reward.includes('Tree')) {
        impactUpdate.treesPlanted = (user?.treesPlanted || 0) + 1;
      }
      if (reward.reward.includes('Plastic')) {
        impactUpdate.plasticSaved = (user?.plasticSaved || 0) + 1;
      }
    }

    const updatedUser = {
      ...user,
      ecoScore: newEcoScore,
      level: newLevel.name,
      redeemedRewards: [...(user?.redeemedRewards || []), rewardId],
      ...impactUpdate
    };

    updateUser(updatedUser);
    updateLeaderboard(updatedUser);

    return {
      success: true,
      reward,
      newEcoScore,
      newLevel
    };
  };

  // Get user rank
  const getUserRank = () => {
    if (!user) return null;
    const sortedLeaderboard = [...leaderboard].sort((a, b) => b.ecoScore - a.ecoScore);
    const rank = sortedLeaderboard.findIndex(u => 
      (u.uid && user.uid && u.uid === user.uid) || 
      (u.name && user.name && u.name === user.name)
    );
    return rank >= 0 ? rank + 1 : sortedLeaderboard.length + 1;
  };

  // Get active challenges
  const getActiveChallenges = () => {
    return challenges.filter(c => c.status === 'active');
  };

  // Get completed challenges
  const getCompletedChallenges = () => {
    return challenges.filter(c => c.status === 'completed');
  };

  // Get user badges
  const getUserBadges = () => {
    if (!user?.badges) return [];
    return badges.filter(b => user.badges.includes(b.id));
  };

  // Get locked badges
  const getLockedBadges = () => {
    if (!user?.badges) return badges;
    return badges.filter(b => !user.badges.includes(b.id));
  };

  const value = {
    products,
    challenges,
    rewards,
    badges,
    leaderboard,
    recentScans,
    scanProduct,
    redeemReward,
    getUserRank,
    getActiveChallenges,
    getCompletedChallenges,
    getUserBadges,
    getLockedBadges,
    generateAIFeedback,
    getProductByBarcode,
    getProductByName
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

