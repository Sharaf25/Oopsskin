# Oopsskin E-Commerce Platform

A modern, full-stack e-commerce platform for beauty and cosmetics products built with Next.js, React, and Node.js.

## 🚀 Features

### Frontend
- **Modern UI/UX** with Tailwind CSS and smooth animations
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Product Catalog** with advanced filtering and search
- **Shopping Cart** with persistent state and voucher support
- **User Authentication** - Secure login, registration, and profile management
- **Multi-language Support** - English and Arabic (RTL)
- **Animated Components** - Smooth transitions and micro-interactions
- **Admin Panel** - Comprehensive role-based access control

### Backend
- **RESTful API** with Express.js
- **MySQL Database** with Sequelize ORM
- **JWT Authentication** with secure refresh tokens
- **Role-based Authorization** (User/Admin)
- **Order Management** system with status tracking
- **Voucher/Discount** system with validation
- **Product Management** with categories
- **Cart & Checkout** functionality

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn package manager

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd webporject
```

### 2. Install dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
cd ..
```

### 3. Environment Setup

Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Create `.env` in the `backend` directory:
```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=oopsskin_db
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_REFRESH_SECRET=your_secure_refresh_secret_key_here
```

### 4. Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE oopsskin_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. The tables will be automatically created by Sequelize on first run

3. (Optional) Create an admin user:
```sql
USE oopsskin_db;
-- First register a user through the app, then run:
UPDATE users SET role = 'admin' WHERE email = 'your-admin@email.com';
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Backend API will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend will run on `http://localhost:3000`

### Production Build

**Frontend:**
```bash
npm run build
npm start
```

**Backend (with PM2):**
```bash
cd backend
npm install -g pm2
pm2 start index.js --name oopsskin-api
pm2 save
```

## 📁 Project Structure

