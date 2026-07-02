import React, { createContext, useContext, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('smartlib_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('smartlib_user');
    return raw ? JSON.parse(raw) : null;
  });

  const login = (authResponse) => {
    localStorage.setItem('smartlib_token', authResponse.token);
    localStorage.setItem('smartlib_user', JSON.stringify({
      fullName: authResponse.fullName,
      email: authResponse.email,
      role: authResponse.role,
    }));
    setToken(authResponse.token);
    setUser({ fullName: authResponse.fullName, email: authResponse.email, role: authResponse.role });
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      const nextUser = {
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      };
      localStorage.setItem('smartlib_user', JSON.stringify(nextUser));
      setUser(nextUser);
      return data;
    } catch (error) {
      logout();
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('smartlib_token');
    localStorage.removeItem('smartlib_user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, login, logout, refreshUser, isAuthenticated: Boolean(token) }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
