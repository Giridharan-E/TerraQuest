import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, AuthContext } from '../App';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Scan, Trophy, Award, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [recentScans, setRecentScans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Refresh user data
      const userResponse = await axios.get(`${API}/users/${user.id}`);
      updateUser(userResponse.data);
      
      // Get leaderboard
      const leaderboardResponse = await axios.get(`${API}/users/leaderboard`);
      setLeaderboard(leaderboardResponse.data.slice(0, 5));
      
      // Get recent scans
      const scansResponse = await axios.get(`${API}/scans/user/${user.id}`);
      setRecentScans(scansResponse.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getLevelProgress = () => {
    const levels = [
      { name: 'Eco Rookie', max: 500 },
      { name: 'Green Explorer', max: 1000 },
      { name: 'Eco Guardian', max: 2000 },
      { name: 'Sustainability Champion', max: 3500 },
      { name: 'Green Legend', max: 5000 }
    ];
    
    const currentLevel = levels.find(l => l.name === user?.level) || levels[0];
    const currentIndex = levels.findIndex(l => l.name === user?.level);
    const prevMax = currentIndex > 0 ? levels[currentIndex - 1].max : 0;
    const progress = ((user?.ecoScore - prevMax) / (currentLevel.max - prevMax)) * 100;
    
    return Math.min(Math.max(progress, 0), 100);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '';
    if (score >= 50) return '';
    return '';
  };

  const getScoreColorStyle = (score) => {
    if (score >= 70) return {color: '#3bb273'};
    if (score >= 50) return {color: '#f97316'};
    return {color: '#ef4444'};
  };

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(to bottom, #f0fdf4, #ffffff)'}} data-testid="dashboard-page">
      <Navigation />

      <div className="max-w-md mx-auto px-4 md:px-6 py-6 pb-24 md:pb-6">
        {/* Hero Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">Continue your sustainability journey</p>
        </div>

        {/* Quick Action */}
        <Button
          onClick={() => navigate('/scan')}
          className="w-full mb-6 py-6 text-white font-semibold rounded-2xl transition-all"
          style={{background: '#3bb273'}}
          data-testid="scan-product-button"
        >
          <Scan className="mr-2 h-5 w-5" />
          Scan Product
        </Button>

        {/* Stats Cards */}
        <div className="space-y-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-4" style={{boxShadow: '0 1px 3px rgba(59,178,115,0.1)'}} data-testid="ecoscore-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6" style={{color: '#3bb273'}} />
                <span className="text-lg font-medium text-gray-800">EcoScore</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{background: 'linear-gradient(135deg, #ffd700 0%, #ffb300 100%)', color: '#1b5e20'}} data-testid="user-level">{user?.level}</span>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900" data-testid="user-ecoscore">{user?.ecoScore}</h3>
              <span className="text-sm text-gray-600">points</span>
            </div>
            <div className="mt-3">
              <Progress value={getLevelProgress()} className="h-2" />
              <p className="text-xs text-gray-600 mt-2">Progress to next level</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-sm p-4" style={{boxShadow: '0 1px 3px rgba(59,178,115,0.1)'}} data-testid="total-scans-card">
              <Scan className="w-6 h-6 mb-2" style={{color: '#3bb273'}} />
              <h3 className="text-2xl font-bold text-gray-900 mb-1" data-testid="user-total-scans">{user?.totalScans}</h3>
              <p className="text-sm text-gray-600">Scanned</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4" style={{boxShadow: '0 1px 3px rgba(59,178,115,0.1)'}} data-testid="avg-score-card">
              <TrendingUp className="w-6 h-6 mb-2" style={{color: '#3bb273'}} />
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {user?.totalScans > 0 ? Math.round(user?.ecoScore / user?.totalScans) : 0}
              </h3>
              <p className="text-sm text-gray-600">Avg Score</p>
            </div>
          </div>
        </div>

        {/* Recent Scans */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-3">
            Recent Scans
          </h2>
          {recentScans.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center" style={{boxShadow: '0 1px 3px rgba(59,178,115,0.1)'}}>
              <p className="text-sm text-gray-600">No scans yet. Start scanning products!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentScans.map((scan, idx) => (
                <div key={scan.id} className="bg-white rounded-2xl shadow-sm p-4 flex justify-between items-center" style={{boxShadow: '0 1px 3px rgba(59,178,115,0.1)'}} data-testid={`recent-scan-${idx}`}>
                  <div>
                    <p className="font-medium text-gray-900">{scan.productName}</p>
                    <p className="text-xs text-gray-600 mt-1">{new Date(scan.scannedAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xl font-bold" style={getScoreColorStyle(scan.score)}>
                    {scan.score}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mini Leaderboard */}
        <div data-testid="leaderboard-preview">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium text-gray-800">
              Top EcoWarriors
            </h2>
            <Button
              variant="ghost"
              onClick={() => navigate('/leaderboard')}
              className="text-sm font-medium hover:bg-transparent p-0"
              style={{color: '#3bb273'}}
              data-testid="view-full-leaderboard-button"
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {leaderboard.map((leader, idx) => (
              <div key={leader.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3" style={{boxShadow: '0 1px 3px rgba(59,178,115,0.1)'}} data-testid={`leaderboard-item-${idx}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{background: '#3bb273'}}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{leader.name}</p>
                  <p className="text-xs text-gray-600">{leader.level}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{leader.ecoScore}</p>
                  <p className="text-xs text-gray-600">points</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;