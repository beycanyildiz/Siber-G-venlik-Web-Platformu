import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// Password API
export const passwordAPI = {
  analyze: (passwordData) => api.post('/passwords/analyze', passwordData),
  generate: (options) => api.post('/passwords/generate', options),
  getHistory: (params) => api.get('/passwords/history', { params }),
  getStats: () => api.get('/passwords/stats'),
  deleteAnalysis: (id) => api.delete(`/passwords/analysis/${id}`),
};

// Hash API
export const hashAPI = {
  generate: (hashData) => api.post('/hashes/generate', hashData),
  verify: (verificationData) => api.post('/hashes/verify', verificationData),
  compare: (comparisonData) => api.post('/hashes/compare', comparisonData),
  getHistory: (params) => api.get('/hashes/history', { params }),
  getStats: () => api.get('/hashes/stats'),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getSecurityInsights: () => api.get('/analytics/security-insights'),
  getSystemAnalytics: () => api.get('/analytics/system'),
};

// Security API
export const securityAPI = {
  getEvents: (params) => api.get('/security/events', { params }),
  getEventDetails: (id) => api.get(`/security/events/${id}`),
  resolveEvent: (id, resolution) => api.put(`/security/events/${id}/resolve`, { resolution }),
  getDashboard: () => api.get('/security/dashboard'),
  updateSettings: (settings) => api.put('/security/settings', settings),
  getSystemMonitor: () => api.get('/security/system/monitor'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

// Utility functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

export const getUserFromToken = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      userId: payload.userId,
      role: payload.role,
    };
  } catch {
    return null;
  }
};

// Error handling utility
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.details || data.error || 'Invalid request';
      case 401:
        return 'Authentication required';
      case 403:
        return 'Access denied';
      case 404:
        return 'Resource not found';
      case 429:
        return 'Rate limit exceeded. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data.error || 'An unexpected error occurred';
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection.';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred';
  }
};

export default api;