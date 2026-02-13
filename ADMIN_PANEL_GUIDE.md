# Oopsskin Admin Panel

## Overview
A comprehensive admin dashboard for managing the Oopsskin e-commerce platform.

## Features

### ✅ Dashboard
- Real-time statistics (Total Products, Orders, Revenue, Pending Orders)
- Recent orders overview
- Quick action buttons
- Order status summary

### ✅ Products Management
- View all products in a table
- Search products by name or category
- Filter by category
- Add new products (coming soon)
- Edit existing products (coming soon)
- Delete products
- View product details (stock, rating, reviews)
- Bilingual support (English/Arabic)

### ✅ Orders Management
- View all orders
- Search orders by order number, customer name, or email
- Filter by order status
- Update order status (pending, confirmed, processing, shipped, delivered, cancelled)
- View order details
- Track order history
- Customer contact information

### 🚧 Coming Soon
- Customer management
- Settings and configuration
- Analytics and reports
- Product image upload
- Bulk operations
- Export data

## Access

### URL
```
http://localhost:3000/admin
```

### Navigation
The admin panel has a persistent sidebar with the following sections:
- **Dashboard** - Overview and statistics
- **Products** - Product catalog management
- **Orders** - Order management and tracking
- **Customers** - Customer accounts (coming soon)
- **Settings** - Configuration (coming soon)

## Pages

### Dashboard (`/admin`)
- Statistics cards showing key metrics
- Recent orders table
- Quick action buttons for common tasks
- Real-time data from backend API

### Products (`/admin/products`)
- Complete product list with pagination
- Search functionality
- Category filter
- Actions: View, Edit, Delete
- Product details: ID, Name (EN/AR), Category, Price, Stock, Rating, Status

### Orders (`/admin/orders`)
- Complete order list
- Search by order number, customer, email
- Filter by status
- Inline status update
- Order details: Order number, Customer info, Total, Payment method, Date

## Backend Integration

### API Endpoints Used
```
GET  /api/products                  - Fetch all products
GET  /api/products/:id              - Fetch product by ID
DELETE /api/products/:id            - Delete product
GET  /api/orders                    - Fetch all orders
GET  /api/orders/:id                - Fetch order by ID
PUT  /api/orders/:id/status         - Update order status
GET  /api/orders/stats/summary      - Fetch order statistics
```

### Backend Server
Make sure the backend server is running:
```bash
cd backend
npm run dev
```

Server should be available at: `http://localhost:5000`

## Design

### Color Scheme
- Primary: Pink (#EC4899)
- Sidebar: Dark Gray (#111827)
- Background: Light Gray (#F3F4F6)
- Success: Green
- Warning: Yellow/Orange
- Error: Red

### Components
- Responsive sidebar navigation
- Data tables with hover effects
- Status badges with color coding
- Search and filter controls
- Loading states
- Error handling with user-friendly messages

## Usage

### Managing Products

**View Products:**
1. Go to `/admin/products`
2. Use search bar to find specific products
3. Filter by category using dropdown

**Delete Product:**
1. Click trash icon on product row
2. Confirm deletion
3. Product is removed from database

### Managing Orders

**View Orders:**
1. Go to `/admin/orders`
2. Use search to find orders by number, customer name, or email
3. Filter by status

**Update Order Status:**
1. Click on status dropdown in order row
2. Select new status
3. Status is updated immediately
4. Customer can be notified (implement notification system)

**Order Statuses:**
- **Pending** - Order placed, awaiting confirmation
- **Confirmed** - Order confirmed, preparing for processing
- **Processing** - Order is being prepared
- **Shipped** - Order has been shipped
- **Delivered** - Order delivered to customer
- **Cancelled** - Order cancelled

## Security Notes

⚠️ **Important:**
- Currently no authentication is implemented
- In production, add authentication middleware
- Implement role-based access control (RBAC)
- Secure API endpoints
- Add audit logging
- Use HTTPS in production

## Future Enhancements

### Phase 1
- [ ] Add product form (create/edit)
- [ ] Product image upload
- [ ] Order details page
- [ ] Print order invoices

### Phase 2
- [ ] Customer management
- [ ] Analytics dashboard
- [ ] Sales reports
- [ ] Inventory alerts

### Phase 3
- [ ] Admin authentication
- [ ] Multiple admin roles
- [ ] Activity logs
- [ ] Email notifications

### Phase 4
- [ ] Advanced analytics
- [ ] Export data (CSV, PDF)
- [ ] Bulk operations
- [ ] API documentation viewer

## Troubleshooting

### Cannot Load Data
**Problem:** Error message "Failed to load data. Make sure the backend server is running."

**Solution:**
1. Check if backend server is running: `cd backend && npm run dev`
2. Verify backend URL in API calls
3. Check MySQL database is running
4. Run `npm run init-db` to initialize database

### No Products/Orders Showing
**Problem:** Empty tables or "No data found"

**Solution:**
1. Run database initialization: `cd backend && npm run init-db`
2. Check backend logs for errors
3. Verify API responses in browser devtools Network tab

### Status Update Not Working
**Problem:** Order status doesn't change

**Solution:**
1. Check backend server logs
2. Verify PUT request is successful
3. Refresh page to see updated status

## Development

### File Structure
```
src/app/admin/
├── layout.tsx              # Admin layout with sidebar
├── page.tsx                # Dashboard page
├── products/
│   └── page.tsx           # Products list page
├── orders/
│   └── page.tsx           # Orders list page
├── customers/
│   └── page.tsx           # Customers page (placeholder)
└── settings/
    └── page.tsx           # Settings page (placeholder)
```

### Adding New Features

**Add New Page:**
1. Create folder in `/admin/`
2. Add `page.tsx` file
3. Update sidebar in `layout.tsx`
4. Connect to backend API if needed

**Add New API Call:**
1. Use fetch API with backend URL
2. Handle loading states
3. Handle errors gracefully
4. Update UI with response data

## Support
For issues or questions, refer to the main project README or backend documentation.
