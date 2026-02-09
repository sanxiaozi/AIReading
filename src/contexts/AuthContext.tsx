'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import * as authAPI from '@/lib/auth-client';

interface User {
  id: number;
  email: string;
  username?: string;
  avatar_url?: string;
  locale: string;
  theme: string;
  playback_speed: number;
  subscription_tier: 'free' | 'pro' | 'premium';
  is_active: number;
  created_at: number;
  updated_at: number;
  last_login_at?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (email: string, password: string, username?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'aireading_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setIsLoading(false);
        return;
      }

      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Load user error:', error);
      localStorage.removeItem(TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(
    async (email: string, password: string, rememberMe?: boolean) => {
      try {
        const response = await authAPI.login({ email, password, rememberMe });
        
        // Save token
        localStorage.setItem(TOKEN_KEY, response.token);
        
        // Set user
        setUser(response.user);
        
        // Redirect to home
        router.push(`/${response.user.locale || 'en'}`);
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    [router]
  );

  const register = useCallback(
    async (email: string, password: string, username?: string) => {
      try {
        const response = await authAPI.register({
          email,
          password,
          username,
        });
        
        // Save token
        localStorage.setItem(TOKEN_KEY, response.token);
        
        // Set user
        setUser(response.user);
        
        // Redirect to home
        router.push(`/${response.user.locale || 'en'}`);
      } catch (error) {
        console.error('Register error:', error);
        throw error;
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear token and user
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      
      // Redirect to home
      router.push('/en');
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Refresh user error:', error);
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
