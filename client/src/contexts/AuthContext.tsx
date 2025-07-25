import React, { createContext, useContext, useState, useEffect } from 'react';
import { tokenManager, authAPI } from '@/lib/auth';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: check if token exists and fetch user
  useEffect(() => {
    const checkAuth = async () => {
      if (tokenManager.isAuthenticated()) {
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Token invalid or expired. Logging out.");
          tokenManager.removeToken();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // const login = async (email: string, password: string) => {
  //   const response = await authAPI.login(email, password);
  //   tokenManager.setToken(response.token);
  //   setUser(response.user);
  //     // setUser(res.data.user);  // <-- This should trigger context update

  // };
const login = async (email: string, password: string) => {
  const response = await authAPI.login(email, password);
  tokenManager.setToken(response.token);

  // 🔥 This is critical
  const userData = await authAPI.getCurrentUser();
  setUser(userData);
};

  const register = async (email: string, password: string) => {
    const response = await authAPI.register(email, password);
    tokenManager.setToken(response.token);
    setUser(response.user);
  };

  const logout = () => {
    tokenManager.removeToken();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
