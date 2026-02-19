'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

const CART_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/cart`;

// Backend cart item structure
interface BackendCartItem {
  id: number; // CartItem ID from database
  cart_id: number;
  product_id: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    price: string;
    item_img?: string;
    category?: string;
  };
}

// Frontend cart item structure
export interface CartItem {
  id: number; // CartItem database ID
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<{ success: boolean; error?: string }>;
  removeFromCart: (itemId: number) => Promise<{ success: boolean; error?: string }>;
  updateQuantity: (itemId: number, quantity: number) => Promise<{ success: boolean; error?: string }>;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { isAuthenticated } = useAuth();

  // Check if mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Monitor authentication status - fetch cart when logged in, clear when logged out
  useEffect(() => {
    if (!isMounted) return;

    if (isAuthenticated) {
      // User is logged in - fetch their cart
      refreshCart();
    } else {
      // User is logged out - clear the cart
      console.log('👤 User logged out - clearing cart');
      setCart([]);
    }
  }, [isAuthenticated, isMounted]);

  // Helper function to get auth token
  const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  };

  // REFRESH CART - Fetch cart from backend
  const refreshCart = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setCart([]); // Clear cart if not authenticated
        return;
      }

      console.log('🛒 Fetching cart from API...');
      const response = await fetch(CART_API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Cart fetched:', data);
        
        // Transform backend cart items to frontend format
        const transformedCart: CartItem[] = (data.items || []).map((item: BackendCartItem) => ({
          id: item.id, // CartItem database ID
          productId: item.product_id,
          name: item.product.name,
          price: parseFloat(item.product.price),
          quantity: item.quantity,
          image: item.product.item_img,
          category: item.product.category,
        }));

        setCart(transformedCart);
      } else if (response.status === 401) {
        console.warn('⚠️ Unauthorized - clearing cart');
        setCart([]);
      } else {
        console.error('❌ Failed to fetch cart:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching cart:', error);
      setCart([]);
    }
  };

  // ADD TO CART
  const addToCart = async (productId: string, quantity: number = 1): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = getAuthToken();
      if (!token) {
        return { success: false, error: 'Please login to add items to cart' };
      }

      setLoading(true);
      console.log('➕ Adding to cart:', { productId, quantity });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
        credentials: 'include',
        mode: 'cors',
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Item added to cart');
        // Refresh cart to get updated data
        await refreshCart();
        return { success: true };
      } else {
        console.error('❌ Failed to add to cart:', data.message);
        return { success: false, error: data.message || 'Failed to add item to cart' };
      }
    } catch (error) {
      console.error('❌ Add to cart error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // UPDATE QUANTITY
  const updateQuantity = async (itemId: number, quantity: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = getAuthToken();
      if (!token) {
        return { success: false, error: 'Authentication required' };
      }

      if (quantity < 1) {
        return { success: false, error: 'Quantity must be at least 1' };
      }

      setLoading(true);
      console.log('📝 Updating quantity:', { itemId, quantity });

      const response = await fetch(`${CART_API_URL}/update/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
        credentials: 'include',
        mode: 'cors',
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Quantity updated');
        // Update local cart state optimistically
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          )
        );
        return { success: true };
      } else {
        console.error('❌ Failed to update quantity:', data.message);
        return { success: false, error: data.message || 'Failed to update quantity' };
      }
    } catch (error) {
      console.error('❌ Update quantity error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // REMOVE FROM CART
  const removeFromCart = async (itemId: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = getAuthToken();
      if (!token) {
        return { success: false, error: 'Authentication required' };
      }

      setLoading(true);
      console.log('🗑️ Removing from cart:', itemId);

      const response = await fetch(`${CART_API_URL}/delete/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Item removed from cart');
        // Update local cart state optimistically
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
        return { success: true };
      } else {
        console.error('❌ Failed to remove item:', data.message);
        return { success: false, error: data.message || 'Failed to remove item' };
      }
    } catch (error) {
      console.error('❌ Remove from cart error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // CLEAR CART (local only - used on logout)
  const clearCart = () => {
    console.log('🧹 Clearing cart locally');
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
