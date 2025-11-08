import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API, AuthContext } from '../App';
import Navigation from '../components/Navigation';
import { Trophy, Medal, Award } from 'lucide-react';

const Leaderboard = () => {
  const { user } = useContext(AuthContext);
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API}/users/leaderboard`);
      setLeaders(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-8 h-8 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-gray-400" />;
    if (rank === 3) return <Medal className="w-8 h-8 text-orange-600" />;
    return <Award className="w-6 h-6 text-green-600" />;
  };

  return (
    <div className="min-h-screen" data-testid="leaderboard-page">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="glass-card p-8 mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-2" style={{fontFamily: 'Space Grotesk'}}>
            Global Leaderboard
          </h1>
          <p className="text-green-700 text-base">Top sustainability champions worldwide</p>
        </div>

        <div className="space-y-4">
          {leaders.map((leader, idx) => (
            <div 
              key={leader.id} 
              className={`score-card p-6 animate-fade-in ${leader.id === user?.id ? 'ring-2 ring-green-500' : ''}`}
              style={{ animationDelay: `${idx * 0.1}s` }}
              data-testid={`leaderboard-rank-${idx + 1}`}
            >
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-16 text-center">
                  {getRankIcon(idx + 1)}
                  <p className="text-sm font-bold text-green-800 mt-1">#{idx + 1}</p>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-green-900">{leader.name}</h3>
                    {leader.id === user?.id && (
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-green-600 font-medium">{leader.level}</p>
                  <p className="text-sm text-green-600 mt-1">{leader.totalScans} products scanned</p>
                </div>
                
                <div className="text-right">
                  <p className="text-4xl font-bold text-green-800">{leader.ecoScore}</p>
                  <p className="text-sm text-green-600">EcoPoints</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;