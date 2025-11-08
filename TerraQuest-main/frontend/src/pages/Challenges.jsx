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
      leaf: <Leaf className="w-12 h-12 text-green-600" />,
      recycle: <Recycle className="w-12 h-12 text-green-600" />,
      trophy: <Trophy className="w-12 h-12 text-green-600" />
    };
    return icons[iconName] || <Target className="w-12 h-12 text-green-600" />;
  };

  return (
    <div className="min-h-screen" data-testid="challenges-page">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="glass-card p-8 mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-2" style={{fontFamily: 'Space Grotesk'}}>
            Eco Challenges
          </h1>
          <p className="text-green-700 text-base">Complete challenges and earn bonus rewards</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge, idx) => (
            <div key={challenge.id} className="score-card p-6 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }} data-testid={`challenge-${idx}`}>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  {getIcon(challenge.icon)}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-green-800 mb-2" style={{fontFamily: 'Space Grotesk'}}>
                    {challenge.title}
                  </h3>
                  <p className="text-green-700 mb-4">{challenge.description}</p>
                  <div className="bg-white bg-opacity-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-green-800 font-medium">📋 {challenge.requirement}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-green-600" />
                      <span className="text-lg font-bold text-green-800">+{challenge.reward} points</span>
                    </div>
                    <Button className="btn-primary text-white" data-testid={`accept-challenge-${idx}`}>
                      Accept Challenge
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mock Google Maps Section */}
        <div className="glass-card p-8 mt-8">
          <h2 className="text-3xl font-bold text-green-800 mb-4" style={{fontFamily: 'Space Grotesk'}}>
            Find Eco-Friendly Stores
          </h2>
          <p className="text-green-700 mb-6">Discover sustainable shopping locations near you</p>
          <div className="bg-green-100 rounded-lg h-96 flex items-center justify-center border-2 border-green-300" data-testid="map-placeholder">
            <div className="text-center">
              <Target className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <p className="text-green-800 font-semibold text-lg">Interactive Map</p>
              <p className="text-green-600 text-sm mt-2">Google Maps integration would show eco-stores here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges;