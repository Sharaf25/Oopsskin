# Oopsskin E-Commerce - Complete Setup Guide

## 🎉 What's New: Voucher System

The voucher/coupon system is now fully integrated into the application! Users can apply discount codes during checkout, and administrators can manage vouchers through the admin panel.

## System Overview

This is a full-featured beauty e-commerce web application with:
- **Frontend**: Next.js 15+ with React, TypeScript, and Tailwind CSS
- **Backend**: Node.js with Express and MySQL
- **Features**: 
  - Product catalog with categories
  - Shopping cart system
  - User authentication
  - Bilingual support (English/Arabic)
  - Order management
  - **NEW: Voucher/Coupon system**
  - Admin panel

## Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with your MySQL credentials
# Copy from .env.example and update values

# Initialize database (creates tables and sample data)
npm run init-db

# Start the server
npm start
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## Voucher System Features

### For Customers
1. **Browse Products**: Add items to cart
2. **Apply Voucher**: Enter voucher code in cart page
3. **Get Discount**: Receive instant discount calculation
4. **Checkout**: Complete purchase with applied discount

### Sample Voucher Codes
Try these pre-configured codes:
- `WELCOME10` - 10% off orders over $50
- `SAVE20` - 20% off orders over $100 (max $50 discount)
- `FREESHIP` - $10 off orders over $30
- `VIP30` - 30% off orders over $200 (max $100 discount)
- `FIRSTORDER` - 15% off any order

### For Administrators
1. **Manage Vouchers**: `/admin/vouchers`
2. **Create New**: Add vouchers with custom settings
3. **Edit Existing**: Update voucher details
4. **Track Usage**: Monitor voucher statistics
5. **Toggle Status**: Activate/deactivate vouchers
6. **View Analytics**: See total usage and performance

## Complete Documentation

### System Guides
- 📖 **[Authentication Guide](AUTHENTICATION_GUIDE.md)** - User auth system
- 🛒 **[Cart System Guide](CART_SYSTEM_GUIDE.md)** - Shopping cart features
- 🌐 **[Language System Guide](LANGUAGE_SYSTEM_GUIDE.md)** - Bilingual support
- 🎫 **[Voucher System Guide](VOUCHER_SYSTEM_GUIDE.md)** - NEW: Complete voucher documentation
- 👤 **[Admin Panel Guide](ADMIN_PANEL_GUIDE.md)** - Admin features

## Project Structure

```
oopsskin/
├── backend/                    # Node.js/Express API
│   ├── config/                # Database configuration
│   ├── routes/                # API routes
│   │   ├── products.js       # Product endpoints
│   │   ├── orders.js         # Order endpoints
│   │   └── vouchers.js       # NEW: Voucher endpoints
│   ├── server.js             # Main server file
│   ├── initDatabase.js       # Database initialization
│   └── package.json
│
├── src/
│   └── app/
│       ├── components/        # Reusable components
│       ├── context/          # React contexts
│       │   ├── AuthContext.tsx
│       │   ├── CartContext.tsx
│       │   └── LanguageContext.tsx
│       ├── admin/            # Admin panel
│       │   ├── vouchers/     # NEW: Voucher management
│       │   ├── products/
│       │   ├── orders/
│       │   └── customers/
│       ├── cart/             # NEW: Updated with voucher integration
│       ├── login/
│       ├── register/
│       └── [other pages]/
│
└── [documentation files]
```

## Key Features

### 🛍️ E-Commerce Features
- Product catalog with filtering and search
- Category-based navigation
- Shopping cart with quantity management
- Cash on delivery checkout
- Order tracking and management

### 🎫 Voucher System (NEW!)
- **Discount Types**: Percentage or fixed amount
- **Restrictions**: Minimum order amount, maximum discount
- **Usage Limits**: Set total usage limits per voucher
- **Expiration**: Set validity dates
- **Real-time Validation**: Instant feedback on voucher application
- **Usage Tracking**: Monitor how many times each voucher is used
- **Admin Management**: Full CRUD operations in admin panel

### 🔐 Authentication
- User registration and login
- Protected routes
- Session management
- Demo account for testing

### 🌐 Internationalization
- English and Arabic languages
- RTL support for Arabic
- Language switcher in navbar
- Translated content throughout

### 📊 Admin Panel
- Product management
- Order management
- Customer management
- **Voucher management** (NEW!)
- Statistics and analytics

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order
- `GET /api/orders/stats/summary` - Get statistics

