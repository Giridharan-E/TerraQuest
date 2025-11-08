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
    if (score >= 70) return { label: 'Excellent', colorStyle: {color: '#3bb273'}, bgStyle: {background: '#f0fdf4'} };
    if (score >= 50) return { label: 'Good', colorStyle: {color: '#f97316'}, bgStyle: {background: '#ffedd5'} };
    return { label: 'Poor', colorStyle: {color: '#ef4444'}, bgStyle: {background: '#fee2e2'} };
  };

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(to bottom, #f0fdf4, #ffffff)'}} data-testid="scan-product-page">
      <Navigation />

      <div className="max-w-md mx-auto px-4 md:px-6 py-6 pb-24 md:pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Scan a Product
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">Discover the sustainability impact of your choices</p>
        </div>

        {/* Scan Interface */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6" style={{boxShadow: '0 1px 3px rgba(59,178,115,0.1)'}}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Enter Barcode</label>
              <Input
                data-testid="barcode-input"
                type="text"
                value={barcode}
                onChange={(e) => {
                  setBarcode(e.target.value);
                  setSelectedBarcode('');
                }}
                placeholder="Enter product barcode (e.g., 1001)"
                className="border-gray-200 focus:border-green-500 rounded-lg"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="text-sm text-gray-600">OR</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Select from List</label>
              <Select value={selectedBarcode} onValueChange={(value) => {
                setSelectedBarcode(value);
                setBarcode('');
              }}>
                <SelectTrigger className="border-gray-200 rounded-lg" data-testid="product-select">
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
              className="w-full py-6 text-white font-semibold rounded-xl transition-all"
              style={{background: loading || (!barcode && !selectedBarcode) ? '#9ca3af' : '#3bb273'}}
              data-testid="scan-button"
            >
              <Scan className="mr-2 h-5 w-5" />
              {loading ? 'Scanning...' : 'Scan Product'}
            </Button>
          </div>
        </div>

        {/* Scanned Product Result */}
        {scannedProduct && (
          <div className="bg-white rounded-2xl shadow-sm p-4" style={{boxShadow: '0 1px 3px rgba(59,178,115,0.1)'}} data-testid="scanned-product-result">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-1">
                  {scannedProduct.name}
                </h2>
                <p className="text-sm text-gray-600">{scannedProduct.brand} • {scannedProduct.category}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold mb-1" style={getScoreCategory(scannedProduct.sustainabilityScore).colorStyle}>
                  {scannedProduct.sustainabilityScore}
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{...getScoreCategory(scannedProduct.sustainabilityScore).bgStyle, ...getScoreCategory(scannedProduct.sustainabilityScore).colorStyle}}>
                  {getScoreCategory(scannedProduct.sustainabilityScore).label}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Factory className="w-4 h-4" style={{color: '#3bb273'}} />
                </div>
                <p className="text-xl font-bold text-gray-900">{scannedProduct.carbonFootprint}</p>
                <p className="text-xs text-gray-600 mt-1">Carbon</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Recycle className="w-4 h-4" style={{color: '#3bb273'}} />
                </div>
                <p className="text-xl font-bold text-gray-900">{scannedProduct.recyclable ? 'Yes' : 'No'}</p>
                <p className="text-xs text-gray-600 mt-1">Recycle</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4" style={{color: '#3bb273'}} />
                </div>
                <p className="text-xl font-bold text-gray-900">{scannedProduct.ethicalScore}</p>
                <p className="text-xs text-gray-600 mt-1">Ethical</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setScannedProduct(null);
                  setBarcode('');
                  setSelectedBarcode('');
                }}
                variant="outline"
                className="flex-1 py-3 rounded-xl border-gray-200 text-gray-700 font-medium"
                data-testid="scan-another-button"
              >
                Scan Another
              </Button>
              <Button
                onClick={() => navigate('/')}
                className="flex-1 py-3 text-white font-semibold rounded-xl"
                style={{background: '#3bb273'}}
                data-testid="back-to-dashboard-button"
              >
                Dashboard
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