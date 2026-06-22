import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const data = await authService.getProfile();
      setUser(data);
    } catch (err) {
      console.error('Không thể fetch profile:', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password);
      localStorage.setItem('token', res.access_token);
      // Fetch profile immediately
      const profileData = await authService.getProfile();
      setUser(profileData);
      setIsLoading(false);
      return profileData;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const register = async (signUpData) => {
    setIsLoading(true);
    try {
      const res = await authService.register(signUpData);
      localStorage.setItem('token', res.access_token);
      // Fetch profile immediately
      const profileData = await authService.getProfile();
      setUser(profileData);
      setIsLoading(false);
      return profileData;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser: fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