### Vouchers (NEW!)
- `GET /api/vouchers` - Get all vouchers
- `GET /api/vouchers/:id` - Get voucher by ID
- `GET /api/vouchers/validate/:code` - Validate voucher code
- `POST /api/vouchers` - Create voucher
- `POST /api/vouchers/apply/:code` - Apply voucher (increment usage)
- `PUT /api/vouchers/:id` - Update voucher
- `PATCH /api/vouchers/:id/toggle` - Toggle voucher status
- `DELETE /api/vouchers/:id` - Delete voucher
- `GET /api/vouchers/stats/summary` - Get statistics

## Testing the Voucher System

### 1. Customer Flow
```bash
# Start both servers
cd backend && npm start
cd .. && npm run dev
```

1. Open browser to `http://localhost:3000`
2. Register/login to your account
3. Add products to cart
4. Go to cart page
5. Enter voucher code: `WELCOME10`
6. Click "Apply"
7. See discount applied to order total
8. Proceed to checkout
9. Complete order

### 2. Admin Flow
1. Navigate to `http://localhost:3000/admin/vouchers`
2. View list of all vouchers
3. See usage statistics
4. Create a new voucher
5. Edit existing voucher
6. Toggle voucher status
7. Delete test voucher

## Database Schema

### Vouchers Table (NEW!)
```sql
CREATE TABLE vouchers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type ENUM('percentage', 'fixed'),
  discount_value DECIMAL(10, 2),
  min_order_amount DECIMAL(10, 2),
  max_discount DECIMAL(10, 2),
  usage_limit INT,
  used_count INT DEFAULT 0,
  valid_from DATETIME,
  valid_until DATETIME,
  status ENUM('active', 'inactive'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Development

### Adding New Features
1. Backend: Add routes in `backend/routes/`
2. Frontend: Create pages in `src/app/`
3. Update documentation in markdown files

### Testing
- Test API endpoints using Postman or curl
- Test frontend features in browser
- Check mobile responsiveness
- Test both English and Arabic languages
- Test voucher validation and application

## Troubleshooting

### Backend Issues
- **MySQL connection failed**: Check credentials in `.env`
- **Tables not found**: Run `npm run init-db`
- **Port already in use**: Change PORT in `.env`

### Frontend Issues
- **API calls failing**: Ensure backend is running
- **Cart not updating**: Check browser console for errors
- **Voucher not applying**: Verify voucher code and requirements

### Voucher Issues
- **Invalid voucher**: Check code spelling, expiration, and status
- **Minimum order not met**: Add more items to cart
- **Usage limit reached**: Voucher has been used maximum times
- **Voucher expired**: Check valid_until date

## Production Deployment

See [CPANEL_DEPLOYMENT.md](CPANEL_DEPLOYMENT.md) for deployment instructions.

## Environment Variables

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=oopsskin_db
FRONTEND_URL=http://localhost:3000
```

### Frontend
Update API URLs in production:
- Change `http://localhost:5000` to your production API URL
- Update in all fetch calls

## Support & Resources

### Documentation Files
- `README.md` - This file (main guide)
- `VOUCHER_SYSTEM_GUIDE.md` - Complete voucher documentation
- `AUTHENTICATION_GUIDE.md` - Auth system details
- `CART_SYSTEM_GUIDE.md` - Shopping cart details
- `LANGUAGE_SYSTEM_GUIDE.md` - Translation system
- `ADMIN_PANEL_GUIDE.md` - Admin features
- `CPANEL_DEPLOYMENT.md` - Deployment guide

### Code Locations
- Backend vouchers: `backend/routes/vouchers.js`
- Frontend cart: `src/app/cart/page.tsx`
- Admin vouchers: `src/app/admin/vouchers/page.tsx`
- Database init: `backend/initDatabase.js`

## Next Steps

1. ✅ Voucher system is complete and ready to use
2. Test all voucher features thoroughly
3. Create additional vouchers for promotions
4. Monitor voucher usage through admin panel
5. Consider additional features:
   - Email voucher codes to customers
   - Automatic voucher suggestions
   - Category-specific vouchers
   - User-specific vouchers
   - Referral program

## License

This project is for educational and commercial use.

## Contact

For questions or support, refer to the documentation files or check the code comments.

---

**Oopsskin E-Commerce** - A modern beauty products online store with full voucher support! 🎉