```
webporject/
├── backend/                    # Backend API
│   ├── config/                # Database & app configuration
│   │   └── db.js             # Sequelize connection
│   ├── controllers/           # Business logic controllers
│   │   ├── authController.js # Authentication logic
│   │   ├── productControllers.js
│   │   ├── orderController.js
│   │   ├── cartController.js
│   │   └── voucherController.js
│   ├── middleware/            # Custom middleware
│   │   └── authMiddleware.js # JWT verification
│   ├── models/                # Sequelize models
│   │   ├── User.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Voucher.js
│   │   └── index.js          # Model associations
│   ├── routes/                # API route definitions
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── cartRoutes.js
│   │   └── voucherRoutes.js
│   ├── utils/                 # Utility functions
│   │   ├── cache.js
│   │   └── cleanExpiredTokens.js
│   ├── index.js               # Server entry point
│   └── package.json
├── src/
│   ├── app/
│   │   ├── admin/             # Admin panel (protected)
│   │   │   ├── layout.tsx    # Admin layout with sidebar
│   │   │   ├── page.tsx      # Dashboard
│   │   │   ├── orders/       # Order management
│   │   │   ├── customers/    # Customer management
│   │   │   ├── vouchers/     # Voucher management
│   │   │   └── settings/     # Settings & slider
│   │   ├── components/        # Reusable React components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ProductCarousel.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   └── AdminProtected.tsx
│   │   ├── context/           # React Context providers
│   │   │   ├── AuthContext.tsx
│   │   │   ├── CartContext.tsx
│   │   │   └── LanguageContext.tsx
│   │   ├── hooks/             # Custom React hooks
│   │   │   └── useAdminAuth.ts
│   │   ├── [pages]/           # Next.js app router pages
│   │   │   ├── page.tsx      # Homepage
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── cart/
│   │   │   ├── product/[id]/
│   │   │   └── ...
│   │   ├── globals.css        # Global styles & animations
│   │   └── layout.tsx         # Root layout
│   └── config/
│       └── api.ts             # **Global API configuration**
├── public/                     # Static assets
├── .env.local                 # Frontend environment variables
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🔐 Authentication & Authorization

### User Roles
- **user** - Regular customers (default role)
- **admin** - Full admin panel access

### Admin Access Setup

1. Register a user through the application
2. Update the database to grant admin role:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

3. Login with the admin account
4. Access admin panel at `/admin`

### Protected Routes
- `/admin/*` - All admin routes require admin role
- Automatic redirects for unauthorized access
- JWT token validation on all protected endpoints

## 🎨 Key Features Detail

### Product Carousel
- Auto-looping smooth animation
- Always shows 4 full cards
- Responsive on all devices
- Hover pause functionality

### Search & Filter
- Real-time product search
- Category-based filtering
- Multi-language search support
- Smart product suggestions

### Shopping Cart
- Add/remove products
- Quantity adjustment
- Persistent cart state (localStorage)
- Voucher/discount code application
- Real-time price calculations

### Admin Panel
- **Dashboard**: Statistics and recent orders
- **Orders**: Full order management with status updates
- **Customers**: Customer list and details
- **Vouchers**: Create and manage discount codes
- **Settings**: Homepage slider management

### Multi-language Support
- English and Arabic
- RTL (Right-to-Left) support for Arabic
- Language toggle in navbar
- Persistent language preference

## 🌐 API Endpoints

All API endpoints are centralized in `src/config/api.ts`

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout (invalidates token)
- `GET /api/auth/current` - Get current authenticated user
- `POST /api/auth/refresh` - Refresh access token

### Products
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/:id` - Get single product details
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `GET /api/orders` - Get user orders (or all for admin)
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (admin only)
- `GET /api/orders/stats/summary` - Order statistics (admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add product to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:id` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Vouchers
- `GET /api/vouchers` - Get all vouchers (admin only)
- `POST /api/vouchers` - Create voucher (admin only)
- `POST /api/vouchers/validate` - Validate voucher code
- `GET /api/vouchers/stats/summary` - Voucher statistics (admin only)

## 🎨 Styling & Theming

- **CSS Framework:** Tailwind CSS v3
- **Primary Color:** Pink-500 (#EC4899)
- **Secondary Color:** Purple-500 (#8B5CF6)
- **Icon Library:** Lucide React
- **Animations:** Custom CSS keyframes + Tailwind animations
- **Fonts:** System font stack for optimal performance

## 🔧 Configuration Files

### Global API Configuration (`src/config/api.ts`)

Centralized configuration for all API endpoints and constants:

```typescript
import { API_ENDPOINTS, APP_CONSTANTS } from '@/config/api';

// Use in components
const response = await fetch(API_ENDPOINTS.PRODUCTS.BASE);
const token = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN);
```

**Benefits:**
- Single source of truth for API URLs
- Easy to update for production deployment
- Type-safe endpoints with TypeScript
- Consistent constant usage across the app

### Environment Variables

**Frontend (`.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Backend (`.env`):**
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=oopsskin_db
JWT_SECRET=your_very_secure_secret_key
JWT_REFRESH_SECRET=your_refresh_token_secret
```

## 📦 Deployment

### Frontend (Vercel/Netlify)

1. Build the project:
   ```bash
   npm run build
   ```

2. Set environment variables in your hosting platform:
   ```
   NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
   ```

3. Deploy:
   ```bash
   vercel deploy --prod
   # or
   netlify deploy --prod
   ```

### Frontend (cPanel)

1. Build for production:
   ```bash
   npm run build
   ```

2. Upload files to server (or use Git)

3. Setup Node.js app in cPanel:
   - Application root: `/home/username/public_html`
   - Application URL: `yourdomain.com`
   - Application startup file: `.next/standalone/server.js`
   - Node.js version: 16.x or higher

4. Set environment variables in cPanel

5. Start the application

### Backend (VPS/Dedicated Server)

1. Install dependencies:
   ```bash
   cd backend
   npm install --production
   ```

2. Setup PM2:
   ```bash
   npm install -g pm2
   pm2 start index.js --name oopsskin-api
   pm2 startup
   pm2 save
   ```

3. Setup Nginx reverse proxy (recommended):
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. Setup SSL with Let's Encrypt:
   ```bash
   sudo certbot --nginx -d api.yourdomain.com
   ```

### Backend (cPanel)

1. Upload backend files

2. Setup Node.js app in cPanel:
   - Application root: `/home/username/api`
   - Application URL: `api.yourdomain.com`
   - Application startup file: `index.js`

3. Set environment variables

4. Start application

## 🐛 Troubleshooting

### Backend Connection Issues
**Problem:** Frontend can't connect to backend

**Solutions:**
- ✅ Verify backend is running: `curl http://localhost:5000/api/products`
- ✅ Check `NEXT_PUBLIC_API_URL` in `.env.local`
- ✅ Ensure CORS is configured in backend
- ✅ Check firewall settings

### Authentication Issues
**Problem:** Login fails or user gets logged out

**Solutions:**
- ✅ Clear browser localStorage and cookies
- ✅ Verify JWT secret is set in backend `.env`
- ✅ Check token expiration settings
- ✅ Ensure backend `/auth/current` endpoint works

### Database Connection Issues
**Problem:** Backend can't connect to MySQL

**Solutions:**
- ✅ Verify MySQL service is running
- ✅ Check credentials in `backend/.env`
- ✅ Ensure database exists: `CREATE DATABASE oopsskin_db;`
- ✅ Check MySQL user permissions

### Build Errors
**Problem:** `npm run build` fails

**Solutions:**
- ✅ Delete `.next` folder and node_modules
- ✅ Run `npm install` again
- ✅ Check for TypeScript errors: `npm run type-check`
- ✅ Clear cache: `npm cache clean --force`

### Admin Access Issues
**Problem:** Can't access /admin even after setting role

**Solutions:**
- ✅ Verify role in database: `SELECT role FROM users WHERE id = X;`
- ✅ Logout and login again to refresh token
- ✅ Check browser console for errors
- ✅ Verify backend returns `role` field in auth response

## 🔄 Code Quality & Best Practices

### Clean Code Features
✅ **Centralized Configuration** - All API endpoints and constants in one file  
✅ **Type Safety** - Full TypeScript support  
✅ **Error Handling** - Comprehensive try-catch blocks  
✅ **Code Reusability** - Custom hooks and reusable components  
✅ **Consistent Naming** - Clear, descriptive variable names  
✅ **Comments** - Documented complex logic  
✅ **Security** - JWT authentication, role-based access  

### Performance Optimizations
✅ **Code Splitting** - Next.js automatic code splitting  
✅ **Image Optimization** - Next.js Image component  
✅ **Lazy Loading** - Dynamic imports for heavy components  
✅ **Caching** - Browser caching for static assets  
✅ **Minification** - Production builds are minified  

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards
- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test before committing
- Update documentation if needed

## 📝 License

This project is proprietary software. All rights reserved.

## 👥 Support & Contact

For support or inquiries:
- **Email:** support@oopsskin.com
- **Website:** https://oopsskin.com

## 🔄 Version History

**Version 1.0.0** (Current)
- ✅ Complete e-commerce functionality
- ✅ Admin panel with role-based access
- ✅ Multi-language support (EN/AR)
- ✅ Order management system
- ✅ Voucher/discount system
- ✅ Secure authentication with JWT
- ✅ Responsive design
- ✅ Centralized API configuration
- ✅ Production-ready codebase

## 🎯 Future Enhancements

- [ ] Email notifications for orders
- [ ] Product reviews and ratings
- [ ] Advanced analytics dashboard
- [ ] Multi-currency support
- [ ] Wishlist functionality
- [ ] Social media integration
- [ ] Mobile app (React Native)

---

**Built with ❤️ using Next.js 14, React 18, Node.js, Express, and MySQL**

*Last Updated: February 2026*

