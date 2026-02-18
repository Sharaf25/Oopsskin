# Cart API Debugging Guide

## Issues Fixed

### 1. **URL Mismatch in addToCart**
- **Problem**: Frontend was calling `http://localhost:5000/cart/add` instead of `http://localhost:5000/api/cart/add`
- **Fix**: Updated CartContext.tsx line 140 to use correct API endpoint
- **Status**: ✅ Fixed

### 2. **Product Data Structure in getCart Response**
- **Problem**: Backend was returning inconsistent data structure using `item.toJSON()`
- **Fix**: Standardized response format to match frontend expectations
- **Status**: ✅ Fixed

## Current Cart API Endpoints

All endpoints require authentication (`Bearer token` in Authorization header)

### 1. Add to Cart
```
POST http://localhost:5000/api/cart/add
Headers: Authorization: Bearer <token>
Body: { "productId": "1", "quantity": 2 }
Response: { "message": "Item added to cart" }
```

### 2. Get Cart
```
GET http://localhost:5000/api/cart
Headers: Authorization: Bearer <token>
Response: {
  "items": [
    {
      "id": 1,
      "cart_id": 1,
      "product_id": "1",
      "quantity": 2,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "product": {
        "id": "1",
        "name": "Product Name",
        "price": "29.99",
        "item_img": "image.jpg",
        "category": "Category"
      }
    }
  ]
}
```

### 3. Update Quantity
```
PUT http://localhost:5000/api/cart/update/:itemId
Headers: Authorization: Bearer <token>
Body: { "quantity": 3 }
Response: { "message": "Quantity updated" }
```

### 4. Remove Item
```
DELETE http://localhost:5000/api/cart/delete/:itemId
Headers: Authorization: Bearer <token>
Response: { "message": "Item removed" }
```

## Testing Steps

### Using Browser Console

1. **Check if user is authenticated**:
```javascript
localStorage.getItem('authToken')
```

2. **Test Add to Cart** (open browser console on frontend):
```javascript
const token = localStorage.getItem('authToken');
fetch('http://localhost:5000/api/cart/add', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ productId: '1', quantity: 1 }),
  credentials: 'include'
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

3. **Test Get Cart**:
```javascript
const token = localStorage.getItem('authToken');
fetch('http://localhost:5000/api/cart', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  credentials: 'include'
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

### Using the UI

1. **Login** to the application
2. **Open browser DevTools** (F12) and go to Console tab
3. **Navigate** to All Products or Home page
4. **Click "Add to Cart"** on any product
5. **Check Console** for:
   - `➕ Adding to cart:` message
   - `✅ Item added to cart` or error message
   - `🛒 Fetching cart from API...` message
   - `✅ Cart fetched:` with cart data

6. **Check Network Tab** (F12 → Network):
   - Look for requests to `localhost:5000/api/cart/add`
   - Check Status: Should be `200 OK`
   - Check Response: Should contain `{ "message": "Item added to cart" }`

7. **Navigate to Cart Page** (`/cart`)
   - Should display all cart items
   - Update quantity buttons should work
   - Remove button should work

## Common Issues & Solutions

### Issue 1: "Please login to add items to cart"
- **Cause**: User is not authenticated
- **Solution**: Login via `/login` page first

### Issue 2: 401 Unauthorized
- **Cause**: Invalid or expired token
- **Solution**: Logout and login again to get fresh token

### Issue 3: CORS Error
- **Cause**: Backend CORS not configured properly
- **Solution**: Check `backend/index.js` has correct CORS settings
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Issue 4: "Product not found or price = 0"
- **Cause**: Product doesn't exist in products API
- **Solution**: Check if product ID is valid by calling `/api/products`

### Issue 5: Cart empty after refresh
- **Cause**: Cart not fetching on mount or authentication issue
- **Solution**: Check browser console for errors, ensure `refreshCart()` is called in `useEffect`

### Issue 6: Network Error
- **Cause**: Backend server not running
- **Solution**: Start backend with `npm start` in `/backend` directory

## Backend Server Check

1. **Ensure backend is running**:
```powershell
cd backend
npm start
```

2. **Check if server is listening**:
   - Should see: `✅ Tables are synced`
   - Should see: `Server is running on port 5000`

3. **Test health endpoint**:
   - Open browser: `http://localhost:5000/`
   - Should see: "Welcome to the API"

## Data Flow

```
User clicks "Add to Cart"
  ↓
ProductCarousel/AllProducts calls addToCart(productId, quantity)
  ↓
CartContext.addToCart() sends POST to /api/cart/add
  ↓
Backend authenticates user via JWT token
  ↓
Backend finds/creates user's cart
  ↓
Backend adds/updates CartItem in database
  ↓
Backend returns success message
  ↓
Frontend calls refreshCart() to fetch updated cart
  ↓
CartContext updates cart state
  ↓
UI updates to show cart count badge
```

## Key Files

- **Frontend Context**: `src/app/context/CartContext.tsx`
- **Backend Routes**: `backend/routes/cartRoutes.js`
- **Backend Controller**: `backend/controllers/cartController.js`
- **Backend Models**: `backend/models/Cart.js`, `backend/models/CartItem.js`
- **Authentication Middleware**: `backend/middleware/authMiddleware.js`

## Changes Made

1. Fixed API URL in `CartContext.tsx` addToCart function (line 140)
2. Standardized cart response format in `cartController.js` getCart function
3. Ensured proper product data structure matching frontend expectations

## Next Steps

1. Test all cart operations in browser
2. Verify cart persists across page refreshes
3. Verify cart is user-specific (different users see different carts)
4. Verify cart clears on logout
5. Test error handling (network errors, authentication errors, etc.)
