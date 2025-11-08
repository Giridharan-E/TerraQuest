import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, AuthContext } from '../App';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scan, Leaf, Recycle, Award, Factory, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const ScanProduct = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [selectedBarcode, setSelectedBarcode] = useState('');
  const [barcode, setBarcode] = useState('');
  const [scannedProduct, setScannedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleScan = async () => {
    const barcodeToScan = barcode || selectedBarcode;
    if (!barcodeToScan) {
      toast.error('Please enter or select a barcode');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/scans`, {
        userId: user.id,
        productBarcode: barcodeToScan
      });
      
      setScannedProduct(response.data.product);
      
      // Refresh user data
      const userResponse = await axios.get(`${API}/users/${user.id}`);
      updateUser(userResponse.data);
      
      toast.success(`Scanned ${response.data.product.name}! +${response.data.product.sustainabilityScore} points`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to scan product');
    } finally {
      setLoading(false);
    }
  };

  const getScoreCategory = (score) => {
    if (score >= 70) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 50) return { label: 'Good', color: 'text-orange-500', bg: 'bg-orange-100' };
    return { label: 'Poor', color: 'text-red-600', bg: 'bg-red-100' };
  };

  return (
    <div className="min-h-screen" data-testid="scan-product-page">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="glass-card p-8 mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-2" style={{fontFamily: 'Space Grotesk'}}>
            Scan a Product
          </h1>
          <p className="text-green-700 text-base">Discover the sustainability impact of your choices</p>
        </div>

        {/* Scan Interface */}
        <div className="glass-card p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-green-800 font-semibold mb-2">Enter Barcode</label>
              <Input
                data-testid="barcode-input"
                type="text"
                value={barcode}
                onChange={(e) => {
                  setBarcode(e.target.value);
                  setSelectedBarcode('');
                }}
                placeholder="Enter product barcode (e.g., 1001)"
                className="border-green-300 focus:border-green-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 border-t border-green-300"></div>
              <span className="text-green-600 font-medium">OR</span>
              <div className="flex-1 border-t border-green-300"></div>
            </div>

            <div>
              <label className="block text-green-800 font-semibold mb-2">Select from List</label>
              <Select value={selectedBarcode} onValueChange={(value) => {
                setSelectedBarcode(value);
                setBarcode('');
              }}>
                <SelectTrigger className="border-green-300" data-testid="product-select">
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.barcode} value={product.barcode}>
                      {product.name} - {product.brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleScan} 
              disabled={loading || (!barcode && !selectedBarcode)}
              className="w-full btn-primary text-white py-6 text-lg"
              data-testid="scan-button"
            >
              <Scan className="mr-2 h-5 w-5" />
              {loading ? 'Scanning...' : 'Scan Product'}
            </Button>
          </div>
        </div>

        {/* Scanned Product Result */}
        {scannedProduct && (
          <div className="score-card p-8 animate-fade-in" data-testid="scanned-product-result">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-green-800 mb-1" style={{fontFamily: 'Space Grotesk'}}>
                  {scannedProduct.name}
                </h2>
                <p className="text-green-600">{scannedProduct.brand} • {scannedProduct.category}</p>
              </div>
              <div className="text-right">
                <div className={`text-5xl font-bold mb-1 ${getScoreCategory(scannedProduct.sustainabilityScore).color}`}>
                  {scannedProduct.sustainabilityScore}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreCategory(scannedProduct.sustainabilityScore).bg} ${getScoreCategory(scannedProduct.sustainabilityScore).color}`}>
                  {getScoreCategory(scannedProduct.sustainabilityScore).label}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white bg-opacity-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Factory className="w-5 h-5 text-green-700" />
                  <span className="font-semibold text-green-800">Carbon Footprint</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{scannedProduct.carbonFootprint}</p>
                <p className="text-xs text-green-600">CO₂ score (lower is better)</p>
              </div>

              <div className="bg-white bg-opacity-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Recycle className="w-5 h-5 text-green-700" />
                  <span className="font-semibold text-green-800">Recyclable</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{scannedProduct.recyclable ? 'Yes' : 'No'}</p>
                <p className="text-xs text-green-600">Material recyclability</p>
              </div>

              <div className="bg-white bg-opacity-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-5 h-5 text-green-700" />
                  <span className="font-semibold text-green-800">Ethical Score</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{scannedProduct.ethicalScore}/100</p>
                <p className="text-xs text-green-600">Fair trade & sourcing</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={() => {
                  setScannedProduct(null);
                  setBarcode('');
                  setSelectedBarcode('');
                }}
                variant="outline"
                className="flex-1 border-green-500 text-green-700 hover:bg-green-50"
                data-testid="scan-another-button"
              >
                Scan Another
              </Button>
              <Button 
                onClick={() => navigate('/')}
                className="flex-1 btn-primary text-white"
                data-testid="back-to-dashboard-button"
              >
                Back to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanProduct;