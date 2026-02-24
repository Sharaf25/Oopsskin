# Testing Guide - All Products Features

## 🧪 How to Test All Features

### Prerequisites
- ✅ Backend running on http://localhost:5000
- ✅ Frontend running on http://localhost:3001
- ✅ Database seeded with dummy products

---

## 🎯 Feature Tests

### 1. Test Search Bar
1. Navigate to http://localhost:3001/all-products
2. Find the search bar at the top of the products grid
3. Type "lipstick" - should filter to show only lipstick products
4. Clear search - all products should appear again
5. Try "face" - should show face-related products
6. **Expected**: Real-time filtering, page resets to 1

### 2. Test Dual-Handle Price Slider
1. Scroll to sidebar on the left
2. Find "Price Range" section
3. **Try Min Handle**: 
   - Drag left handle to $100
   - Products below $100 should disappear
4. **Try Max Handle**:
   - Drag right handle to $50
   - Only products between $100-$50 should show (none)
5. **Set Range**:
   - Min: $20, Max: $100
   - Should show products in that price range
6. Click "Reset Price Filter" - all products return
7. **Expected**: 
   - Active pink bar between handles
   - Handles can't cross each other
   - Real-time filtering

### 3. Test Product Images
1. Check all product cards
2. **Expected**:
   - Each product shows dummy.jpg image
   - Images load from http://localhost:5000/uploads/products/dummy.jpg
   - No broken image icons
   - If an image fails, placeholder appears

### 4. Test Combined Filters
1. **Search + Price**:
   - Search "cream"
   - Set price range $50-$150
   - Should show only cream products in that price range
   
2. **Search + Sort + Price**:
   - Search "lipstick"
   - Set price $0-$100
   - Sort by "Price: High to Low"
   - Should show lipstick products sorted descending
   
3. **Category + Search + Price**:
   - Click "Makeup" category
   - Search "lip"
   - Set price $10-$60
   - Should filter correctly

### 5. Test Sorting
1. Select "Price: Low to High" - cheapest products first
2. Select "Price: High to Low" - most expensive first
3. Select "Featured" - default ordering
4. **Expected**: Products re-order instantly

### 6. Test Pagination
1. Ensure more than 10 products exist
2. Click page 2
3. Products should change
4. URL should update
5. **Expected**: Smooth scroll to top, new products load

---

## 🔍 Visual Verification

### Search Bar Should Have:
- ✅ Magnifying glass icon on left
- ✅ White background with gray border
- ✅ Pink ring on focus
- ✅ Placeholder: "Search products..."

### Dual-Handle Slider Should Have:
- ✅ Gray background track (full width)
- ✅ Pink active track (between handles)
- ✅ Two white handles with pink border
- ✅ Shadow effect on handles
- ✅ Hover effect (light pink background)
- ✅ Price labels above ($XX - $XX)
- ✅ Reset button below

### Product Cards Should Show:
- ✅ Product image (not placeholder)
- ✅ Badge if applicable (NEW, HOT, etc.)
- ✅ Product name
- ✅ Category name
- ✅ Price (with strikethrough for before_price)
- ✅ Color swatches
- ✅ Star rating
- ✅ Add to Cart button

---

## 🌐 API Testing

### Test Product API Manually

**Full URL Example**:
```
http://localhost:5000/api/products?lang=en&page=1&limit=10&sort=asc&minPrice=30&maxPrice=100&search=lip
```

**Expected Response**:
```json
{
  "totalItems": 3,
  "totalPages": 1,
  "currentPage": 1,
  "data": [
    {
      "id": 1,
      "name": "Lipstick Red",
      "price": 50,
      "featured_image": "uploads/products/dummy.jpg",
      ...
    }
  ]
}
```

**Test in Browser**:
1. Open: http://localhost:5000/api/products?lang=en
2. Should see JSON with all products
3. Add filters: http://localhost:5000/api/products?lang=en&search=lip&minPrice=20&maxPrice=60
4. Should see filtered results

**Test Image URL**:
1. Open: http://localhost:5000/uploads/products/dummy.jpg
2. Should display the dummy image
3. If not, check backend console for static file serving message

---

## 🐛 Debugging Tips

### If Search Doesn't Work:
1. Check browser console for errors
2. Verify API URL is correct (http://localhost:5000)
3. Check network tab - should see API call with `search` parameter
4. Backend should log the SQL query with LIKE

### If Images Don't Load:
1. Check backend console for "📁 Serving static files from: ..."
2. Visit http://localhost:5000/uploads/products/dummy.jpg directly
3. Check browser console for 404 errors
4. Verify file exists: `backend/uploads/products/dummy.jpg`

### If Slider Doesn't Work:
1. Inspect element - check if styles applied
2. Console errors for React state issues
3. Try resetting price filter
4. Check if handles respond to drag events

### If Filters Don't Combine:
1. Check network tab - URL should have all query params
2. Backend should receive all filters
3. Check useEffect dependencies include all filter states

---

## ✅ Success Criteria

All features working if:
- ✅ Search filters products instantly
- ✅ Dual-handle slider updates price range visually and functionally
- ✅ Product images load from backend (not placeholders)
- ✅ All filters work independently
- ✅ All filters work together
- ✅ Pagination resets when filters change
- ✅ No console errors
- ✅ Smooth user experience

---

## 📸 Screenshots Checklist

Take screenshots of:
1. Search bar with results
2. Dual-handle slider at different positions
3. Product grid with images loaded
4. Combined filters in action
5. Mobile responsive view

---

## 🎉 Done!

All three major features are implemented and ready to test!
