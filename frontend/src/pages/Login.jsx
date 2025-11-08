import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, AuthContext } from '../App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, Sprout } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;
      
      const response = await axios.post(`${API}${endpoint}`, payload);
      login(response.data.user, response.data.token);
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" data-testid="login-page">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Leaf className="w-16 h-16 text-green-700 animate-pulse-subtle" />
              <Sprout className="w-8 h-8 text-green-500 absolute -bottom-2 -right-2" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-center mb-2 text-green-800" style={{fontFamily: 'Space Grotesk'}}>
            TerraQuest
          </h1>
          <p className="text-center text-green-700 mb-8 text-sm">
            Small Choices. Big Impact. 🌱
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="text-green-800">Name</Label>
                <Input
                  id="name"
                  data-testid="name-input"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required={!isLogin}
                  className="mt-1 border-green-300 focus:border-green-500"
                  placeholder="Your name"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email" className="text-green-800">Email</Label>
              <Input
                id="email"
                data-testid="email-input"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="mt-1 border-green-300 focus:border-green-500"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-green-800">Password</Label>
              <Input
                id="password"
                data-testid="password-input"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                className="mt-1 border-green-300 focus:border-green-500"
                placeholder="••••••••"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full btn-primary text-white font-semibold py-6 text-base"
              data-testid="submit-button"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-green-700 hover:text-green-800 text-sm font-medium"
              data-testid="toggle-auth-button"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;