# oopsskin - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Getting Started](#getting-started)
4. [Authentication System](#authentication-system)
5. [Cart & Checkout System](#cart--checkout-system)
6. [Voucher System](#voucher-system)
7. [Admin Panel](#admin-panel)
8. [Multi-Language Support](#multi-language-support)
9. [API Endpoints](#api-endpoints)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**oopsskin** is a modern, full-stack e-commerce web application for beauty and skincare products built with Next.js and React.

### Features
- ✅ User authentication (register, login, logout)
- ✅ Product catalog with categories
- ✅ Shopping cart system
- ✅ Checkout with Cash on Delivery
- ✅ Voucher/discount code system
- ✅ Admin panel for managing products, orders, vouchers
- ✅ Multi-language support (English/Arabic)
- ✅ Responsive design with Tailwind CSS
- ✅ Static export compatible (no SSR dependencies)

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js with Express
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing

### Package Manager
- npm

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MySQL database server running
- npm or yarn package manager

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd webporject
```

#### 2. Install frontend dependencies
```bash
npm install
```

#### 3. Install backend dependencies
```bash
cd backend
npm install
```

#### 4. Configure environment variables
Create `backend/.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=huda_store
JWT_SECRET=your_super_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
```

#### 5. Start the backend server
```bash
cd backend
npm start
```
Backend runs on: `http://localhost:5000`

#### 6. Start the frontend development server
```bash
npm run dev
```
Frontend runs on: `http://localhost:3000`

---

## 🔐 Authentication System

### Overview
The authentication system uses JWT tokens stored in localStorage with backend API validation.

### Architecture
- **Context**: `src/app/context/AuthContext.tsx`
- **Backend Routes**: `backend/routes/authRoutes.js`
- **Backend Controller**: `backend/controllers/authController.js`

### API Endpoints

#### Register User
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

#### Login User
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "role": "user"
}
```

#### Get Current User
```http
GET http://localhost:5000/api/auth/current
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "role": "user"
}
```

### Frontend Implementation

```tsx
import { useAuth } from '@/app/context/AuthContext';

function MyComponent() {
  const { user, login, register, logout, isAuthenticated, loading } = useAuth();

  // Login
  const handleLogin = async () => {
    const result = await login('john@example.com', 'password123');
    if (result.success) {
      console.log('Login successful!');
    } else {
      console.error(result.error);
    }
  };

  // Register
  const handleRegister = async () => {
    const result = await register({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      password: 'password123'
    });
    if (result.success) {
      console.log('Registration successful!');
    } else {
      console.error(result.error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.name}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Protected Routes
Routes like `/cart` and `/admin` require authentication. Redirect logic is handled in the page components.

---

## 🛒 Cart & Checkout System

### Cart Context
Location: `src/app/context/CartContext.tsx`

### Features
- Add products to cart
- Update quantities
- Remove items
- Calculate totals with shipping
- Apply discount vouchers
- Persist cart in localStorage

### Usage Example

```tsx
import { useCart } from '@/app/context/CartContext';

function ProductPage() {
  const { addToCart, cart, getCartTotal } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: '1',
      name: 'Product Name',
      price: 29.99,
      category: 'Makeup',
      quantity: 1
    });
  };

  return (
    <div>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <p>Cart Total: ${getCartTotal()}</p>
    </div>
  );
}
```

### Checkout Flow
1. User adds items to cart
2. User must be authenticated to checkout
3. User applies voucher (optional)
4. User fills shipping information
5. Order is submitted via API
6. Cart is cleared on success

---

## 🎟️ Voucher System

### Features
- Percentage-based discounts (e.g., 10% off)
- Fixed amount discounts (e.g., $5 off)
- Minimum order requirements
- Maximum discount caps
- Usage limits
- Expiration dates
- Active/inactive status

### Voucher API Endpoints

#### Validate Voucher
```http
GET http://localhost:5000/api/vouchers/validate/WELCOME10
```

**Response:**
```json
{
  "success": true,
  "voucher": {
    "code": "WELCOME10",
    "discount_type": "percentage",
    "discount_value": 10,
    "min_order_amount": 50,
    "max_discount": 20,
    "status": "active"
  }
}
```

#### Apply Voucher (Increment Usage)
```http
POST http://localhost:5000/api/vouchers/apply/WELCOME10
```

### Frontend Implementation

```tsx
// Validate voucher
const response = await fetch(`http://localhost:5000/api/vouchers/validate/${code}`);
const data = await response.json();

if (data.success) {
  // Calculate discount
  let discount = 0;
  if (data.voucher.discount_type === 'percentage') {
    discount = subtotal * (data.voucher.discount_value / 100);
    if (data.voucher.max_discount && discount > data.voucher.max_discount) {
      discount = data.voucher.max_discount;
    }
  } else {
    discount = data.voucher.discount_value;
  }
  
  const total = subtotal - discount + shipping;
}
```

---

## 👨‍💼 Admin Panel

### Access
URL: `http://localhost:3000/admin`

**Note**: Currently requires authentication but does not check for admin role. Add role-based access control as needed.

### Features
- **Dashboard**: View statistics and recent orders
- **Products**: Manage product catalog (view, edit, delete)
- **Orders**: View and manage customer orders
- **Vouchers**: Create and manage discount codes
- **Customers**: View customer information
- **Settings**: Configure store settings

### Admin Routes
- `/admin` - Dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/vouchers` - Voucher management
- `/admin/customers` - Customer management
- `/admin/settings` - Settings

---

## 🌍 Multi-Language Support

### Supported Languages
- English (en)
- Arabic (ar)

### Language Context
Location: `src/app/context/LanguageContext.tsx`

### Usage

```tsx
import { useLanguage } from '@/app/context/LanguageContext';

function MyComponent() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div>
      <p>{t('welcome')}</p>
      <button onClick={toggleLanguage}>
        Switch to {language === 'en' ? 'Arabic' : 'English'}
      </button>
    </div>
  );
}
```

### Adding Translations
Edit `src/app/context/LanguageContext.tsx` and add to the `translations` object:

```tsx
const translations = {
  en: {
    welcome: 'Welcome',
    // ... more translations
  },
  ar: {
    welcome: 'أهلا بك',
    // ... more translations
  }
};
```

---

## 📡 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/current` - Get current authenticated user
- `POST /api/auth/logout` - Logout user (invalidate token)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/stats/summary` - Get order statistics

### Vouchers
- `GET /api/vouchers` - Get all vouchers
- `GET /api/vouchers/:id` - Get voucher by ID
- `POST /api/vouchers` - Create new voucher
- `PUT /api/vouchers/:id` - Update voucher
- `DELETE /api/vouchers/:id` - Delete voucher
- `GET /api/vouchers/validate/:code` - Validate voucher code
- `POST /api/vouchers/apply/:code` - Apply voucher (increment usage)
- `PATCH /api/vouchers/:id/toggle` - Toggle voucher active status
- `GET /api/vouchers/stats/summary` - Get voucher statistics

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

---

## 🚢 Deployment

### Frontend Deployment (Static Export)

#### 1. Build the project
```bash
npm run build
```

#### 2. Export static files
```bash
npm run export
```

#### 3. Deploy the `out/` folder
Upload the contents of the `out/` folder to your hosting provider (cPanel, Netlify, Vercel, etc.).

### Backend Deployment (cPanel)

#### 1. Prepare the backend
```bash
cd backend
npm install --production
```

#### 2. Upload files to cPanel
- Upload backend folder via File Manager or FTP
- Create `.env` file with production values

#### 3. Setup Node.js App in cPanel
- Go to "Setup Node.js App"
- Select Node.js version
- Set application root to backend folder
- Set startup file to `index.js`
- Click "Create"

#### 4. Setup MySQL Database
- Create database in cPanel
- Create database user
- Grant all privileges
- Update `.env` with production database credentials

#### 5. Start the application
Click "Start" in the Node.js App interface.

### Environment Variables (Production)
```env
DB_HOST=localhost
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=your_production_db_name
JWT_SECRET=generate_a_strong_random_secret
JWT_REFRESH_SECRET=generate_another_strong_random_secret
PORT=5000
```

---

## 🔧 Troubleshooting

### CORS Issues

**Problem**: Network errors when calling backend API from frontend

**Solution**: Ensure backend CORS is configured correctly in `backend/index.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

For production, update origin to your production frontend URL.

### Authentication Not Working

**Checklist**:
1. ✅ Backend server running on port 5000
2. ✅ Frontend using correct API URL (`http://localhost:5000/api/auth`)
3. ✅ CORS configured properly
4. ✅ JWT tokens stored in localStorage
5. ✅ Authorization header format: `Bearer <token>`

**Debug**:
```javascript
// Check token in browser console
console.log(localStorage.getItem('authToken'));

// Check API response
console.log('API Response:', await fetch('http://localhost:5000/api/auth/current', {
  headers: { 'Authorization': localStorage.getItem('authToken') }
}).then(r => r.json()));
```

### Database Connection Issues

**Problem**: Backend can't connect to MySQL

**Solution**:
1. Verify MySQL is running
2. Check credentials in `.env`
3. Ensure database exists
4. Grant proper user privileges

```sql
CREATE DATABASE huda_store;
CREATE USER 'your_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON huda_store.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

### Port Already in Use

**Problem**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```powershell
# Windows - Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in backend/index.js
app.listen(5001, () => {
  console.log('Server running on port 5001');
});
```

### Build Errors

**Problem**: Build fails with module not found errors

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run build
```

---

## 📝 Project Structure

```
webporject/
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   └── authController.js  # Authentication logic
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification
│   ├── models/
│   │   ├── User.js
│   │   ├── RefreshToken.js
│   │   └── InvalidToken.js
│   ├── routes/
│   │   └── authRoutes.js      # API routes
│   ├── utils/
│   │   └── cleanExpiredTokens.js
│   ├── .env                    # Environment variables
│   ├── index.js                # Main server file
│   └── package.json
├── src/
│   └── app/
│       ├── admin/              # Admin panel pages
│       ├── components/         # Reusable components
│       │   ├── Navbar.tsx
│       │   ├── Footer.tsx
│       │   ├── HeroSection.tsx
│       │   └── ...
│       ├── context/            # React Context providers
│       │   ├── AuthContext.tsx
│       │   ├── CartContext.tsx
│       │   └── LanguageContext.tsx
│       ├── cart/
│       │   └── page.tsx
│       ├── login/
│       │   └── page.tsx
│       ├── register/
│       │   └── page.tsx
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx            # Home page
├── public/                     # Static assets
├── .gitignore
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── PROJECT_DOCUMENTATION.md    # This file
```

---

## 🎓 Best Practices

### Security
- ✅ Always use HTTPS in production
- ✅ Store JWT secret in environment variables
- ✅ Hash passwords with bcrypt
- ✅ Validate and sanitize all user inputs
- ✅ Implement rate limiting for API endpoints
- ✅ Use CORS properly

### Code Organization
- ✅ Use TypeScript for type safety
- ✅ Keep components small and focused
- ✅ Use Context API for global state
- ✅ Follow Next.js App Router conventions
- ✅ Use meaningful variable and function names

### Performance
- ✅ Use static export for better performance
- ✅ Optimize images with next/image (when not using static export)
- ✅ Minimize bundle size
- ✅ Use lazy loading where appropriate
- ✅ Cache API responses when possible

---

## 📞 Support & Contact

For issues, questions, or contributions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

---

## 📄 License

[Your License Here]

---

**Last Updated**: February 2026
**Version**: 1.0.0
