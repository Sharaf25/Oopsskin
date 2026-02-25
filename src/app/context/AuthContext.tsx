'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_ENDPOINTS, APP_CONSTANTS } from '@/config/api';


export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  role?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AUTH PROVIDER COMPONENT

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Check if we're in the browser
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check authentication on mount (only in browser)
  useEffect(() => {
    if (isMounted) {
      checkAuth();
    }
  }, [isMounted]);

  
  // CHECK AUTHENTICATION STATUS

  const checkAuth = async () => {
    try {
      // Only run in browser
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN);
      
      if (!token) {
        setLoading(false);
        return;
      }

      // Call currentUser API with token in Authorization header
      const response = await fetch(API_ENDPOINTS.AUTH.CURRENT, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        mode: 'cors',
      });

      if (response.ok) {
        const data = await response.json();
        
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role || 'user',
        });
      } else {
        // Token invalid or expired, clear it
        localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
        setUser(null);
      }
    } catch (error) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };


  // REGISTER NEW USER

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      // Only run in browser
      if (typeof window === 'undefined') {
        return { success: false, error: 'Client-side only' };
      }

      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: userData.password,
        }),
        credentials: 'include', // Include cookies
        mode: 'cors',
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful, now login automatically
        return await login(userData.email, userData.password);
      } else {
        return {
          success: false,
          error: data.message || 'Registration failed. Please try again.',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error. Please check your connection and ensure the backend server is running on port 5000.',
      };
    }
  };


  // LOGIN USER
 
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Only run in browser
      if (typeof window === 'undefined') {
        return { success: false, error: 'Client-side only' };
      }

      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies for session
        mode: 'cors',
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store tokens in localStorage
        localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN, data.token);
        
        if (data.refreshToken) {
          localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
        }

        // Set user data
        setUser({
          id: data.id,
          name: data.name || data.email,
          email: data.email,
          phone: data.phone || '',
          role: data.role || APP_CONSTANTS.USER_ROLES.USER,
        });

        return { success: true };
      } else {
        return {
          success: false,
          error: data.message || 'Invalid email or password.',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Network error. Please check your connection and ensure the backend server is running on port 5000.',
      };
    }
  };


  // LOGOUT USER

  const logout = async () => {
    // Only run in browser
    if (typeof window === 'undefined') return;
    
    try {
      const token = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN);
      
      // Call backend logout API to invalidate token
      if (token) {
        const response = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,  // Added "Bearer " prefix
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          mode: 'cors',
        });

        if (response.ok) {
          // Logout API success
        } else {
          // Logout API returned error
        }
      }
    } catch (error) {
      // Continue with local logout even if API call fails
    } finally {
      // Always clear tokens and user data locally
      localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
      setUser(null);
      
      // Trigger a storage event to notify CartContext
      window.dispatchEvent(new Event('storage'));
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


// USE AUTH HOOK

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
