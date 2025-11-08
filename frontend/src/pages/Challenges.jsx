import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../App';
import Navigation from '../components/Navigation';
import { Target, Gift, Leaf, Recycle, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get(`${API}/challenges`);
      setChallenges(response.data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      leaf: <Leaf className="w-8 h-8" style={{color: '#3bb273'}} />,
      recycle: <Recycle className="w-8 h-8" style={{color: '#3bb273'}} />,
      trophy: <Trophy className="w-8 h-8" style={{color: '#3bb273'}} />
    };
    return icons[iconName] || <Target className="w-8 h-8" style={{color: '#3bb273'}} />;
  };

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(to bottom, #f0fdf4, #ffffff)'}} data-testid="challenges-page">
      <Navigation />

      <div className="max-w-md mx-auto px-4 md:px-6 py-6 pb-24 md:pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Eco Challenges
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">Complete challenges and earn bonus rewards</p>
        </div>

        <div className="space-y-4">
          {challenges.map((challenge, idx) => (
            <div key={challenge.id} className="bg-white rounded-2xl shadow-sm p-4" style={{boxShadow: '0 1px 3px rgba(59,178,115,0.1)'}} data-testid={`challenge-${idx}`}>
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{background: '#f0fdf4'}}>
                    {getIcon(challenge.icon)}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{challenge.description}</p>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-700">{challenge.requirement}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4" style={{color: '#fbbf24'}} />
                      <span className="text-sm font-semibold text-gray-900">+{challenge.reward} pts</span>
                    </div>
                    <Button className="px-4 py-2 text-white font-semibold rounded-xl" style={{background: '#3bb273'}} data-testid={`accept-challenge-${idx}`}>
                      Accept
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mock Google Maps Section */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mt-6" style={{boxShadow: '0 1px 3px rgba(59,178,115,0.1)'}}>
          <h2 className="text-lg font-medium text-gray-800 mb-2">
            Find Eco-Friendly Stores
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">Discover sustainable shopping locations near you</p>
          <div className="bg-gray-50 rounded-xl h-64 flex items-center justify-center border border-gray-200" data-testid="map-placeholder">
            <div className="text-center">
              <Target className="w-12 h-12 mx-auto mb-3" style={{color: '#3bb273'}} />
              <p className="text-base font-medium text-gray-900">Interactive Map</p>
              <p className="text-sm text-gray-600 mt-1">Google Maps integration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges;