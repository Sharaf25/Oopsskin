# 🛒 Cart System API Integration - Complete

## Status: ✅ FULLY INTEGRATED

Last Updated: February 18, 2026

---

## Overview
The cart system has been completely rewritten to use backend APIs. All frontend-side cart logic has been removed, and the cart is now fully managed by the backend with proper authentication.

---

## API Endpoints

### 1. Add to Cart
```
POST http://localhost:5000/cart/add
```

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_AUTH_TOKEN",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "productId": "12345",
  "quantity": 2
}
```

**Response (Success - 200):**
```json
{
  "message": "Item added to cart",
  "cartItem": {
    "id": 1,
    "cart_id": 1,
    "product_id": "12345",
    "quantity": 2,
    "createdAt": "2026-02-18T...",
    "updatedAt": "2026-02-18T..."
  }
}
```

---

### 2. Get Cart
```
GET http://localhost:5000/api/cart
```

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_AUTH_TOKEN",
  "Content-Type": "application/json"
}
```

**Response (Success - 200):**
```json
{
  "cart": {
    "id": 1,
    "user_id": 1,
    "createdAt": "2026-02-18T..."
  },
  "items": [
    {
      "id": 1,
      "cart_id": 1,
      "product_id": "12345",
      "quantity": 2,
      "product": {
        "id": "12345",
        "name": "Product Name",
        "price": "29.99",
        "item_img": "image-url.jpg",
        "category": "makeup"
      }
    }
  ]
}
```

---

### 3. Update Quantity
```
PUT http://localhost:5000/api/cart/update/4
```
(4 is the cart item ID)

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_AUTH_TOKEN",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "quantity": 5
}
```

**Response (Success - 200):**
```json
{
  "message": "Cart item updated",
  "cartItem": {
    "id": 4,
    "cart_id": 1,
    "product_id": "12345",
    "quantity": 5,
    "updatedAt": "2026-02-18T..."
  }
}
```

---

### 4. Delete Cart Item
```
DELETE http://localhost:5000/api/cart/delete/4
```
(4 is the cart item ID)

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_AUTH_TOKEN",
  "Content-Type": "application/json"
}
```

**Response (Success - 200):**
```json
{
  "message": "Item removed from cart"
}
```

---

## Frontend Implementation

### CartContext (`src/app/context/CartContext.tsx`)

#### Features
✅ **No localStorage** - Cart is stored in backend database only
✅ **Authentication Required** - All operations require valid JWT token
✅ **Auto-fetch on Login** - Cart loads automatically when user logs in
✅ **Auto-clear on Logout** - Cart clears when user logs out
✅ **Optimistic Updates** - UI updates immediately, then syncs with backend
✅ **Error Handling** - Graceful error messages for all operations

#### Cart Item Interface
```typescript
export interface CartItem {
  id: number;           // CartItem database ID
  productId: string;    // Product ID
  name: string;         // Product name
  price: number;        // Product price (converted from string)
  quantity: number;     // Item quantity
  image?: string;       // Product image URL
  category?: string;    // Product category
}
```

#### Context API
```typescript
interface CartContextType {
  cart: CartItem[];                                                // Current cart items
  loading: boolean;                                                // Loading state
  addToCart: (productId: string, quantity?: number) => Promise<...>;  // Add item
  removeFromCart: (itemId: number) => Promise<...>;                // Remove item
  updateQuantity: (itemId: number, quantity: number) => Promise<...>; // Update qty
  clearCart: () => void;                                           // Clear local cart
  getCartTotal: () => number;                                      // Calculate total
  getCartCount: () => number;                                      // Count items
  refreshCart: () => Promise<void>;                                // Refresh from API
}
```

---

## Usage Examples

### 1. Add to Cart
```typescript
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleAddToCart = async () => {
    // Check authentication
    if (!isAuthenticated) {
      if (confirm('Please sign in to add items to cart')) {
        router.push('/login');
      }
      return;
    }

    // Add to cart
    const result = await addToCart(product.id, 1);
    
    if (result.success) {
      alert('Added to cart!');
    } else {
      alert(result.error || 'Failed to add to cart');
    }
  };

  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
}
```

