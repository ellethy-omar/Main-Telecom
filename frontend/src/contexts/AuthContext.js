import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { setAuthContext } from '../utils/apiInterceptor';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        console.log(storedToken);
        const verificationResult = await authService.verifyToken(storedToken);
        
        if (verificationResult.success) {
          setToken(storedToken);
          setIsAuthenticated(true);
          console.log('[AuthContext] Token verified successfully');
        } else {
          console.log('[AuthContext] Token verification failed, logging out');
          forceLogout();
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
        setToken(response.token);
        setIsAuthenticated(true);
        return { success: true, data: response };
      }
      throw new Error('No token received');
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.token) {
        localStorage.setItem('token', response.token);
        setToken(response.token);
        setIsAuthenticated(true);
        return { success: true, data: response };
      }
      throw new Error('No token received');
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
  };

  const forceLogout = useCallback(() => {
    logout();
    setSessionExpired(false);
    console.log('[AuthContext] User logged out due to invalid token');
  });

  useEffect(() => {
    setAuthContext({ forceLogout, setSessionExpired });
  }, [forceLogout, setSessionExpired]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        loading,
        login,
        register,
        logout,
        forceLogout,
        sessionExpired,         // 🆕 expose sessionExpired state
        setSessionExpired,      // 🆕 expose setter
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
