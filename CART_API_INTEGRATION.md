# Cart System API Integration - Complete ✅

## Overview
Successfully integrated the backend cart APIs into the frontend, replacing all localStorage-based cart functionality with secure, server-side cart management that requires authentication.

---

## API Endpoints Integrated

### 1. **Add to Cart**
**Endpoint**: `POST http://localhost:5000/api/cart/add`  
**Auth**: Required  
**Request Body**:
```json
{
  "productId": "string",
  "quantity": 1
}
```
**Response**:
```json
{
  "message": "Item added to cart"
}
```

### 2. **Get Cart**
**Endpoint**: `GET http://localhost:5000/api/cart`  
**Auth**: Required  
**Response**:
```json
{
  "items": [
    {
      "id": 1,
      "cart_id": 1,
      "productId": "123",
      "quantity": 2,
      "product": {
        "id": "123",
        "name": "Product Name",
        "name_e": "English Name",
        "price": "50.00",
        "item_img": "http://example.com/image.jpg",
        "class_id": "MAKEUP"
      }
    }
  ]
}
```

### 3. **Update Quantity**
**Endpoint**: `PUT http://localhost:5000/api/cart/update/:itemId`  
**Auth**: Required  
**Request Body**:
```json
{
  "quantity": 3
}
```
**Response**:
```json
{
  "message": "Quantity updated"
}
```

### 4. **Delete Cart Item**
**Endpoint**: `DELETE http://localhost:5000/api/cart/delete/:itemId`  
**Auth**: Required  
**Response**:
```json
{
  "message": "Item removed"
}
```

---

## Frontend Implementation

### CartContext (`src/app/context/CartContext.tsx`)

#### Complete Rewrite
✅ Removed all localStorage logic  
✅ Implemented API-based cart management  
✅ Added authentication token handling  
✅ Added loading states  
✅ Added error handling  
✅ Added cart refresh functionality  

#### New Interface
```typescript
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
```

#### CartItem Structure
```typescript
export interface CartItem {
  id: number;          // CartItem database ID
  productId: string;   // Product ID from external API
  name: string;        // Product name
  price: number;       // Product price
  quantity: number;    // Quantity in cart
  image?: string;      // Product image URL
  category?: string;   // Product category
}
```

---

## Key Features

### 1. **Authentication Required**
- All cart operations require a valid auth token
- Token is retrieved from localStorage
- Automatically clears cart if user is not authenticated
- Returns clear error messages when authentication fails

### 2. **Automatic Cart Synchronization**
- Cart is fetched from backend on component mount
- Cart updates after every add/update/remove operation
- Ensures frontend and backend are always in sync

### 3. **Async Operations**
All cart functions now return Promises:
```typescript
// Add to cart
const result = await addToCart("productId123", 1);
if (result.success) {
  // Success!
} else {
  alert(result.error);
}

// Update quantity
const result = await updateQuantity(itemId, 3);

// Remove item
const result = await removeFromCart(itemId);
```

### 4. **Error Handling**
Each operation returns `{ success: boolean; error?: string }`:
- Network errors handled gracefully
- API errors displayed to user
- Authentication errors handled automatically

### 5. **Loading States**
- `loading` boolean in context
- Can be used to show spinners/disabled states
- Prevents duplicate operations

---

## Updated Components

### 1. **All Products Page** (`src/app/all-products/page.tsx`)
```typescript
// Old (localStorage-based)
addToCart({
  id: product.id,
  name: product.name,
  price: product.price,
  category: product.category,
});

// New (API-based)
const result = await addToCart(String(product.id), 1);
if (result.success) {
  alert(`${product.name} added to cart`);
} else {
  alert(result.error || 'Failed to add to cart');
}
```

### 2. **Cart Page** (`src/app/cart/page.tsx`)
✅ Updated to use new async cart functions  
✅ Added loading prop from context  
✅ Removed color/variant support (not in API yet)  
✅ Added product image display  
✅ Handles API errors gracefully  

**Changes**:
- Removed `color` field references
- Added image display with fallback
- Uses `itemId` (database ID) for updates/deletes
- Async handlers for all cart operations

---

## Validation & Security

### Backend Validation
✅ **Authentication middleware** (`ensureAuthenticated`)  
✅ **Product existence check** (verifies product from external API)  
✅ **Quantity validation** (must be >= 1)  
✅ **User-specific carts** (cart linked to user ID)  
✅ **Token blacklist check** (invalid tokens rejected)  

### Frontend Validation
✅ **Auth check before operations**  
✅ **Product ID conversion** (handles both string and number IDs)  
✅ **Quantity constraints** (minimum 1)  
✅ **Error message display**  

---

## Data Flow

### Add to Cart Flow
```
User clicks "Add to Cart"
       ↓
Frontend checks authentication
       ↓
API Request: POST /api/cart/add
  - Headers: Authorization token
  - Body: { productId, quantity }
       ↓
Backend validates token
       ↓
Backend fetches product from external API
       ↓
Backend checks if item exists in cart
  - If exists: increment quantity
  - If not: create new cart item
       ↓
Response: { message: "Item added to cart" }
       ↓
Frontend refreshes cart from backend
       ↓
UI updates with new cart data
```

### Get Cart Flow
```
Component mounts or refreshCart() called
       ↓
Frontend gets auth token
       ↓
API Request: GET /api/cart
  - Headers: Authorization token
       ↓
Backend validates token
       ↓
Backend fetches cart from database
       ↓
Backend merges cart items with product data
       ↓
Response: { items: [...] }
       ↓
Frontend transforms backend data
       ↓
Cart state updated
```

