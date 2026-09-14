import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // Decode user from token or use generic since actual API user doesn't have much info
      setUser({ email: 'demo1@ivy.homes' }); 
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    const handleUnauthorized = () => setToken(null);
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('https://solve.ivy.homes/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'IVY26-F487E77DAB9A',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      // Use access_token based on our findings
      setToken(data.access_token);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
