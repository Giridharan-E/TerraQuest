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
      'tree-pine': <TreePine className="w-8 h-8" style={{color: '#3bb273'}} />,
      'shopping-bag': <ShoppingBag className="w-8 h-8" style={{color: '#3bb273'}} />,
      'waves': <Waves className="w-8 h-8" style={{color: '#3b82f6'}} />,
      'sprout': <Sprout className="w-8 h-8" style={{color: '#3bb273'}} />
    };
    return icons[iconName] || <Gift className="w-8 h-8" style={{color: '#3bb273'}} />;
  };

  const handleRedeem = (reward) => {
    if (user.ecoScore >= reward.pointsRequired) {
      toast.success(`Redeemed: ${reward.name}!`);
    } else {
      toast.error(`Need ${reward.pointsRequired - user.ecoScore} more points!`);
    }
  };

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(to bottom, #f0fdf4, #ffffff)'}} data-testid="rewards-page">
      <Navigation />

      <div className="max-w-md mx-auto px-4 md:px-6 py-6 pb-24 md:pb-6">
        <div className="mb-6">
          <div className="flex justify-between items-start mb-1">
            <h1 className="text-2xl font-semibold text-gray-900">
              Rewards Store
            </h1>
            <div className="text-right">
              <p className="text-xs text-gray-600">Your Score</p>
              <p className="text-xl font-bold text-gray-900" data-testid="user-ecoscore-display">{user?.ecoScore}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">Redeem your EcoPoints for real-world impact</p>
        </div>

        <div className="space-y-4">
          {rewards.map((reward, idx) => {
            const canRedeem = user?.ecoScore >= reward.pointsRequired;
            return (
              <div key={reward.id} className="bg-white rounded-2xl shadow-sm p-4" style={{boxShadow: '0 1px 3px rgba(59,178,115,0.1)'}} data-testid={`reward-${idx}`}>
                <div className="flex gap-3 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{background: reward.icon === 'waves' ? '#dbeafe' : '#f0fdf4'}}>
                      {getIcon(reward.icon)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {reward.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{reward.ngoName}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{reward.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-600 mb-0.5">Points Required</p>
                    <p className="text-lg font-bold text-gray-900">{reward.pointsRequired}</p>
                  </div>
                  <Button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canRedeem}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                      canRedeem ? 'text-white' : 'text-gray-600'
                    }`}
                    style={{background: canRedeem ? '#3bb273' : '#e5e7eb'}}
                    data-testid={`redeem-reward-${idx}`}
                  >
                    {canRedeem ? 'Redeem' : 'Locked'}
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