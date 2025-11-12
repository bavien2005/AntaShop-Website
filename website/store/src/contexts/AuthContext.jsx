import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { STORAGE_KEYS } from '../constants';
import { useDataSync } from './DataSyncContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dataSync = useDataSync ? (() => {
    try {
      return useDataSync();
    } catch {
      return null;
    }
  })() : null;

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Invalid stored user data:', error);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } else if (token) {
      try {
        const decoded = jwtDecode(token);
        const userData = {
          username: decoded.sub || decoded.username,
          role: decoded.role || 'USER',
          email: decoded.email
        };
        setUser(userData);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      }
    }
    setIsLoading(false);
  }, []);

  // Listen for auth:logout event from API interceptor
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      // Navigation will be handled by the component that triggers login redirect
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = (token) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    try {
      const decoded = jwtDecode(token);
      const userData = {
        username: decoded.sub || decoded.username,
        role: decoded.role || 'USER',
        email: decoded.email
      };
      setUser(userData);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      if (dataSync) {
        dataSync.emitAuthUpdate({ action: 'login', user: userData });
      }
    } catch (error) {
      console.error('Invalid token:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    if (dataSync) {
      dataSync.emitAuthUpdate({ action: 'logout' });
    }
  };

  // Check if user is admin
  const isAdmin = user?.role === 'ADMIN';

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
