# Logout API - Complete Guide

## Overview
The logout API endpoint invalidates the user's access token and removes all refresh tokens, ensuring secure logout from the application.

## Endpoint Details

### **POST** `/api/auth/logout`

**Full URL**: `http://localhost:5000/api/auth/logout`

**Authentication**: Required (Protected route)

**Description**: Logs out the current user by:
1. Adding the access token to the `InvalidToken` table (blacklist)
2. Deleting all refresh tokens associated with the user
3. Preventing reuse of the invalidated token

---

## Request Format

### Headers
```
Authorization: <your-access-token>
Content-Type: application/json
```

**Note**: The token can be sent with or without the "Bearer " prefix:
- `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- `Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Body
No request body required.

---

## Response Format

### Success Response (200 OK)
```json
{
  "message": "Logged out successfully"
}
```

### Error Responses

#### 401 Unauthorized - Missing Token
```json
{
  "message": "Access token required"
}
```

#### 401 Unauthorized - Invalid Token
```json
{
  "message": "Access token not valid"
}
```

#### 401 Unauthorized - Invalidated Token
```json
{
  "message": "Access token invalidated"
}
```

#### 500 Internal Server Error
```json
{
  "message": "Error message details"
}
```

---

## Backend Implementation

### Route Definition
**File**: `backend/routes/authRoutes.js`
```javascript
router.post("/logout", ensureAuthenticated, logout);
```

### Controller Logic
**File**: `backend/controllers/authController.js`
```javascript
const logout = async (req, res) => {
  try {
    const decoded = jwt.decode(req.token);
    
    // Add token to blacklist
    await InvalidToken.create({
      token: req.token,
      expiresAt: new Date(decoded.exp * 1000),
    });

    // Delete all refresh tokens for this user
    await RefreshToken.destroy({ where: { userId: req.user.id } });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
```

### Middleware
**File**: `backend/middleware/authMiddleware.js`

The `ensureAuthenticated` middleware:
1. Extracts the token from the `Authorization` header
2. Checks if the token is in the `InvalidToken` blacklist
3. Verifies the JWT signature
4. Attaches `req.user` (user ID and role) and `req.token` to the request

---

## Frontend Implementation

### AuthContext Integration
**File**: `src/app/context/AuthContext.tsx`

```typescript
const logout = async () => {
  // Only run in browser
  if (typeof window === 'undefined') return;
  
  console.log('Logging out...');
  
  try {
    const token = localStorage.getItem('authToken');
    
    // Call backend logout API to invalidate token
    if (token) {
      await fetch(`${AUTH_API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
      });
    }
  } catch (error) {
    console.error('Logout API error:', error);
    // Continue with local logout even if API call fails
  } finally {
    // Always clear tokens and user data locally
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }
};
```

### Usage in Components
```typescript
import { useAuth } from '@/app/context/AuthContext';

function MyComponent() {
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Redirect to home or login page
    router.push('/');
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
```

---

## Testing the Logout API

### Using cURL
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

### Using Postman
1. **Method**: POST
2. **URL**: `http://localhost:5000/api/auth/logout`
3. **Headers**:
   - `Authorization`: `<your-token>`
   - `Content-Type`: `application/json`
4. **Body**: None
5. **Send**

### Using JavaScript (fetch)
```javascript
const logout = async () => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('http://localhost:5000/api/auth/logout', {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json();
  console.log(data); // { message: "Logged out successfully" }
  
  // Clear local storage
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
};
```

---

## Security Features

### 1. Token Blacklisting
- When a user logs out, their access token is added to the `InvalidToken` table
- Any subsequent request with that token will be rejected
- Tokens are automatically cleaned up after expiration

### 2. Refresh Token Revocation
- All refresh tokens for the user are deleted
- Prevents token refresh after logout
- User must login again to get new tokens

### 3. Graceful Degradation
- Frontend clears local tokens even if API call fails
- Ensures user is logged out locally regardless of network issues
- Prevents UI inconsistencies

### 4. CORS Protection
- CORS configured to only allow frontend origin
- Credentials mode enabled for secure cookie handling

---

## Database Tables

### InvalidToken Table
Stores blacklisted tokens:
```javascript
{
  id: INTEGER (Primary Key),
  token: STRING (The invalidated JWT),
  expiresAt: DATE (When the token expires)
}
```

### RefreshToken Table
Stores active refresh tokens (deleted on logout):
```javascript
{
  id: INTEGER (Primary Key),
  token: STRING (The refresh token),
  userId: INTEGER (Foreign Key to User),
  expiresAt: DATE (When the token expires)
}
```

---

## Common Issues & Solutions

### Issue 1: "Access token required"
**Cause**: Authorization header is missing
**Solution**: Ensure the token is included in the request headers

### Issue 2: "Access token not valid"
**Cause**: Token is expired or malformed
**Solution**: Login again to get a new token

### Issue 3: Token already invalidated
**Cause**: User already logged out or token was blacklisted
**Solution**: This is expected behavior; clear local storage and redirect to login

### Issue 4: Network error on logout
**Cause**: Backend server is not running or CORS issue
**Solution**: 
- Check if backend is running on port 5000
- Verify CORS configuration allows your frontend origin
- Frontend should still clear local tokens even if API fails

---

## Flow Diagram

```
User clicks Logout
       ↓
Frontend calls logout() in AuthContext
       ↓
API Request: POST /api/auth/logout
       ↓
Middleware: ensureAuthenticated
  - Extract token from headers
  - Check if token is blacklisted
  - Verify JWT signature
       ↓
Controller: logout
  - Add token to InvalidToken table
  - Delete all RefreshTokens for user
       ↓
Response: { message: "Logged out successfully" }
       ↓
Frontend: Clear localStorage
  - Remove authToken
  - Remove refreshToken
  - Set user to null
       ↓
User is logged out
```

---

## Complete Authentication Flow

1. **Register**: `POST /api/auth/register` → Returns success message
2. **Login**: `POST /api/auth/login` → Returns access token + refresh token
3. **Use Protected Routes**: Include token in Authorization header
4. **Check Current User**: `GET /api/auth/current` → Returns user data
5. **Refresh Token**: `POST /api/auth/refresh_token` → Returns new tokens
6. **Logout**: `POST /api/auth/logout` → Invalidates token

---

## Related Files

### Backend
- `backend/routes/authRoutes.js` - Route definitions
- `backend/controllers/authController.js` - Logout logic
- `backend/middleware/authMiddleware.js` - Token verification
- `backend/models/InvalidToken.js` - Token blacklist model
- `backend/models/RefreshToken.js` - Refresh token model

### Frontend
- `src/app/context/AuthContext.tsx` - Authentication context with logout
- `src/app/components/Navbar.tsx` - UI component with logout button
- `src/app/profile/page.tsx` - Profile page with logout option

---

## Best Practices

1. **Always call the logout API** before clearing local storage to ensure token invalidation
2. **Handle network errors gracefully** - clear local tokens even if API fails
3. **Redirect after logout** to prevent access to protected pages
4. **Show logout confirmation** for better UX
5. **Clear all user-related data** from localStorage/sessionStorage
6. **Use HTTPS in production** to protect tokens in transit

---

## Status
✅ **IMPLEMENTED** - Logout API is fully functional with token blacklisting and refresh token revocation.

---
*Last Updated: February 18, 2026*
