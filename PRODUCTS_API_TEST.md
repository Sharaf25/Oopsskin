# Products API - Quick Test Guide

## 🧪 API Testing Instructions

### Prerequisites
- Backend server must be running: `npm start` in `/backend` folder
- Server should be accessible at `http://localhost:5000`

## Test Cases

### ✅ Test 1: Basic Fetch (No Parameters)
**Request:**
```
GET http://localhost:5000/api/products
```

**Expected Response:**
```json
{
  "totalItems": 45,
  "page": 1,
  "limit": 45,
  "totalPages": 1,
  "data": [ /* all products */ ]
}
```

---

### ✅ Test 2: Pagination
**Request:**
```
GET http://localhost:5000/api/products?page=1&limit=10
```

**Expected Response:**
```json
{
  "totalItems": 45,
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "data": [ /* 10 products */ ]
}
```

---

### ✅ Test 3: Price Filtering (Min Price)
**Request:**
```
GET http://localhost:5000/api/products?minPrice=20
```

**Expected:** Only products with `price >= 20`

---

### ✅ Test 4: Price Filtering (Max Price)
**Request:**
```
GET http://localhost:5000/api/products?maxPrice=50
```

**Expected:** Only products with `price <= 50`

---

### ✅ Test 5: Price Range
**Request:**
```
GET http://localhost:5000/api/products?minPrice=20&maxPrice=50
```

**Expected:** Only products with `20 <= price <= 50`

---

### ✅ Test 6: Sort Ascending
**Request:**
```
GET http://localhost:5000/api/products?sort=asc
```

**Expected:** Products sorted by price (lowest first)

---

### ✅ Test 7: Sort Descending
**Request:**
```
GET http://localhost:5000/api/products?sort=desc
```

**Expected:** Products sorted by price (highest first)

---

### ✅ Test 8: Combined Filters
**Request:**
```
GET http://localhost:5000/api/products?minPrice=20&maxPrice=100&sort=asc&page=1&limit=12
```

**Expected:**
- Products with price between $20-$100
- Sorted low to high
- First page
- 12 items per page

---

## 🖥️ Testing Methods

### Method 1: Browser
Simply paste the URL in your browser:
```
http://localhost:5000/api/products
```

### Method 2: PowerShell (cURL)
```powershell
# Basic fetch
curl http://localhost:5000/api/products

# With parameters
curl "http://localhost:5000/api/products?page=1&limit=10"

# With price filter
curl "http://localhost:5000/api/products?minPrice=20&maxPrice=50"

# With sorting
curl "http://localhost:5000/api/products?sort=desc"
```

### Method 3: Postman
1. Create new GET request
2. Enter URL: `http://localhost:5000/api/products`
3. Add query parameters in the Params tab:
   - page: 1
   - limit: 10
   - minPrice: 20
   - maxPrice: 100
   - sort: asc
4. Send request

### Method 4: VS Code REST Client Extension
Create a `.http` file:

```http
### Get all products
GET http://localhost:5000/api/products

### Get products with pagination
GET http://localhost:5000/api/products?page=1&limit=10

### Get products with price filter
GET http://localhost:5000/api/products?minPrice=20&maxPrice=50

### Get products sorted
GET http://localhost:5000/api/products?sort=asc

### Combined filters
GET http://localhost:5000/api/products?minPrice=20&maxPrice=100&sort=asc&page=1&limit=12
```

---

## 🔍 Response Verification

### Check These Fields:
- ✅ `totalItems`: Total count of filtered products
- ✅ `page`: Current page number
- ✅ `limit`: Items per page
- ✅ `totalPages`: Total pages available
- ✅ `data`: Array of product objects

### Product Object Structure:
```json
{
  "id": 123,
  "name": "Product Name",
  "item_img": "https://...",
  "price": 25.99,
  "color_id_main": "color1",
  "color_id_measure": ["color1", "color2"]
}
```

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch" or Connection Error
**Solution:** Make sure backend server is running:
```bash
cd backend
npm start
```

### Issue: Empty `data` array
**Possible causes:**
1. Cache is empty (wait 30 seconds for initial fetch)
2. External API is down (check backend console logs)
3. All products filtered out by price range

### Issue: Filters not working
**Check:**
1. Query parameters are correctly formatted
2. Price values are valid numbers
3. Sort parameter is 'asc' or 'desc'

---

## 📊 Sample Test Results

### Expected Product Count (Approximate)
- Total products: ~45 (varies based on external API)
- Products with price > $20: ~30-35
- Products with price < $50: ~15-20

### Performance Expectations
- First request: ~1-2 seconds (fetches from external API)
- Subsequent requests: <100ms (served from cache)
- Cache refresh: Every 30 minutes

---

## ✅ Success Criteria

The API is working correctly if:
1. ✅ Returns valid JSON response
2. ✅ Pagination calculates correct totalPages
3. ✅ Price filtering excludes out-of-range products
4. ✅ Sorting orders products correctly
5. ✅ All products have non-null, non-zero prices
6. ✅ Response time is fast (cached)
7. ✅ No 500 server errors

---

**Status**: Ready for Testing
**Last Updated**: 2025