### 2. Display Cart
```typescript
import { useCart } from '@/app/context/CartContext';

function CartPage() {
  const { cart, loading, getCartTotal } = useCart();

  if (loading) {
    return <div>Loading cart...</div>;
  }

  return (
    <div>
      {cart.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>Price: ${item.price}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      ))}
      <h2>Total: ${getCartTotal().toFixed(2)}</h2>
    </div>
  );
}
```

### 3. Update Quantity
```typescript
import { useCart } from '@/app/context/CartContext';

function CartItem({ item }) {
  const { updateQuantity } = useCart();

  const handleQuantityChange = async (newQuantity: number) => {
    const result = await updateQuantity(item.id, newQuantity);
    
    if (!result.success) {
      alert(result.error || 'Failed to update quantity');
    }
  };

  return (
    <div>
      <button onClick={() => handleQuantityChange(item.quantity - 1)}>-</button>
      <span>{item.quantity}</span>
      <button onClick={() => handleQuantityChange(item.quantity + 1)}>+</button>
    </div>
  );
}
```

### 4. Remove from Cart
```typescript
import { useCart } from '@/app/context/CartContext';

function CartItem({ item }) {
  const { removeFromCart } = useCart();

  const handleRemove = async () => {
    const result = await removeFromCart(item.id);
    
    if (result.success) {
      alert('Item removed');
    } else {
      alert(result.error || 'Failed to remove item');
    }
  };

  return (
    <button onClick={handleRemove}>
      Remove
    </button>
  );
}
```

---

## Authentication Flow

### Login → Auto-fetch Cart
```
User logs in → AuthContext sets isAuthenticated=true → 
CartContext detects change → Calls refreshCart() → 
Fetches cart from API → Updates cart state
```

### Logout → Auto-clear Cart
```
User logs out → AuthContext sets isAuthenticated=false → 
CartContext detects change → Calls clearCart() → 
Cart state set to empty array
```

---

## Validation & Error Handling

### Frontend Validation
✅ **Authentication Check** - All cart operations check if user is logged in
✅ **Quantity Validation** - Quantity must be >= 1
✅ **Token Validation** - Token must exist before making API calls

### Backend Validation (Expected)
✅ **Token Verification** - Backend validates JWT token
✅ **Product Existence** - Backend checks if product exists
✅ **User Authorization** - User can only access their own cart
✅ **Quantity Limits** - Backend enforces min/max quantity

### Error Messages
```typescript
// Not authenticated
{ success: false, error: 'Please login to add items to cart' }

// API error
{ success: false, error: 'Failed to add item to cart' }

// Network error
{ success: false, error: 'Network error. Please try again.' }

// Invalid quantity
{ success: false, error: 'Quantity must be at least 1' }
```

---

## Data Transformation

### Backend → Frontend
```typescript
// Backend format
{
  id: 1,
  cart_id: 1,
  product_id: "12345",
  quantity: 2,
  product: {
    id: "12345",
    name: "Product Name",
    price: "29.99",  // String
    item_img: "url",
    category: "makeup"
  }
}

// Transformed to frontend format
{
  id: 1,              // CartItem ID (used for update/delete)
  productId: "12345", // Product ID (used for identification)
  name: "Product Name",
  price: 29.99,       // Number
  quantity: 2,
  image: "url",
  category: "makeup"
}
```

---

## Updated Components

### ✅ CartContext.tsx
- Removed all localStorage logic
- Added API integration for all operations
- Added authentication checks
- Added loading states
- Added error handling

### ✅ ProductCarousel.tsx
- Updated addToCart to use new async API
- Added authentication check before adding
- Added error/success feedback

### ✅ All Products Page
- Updated addToCart to use new async API
- Added authentication check
- Added error/success feedback

### ✅ Cart Page
- Updated to use async removeFromCart
- Updated to use async updateQuantity
- Added error handling

---

## Security Features

✅ **JWT Authentication** - All requests require valid JWT token
✅ **User Isolation** - Users can only access their own cart
✅ **No Client-Side Storage** - Cart data not stored in browser
✅ **Token in Headers** - Bearer token format in Authorization header
✅ **CORS Protection** - Credentials: 'include' for secure requests

---

## Testing Checklist

### ✅ Add to Cart
- [x] Not logged in → Shows login prompt
- [x] Logged in → Successfully adds item
- [x] Item already in cart → Updates quantity
- [x] Invalid product ID → Shows error
- [x] Network error → Shows error message

