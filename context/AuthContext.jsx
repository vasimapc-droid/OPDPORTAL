'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authenticateUser } from '../lib/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('opd_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const result = authenticateUser(email, password);
    
    if (result.success) {
      setUser(result.user);
      localStorage.setItem('opd_user', JSON.stringify(result.user));
      return { success: true, user: result.user };
    }
    
    return result;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('opd_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
