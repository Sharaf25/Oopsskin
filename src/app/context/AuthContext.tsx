'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    // Create demo account if it doesn't exist
    const usersJson = localStorage.getItem('oopsskin-users');
    if (!usersJson) {
      const demoUsers = [
        {
          id: 'demo-1',
          email: 'demo@oopsskin.com',
          password: 'demo123',
          fullName: 'Demo User',
          phone: '+1 234 567 8900',
        },
      ];
      localStorage.setItem('oopsskin-users', JSON.stringify(demoUsers));
    }

    const savedUser = localStorage.getItem('oopsskin-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoaded(true);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      if (user) {
        localStorage.setItem('oopsskin-user', JSON.stringify(user));
      } else {
        localStorage.removeItem('oopsskin-user');
      }
    }
  }, [user, isLoaded]);

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      // Get existing users
      const usersJson = localStorage.getItem('oopsskin-users');
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Check if email already exists
      if (users.find((u: any) => u.email === userData.email)) {
        alert('Email already registered!');
        return false;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        password: userData.password, // In production, hash this!
        fullName: userData.fullName,
        phone: userData.phone,
      };

      // Save to users list
      users.push(newUser);
      localStorage.setItem('oopsskin-users', JSON.stringify(users));

      // Auto login
      const { password, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get existing users
      const usersJson = localStorage.getItem('oopsskin-users');
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Find user
      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!foundUser) {
        alert('Invalid email or password!');
        return false;
      }

      // Set user (without password)
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('oopsskin-user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
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
