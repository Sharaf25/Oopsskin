# Backend Debug - Issue Fixed ✅

## Problem
Backend crashed with nodemon showing:
```
[nodemon] app crashed - waiting for file changes before starting...
```

## Root Cause
Missing `axios` dependency in `node_modules` even though it was listed in `package.json`.

## Error Details
```
Error: Cannot find module 'axios'
Require stack:
- E:\VScode\webporject\backend\controllers\productControllers.js
- E:\VScode\webporject\backend\controllers\cartController.js
- E:\VScode\webporject\backend\routes\cartRoutes.js
- E:\VScode\webporject\backend\index.js
```

## Solution
Ran `npm install` in the backend directory to install all dependencies:

```powershell
cd backend
npm install
```

## Result
Backend now runs successfully on port 5000:

```
✅ Server running on port 5000
✅ Database connected
✅ Tables are synced
✅ Expired refresh tokens cleaned: 0
```

## How to Start Backend

### Method 1: Using npm script (with nodemon for auto-restart)
```powershell
cd backend
npm start
```

### Method 2: Using node directly
```powershell
cd backend
node index.js
```

### Method 3: From root directory
```powershell
Set-Location -Path "e:\VScode\webporject\backend"
node index.js
```

## Backend Status
- ✅ Server running on port 5000
- ✅ Database connected (MySQL)
- ✅ All tables synced with Sequelize
- ✅ CORS enabled for frontend
- ✅ All routes active:
  - `/api/auth` - Authentication
  - `/api/cart` - Shopping cart
  - `/api/orders` - Orders
  - `/api/admin/vouchers` - Vouchers
  - `/api/products` - Products (proxy to external API)

## Dependencies Installed
- ✅ axios (for external API calls)
- ✅ bcryptjs (password hashing)
- ✅ cookie-parser
- ✅ cors
- ✅ dotenv (environment variables)
- ✅ express
- ✅ jsonwebtoken (JWT auth)
- ✅ mysql2 (database driver)
- ✅ sequelize (ORM)
- ✅ node-cache (caching)

## Environment Variables (backend/.env)
Make sure you have these configured:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
PORT=5000
```

## Troubleshooting Tips

### If backend crashes again:
1. **Run directly with node** to see full error:
   ```powershell
   cd backend
   node index.js
   ```

2. **Check if MySQL is running**:
   - Verify MySQL service is active
   - Test connection with credentials in .env

3. **Reinstall dependencies**:
   ```powershell
   cd backend
   rm -r node_modules
   npm install
   ```

4. **Check for missing modules**:
   - Error will show "Cannot find module 'module-name'"
   - Install specifically: `npm install module-name`

5. **Verify all files exist**:
   - backend/models/index.js
   - backend/controllers/*.js
   - backend/routes/*.js
   - backend/.env

## Next Steps
Your backend is now running! Make sure:
- Frontend is configured to use `http://localhost:5000/api`
- Database credentials in `.env` are correct
- MySQL server is running

---
*Issue resolved on February 18, 2026*