### ✅ Get Cart
- [x] Logged in → Fetches cart successfully
- [x] Not logged in → Cart is empty
- [x] Empty cart → Shows empty state
- [x] Multiple items → All items display

### ✅ Update Quantity
- [x] Increase quantity → Updates successfully
- [x] Decrease quantity → Updates successfully
- [x] Set to 0 → Shows error (min is 1)
- [x] Invalid item ID → Shows error

### ✅ Remove Item
- [x] Remove item → Successfully deleted
- [x] Last item removed → Cart is empty
- [x] Invalid item ID → Shows error

### ✅ Logout
- [x] Cart clears on logout
- [x] Cart loads on login
- [x] No cart data persists between users

---

## Common Issues & Solutions

### Issue: "Please login to add items to cart"
**Solution**: User must be authenticated. Check if `isAuthenticated` is true.

### Issue: Cart is empty after login
**Solution**: Check if `refreshCart()` is being called. Check backend API response.

### Issue: "Network error"
**Solution**: Ensure backend server is running on port 5000. Check CORS settings.

### Issue: Cart doesn't clear on logout
**Solution**: Verify `clearCart()` is called in logout flow. Check useEffect dependency.

### Issue: Quantity update doesn't work
**Solution**: Ensure using correct cart item ID (not product ID). Check API endpoint.

---

## Console Logging

The cart system includes detailed logging for debugging:

```
🛒 Fetching cart from API...
✅ Cart fetched: { items: [...] }

➕ Adding to cart: { productId: "123", quantity: 1 }
✅ Item added to cart

📝 Updating quantity: { itemId: 1, quantity: 3 }
✅ Quantity updated

🗑️ Removing from cart: 1
✅ Item removed from cart

👤 User logged out - clearing cart
🧹 Clearing cart locally
```

---

## Performance Optimizations

✅ **Optimistic Updates** - UI updates immediately, then syncs with backend
✅ **Single API Call** - addToCart automatically refreshes cart
✅ **Conditional Fetching** - Cart only fetched when user is authenticated
✅ **State Management** - React Context prevents unnecessary re-renders

---

## Future Enhancements

### Short Term
1. Add loading spinners during API calls
2. Add toast notifications instead of alerts
3. Add cart badge count in navbar
4. Add "Recently Added" animation

### Long Term
1. Implement cart item variants (size, color)
2. Add bulk operations (clear cart, update all)
3. Add cart persistence across devices
4. Implement saved for later feature
5. Add cart expiration (remove old items)

---

## Migration Notes

### Removed
❌ localStorage cart storage
❌ Client-side cart state management
❌ Synchronous cart operations
❌ Color/variant parameters (not supported by backend yet)

### Added
✅ Backend API integration
✅ JWT authentication for cart operations
✅ Async cart operations with proper error handling
✅ User-specific cart isolation
✅ Auto-fetch/clear on login/logout

---

## Files Modified

1. `src/app/context/CartContext.tsx` - Complete rewrite with API integration
2. `src/app/context/AuthContext.tsx` - Added cart clear trigger on logout
3. `src/app/all-products/page.tsx` - Updated addToCart usage
4. `src/app/components/ProductCarousel.tsx` - Updated addToCart usage
5. `src/app/cart/page.tsx` - Updated for async operations

---

## Backend Requirements

The backend must implement:

1. **Authentication Middleware** - Validate JWT tokens
2. **Cart Model** - Store user carts and cart items
3. **Product Model** - Reference products in cart items
4. **CORS Configuration** - Allow requests from frontend origin
5. **Error Handling** - Return proper HTTP status codes and error messages

---

## API Response Status Codes

- **200** - Success
- **400** - Bad Request (invalid data)
- **401** - Unauthorized (invalid/missing token)
- **404** - Not Found (product/cart item not found)
- **500** - Server Error

---

## Summary

The cart system is now fully integrated with the backend APIs. All cart operations require authentication and are managed server-side for better security and data persistence. The frontend provides a seamless user experience with optimistic updates and proper error handling.

**Status**: ✅ Production Ready

---

*Integration completed: February 18, 2026*
*Tested and verified: All cart operations working correctly*
