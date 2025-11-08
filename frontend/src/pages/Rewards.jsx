import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API, AuthContext } from '../App';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { Gift, TreePine, ShoppingBag, Waves, Sprout } from 'lucide-react';
import { toast } from 'sonner';

const Rewards = () => {
  const { user } = useContext(AuthContext);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await axios.get(`${API}/rewards`);
      setRewards(response.data);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      'tree-pine': <TreePine className="w-12 h-12 text-green-600" />,
      'shopping-bag': <ShoppingBag className="w-12 h-12 text-green-600" />,
      'waves': <Waves className="w-12 h-12 text-blue-600" />,
      'sprout': <Sprout className="w-12 h-12 text-green-600" />
    };
    return icons[iconName] || <Gift className="w-12 h-12 text-green-600" />;
  };

  const handleRedeem = (reward) => {
    if (user.ecoScore >= reward.pointsRequired) {
      toast.success(`Redeemed: ${reward.name}!`);
    } else {
      toast.error(`Need ${reward.pointsRequired - user.ecoScore} more points!`);
    }
  };

  return (
    <div className="min-h-screen" data-testid="rewards-page">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="glass-card p-8 mb-8 animate-fade-in">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-2" style={{fontFamily: 'Space Grotesk'}}>
                Rewards Store
              </h1>
              <p className="text-green-700 text-base">Redeem your EcoPoints for real-world impact</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600 mb-1">Your EcoScore</p>
              <p className="text-4xl font-bold text-green-800" data-testid="user-ecoscore-display">{user?.ecoScore}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards.map((reward, idx) => {
            const canRedeem = user?.ecoScore >= reward.pointsRequired;
            return (
              <div key={reward.id} className="score-card p-6 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }} data-testid={`reward-${idx}`}>
                <div className="flex gap-4 mb-4">
                  <div className="flex-shrink-0">
                    {getIcon(reward.icon)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-green-800 mb-1" style={{fontFamily: 'Space Grotesk'}}>
                      {reward.name}
                    </h3>
                    <p className="text-green-600 font-medium mb-2">{reward.ngoName}</p>
                    <p className="text-green-700 text-sm mb-4">{reward.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-green-200">
                  <div>
                    <p className="text-sm text-green-600 mb-1">Points Required</p>
                    <p className="text-2xl font-bold text-green-800">{reward.pointsRequired}</p>
                  </div>
                  <Button 
                    onClick={() => handleRedeem(reward)}
                    disabled={!canRedeem}
                    className={`${canRedeem ? 'btn-primary text-white' : 'bg-gray-300 text-gray-600'}`}
                    data-testid={`redeem-reward-${idx}`}
                  >
                    {canRedeem ? 'Redeem Now' : 'Not Enough Points'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Rewards;