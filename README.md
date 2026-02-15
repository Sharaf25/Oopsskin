# oopsskin - Beauty & Skincare E-Commerce

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-38B2AC?style=for-the-badge&logo=tailwind-css)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-8+-orange?style=for-the-badge&logo=mysql)

A modern, full-stack e-commerce platform for beauty and skincare products

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Tech Stack](#-tech-stack)

</div>

---

## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based authentication with register/login
- 🛒 **Shopping Cart** - Full-featured cart with quantity management
- 💳 **Checkout System** - Cash on Delivery payment option
- 🎟️ **Voucher System** - Discount codes with percentage and fixed amounts
- 👨‍💼 **Admin Panel** - Manage products, orders, vouchers, and customers
- 🌍 **Multi-Language** - English and Arabic support
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- ⚡ **Static Export** - Can be deployed as static site

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd webporject
```

2. **Install dependencies**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

3. **Configure environment**
Create `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=huda_store
JWT_SECRET=your_super_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
```

4. **Start the servers**
```bash
# Terminal 1 - Backend (port 5000)
cd backend
npm start

# Terminal 2 - Frontend (port 3000)
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📚 Documentation

For complete documentation, see [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)

**Quick Links:**
- [Authentication Guide](PROJECT_DOCUMENTATION.md#-authentication-system)
- [Cart System](PROJECT_DOCUMENTATION.md#-cart--checkout-system)
- [Voucher System](PROJECT_DOCUMENTATION.md#-voucher-system)
- [Admin Panel](PROJECT_DOCUMENTATION.md#-admin-panel)
- [API Reference](PROJECT_DOCUMENTATION.md#-api-endpoints-reference)
- [Deployment Guide](PROJECT_DOCUMENTATION.md#-deployment)
- [Troubleshooting](PROJECT_DOCUMENTATION.md#-troubleshooting)

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State:** React Context API

### Backend
- **Runtime:** Node.js with Express
- **Database:** MySQL with Sequelize ORM
- **Auth:** JWT (JSON Web Tokens)
- **Security:** bcrypt

---

## 📁 Project Structure

```
webporject/
├── backend/              # Backend API server
│   ├── controllers/      # Business logic
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── index.js         # Server entry point
├── src/
│   └── app/
│       ├── admin/       # Admin panel pages
│       ├── components/  # React components
│       ├── context/     # Global state (Auth, Cart, Language)
│       └── ...          # Other pages
├── public/              # Static assets
└── PROJECT_DOCUMENTATION.md  # Full documentation
```

---

## 🔑 Key Features Explained

### Authentication
- JWT-based authentication
- Secure password hashing with bcrypt
- Token refresh mechanism
- Protected routes

### Shopping Cart
- Add/remove products
- Update quantities
- Apply discount vouchers
- Calculate totals with shipping
- Persistent cart (localStorage)

### Voucher System
- Percentage or fixed discounts
- Minimum order requirements
- Maximum discount caps
- Usage limits and expiration
- Admin management interface

### Admin Panel
- Dashboard with statistics
- Product management (CRUD)
- Order management
- Voucher management
- Customer overview

---

## 🌐 API Endpoints

### Authentication
```
POST   /api/auth/register    Register new user
POST   /api/auth/login       Login user
GET    /api/auth/current     Get current user
POST   /api/auth/logout      Logout user
```

### Orders
```
POST   /api/orders           Create order
GET    /api/orders           Get all orders
GET    /api/orders/:id       Get order by ID
PUT    /api/orders/:id/status Update order status
```

### Vouchers
```
GET    /api/vouchers/validate/:code  Validate voucher
POST   /api/vouchers/apply/:code     Apply voucher
GET    /api/vouchers                 Get all vouchers
POST   /api/vouchers                 Create voucher
```

For complete API documentation, see [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md#-api-endpoints-reference)

---

## 🚢 Deployment

### Quick Deploy

**Frontend (Static Export):**
```bash
npm run build
npm run export
# Upload 'out/' folder to hosting
```

**Backend (Node.js):**
```bash
cd backend
npm install --production
# Configure production environment
npm start
```

See [Deployment Guide](PROJECT_DOCUMENTATION.md#-deployment) for detailed instructions.

---

## 🔧 Troubleshooting

### Common Issues

**CORS Errors?**
- Check backend CORS configuration in `backend/index.js`
- Ensure frontend URL is allowed

**Authentication Not Working?**
- Verify backend is running on port 5000
- Check JWT tokens in localStorage
- Verify API URL in AuthContext

**Database Connection Failed?**
- Check MySQL is running
- Verify `.env` credentials
- Ensure database exists

See [Troubleshooting Guide](PROJECT_DOCUMENTATION.md#-troubleshooting) for more solutions.

---

## 📝 Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run export       # Export static site
npm run lint         # Run ESLint

# Backend
cd backend
npm start            # Start server with nodemon
npm run prod         # Start production server
```

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

[Your License Here]

---

## 📞 Support

Need help? Check out:
- [Full Documentation](PROJECT_DOCUMENTATION.md)
- [Troubleshooting Guide](PROJECT_DOCUMENTATION.md#-troubleshooting)
- Create an issue in the repository

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

</div>
