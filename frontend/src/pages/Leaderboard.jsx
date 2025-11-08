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
    <div className="min-h-screen" style={{background: 'linear-gradient(to bottom, #f0fdf4, #ffffff)'}} data-testid="leaderboard-page">
      <Navigation />

      <div className="max-w-md mx-auto px-4 md:px-6 py-6 pb-24 md:pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Global Leaderboard
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">Top sustainability champions worldwide</p>
        </div>

        <div className="space-y-3">
          {leaders.map((leader, idx) => (
            <div
              key={leader.id}
              className={`bg-white rounded-2xl shadow-sm p-4 ${
                leader.id === user?.id ? 'ring-2' : ''
              }`}
              style={{
                boxShadow: '0 1px 3px rgba(59,178,115,0.1)',
                ringColor: leader.id === user?.id ? '#3bb273' : 'transparent'
              }}
              data-testid={`leaderboard-rank-${idx + 1}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 text-center">
                  {getRankIcon(idx + 1)}
                  <p className="text-xs font-semibold text-gray-700 mt-1">#{idx + 1}</p>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-gray-900">{leader.name}</h3>
                    {leader.id === user?.id && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full text-white" style={{background: '#3bb273'}}>
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{leader.level}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{leader.totalScans} products scanned</p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{leader.ecoScore}</p>
                  <p className="text-xs text-gray-600">points</p>
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