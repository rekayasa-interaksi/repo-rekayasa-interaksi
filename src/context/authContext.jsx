import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
// import { useNavigate } from 'react-router-dom';
import { logout as logoutService, checkAuthStatus } from '../services/auth.api';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const navigate = useNavigate();

  const logout = useCallback(
    async (shouldNavigate = true) => {
      if (user) {
        try {
          await logoutService();
        } catch (error) {
          console.error('API logout call failed:', error);
        }
      }

      setUser(null);
      localStorage.removeItem('rememberMe');

      // if (shouldNavigate) {
      //   navigate('/');
      // }
    },
    [user]
  );

  useEffect(() => {
    const verifyAuthStatus = async () => {
      try {
        const response = await checkAuthStatus();
        setUser(response.data.data);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuthStatus();
  }, []);

  const login = useCallback((userData, rememberMe = false) => {
    setUser(userData);

    localStorage.setItem('rememberMe', rememberMe);
  }, []);

  useEffect(() => {
    const handleLogoutEvent = () => logout(true);

    window.addEventListener('logout-event', handleLogoutEvent);
    return () => window.removeEventListener('logout-event', handleLogoutEvent);
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout
    }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
