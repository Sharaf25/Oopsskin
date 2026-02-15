# User Profile Page - Documentation

## Overview
A comprehensive user profile page where authenticated users can manage their personal information, view order history, and manage their favourite products.

## Location
`src/app/profile/page.tsx`

## Features

### ✅ Implemented (Static/Frontend)

#### 1. **Personal Information Tab**
- View and edit profile details
- Fields:
  - Full Name (editable)
  - Email Address (read-only)
  - Phone Number (editable)
  - Street Address (editable)
  - City (editable)
  - Postal Code (editable)
- Edit/Save/Cancel functionality (UI only)
- Account information display (status, member since)

#### 2. **My Orders Tab**
- View order history
- Mock data showing:
  - Order ID
  - Order date
  - Total amount
  - Number of items
  - Order status (Delivered, Shipped, Processing)
- Color-coded status badges
- "View Details" button for each order

#### 3. **Favourites Tab**
- Grid display of favourite products
- Mock data showing:
  - Product name
  - Product category
  - Price
  - Stock status
- "Add to Cart" and "Remove from Favourites" buttons

#### 4. **Navigation Sidebar**
- Profile avatar with user name and email
- Tab navigation:
  - Personal Info
  - My Orders
  - Favourites
  - Shopping Cart (link)
- Active tab highlighting
- Sticky positioning

#### 5. **Authentication**
- Protected route (requires login)
- Redirect to login if not authenticated
- Loading state while checking auth

### 🔄 Pending (Backend Integration)

The following features are UI-only and require API integration:

#### 1. **Profile Update API**
```typescript
// TODO: POST /api/users/profile
// Update user profile information
const updateProfile = async (profileData) => {
  const response = await fetch('http://localhost:5000/api/users/profile', {
    method: 'PUT',
    headers: {
      'Authorization': localStorage.getItem('authToken'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });
  return response.json();
};
```

#### 2. **Orders API**
```typescript
// TODO: GET /api/orders/user
// Fetch user's order history
const fetchOrders = async () => {
  const response = await fetch('http://localhost:5000/api/orders/user', {
    headers: {
      'Authorization': localStorage.getItem('authToken'),
    },
  });
  return response.json();
};
```

#### 3. **Favourites API**
```typescript
// TODO: GET /api/favourites
// Fetch user's favourite products
const fetchFavourites = async () => {
  const response = await fetch('http://localhost:5000/api/favourites', {
    headers: {
      'Authorization': localStorage.getItem('authToken'),
    },
  });
  return response.json();
};

// TODO: POST /api/favourites/:productId
// Add product to favourites

// TODO: DELETE /api/favourites/:productId
// Remove product from favourites
```

## Usage

### Accessing the Profile Page

1. **Via Navbar**
   - User must be logged in
   - Hover over user icon in navbar
   - Click "My Profile"

2. **Direct URL**
   - Navigate to `http://localhost:3000/profile`
   - Will redirect to login if not authenticated

### Mock Data

The page currently uses mock data for demonstration:

**Mock Orders:**
```javascript
const mockOrders = [
  {
    id: '1',
    date: '2026-02-10',
    total: 125.99,
    status: 'Delivered',
    items: 3,
  },
  // ... more orders
];
```

**Mock Favourites:**
```javascript
const mockFavourites = [
  {
    id: '1',
    name: 'Hydrating Face Serum',
    price: 45.99,
    category: 'Skincare',
    inStock: true,
  },
  // ... more products
];
```

## UI Components

### Color Scheme
- **Primary**: Pink (#EC4899)
- **Success**: Green (#10B981)
- **Info**: Blue (#3B82F6)
- **Warning**: Yellow (#F59E0B)
- **Danger**: Red (#EF4444)

### Status Badges
- **Delivered**: Green background
- **Shipped**: Blue background
- **Processing**: Yellow background

### Icons (Lucide React)
- User - Profile avatar and personal info
- Mail - Email display
- Phone - Phone number
- MapPin - Address
- Package - Orders
- Heart - Favourites
- ShoppingBag - Cart
- Edit2 - Edit mode
- Save - Save changes
- X - Cancel/Close
- Settings - Personal info tab

## Responsive Design

### Mobile (< 768px)
- Single column layout
- Stacked navigation
- Full-width cards
- Touch-friendly buttons

### Tablet (768px - 1024px)
- 2-column grid for favourites
- Sidebar navigation
- Optimized spacing

### Desktop (> 1024px)
- 4-column layout (1 sidebar + 3 content)
- Sticky sidebar
- Grid layouts for favourites

## Integration Steps

### 1. Backend API Endpoints Needed

```javascript
// In backend/routes/userRoutes.js
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.get('/orders', authMiddleware, getUserOrders);
router.get('/favourites', authMiddleware, getUserFavourites);
router.post('/favourites/:productId', authMiddleware, addToFavourites);
router.delete('/favourites/:productId', authMiddleware, removeFromFavourites);
```

### 2. Database Tables Needed

**Users Table (already exists):**
```sql
ALTER TABLE users
ADD COLUMN address VARCHAR(255),
ADD COLUMN city VARCHAR(100),
ADD COLUMN postalCode VARCHAR(20);
```

**Favourites Table (new):**
```sql
CREATE TABLE favourites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY unique_favourite (user_id, product_id)
);
```

### 3. Frontend Integration

Replace mock data with API calls:

```typescript
// In profile/page.tsx

// Fetch orders
useEffect(() => {
  const loadOrders = async () => {
    const response = await fetch('http://localhost:5000/api/users/orders', {
      headers: {
        'Authorization': localStorage.getItem('authToken'),
      },
    });
    const data = await response.json();
    setOrders(data.orders);
  };
  
  if (isAuthenticated) {
    loadOrders();
  }
}, [isAuthenticated]);

// Similar for favourites...
```

## Testing Checklist

### Manual Testing
- [ ] Can access profile page when logged in
- [ ] Redirects to login when not authenticated
- [ ] Can switch between tabs (Info, Orders, Favourites)
- [ ] Can enter edit mode for personal info
- [ ] Form fields are editable in edit mode
- [ ] Can save changes (shows alert)
- [ ] Can cancel editing (reverts changes)
- [ ] Email field is always read-only
- [ ] Navigation links work correctly
- [ ] Responsive on mobile, tablet, desktop

### API Integration Testing (When Ready)
- [ ] Profile updates save to database
- [ ] Real orders display correctly
- [ ] Real favourites display correctly
- [ ] Can add product to favourites
- [ ] Can remove product from favourites
- [ ] Error handling for failed API calls
- [ ] Loading states during API calls

## Notes

- **Static Page**: This is a static UI implementation. All functionality is frontend-only.
- **API Placeholders**: Alert messages indicate where API integration is needed.
- **Mock Data**: Sample data is hardcoded for demonstration purposes.
- **Production Ready**: The UI is complete and ready for API integration.

## Next Steps

1. Create backend API endpoints for:
   - User profile updates
   - Order history
   - Favourites management

2. Create database migrations for:
   - User address fields
   - Favourites table

3. Integrate APIs with frontend:
   - Replace mock data with real API calls
   - Add loading states
   - Add error handling
   - Add success/error notifications

4. Add features:
   - Order detail view modal
   - Product quick view from favourites
   - Password change functionality
   - Profile picture upload

---

**Status**: ✅ Frontend Complete (Static)  
**Created**: February 15, 2026  
**Last Updated**: February 15, 2026
