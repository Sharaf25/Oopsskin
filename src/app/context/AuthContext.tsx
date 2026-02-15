'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';


const AUTH_API_URL = 'http://localhost:5000/api/auth';


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

      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setLoading(false);
        return;
      }

      console.log('🔍 Checking authentication with token...');

      // Call currentUser API with token in Authorization header
      const response = await fetch(`${AUTH_API_URL}/current`, {
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
        console.log('Authentication valid:', data);
        
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role || 'user',
        });
      } else {
        console.log('Authentication failed, clearing token');
        // Token invalid or expired, clear it
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
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

      console.log('📝 Registering user:', { ...userData, password: '***' });

      const response = await fetch(`${AUTH_API_URL}/register`, {
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
      console.log('📝 Register response:', { status: response.status, data });

      if (response.ok) {
        console.log('Registration successful, auto-logging in...');
        // Registration successful, now login automatically
        return await login(userData.email, userData.password);
      } else {
        return {
          success: false,
          error: data.message || 'Registration failed. Please try again.',
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection and ensure the backend server is running on port 5000.',
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

      console.log('Attempting login:', { email, password: '***' });
      console.log('API URL:', `${AUTH_API_URL}/login`);

      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies for session
        mode: 'cors',
      });

      console.log('Login response status:', response.status);

      const data = await response.json();
      console.log('Login response data:', data);

      if (response.ok && data.token) {
        console.log('Login successful');
        
        // Store tokens in localStorage
        localStorage.setItem('authToken', data.token);
        
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }

        // Set user data
        setUser({
          id: data.id,
          name: data.name || data.email,
          email: data.email,
          phone: data.phone || '',
          role: data.role || 'user',
        });

        return { success: true };
      } else {
        return {
          success: false,
          error: data.message || 'Invalid email or password.',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error details:', {
        type: error instanceof Error ? error.constructor.name : typeof error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      return {
        success: false,
        error: 'Network error. Please check your connection and ensure the backend server is running on port 5000.',
      };
    }
  };


  // LOGOUT USER

  const logout = () => {
    // Only run in browser
    if (typeof window === 'undefined') return;
    
    console.log('Logging out...');
    
    // Clear tokens and user data
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
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
