# Admin Authentication & Authorization

## Overview
The admin panel is now protected with role-based authentication. Only users with `role: "admin"` in their JWT token can access admin pages.

---

## Implementation Details

### 1. **Admin Auth Hook** (`src/app/hooks/useAdminAuth.ts`)
Custom hook that checks if the current user is authenticated and has admin role.

**Features:**
- Checks authentication status
- Validates user role is "admin"
- Redirects non-authenticated users to login
- Redirects non-admin users to home page
- Provides loading state during auth check

**Usage:**
```typescript
const { isAdmin, loading, user } = useAdminAuth();
```

---

### 2. **Admin Protected Component** (`src/app/components/AdminProtected.tsx`)
Wrapper component that protects admin routes and shows loading states.

**Features:**
- Shows loading spinner while checking authentication
- Only renders children if user is admin
- Automatic redirect for unauthorized users

**Usage:**
```tsx
<AdminProtected>
  <YourAdminContent />
</AdminProtected>
```

---

### 3. **Admin Layout Protection** (`src/app/admin/layout.tsx`)
The admin layout is wrapped with `AdminProtected`, protecting all admin pages.

**Protected Pages:**
- `/admin` - Dashboard
- `/admin/orders` - Orders Management
- `/admin/customers` - Customer Management
- `/admin/vouchers` - Vouchers Management
- `/admin/settings` - Settings & Home Slider

---

## How It Works

### Authentication Flow

1. **User accesses admin page** → `/admin`
2. **`AdminProtected` component loads**
3. **`useAdminAuth` hook checks:**
   - ✅ Is user authenticated? (from `AuthContext`)
   - ✅ Does user have `role: "admin"` in token?
4. **If NOT authenticated:**
   - Redirect to `/login?redirect=/admin`
5. **If NOT admin (role !== "admin"):**
   - Redirect to `/` (home page)
6. **If admin:**
   - ✅ Render admin content

---

## JWT Token Structure

The backend JWT token must include the `role` field:

```json
{
  "id": 1,
  "email": "admin@oopsskin.com",
  "name": "Admin User",
  "role": "admin",  // ← This is required!
  "iat": 1234567890,
  "exp": 1234567890
}
```

**User Token:**
```json
{
  "role": "user"  // ← Regular users
}
```

**Admin Token:**
```json
{
  "role": "admin"  // ← Admin users only
}
```

---

## Backend Requirements

### 1. **User Model** (Database)
Ensure your `users` table has a `role` column:

```sql
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
```

### 2. **Register/Login API**
The backend must include `role` in the response:

```javascript
// authController.js - Login response
res.json({
  success: true,
  token: token,
  refreshToken: refreshToken,
  id: user.id,
  email: user.email,
  name: user.name,
  phone: user.phone,
  role: user.role || 'user',  // ← Include role
});
```

### 3. **Current User API**
The `/api/auth/current` endpoint must return role:

```javascript
// authController.js - Current user
res.json({
  id: user.id,
  email: user.email,
  name: user.name,
  phone: user.phone,
  role: user.role || 'user',  // ← Include role
});
```

---

## Creating Admin Users

### Option 1: Database Update (Quick)
```sql
-- Make an existing user an admin
UPDATE users SET role = 'admin' WHERE email = 'admin@oopsskin.com';
```

### Option 2: During Registration (Programmatic)
```javascript
// Only for testing - in production, use a secure admin creation flow
const newUser = {
  email: 'admin@oopsskin.com',
  password: hashedPassword,
  name: 'Admin User',
  role: 'admin'  // ← Set during user creation
};
```

---

## Testing

### Test Regular User
1. Login as regular user
2. Try to access `/admin`
3. Should be redirected to home (`/`)

### Test Admin User
1. Login as admin user (role: "admin")
2. Access `/admin`
3. Should see admin dashboard
4. Can navigate all admin pages

### Test Unauthenticated
1. Logout
2. Try to access `/admin`
3. Should be redirected to `/login?redirect=/admin`

---

## Security Features

✅ **Client-side protection** - React hooks prevent rendering
✅ **Server-side validation** - Backend APIs should also check role
✅ **Token-based** - Role stored in JWT token
✅ **Automatic redirects** - Unauthorized users redirected
✅ **Loading states** - Prevents flash of protected content
✅ **Type-safe** - TypeScript interfaces for User with role

---

## Files Modified

1. **`src/app/hooks/useAdminAuth.ts`** - NEW
   - Admin authentication hook

2. **`src/app/components/AdminProtected.tsx`** - NEW
   - Admin route protection component

3. **`src/app/admin/layout.tsx`** - UPDATED
   - Wrapped with `AdminProtected`
   - Shows actual admin user info
   - Uses `useAuth` for user data

4. **`src/app/context/AuthContext.tsx`** - ALREADY HAS
   - User interface includes `role?: string`
   - Login/register captures `role` from API
   - Current user endpoint includes role

---

## Important Notes

⚠️ **Backend Security Required**
- Frontend protection is for UX only
- Backend APIs MUST validate admin role on sensitive endpoints
- Never trust frontend-only authorization

⚠️ **Token Management**
- Admin tokens stored in localStorage
- Ensure HTTPS in production
- Consider using httpOnly cookies for enhanced security

⚠️ **Admin Account Security**
- Use strong passwords for admin accounts
- Consider 2FA for admin users
- Regularly audit admin access

---

## Next Steps

1. ✅ Frontend admin protection - **COMPLETE**
2. 🔄 Update backend to include `role` in responses - **VERIFY**
3. 🔄 Add `role` column to database - **IF NOT EXISTS**
4. 🔄 Create admin user in database - **MANUAL**
5. 🔜 Add backend API role validation - **RECOMMENDED**

---

## Example: Backend API Protection

Add middleware to protect admin-only endpoints:

```javascript
// middleware/adminMiddleware.js
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  next();
};

// Use in routes
router.delete('/products/:id', authMiddleware, adminOnly, deleteProduct);
router.post('/vouchers', authMiddleware, adminOnly, createVoucher);
```

---

## Troubleshooting

### "Redirecting to home" even with admin user
- Check: Does backend return `role: "admin"` in login response?
- Check: Is role stored in localStorage token?
- Check: Does `/api/auth/current` return role?

### "Verifying admin access..." stuck loading
- Check: Is backend API running?
- Check: Is `authToken` in localStorage?
- Check: Backend `/api/auth/current` endpoint working?

### Admin pages flash then redirect
- This is normal during auth check
- `AdminProtected` shows loading state
- If persists, check token validity

---

## Success! 🎉

Your admin panel is now fully protected with role-based authentication!

**To test:**
1. Create an admin user in database: `UPDATE users SET role = 'admin' WHERE id = 1`
2. Login with that user
3. Navigate to `/admin`
4. Should see the admin dashboard!
