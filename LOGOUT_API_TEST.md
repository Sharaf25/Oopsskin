# Testing Logout API

## Quick Test Steps

### Step 1: Login First
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourpassword"
  }'
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "email": "user@example.com",
  "name": "User Name",
  "phone": "1234567890",
  "role": "user"
}
```

Copy the `token` value.

---

### Step 2: Verify Token Works (Optional)
```bash
curl -X GET http://localhost:5000/api/auth/current \
  -H "Authorization: YOUR_TOKEN_HERE"
```

**Expected Response**:
```json
{
  "id": 1,
  "name": "User Name",
  "email": "user@example.com",
  "phone": "1234567890",
  "role": "user",
  "city": null,
  "street": null
}
```

---

### Step 3: Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**Expected Response**:
```json
{
  "message": "Logged out successfully"
}
```

---

### Step 4: Verify Token is Invalidated
Try using the same token again:
```bash
curl -X GET http://localhost:5000/api/auth/current \
  -H "Authorization: YOUR_TOKEN_HERE"
```

**Expected Response** (401 Unauthorized):
```json
{
  "message": "Access token invalidated"
}
```

---

## JavaScript Browser Console Test

Open your browser console on `http://localhost:3000` and run:

```javascript
// 1. Login
const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'yourpassword'
  })
});
const loginData = await loginResponse.json();
console.log('Login:', loginData);
const token = loginData.token;

// 2. Check current user (should work)
const currentResponse = await fetch('http://localhost:5000/api/auth/current', {
  headers: { 'Authorization': token },
  credentials: 'include'
});
const currentData = await currentResponse.json();
console.log('Current User:', currentData);

// 3. Logout
const logoutResponse = await fetch('http://localhost:5000/api/auth/logout', {
  method: 'POST',
  headers: { 
    'Authorization': token,
    'Content-Type': 'application/json'
  },
  credentials: 'include'
});
const logoutData = await logoutResponse.json();
console.log('Logout:', logoutData);

// 4. Try to use the token again (should fail)
const invalidResponse = await fetch('http://localhost:5000/api/auth/current', {
  headers: { 'Authorization': token },
  credentials: 'include'
});
const invalidData = await invalidResponse.json();
console.log('Should be invalid:', invalidData);
```

---

## Postman Collection

### Request 1: Login
- **Method**: POST
- **URL**: `http://localhost:5000/api/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Tests** (save token to variable):
  ```javascript
  pm.environment.set("authToken", pm.response.json().token);
  ```

### Request 2: Current User (Before Logout)
- **Method**: GET
- **URL**: `http://localhost:5000/api/auth/current`
- **Headers**: `Authorization: {{authToken}}`

### Request 3: Logout
- **Method**: POST
- **URL**: `http://localhost:5000/api/auth/logout`
- **Headers**: 
  - `Authorization: {{authToken}}`
  - `Content-Type: application/json`

### Request 4: Current User (After Logout - Should Fail)
- **Method**: GET
- **URL**: `http://localhost:5000/api/auth/current`
- **Headers**: `Authorization: {{authToken}}`
- **Expected**: 401 Unauthorized - "Access token invalidated"

---

## Expected Database Changes

### After Logout:

#### InvalidToken Table
New row added:
```
id | token                          | expiresAt
---+--------------------------------+------------------------
1  | eyJhbGciOiJIUzI1NiIsInR...     | 2026-02-18 10:45:00
```

#### RefreshToken Table
All rows for the user deleted:
```
(No rows for this user)
```

You can verify with SQL:
```sql
SELECT * FROM InvalidTokens;
SELECT * FROM RefreshTokens WHERE userId = 1;
```

---

## Frontend Testing

### In Your React App:

1. **Login** to your app (register if needed)
2. **Open Browser DevTools** → Application → Local Storage
3. **Verify tokens exist**:
   - `authToken`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - `refreshToken`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. **Click Logout** button in the navbar
5. **Check Local Storage** again:
   - Both tokens should be removed
6. **Check Console** for logout logs:
   ```
   Logging out...
   ```
7. **Verify redirect** to home/login page
8. **Try accessing protected pages** (should redirect to login)

---

## Troubleshooting

### Backend Not Responding
```bash
# Check if backend is running
curl http://localhost:5000/

# Should return: "Welcome to the API"
```

### CORS Errors
Check backend CORS configuration in `backend/index.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Token Format Issues
- ✅ Correct: `Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- ✅ Also correct: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- ❌ Wrong: `Bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## Success Indicators

✅ Logout API returns 200 with `{ message: "Logged out successfully" }`  
✅ Token is added to InvalidToken table  
✅ All refresh tokens for user are deleted  
✅ Subsequent requests with the token return 401  
✅ Frontend clears localStorage  
✅ User state is set to null  
✅ User is redirected appropriately  

---
*Test completed successfully on February 18, 2026*
