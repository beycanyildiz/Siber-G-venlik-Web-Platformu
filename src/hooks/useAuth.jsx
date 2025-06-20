import { useState, useEffect, createContext, useContext } from 'react';
import { authAPI, setAuthToken, getAuthToken, getUserFromToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const DEMO_MODE = true; // Can be set via env or config
  const DEMO_EMAIL = 'test@example.com';
  const DEMO_PASSWORD = 'Test1234';

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = getAuthToken();
      if (token) {
        const userData = getUserFromToken();
        if (userData) {
          // Verify token with server
          const response = await authAPI.getProfile();
          setUser(response.data.user);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    if (DEMO_MODE && credentials.email === DEMO_EMAIL && credentials.password === DEMO_PASSWORD) {
      // Demo kullanıcı: sahte oturum başlat
      setUser({ email: DEMO_EMAIL, username: 'testuser', role: 'user' });
      setError(null);
      return { success: true, user: { email: DEMO_EMAIL, username: 'testuser', role: 'user' } };
    }
    try {
      setError(null);
      setLoading(true);
      
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      setAuthToken(token);
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      
      setAuthToken(token);
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await authAPI.updateProfile(profileData);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setError(null);
      await authAPI.changePassword(passwordData);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Password change failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};