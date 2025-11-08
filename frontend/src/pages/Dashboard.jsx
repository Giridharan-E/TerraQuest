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
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen" data-testid="dashboard-page">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="glass-card p-8 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-2" style={{fontFamily: 'Space Grotesk'}}>
                Welcome back, {user?.name}!
              </h1>
              <p className="text-green-700 text-base">Continue your sustainability journey</p>
            </div>
            <Button 
              onClick={() => navigate('/scan')} 
              className="btn-primary text-white px-8 py-6 text-lg"
              data-testid="scan-product-button"
            >
              <Scan className="mr-2 h-5 w-5" />
              Scan Product
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="score-card p-6" data-testid="ecoscore-card">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-10 h-10 text-green-600" />
              <span className="level-badge" data-testid="user-level">{user?.level}</span>
            </div>
            <h3 className="text-3xl font-bold text-green-800 mb-1" data-testid="user-ecoscore">{user?.ecoScore}</h3>
            <p className="text-green-600 text-sm font-medium">EcoScore</p>
            <div className="mt-4">
              <Progress value={getLevelProgress()} className="h-2" />
              <p className="text-xs text-green-600 mt-2">Progress to next level</p>
            </div>
          </div>

          <div className="score-card p-6" data-testid="total-scans-card">
            <Scan className="w-10 h-10 text-green-600 mb-4" />
            <h3 className="text-3xl font-bold text-green-800 mb-1" data-testid="user-total-scans">{user?.totalScans}</h3>
            <p className="text-green-600 text-sm font-medium">Products Scanned</p>
          </div>

          <div className="score-card p-6" data-testid="avg-score-card">
            <TrendingUp className="w-10 h-10 text-green-600 mb-4" />
            <h3 className="text-3xl font-bold text-green-800 mb-1">
              {user?.totalScans > 0 ? Math.round(user?.ecoScore / user?.totalScans) : 0}
            </h3>
            <p className="text-green-600 text-sm font-medium">Average Sustainability</p>
          </div>
        </div>

        {/* Recent Scans & Leaderboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Scans */}
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-4" style={{fontFamily: 'Space Grotesk'}}>
              Recent Scans
            </h2>
            {recentScans.length === 0 ? (
              <p className="text-green-600 text-center py-8">No scans yet. Start scanning products!</p>
            ) : (
              <div className="space-y-3">
                {recentScans.map((scan, idx) => (
                  <div key={scan.id} className="bg-white bg-opacity-50 rounded-lg p-4 flex justify-between items-center" data-testid={`recent-scan-${idx}`}>
                    <div>
                      <p className="font-semibold text-green-900">{scan.productName}</p>
                      <p className="text-xs text-green-600">{new Date(scan.scannedAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-2xl font-bold ${getScoreColor(scan.score)}`}>
                      {scan.score}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mini Leaderboard */}
          <div className="glass-card p-6" data-testid="leaderboard-preview">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-green-800" style={{fontFamily: 'Space Grotesk'}}>
                Top EcoWarriors
              </h2>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/leaderboard')}
                className="text-green-700 hover:text-green-800"
                data-testid="view-full-leaderboard-button"
              >
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {leaderboard.map((leader, idx) => (
                <div key={leader.id} className="bg-white bg-opacity-50 rounded-lg p-4 flex items-center gap-4" data-testid={`leaderboard-item-${idx}`}>
                  <div className="w-8 h-8 rounded-full eco-gradient flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-green-900">{leader.name}</p>
                    <p className="text-xs text-green-600">{leader.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-800">{leader.ecoScore}</p>
                    <p className="text-xs text-green-600">points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;