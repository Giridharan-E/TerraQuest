import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../App';
import { useData } from '../contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scan, Leaf, Recycle, Award, Factory, ArrowLeft, MapPin, Sparkles, Globe, ArrowRight, Home, Trophy, Gift, User, Bot } from 'lucide-react';
import { toast } from 'sonner';

// Circular Progress Component for Eco Score with Animation
const CircularProgress = ({ value, size = 120, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  const getColor = (val) => {
    if (val >= 70) return '#3bb273';
    if (val >= 50) return '#fbbf24';
    return '#ef4444';
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(value)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (value / 100) * circumference }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className="text-3xl font-bold"
          style={{ color: getColor(value) }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          {value}
        </motion.span>
        <span className="text-xs text-gray-500">/100</span>
      </div>
    </div>
  );
};

const ScanProduct = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { products, scanProduct, generateAIFeedback } = useData();
  const [selectedBarcode, setSelectedBarcode] = useState('');
  const [barcode, setBarcode] = useState('');
  const [scannedProduct, setScannedProduct] = useState(null);
  const [aiFeedback, setAiFeedback] = useState('');
  const [pointsEarned, setPointsEarned] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle search query from URL or location state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    const productQuery = searchParams.get('product');
    
    if (searchQuery) {
      setBarcode(searchQuery);
    } else if (productQuery) {
      setBarcode(productQuery);
    }
  }, [location]);

  const handleScan = async () => {
    const barcodeToScan = barcode || selectedBarcode;
    if (!barcodeToScan) {
      toast.error('Please enter or select a barcode');
      return;
    }

    setLoading(true);
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = scanProduct(barcodeToScan);
    
    if (!result.success) {
      toast.error(result.error || 'Product not found');
      setLoading(false);
      return;
    }

    setScannedProduct(result.product);
    setAiFeedback(result.aiFeedback);
    setPointsEarned(result.pointsEarned);
    setUnlockedBadges(result.unlockedBadges || []);
    
    // Show success toast with points
    toast.success(`Scanned ${result.product.name}!`, {
      description: `+${result.pointsEarned} EcoPoints earned! ${result.newLevel.name} level reached!`,
      duration: 4000
    });

    // Show badge unlock notifications
    if (result.unlockedBadges && result.unlockedBadges.length > 0) {
      setTimeout(() => {
        result.unlockedBadges.forEach(badge => {
          toast.success(`Badge Unlocked! 🏅`, {
            description: badge.name,
            duration: 3000
          });
        });
      }, 500);
    }

    setLoading(false);
  };

  const getScoreCategory = (score) => {
    if (score >= 70) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-300' };
    if (score >= 50) return { label: 'Good', color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-300' };
    return { label: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-300' };
  };

  const getCarbonLevel = (carbon) => {
    if (carbon < 30) return { label: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (carbon < 60) return { label: 'Medium', color: 'text-amber-600', bg: 'bg-amber-100' };
    return { label: 'High', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getEthicalLevel = (ethical) => {
    if (ethical >= 70) return { label: 'High', color: 'text-green-600', bg: 'bg-green-100' };
    if (ethical >= 50) return { label: 'Medium', color: 'text-amber-600', bg: 'bg-amber-100' };
    return { label: 'Low', color: 'text-red-600', bg: 'bg-red-100' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d8f3dc] via-[#b7e4c7] to-[#95d5b2] pb-20" data-testid="scan-product-page">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-green-50 via-green-100 to-green-200 pt-8 pb-6 px-4 md:px-6"
      >
        {/* Decorative background */}
        <motion.div 
          className="absolute top-0 right-0 w-48 h-48 opacity-15"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path d="M100 20 Q120 40 140 20 T180 20 Q160 60 180 100 T160 180 Q140 160 100 180 T20 160 Q40 140 20 100 T40 20 Q60 40 100 20 Z" 
                  fill="#3bb273"/>
          </svg>
        </motion.div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                className="text-gray-700 hover:bg-white/50"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            </motion.div>
            <motion.div 
              className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Globe className="w-5 h-5 text-green-700" />
            </motion.div>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2"
          >
            {scannedProduct ? 'Your Eco Scan Result' : 'Scan a Product'}
          </motion.h1>
          <p className="text-sm text-gray-600">See how your choice impacts the planet 🌎</p>
        </div>
      </motion.div>

      <div className="px-4 md:px-6 pt-6">
        <AnimatePresence mode="wait">
          {!scannedProduct ? (
            <motion.div
              key="scan-input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] mb-6 border border-green-100"
            >
              <div className="space-y-4">
                {/* Barcode Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Barcode or Product Name
                  </label>
                  <div className="relative">
                    <Scan className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      data-testid="barcode-input"
                      type="text"
                      value={barcode}
                      onChange={(e) => {
                        setBarcode(e.target.value);
                        setSelectedBarcode('');
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleScan();
                        }
                      }}
                      placeholder="Try: Coca-Cola, Tata Salt, Dove Soap, or barcode (12345, 67890)"
                      className="pl-12 pr-4 py-3 rounded-xl border-2 border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-200"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="text-xs text-gray-500 font-medium">OR</span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>

                {/* Product Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select from List
                  </label>
                  <Select 
                    value={selectedBarcode} 
                    onValueChange={(value) => {
                      setSelectedBarcode(value);
                      setBarcode('');
                    }}
                  >
                    <SelectTrigger 
                      className="border-2 border-green-200 rounded-xl" 
                      data-testid="product-select"
                    >
                      <SelectValue placeholder="Choose a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.barcode} value={product.barcode}>
                          {product.name} ({product.sustainabilityScore}/100)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Scan Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={handleScan} 
                    disabled={loading || (!barcode && !selectedBarcode)}
                    className="w-full bg-gradient-to-r from-[#3bb273] to-[#2d9a5f] text-white rounded-xl py-4 text-base font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                    data-testid="scan-button"
                  >
                    {loading ? (
                      <>
                        <motion.div 
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2 inline-block"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Scan className="mr-2 h-5 w-5" />
                        Scan Product
                      </>
                    )}
                  </Button>
                </motion.div>

                {/* Mock Scan Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => {
                      if (products.length > 0) {
                        const randomProduct = products[Math.floor(Math.random() * products.length)];
                        setSelectedBarcode(randomProduct.barcode);
                        setBarcode(randomProduct.name);
                        setTimeout(() => handleScan(), 100);
                      }
                    }}
                    variant="outline"
                    className="w-full border-2 border-green-300 text-green-700 rounded-xl py-3 hover:bg-green-50"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Mock Scan (Random Product)
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="product-result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {/* Points Earned Banner */}
              {pointsEarned > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl p-4 mb-4 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">+{pointsEarned} EcoPoints Earned!</p>
                      <p className="text-sm opacity-90">Keep scanning to unlock more rewards</p>
                    </div>
                    <Sparkles className="w-8 h-8" />
                  </div>
                </motion.div>
              )}

              {/* Product Result Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] mb-6 border border-green-100"
                data-testid="scanned-product-result"
              >
                {/* Product Header */}
                <div className="flex items-start justify-between mb-6">
                  <motion.div 
                    className="flex-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                      {scannedProduct.name}
                    </h2>
                    <p className="text-sm text-gray-600">{scannedProduct.category}</p>
                  </motion.div>
                  
                  {/* Circular Eco Score */}
                  <CircularProgress value={scannedProduct.sustainabilityScore} />
                </div>

                {/* Score Badge */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${getScoreCategory(scannedProduct.sustainabilityScore).bg} border ${getScoreCategory(scannedProduct.sustainabilityScore).border} mb-6`}
                >
                  <Award className={`w-4 h-4 ${getScoreCategory(scannedProduct.sustainabilityScore).color}`} />
                  <span className={`text-sm font-semibold ${getScoreCategory(scannedProduct.sustainabilityScore).color}`}>
                    {getScoreCategory(scannedProduct.sustainabilityScore).label}
                  </span>
                </motion.div>

                {/* Sustainability Tags */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-3 gap-3 mb-6"
                >
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Recycle className="w-5 h-5 text-green-600" />
                      <span className="text-xs font-medium text-gray-700">Recyclability</span>
                    </div>
                    <p className={`text-lg font-bold ${scannedProduct.recyclable ? 'text-green-600' : 'text-red-600'}`}>
                      {scannedProduct.recyclable ? 'Yes' : 'Low'}
                    </p>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Factory className="w-5 h-5 text-amber-600" />
                      <span className="text-xs font-medium text-gray-700">Carbon</span>
                    </div>
                    <p className={`text-lg font-bold ${getCarbonLevel(scannedProduct.carbonFootprint).color}`}>
                      {getCarbonLevel(scannedProduct.carbonFootprint).label}
                    </p>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      <span className="text-xs font-medium text-gray-700">Ethical</span>
                    </div>
                    <p className={`text-lg font-bold ${getEthicalLevel(scannedProduct.ethicalScore).color}`}>
                      {getEthicalLevel(scannedProduct.ethicalScore).label}
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* AI Eco Impact Summary (Chat Bubble) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 mb-6 border border-green-200 relative"
              >
                <div className="absolute top-4 left-4">
                  <motion.div 
                    className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Bot className="w-4 h-4 text-green-700" />
                  </motion.div>
                </div>
                <div className="pl-12">
                  <p className="text-sm font-medium text-gray-800 mb-1">AI Eco Analysis</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {aiFeedback || generateAIFeedback(scannedProduct)}
                  </p>
                </div>
                {/* Chat bubble tail */}
                <div className="absolute bottom-0 left-8 transform translate-y-1/2 rotate-45 w-4 h-4 bg-green-50 border-r border-b border-green-200"></div>
              </motion.div>

              {/* Greener Alternatives Section */}
              {scannedProduct.alternatives && scannedProduct.alternatives.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] mb-6 border border-green-100"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Find Greener Alternatives</h3>
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <MapPin className="w-6 h-6 text-green-600" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 mb-3">
                        Try <span className="font-semibold text-green-700">{scannedProduct.alternatives.join(', ')}</span> for more sustainable options.
                      </p>
                      <Button
                        onClick={() => navigate('/challenges')}
                        variant="outline"
                        className="border-green-300 text-green-700 hover:bg-green-50 rounded-xl"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        View on Map
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="space-y-3"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => {
                      setScannedProduct(null);
                      setBarcode('');
                      setSelectedBarcode('');
                      setAiFeedback('');
                      setPointsEarned(0);
                      setUnlockedBadges([]);
                    }}
                    variant="outline"
                    className="w-full border-2 border-green-300 text-green-700 hover:bg-green-50 rounded-xl py-4 font-semibold"
                    data-testid="scan-another-button"
                  >
                    <Scan className="mr-2 h-5 w-5" />
                    Scan Another Product
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => navigate('/')}
                    className="w-full bg-gradient-to-r from-[#3bb273] to-[#2d9a5f] text-white rounded-xl py-4 font-semibold shadow-md hover:shadow-lg"
                    data-testid="back-to-dashboard-button"
                  >
                    Save to My Scans
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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

export default ScanProduct;