---

## Database Tables

### Cart Table
```javascript
{
  id: INTEGER (Primary Key),
  user_id: INTEGER (Foreign Key to User),
  createdAt: DATE,
  updatedAt: DATE
}
```

### CartItem Table
```javascript
{
  id: INTEGER (Primary Key),
  cart_id: INTEGER (Foreign Key to Cart),
  productId: STRING (Product ID from external API),
  quantity: INTEGER,
  createdAt: DATE,
  updatedAt: DATE
}
```

---

## Usage Examples

### In Components
```typescript
import { useCart } from '@/app/context/CartContext';

function ProductCard({ product }) {
  const { addToCart, loading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    const result = await addToCart(product.id, 1);
    
    if (result.success) {
      toast.success('Added to cart!');
    } else {
      toast.error(result.error || 'Failed to add to cart');
    }
    
    setIsAdding(false);
  };

  return (
    <button 
      onClick={handleAddToCart}
      disabled={loading || isAdding}
    >
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### In Cart Page
```typescript
const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();

// Update quantity
const handleQuantityChange = async (itemId, newQuantity) => {
  const result = await updateQuantity(itemId, newQuantity);
  if (!result.success) {
    alert(result.error);
  }
};

// Remove item
const handleRemove = async (itemId) => {
  if (confirm('Remove this item?')) {
    const result = await removeFromCart(itemId);
    if (!result.success) {
      alert(result.error);
    }
  }
};
```

---

## Testing

### Manual Testing Steps

1. **Add to Cart (Authenticated)**
   - Login to the app
   - Browse products
   - Click "Add to Cart"
   - Verify success message
   - Check cart count updates

2. **Add to Cart (Not Authenticated)**
   - Logout
   - Try to add product
   - Verify "Please login" error
   - Redirected to login

3. **View Cart**
   - Navigate to cart page
   - Verify all items display
   - Check product images load
   - Verify quantities correct
   - Check total calculation

4. **Update Quantity**
   - Click + button
   - Verify quantity increases
   - Click - button
   - Verify quantity decreases
   - Check minimum is 1

5. **Remove Item**
   - Click trash icon
   - Verify item removed
   - Check cart updates

6. **Empty Cart**
   - Remove all items
   - Verify empty cart message
   - Check "Start Shopping" link

### API Testing (cURL)
```bash
# Login first to get token
TOKEN="your_token_here"

# Add to cart
curl -X POST http://localhost:5000/api/cart/add \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"123","quantity":1}'

# Get cart
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: $TOKEN"

# Update quantity
curl -X PUT http://localhost:5000/api/cart/update/1 \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity":3}'

# Delete item
curl -X DELETE http://localhost:5000/api/cart/delete/1 \
  -H "Authorization: $TOKEN"
```

---

## Error Handling

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Please login to add items to cart" | No auth token | User needs to login |
| "Access token required" | Token missing in request | Check localStorage has token |
| "Access token not valid" | Token expired/invalid | User needs to re-login |
| "Product not found" | Invalid product ID | Verify product exists in external API |
| "Quantity must be >= 1" | Invalid quantity | Enforce minimum quantity of 1 |
| "Network error" | Backend not running | Start backend server |

---

## Migration Notes

### Breaking Changes from Old Cart System

1. **Function Signatures Changed**
   ```typescript
   // Old
   addToCart(item: Omit<CartItem, 'quantity'>) => void
   
   // New
   addToCart(productId: string, quantity?: number) => Promise<{success: boolean; error?: string}>
   ```

2. **No More localStorage**
   - Cart no longer persists in localStorage
   - Cart is server-side only
   - Requires authentication

3. **Removed Features**
   - Color/variant support (not in backend API yet)
   - Offline cart functionality
   - Guest cart (now requires login)

4. **Item IDs Changed**
   - Old: Used product ID directly
   - New: Uses CartItem database ID for updates/deletes

---

## Future Enhancements

### Recommended Improvements

1. **Add Product Variants Support**
   - Handle size/color options
   - Update backend to support variants
   - Update frontend to display variant options

2. **Guest Cart**
   - Allow cart before login
   - Merge with user cart on login
   - Use session-based cart for guests

3. **Cart Optimistic Updates**
   - Update UI immediately
   - Revert on API failure
   - Better user experience

4. **Cart Persistence Notifications**
   - "Cart saved" message
   - "Items in your cart" reminder
   - Cart expiration warnings

5. **Bulk Operations**
   - "Clear all" button with API call
   - "Update all quantities" endpoint
   - "Move to wishlist" feature

6. **Cart Analytics**
   - Track add-to-cart events
   - Monitor abandoned carts
   - Conversion tracking

---

## Related Files

### Modified
- `src/app/context/CartContext.tsx` - Complete rewrite with API integration
- `src/app/all-products/page.tsx` - Updated addToCart calls
- `src/app/cart/page.tsx` - Updated to use async cart operations

### Backend
- `backend/routes/cartRoutes.js` - Cart API routes
- `backend/controllers/cartController.js` - Cart business logic
- `backend/models/Cart.js` - Cart model
- `backend/models/CartItem.js` - CartItem model

### Documentation
- `CART_API_INTEGRATION.md` - This file

---

## Status

✅ **COMPLETE** - Cart system fully integrated with backend APIs, all localStorage functionality removed, authentication required, error handling implemented.

---

*Integration completed: February 18, 2026*
