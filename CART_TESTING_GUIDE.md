# 🛒 Cart System - Complete Testing Guide

## Quick Start

### 1. Start Backend Server
```powershell
cd backend
npm start
```
**Expected Output**:
```
Server running on port 5000
✅ Tables are synced
```

### 2. Start Frontend Server
```powershell
# In a new terminal
npm run dev
```
**Expected Output**:
```
ready - started server on 0.0.0.0:3000
```

### 3. Login
1. Open browser: `http://localhost:3000/login`
2. Login with your credentials
3. Check localStorage has token:
   - Press F12 → Console
   - Type: `localStorage.getItem('authToken')`
   - Should return a token string

## Testing Cart Operations

### ✅ Test 1: Add to Cart from Home Page
1. Go to `http://localhost:3000`
2. Scroll to "Best Sellers" section
3. Click "Add to Cart" on any product
4. **Open DevTools Console (F12)**
5. Look for messages:
   ```
   ➕ Adding to cart: {productId: "1", quantity: 1}
   ✅ Item added to cart
   🛒 Fetching cart from API...
   ✅ Cart fetched: {items: [...]}
   ```
6. Check cart badge in navbar - should show count (e.g., "1")

### ✅ Test 2: Add to Cart from All Products Page
1. Go to `http://localhost:3000/all-products`
2. Click "Add to Cart" on any product
3. Check console for success messages
4. Cart badge should increment

### ✅ Test 3: View Cart Page
1. Click on cart icon in navbar OR go to `http://localhost:3000/cart`
2. Should see all added items with:
   - Product image
   - Product name
   - Price
   - Quantity selector
   - Remove button
   - Total price

### ✅ Test 4: Update Quantity
1. On cart page, use + / - buttons to change quantity
2. Check console for:
   ```
   📝 Updating quantity: {itemId: 1, quantity: 2}
   ✅ Quantity updated
   ```
3. Total price should update immediately

### ✅ Test 5: Remove Item
1. On cart page, click "Remove" button
2. Check console for:
   ```
   🗑️ Removing from cart: 1
   ✅ Item removed from cart
   ```
3. Item should disappear from cart

### ✅ Test 6: Cart Persistence
1. Add items to cart
2. Refresh the page (F5)
3. Cart should still have the same items
4. Check console for:
   ```
   🛒 Fetching cart from API...
   ✅ Cart fetched: {items: [...]}
   ```

### ✅ Test 7: Logout Clears Cart
1. Add items to cart
2. Click "Logout" in navbar
3. Cart badge should show 0
4. Check console for:
   ```
   👤 User logged out - clearing cart
   ```
5. Login again - cart should be empty (new session)

### ✅ Test 8: User-Specific Cart
1. Login as User A, add items
2. Logout
3. Login as User B, cart should be empty
4. Add different items as User B
5. Logout and login as User A again - should see User A's items

## Network Tab Verification

### Check API Calls (F12 → Network)

1. **Add to Cart**
   - URL: `http://localhost:5000/api/cart/add`
   - Method: POST
   - Status: 200 OK
   - Response: `{"message": "Item added to cart"}`
   - Headers: Should include `Authorization: Bearer ...`

2. **Get Cart**
   - URL: `http://localhost:5000/api/cart`
   - Method: GET
   - Status: 200 OK
   - Response: `{"items": [...]}`

3. **Update Quantity**
   - URL: `http://localhost:5000/api/cart/update/:itemId`
   - Method: PUT
   - Status: 200 OK
   - Response: `{"message": "Quantity updated"}`

4. **Remove Item**
   - URL: `http://localhost:5000/api/cart/delete/:itemId`
   - Method: DELETE
   - Status: 200 OK
   - Response: `{"message": "Item removed"}`

## Troubleshooting

### ❌ Problem: "Please login to add items to cart"
**Solution**: You're not logged in. Go to `/login` first.

### ❌ Problem: "Failed to fetch" error
**Solution**: 
1. Check backend is running: `http://localhost:5000/` should show "Welcome to the API"
2. Check CORS in `backend/index.js` includes `http://localhost:3000`

### ❌ Problem: 401 Unauthorized
**Solution**: Token expired. Logout and login again.

### ❌ Problem: Cart badge shows 0 but items exist
**Solution**:
1. Check console for errors
2. Open cart page directly: `/cart`
3. Check Network tab for failed API calls

### ❌ Problem: Cart is empty after refresh
**Solution**:
1. Check console for `🛒 Fetching cart from API...` message
2. Verify you're still logged in (check `localStorage.getItem('authToken')`)
3. Check Network tab - ensure `/api/cart` returns items

### ❌ Problem: Can't add items (no error message)
**Solution**:
1. Check console for errors
2. Verify product ID exists: `http://localhost:5000/api/products`
3. Check Network tab for failed POST to `/api/cart/add`

## Using the API Tester

For direct API testing without the UI:

1. **Open tester**: Open `cart-api-tester.html` in browser
2. **Login first**: Login at `http://localhost:3000/login`
3. **Return to tester**: The tool will auto-detect your auth token
4. **Test operations**: Use the buttons to test each API endpoint
5. **View results**: Results show in the output boxes below each button

## Success Indicators

When everything is working correctly:

✅ Console shows clear success/error messages for each operation  
✅ Cart badge updates immediately after adding items  
✅ Cart page displays all items with correct data  
✅ Quantity updates work instantly  
✅ Remove button works instantly  
✅ Cart persists across page refreshes  
✅ Cart clears on logout  
✅ Different users have isolated carts  
✅ No CORS errors in console  
✅ All API calls return 200 OK (check Network tab)  

## Code Quality Checks

### Frontend (`src/app/context/CartContext.tsx`)
- ✅ No localStorage usage for cart data
- ✅ All cart operations use backend API
- ✅ Proper error handling with user-friendly messages
- ✅ Loading states for async operations
- ✅ Auth token included in all requests
- ✅ Cart cleared on logout

### Backend (`backend/controllers/cartController.js`)
- ✅ All endpoints require authentication
- ✅ Proper user isolation (cart_id linked to user_id)
- ✅ Product data merged from products API
- ✅ Consistent response format
- ✅ Error handling for edge cases

## Performance Notes

- Cart fetched once on mount (when authenticated)
- After add/update/remove, cart is refreshed from server
- Optimistic UI updates for better UX
- Product data cached in backend for fast response

---

## 🎉 Expected Final State

After completing all tests:

1. ✅ Cart system fully functional
2. ✅ All operations work (add, get, update, delete)
3. ✅ Cart is user-specific and secure
4. ✅ Cart persists correctly
5. ✅ Cart clears on logout
6. ✅ No errors in console
7. ✅ All API calls successful (200 OK)

**If all tests pass, your cart system is working perfectly!** 🎊
