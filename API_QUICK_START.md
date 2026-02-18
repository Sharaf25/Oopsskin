# 🚀 Quick Start: Backend APIs

## Backend Server
```bash
cd backend
npm start
```
Server runs at: `http://localhost:5000`

---

## 🛒 Cart API (Authentication Required)

### Get Cart
```http
GET http://localhost:5000/api/cart
Authorization: Bearer YOUR_JWT_TOKEN
```

### Add to Cart
```http
POST http://localhost:5000/api/cart
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "productId": 123,
  "quantity": 2
}
```

### Update Quantity
```http
PUT http://localhost:5000/api/cart/ITEM_ID
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "quantity": 3
}
```

### Remove from Cart
```http
DELETE http://localhost:5000/api/cart/ITEM_ID
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📦 Products API (Public - No Auth)

### Get All Products
```http
GET http://localhost:5000/api/products
```

### With Pagination
```http
GET http://localhost:5000/api/products?page=1&limit=10
```

### Filter by Price
```http
GET http://localhost:5000/api/products?minPrice=20&maxPrice=100
```

### Sort by Price
```http
GET http://localhost:5000/api/products?sort=asc
```
or
```http
GET http://localhost:5000/api/products?sort=desc
```

### Combined Example
```http
GET http://localhost:5000/api/products?minPrice=20&maxPrice=100&sort=asc&page=1&limit=12
```

---

## 🔐 Get JWT Token

### Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

Use the `token` value in the `Authorization` header for cart API requests.

---

## 📖 Full Documentation

- **CART_API_INTEGRATION.md** - Complete cart API guide
- **CART_API_SUMMARY.md** - Cart API quick reference
- **PRODUCTS_API_COMPLETE.md** - Products API complete guide
- **PRODUCTS_API_TEST.md** - Testing instructions
- **PROJECT_COMPLETE.md** - Overall project status

---

## ⚡ PowerShell Examples

```powershell
# Get all products
curl http://localhost:5000/api/products

# Get products with pagination
curl "http://localhost:5000/api/products?page=1&limit=10"

# Get products with price filter
curl "http://localhost:5000/api/products?minPrice=20&maxPrice=50"

# Login
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"password123"}'

# Add to cart (replace YOUR_TOKEN)
curl -X POST http://localhost:5000/api/cart -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d '{"productId":123,"quantity":2}'
```

---

## ✅ Status

- ✅ Backend: Running
- ✅ Cart API: Fully Functional
- ✅ Products API: Fully Functional
- ✅ Documentation: Complete

**Ready for Testing!** 🎉
