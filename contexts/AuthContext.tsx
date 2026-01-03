
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authClient } from '@/lib/auth';

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  status?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('[AuthContext] Checking authentication status');
      const authenticated = await authClient.isAuthenticated();
      
      if (authenticated) {
        console.log('[AuthContext] User is authenticated, loading user data');
        const userData = await authClient.getCurrentUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        console.log('[AuthContext] User is not authenticated');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('[AuthContext] Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('[AuthContext] Signing in');
      const data = await authClient.signIn(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      console.log('[AuthContext] Sign in successful');
    } catch (error) {
      console.error('[AuthContext] Sign in failed:', error);
      throw error;
    }
  };

  const signUp = async (email: string, phone: string, password: string) => {
    try {
      console.log('[AuthContext] Signing up');
      const data = await authClient.signUp(email, phone, password);
      setUser(data.user);
      setIsAuthenticated(true);
      console.log('[AuthContext] Sign up successful');
    } catch (error) {
      console.error('[AuthContext] Sign up failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('[AuthContext] Signing out');
      await authClient.signOut();
      setIsAuthenticated(false);
      setUser(null);
      console.log('[AuthContext] Sign out successful');
    } catch (error) {
      console.error('[AuthContext] Sign out failed:', error);
      throw error;
    }
  };

  const refreshAuth = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        signIn,
        signUp,
        signOut,
        refreshAuth,
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
