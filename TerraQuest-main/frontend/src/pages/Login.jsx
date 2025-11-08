import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, AuthContext } from '../App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, Sprout, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;
      
      const response = await axios.post(`${API}${endpoint}`, payload);
      login(response.data.user, response.data.token);
      toast.success(isLogin ? 'Welcome back! 🌱' : 'Account created successfully! 🎉');
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Authentication failed. Please try again.';
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Demo login with mock user
    const demoUser = {
      id: 'demo-user-123',
      name: 'Demo User',
      email: 'demo@terraquest.com',
      ecoScore: 1240,
      level: 'Eco Guardian',
      totalScans: 34
    };
    const demoToken = 'demo-token-' + Date.now();
    
    login(demoUser, demoToken);
    toast.success('Welcome! You\'re logged in as a demo user 🌱');
    navigate('/');
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#fefcfb] via-[#f5f8f6] to-[#e9f8ec] relative overflow-hidden" data-testid="login-page">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large leaf illustration */}
        <div className="absolute top-10 left-10 w-64 h-64 opacity-10 animate-pulse">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path d="M100 20 Q120 40 140 20 T180 20 Q160 60 180 100 T160 180 Q140 160 100 180 T20 160 Q40 140 20 100 T40 20 Q60 40 100 20 Z" 
                  fill="#3bb273"/>
          </svg>
        </div>
        
        {/* Small floating leaves */}
        <div className="absolute top-32 right-20 w-32 h-32 opacity-15 animate-bounce" style={{ animationDuration: '3s' }}>
          <Leaf className="w-full h-full text-green-400" />
        </div>
        
        <div className="absolute bottom-20 left-32 w-24 h-24 opacity-10 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
          <Sprout className="w-full h-full text-green-500" />
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 animate-fade-in border border-green-100">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 via-emerald-400 to-green-500 flex items-center justify-center shadow-lg animate-pulse-subtle">
                <Leaf className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                <Sprout className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent" style={{fontFamily: 'Space Grotesk'}}>
              TerraQuest
            </h1>
            <p className="text-center text-gray-600 text-sm md:text-base">
              Small Choices. Big Impact. 🌱
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="animate-slide-up">
                <Label htmlFor="name" className="text-gray-700 font-medium mb-2 block">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-green-600" />
                    <span>Full Name</span>
                  </div>
                </Label>
                <Input
                  id="name"
                  data-testid="name-input"
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({...formData, name: e.target.value});
                    if (errors.name) setErrors({...errors, name: ''});
                  }}
                  required={!isLogin}
                  className={`mt-1 border-2 ${errors.name ? 'border-red-300 focus:border-red-500' : 'border-green-200 focus:border-green-500'} rounded-xl px-4 py-3 transition-all`}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.name}
                  </p>
                )}
              </div>
            )}
            
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium mb-2 block">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-600" />
                  <span>Email Address</span>
                </div>
              </Label>
              <Input
                id="email"
                data-testid="email-input"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({...formData, email: e.target.value});
                  if (errors.email) setErrors({...errors, email: ''});
                }}
                required
                className={`mt-1 border-2 ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-green-200 focus:border-green-500'} rounded-xl px-4 py-3 transition-all`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.email}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium mb-2 block">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span>Password</span>
                </div>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  data-testid="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    if (errors.password) setErrors({...errors, password: ''});
                  }}
                  required
                  className={`mt-1 border-2 ${errors.password ? 'border-red-300 focus:border-red-500' : 'border-green-200 focus:border-green-500'} rounded-xl px-4 py-3 pr-12 transition-all`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.password}
                </p>
              )}
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
                {errors.submit}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-6 text-base rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="submit-button"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <Leaf className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Demo Login Button */}
          <Button
            type="button"
            onClick={handleDemoLogin}
            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold py-6 text-base rounded-xl shadow-lg hover:shadow-xl transition-all mb-4"
          >
            <span className="flex items-center gap-2">
              🚀 Try Demo Mode
            </span>
          </Button>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleToggleMode}
              className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
              data-testid="toggle-auth-button"
            >
              {isLogin ? (
                <>
                  Don't have an account? <span className="font-semibold underline">Sign up</span>
                </>
              ) : (
                <>
                  Already have an account? <span className="font-semibold underline">Sign in</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          By continuing, you agree to TerraQuest's Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
