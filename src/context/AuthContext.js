import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [driverDocuments, setDriverDocuments] = useState({});

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('user');
      const storedDriverDocs = await AsyncStorage.getItem('driverDocuments');

      if (storedDriverDocs) {
        setDriverDocuments(JSON.parse(storedDriverDocs));
      }
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, userType) => {
    try {
      // In real app, call API
      // const response = await authAPI.login(email, password, userType);
      
      // Mock response
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email,
        userType,
        phone: '+1234567890',
      };
      
      const mockToken = 'mock-jwt-token';
      
      await AsyncStorage.setItem('authToken', mockToken);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return mockUser;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    }
  };

  const signup = async (userData) => {
    try {
      // In real app, call API
      // const response = await authAPI.signup(userData);
      
      // Mock response
      const mockUser = {
        id: '1',
        ...userData,
      };
      
      // Don't auto-login after signup
      return mockUser;
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Signup failed');
    }
  };

  const logout = async () => {
    try {
      // In real app, call API
      // await authAPI.logout();
      
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('driverDocuments');
      
      setUser(null);
      setIsAuthenticated(false);
      setDriverDocuments({});
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (userData) => {
    try {
      const updatedUser = { ...user, ...userData };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  const uploadDriverDocument = async (documentType, fileData) => {
    try {
      if (!user?.id) throw new Error('You must be logged in');

      const userDocs = driverDocuments[user.id] || {};
      const updatedUserDocs = {
        ...userDocs,
        [documentType]: {
          ...fileData,
          status: 'uploaded',
          uploadedAt: new Date().toISOString(),
        },
      };

      const updatedAllDocs = {
        ...driverDocuments,
        [user.id]: updatedUserDocs,
      };

      setDriverDocuments(updatedAllDocs);
      await AsyncStorage.setItem('driverDocuments', JSON.stringify(updatedAllDocs));

      return updatedUserDocs;
    } catch (error) {
      console.error('Upload driver document error:', error);
      throw error;
    }
  };

  const submitDriverVerification = async () => {
    try {
      if (!user?.id) throw new Error('You must be logged in');

      const userDocs = driverDocuments[user.id] || {};
      const requiredDocs = ['driversLicense', 'vehicleRegistration', 'idDocument'];
      const hasAllRequired = requiredDocs.every((docType) => !!userDocs[docType]);

      if (!hasAllRequired) {
        throw new Error('Upload all required documents first');
      }

      const submittedDocs = Object.keys(userDocs).reduce((acc, key) => {
        acc[key] = {
          ...userDocs[key],
          status: 'under_review',
          submittedAt: new Date().toISOString(),
        };
        return acc;
      }, {});

      const updatedAllDocs = {
        ...driverDocuments,
        [user.id]: submittedDocs,
      };

      setDriverDocuments(updatedAllDocs);
      await AsyncStorage.setItem('driverDocuments', JSON.stringify(updatedAllDocs));

      return submittedDocs;
    } catch (error) {
      console.error('Submit verification error:', error);
      throw error;
    }
  };

  const getDriverVerification = () => {
    if (!user?.id) return {};
    return driverDocuments[user.id] || {};
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        signup,
        logout,
        updateUser,
        uploadDriverDocument,
        submitDriverVerification,
        getDriverVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
