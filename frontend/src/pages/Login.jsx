import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('demo1@ivy.homes');
  const [password, setPassword] = useState('a7f1481d90');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(email, password);
    if (success) {
      navigate('/listings');
    } else {
      setError('Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: '80vh' }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="flex-col items-center mb-8">
          <Home size={48} className="text-accent mb-4" />
          <h2 className="text-center">Ivy Homes</h2>
          <p className="text-sm text-center">Sign in to access premium properties</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-col gap-4">
          <div>
            <label className="text-sm mb-2 block">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm mb-2 block">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}
          
          <button type="submit" disabled={loading} className="w-full mt-4">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
