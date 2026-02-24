/**
 * Global API Configuration
 * Central configuration for all API endpoints and constants
 */

// Base API URL - configured via environment variable
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    CURRENT: `${API_BASE_URL}/auth/current`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
  },
  
  // Products
  PRODUCTS: {
    BASE: `${API_BASE_URL}/products`,
    BY_ID: (id: number | string) => `${API_BASE_URL}/products/${id}`,
    // Paginated endpoint with language support
    PAGINATED: (lang: string = 'en', page: number = 1, limit: number = 10) => 
      `${API_BASE_URL}/products?lang=${lang}&page=${page}&limit=${limit}`,
  },
  
  // Orders
  ORDERS: {
    BASE: `${API_BASE_URL}/orders`,
    BY_ID: (id: number | string) => `${API_BASE_URL}/orders/${id}`,
    STATS: `${API_BASE_URL}/orders/stats/summary`,
  },
  
  // Cart
  CART: {
    BASE: `${API_BASE_URL}/cart`,
    ADD: `${API_BASE_URL}/cart/add`,
    UPDATE: (id: number | string) => `${API_BASE_URL}/cart/update/${id}`,
    DELETE: (id: number | string) => `${API_BASE_URL}/cart/delete/${id}`,
    REMOVE: (id: number | string) => `${API_BASE_URL}/cart/remove/${id}`,
    CLEAR: `${API_BASE_URL}/cart/clear`,
  },
  
  // Vouchers
  VOUCHERS: {
    BASE: `${API_BASE_URL}/vouchers`,
    VALIDATE: `${API_BASE_URL}/vouchers/validate`,
    STATS: `${API_BASE_URL}/vouchers/stats/summary`,
  },
};

// App Constants
export const APP_CONSTANTS = {
  // App Info
  APP_NAME: 'oopsskin',
  APP_VERSION: '1.0.0',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  ADMIN_PAGE_SIZE: 20,
  
  // Localstorage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'authToken',
    REFRESH_TOKEN: 'refreshToken',
    CART: 'cart',
    LANGUAGE: 'language',
  },
  
  // User Roles
  USER_ROLES: {
    USER: 'user',
    ADMIN: 'admin',
  },
  
  // Order Status
  ORDER_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
  },
  
  // Languages
  LANGUAGES: {
    ENGLISH: 'en',
    ARABIC: 'ar',
  },
  
  // Theme Colors
  THEME: {
    PRIMARY: '#EC4899', // Pink-500
    SECONDARY: '#8B5CF6', // Purple-500
  },
};

// Helper function to get auth headers
export const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  
  const token = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN);
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper function for API calls with auth
export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  try {
    const authHeaders = getAuthHeaders();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(options.headers as Record<string, string> || {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
      mode: 'cors',
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  APP_CONSTANTS,
  getAuthHeaders,
  apiRequest,
};
