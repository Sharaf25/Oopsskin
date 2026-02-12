# Oopsskin Backend API

## Overview
Node.js backend API for the Oopsskin e-commerce platform with MySQL database.

## Features
- ✅ RESTful API for Products and Orders
- ✅ MySQL Database with connection pooling
- ✅ CORS enabled for frontend integration
- ✅ Comprehensive error handling
- ✅ Request logging
- ✅ Bilingual support (English/Arabic) in database
- ✅ Product inventory management
- ✅ Order tracking system

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Dependencies**:
  - express - Web framework
  - mysql2 - MySQL client
  - cors - Enable CORS
  - dotenv - Environment variables
  - body-parser - Parse request bodies
  - bcryptjs - Password hashing
  - jsonwebtoken - JWT authentication

## Prerequisites
- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn package manager

## Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the backend directory (copy from `.env.example`):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=oopsskin_db
DB_PORT=3306

PORT=5000
JWT_SECRET=your_secret_key

FRONTEND_URL=http://localhost:3000
```

### 3. Initialize Database
This will create the database, tables, and insert sample data:

```bash
npm run init-db
```

Expected output:
```
✅ Database 'oopsskin_db' created
✅ Products table created
✅ Orders table created
✅ Users table created
✅ Sample products inserted
🎉 Database initialization completed!
```

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## Database Schema

### Products Table
```sql
- id (INT, Primary Key, Auto Increment)
- name (VARCHAR)
- name_ar (VARCHAR) - Arabic name
- description (TEXT)
- description_ar (TEXT) - Arabic description
- category (VARCHAR)
- category_ar (VARCHAR) - Arabic category
- price (DECIMAL)
- original_price (DECIMAL)
- rating (DECIMAL)
- reviews_count (INT)
- colors (JSON) - Array of color codes
- images (JSON) - Array of image URLs
- badge (VARCHAR) - e.g., "BESTSELLER", "NEW"
- discount (VARCHAR) - e.g., "SAVE 20%"
- in_stock (BOOLEAN)
- stock_quantity (INT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Orders Table
```sql
- id (INT, Primary Key, Auto Increment)
- order_number (VARCHAR, Unique)
- customer_name (VARCHAR)
- customer_email (VARCHAR)
- customer_phone (VARCHAR)
- customer_address (TEXT)
- customer_city (VARCHAR)
- customer_country (VARCHAR)
- items (JSON) - Array of order items
- subtotal (DECIMAL)
- shipping (DECIMAL)
- total (DECIMAL)
- payment_method (VARCHAR)
- status (VARCHAR) - pending, confirmed, processing, shipped, delivered, cancelled
- notes (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## API Endpoints

### Products API

#### Get All Products
```
GET /api/products
```

Query Parameters:
- `category` - Filter by category
- `search` - Search in name and description
- `sort` - Sort by: price_asc, price_desc, rating, newest
- `limit` - Limit number of results
- `offset` - Pagination offset

Response:
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "id": 1,
      "name": "Flawless Foundation",
      "name_ar": "كريم أساس خالي من العيوب",
      "category": "Foundation",
      "price": 48.00,
      "rating": 4.9,
      "colors": ["#FFE4E1", "#F5DEB3"],
      ...
    }
  ]
}
```

#### Get Product by ID
```
GET /api/products/:id
```

#### Get Products by Category
```
GET /api/products/category/:category
```

#### Create Product (Admin)
```
POST /api/products
Content-Type: application/json

{
  "name": "Product Name",
  "name_ar": "اسم المنتج",
  "description": "Product description",
  "category": "Category",
  "price": 45.00,
  "colors": ["#FF0000", "#00FF00"],
  "in_stock": true,
  "stock_quantity": 100
}
```

#### Update Product (Admin)
```
PUT /api/products/:id
Content-Type: application/json

{
  "price": 39.99,
  "stock_quantity": 150
}
```

#### Delete Product (Admin)
```
DELETE /api/products/:id
```

### Orders API

#### Get All Orders
```
GET /api/orders
```

Query Parameters:
- `status` - Filter by status
- `limit` - Limit number of results
- `offset` - Pagination offset

#### Get Order by ID
```
GET /api/orders/:id
```

#### Get Order by Order Number
```
GET /api/orders/number/:orderNumber
```

#### Create Order
```
POST /api/orders
Content-Type: application/json

{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+1234567890",
  "customer_address": "123 Main St",
  "customer_city": "New York",
  "customer_country": "USA",
  "items": [
    {
      "id": 1,
      "name": "Product Name",
      "price": 48.00,
      "quantity": 2
    }
  ],
  "subtotal": 96.00,
  "shipping": 0,
  "total": 96.00,
  "payment_method": "cash_on_delivery",
  "notes": "Please call before delivery"
}
```

Response:
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "order_number": "ORD-1234567890-123"
  }
}
```

#### Update Order Status (Admin)
```
PUT /api/orders/:id/status
Content-Type: application/json

{
  "status": "shipped"
}
```

Valid statuses: `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`

#### Get Order Statistics (Admin)
```
GET /api/orders/stats/summary
```

Response:
```json
{
  "success": true,
  "data": {
    "total_orders": 150,
    "total_revenue": 12500.00,
    "pending_orders": 25,
    "completed_orders": 100
  }
}
```

## Testing the API

### Using cURL

**Get all products:**
```bash
curl http://localhost:5000/api/products
```

**Get product by ID:**
```bash
curl http://localhost:5000/api/products/1
```

**Create an order:**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test User",
    "customer_email": "test@example.com",
    "customer_phone": "1234567890",
    "customer_address": "123 Test St",
    "items": [{"id": 1, "name": "Test Product", "price": 48.00, "quantity": 1}],
    "subtotal": 48.00,
    "total": 48.00
  }'
```

### Using Postman
1. Import the collection from `postman_collection.json` (if provided)
2. Set the base URL to `http://localhost:5000`
3. Test all endpoints

## Error Handling

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Connecting to Frontend

Update your Next.js frontend to use the API:

```typescript
// In your Next.js app
const API_URL = 'http://localhost:5000/api';

// Fetch products
const response = await fetch(`${API_URL}/products`);
const { data: products } = await response.json();

// Create order
const response = await fetch(`${API_URL}/orders`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData)
});
```

## Security Notes

⚠️ **Important for Production:**
1. Change the `JWT_SECRET` in `.env`
2. Use strong database passwords
3. Enable HTTPS
4. Implement rate limiting
5. Add authentication middleware for admin routes
6. Validate and sanitize all inputs
7. Use environment-specific CORS settings

## Troubleshooting

### Database Connection Failed
- Verify MySQL is running: `mysql -u root -p`
- Check credentials in `.env` file
- Ensure database port (3306) is not blocked

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using port 5000

### Cannot find module errors
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall

## Development

### Project Structure
```
backend/
├── config/
│   └── database.js          # Database configuration
├── routes/
│   ├── products.js          # Products API routes
│   └── orders.js            # Orders API routes
├── .env                     # Environment variables
├── .env.example             # Environment template
├── server.js                # Main server file
├── initDatabase.js          # Database initialization
├── package.json             # Dependencies
└── README.md                # This file
```

### Adding New Features
1. Create new route files in `routes/`
2. Import and use in `server.js`
3. Update this README with new endpoints

## License
MIT

## Support
For issues or questions, please open an issue on GitHub.
