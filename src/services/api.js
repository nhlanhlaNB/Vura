import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './firebase';
import { API_BASE_URL } from '@env';

const api = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Firebase auth token
api.interceptors.request.use(
  async (config) => {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      const token = await firebaseUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password, userType) => {
    const response = await api.post('/auth/login', { email, password, userType });
    return response.data;
  },

  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Ride API
export const rideAPI = {
  createRide: async (rideData) => {
    const response = await api.post('/rides', rideData);
    return response.data;
  },

  getRideHistory: async () => {
    const response = await api.get('/rides/history');
    return response.data;
  },

  getRideById: async (rideId) => {
    const response = await api.get(`/rides/${rideId}`);
    return response.data;
  },

  cancelRide: async (rideId) => {
    const response = await api.post(`/rides/${rideId}/cancel`);
    return response.data;
  },

  rateRide: async (rideId, rating, comment) => {
    const response = await api.post(`/rides/${rideId}/rate`, { rating, comment });
    return response.data;
  },
};

// Driver API
export const driverAPI = {
  updateStatus: async (status) => {
    const response = await api.post('/driver/status', { status });
    return response.data;
  },

  acceptRide: async (rideId) => {
    const response = await api.post(`/driver/rides/${rideId}/accept`);
    return response.data;
  },

  startRide: async (rideId) => {
    const response = await api.post(`/driver/rides/${rideId}/start`);
    return response.data;
  },

  completeRide: async (rideId) => {
    const response = await api.post(`/driver/rides/${rideId}/complete`);
    return response.data;
  },

  getEarnings: async (period = 'today') => {
    const response = await api.get(`/driver/earnings?period=${period}`);
    return response.data;
  },
};

// Location API
export const locationAPI = {
  searchPlaces: async (query) => {
    const response = await api.get(`/location/search?q=${query}`);
    return response.data;
  },

  getDirections: async (origin, destination) => {
    const response = await api.post('/location/directions', { origin, destination });
    return response.data;
  },
};

export default api;
