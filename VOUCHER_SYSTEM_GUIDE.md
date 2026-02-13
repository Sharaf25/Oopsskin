# Voucher System Guide

## Overview
This guide explains the complete voucher/coupon system implementation in the oopsskin e-commerce application, including backend API, database schema, admin management, and frontend integration.

## Features

### Backend Features
- Full CRUD operations for vouchers
- Voucher validation and application
- Support for percentage and fixed amount discounts
- Minimum order amount requirements
- Maximum discount limits (for percentage vouchers)
- Usage tracking and limits
- Expiration date management
- Active/inactive status control
- Statistics and reporting

### Frontend Features
- Apply voucher codes in cart
- Real-time validation and error handling
- Visual feedback for applied discounts
- Discount calculation in order summary
- Voucher information in checkout
- Admin panel for voucher management

## Database Schema

### Vouchers Table
```sql
CREATE TABLE vouchers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type ENUM('percentage', 'fixed') NOT NULL,
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order_amount DECIMAL(10, 2) DEFAULT 0,
  max_discount DECIMAL(10, 2),
  usage_limit INT,
  used_count INT DEFAULT 0,
  valid_from DATETIME,
  valid_until DATETIME,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Fields Explanation
- **code**: Unique voucher code (e.g., "SAVE20", "WELCOME10")
- **description**: Human-readable description of the voucher
- **discount_type**: Either "percentage" or "fixed"
- **discount_value**: Percentage (e.g., 20 for 20%) or fixed amount (e.g., 10 for $10)
- **min_order_amount**: Minimum cart value required to use voucher
- **max_discount**: Maximum discount amount (only for percentage vouchers)
- **usage_limit**: Maximum number of times voucher can be used (NULL for unlimited)
- **used_count**: Current number of times voucher has been used
- **valid_from**: Start date/time for voucher validity
- **valid_until**: End date/time for voucher validity
- **status**: "active" or "inactive"

## Backend API

### Base URL
```
http://localhost:5000/api/vouchers
```

### Endpoints

#### 1. Get All Vouchers
```http
GET /api/vouchers
```

**Query Parameters:**
- `status` - Filter by status (active/inactive)
- `type` - Filter by discount type (percentage/fixed)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "code": "WELCOME10",
      "description": "Welcome discount for new customers",
      "discount_type": "percentage",
      "discount_value": 10,
      "min_order_amount": 50,
      "max_discount": null,
      "usage_limit": 100,
      "used_count": 15,
      "valid_from": "2024-01-01T00:00:00.000Z",
      "valid_until": "2024-12-31T23:59:59.000Z",
      "status": "active",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### 2. Get Single Voucher
```http
GET /api/vouchers/:id
```

#### 3. Create Voucher
```http
POST /api/vouchers
```

**Request Body:**
```json
{
  "code": "SUMMER25",
  "description": "Summer sale 25% off",
  "discount_type": "percentage",
  "discount_value": 25,
  "min_order_amount": 100,
  "max_discount": 50,
  "usage_limit": 200,
  "valid_from": "2024-06-01",
  "valid_until": "2024-08-31",
  "status": "active"
}
```

#### 4. Update Voucher
```http
PUT /api/vouchers/:id
```

**Request Body:** (same as create, all fields optional)

#### 5. Delete Voucher
```http
DELETE /api/vouchers/:id
```

#### 6. Validate Voucher
```http
GET /api/vouchers/validate/:code
```

**Response (Valid):**
```json
{
  "success": true,
  "valid": true,
  "message": "Voucher is valid",
  "voucher": {
    "id": 1,
    "code": "WELCOME10",
    "discount_type": "percentage",
    "discount_value": 10,
    "min_order_amount": 50
  }
}
```

**Response (Invalid):**
```json
{
  "success": false,
  "valid": false,
  "message": "Voucher has expired"
}
```

#### 7. Apply Voucher
```http
POST /api/vouchers/apply/:code
```

Increments the usage count when order is placed.

#### 8. Toggle Status
```http
PATCH /api/vouchers/:id/toggle
```

#### 9. Get Statistics
```http
GET /api/vouchers/stats/summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 5,
    "active": 4,
    "inactive": 1,
    "totalUsage": 47,
    "mostUsed": {
      "code": "SAVE20",
      "used_count": 25
    }
  }
}
```

## Frontend Implementation

### 1. Cart Page Integration

The cart page (`src/app/cart/page.tsx`) includes voucher functionality:

#### State Management
```typescript
const [voucherCode, setVoucherCode] = useState('');
const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
const [voucherError, setVoucherError] = useState('');
const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
```

#### Apply Voucher Function
```typescript
const applyVoucher = async () => {
  if (!voucherCode.trim()) {
    setVoucherError('Please enter a voucher code');
    return;
  }

  setIsApplyingVoucher(true);
  setVoucherError('');

  try {
    const response = await fetch(`http://localhost:5000/api/vouchers/validate/${voucherCode}`);
    const data = await response.json();

    if (data.success) {
      // Check minimum order requirement
      if (data.voucher.min_order_amount && subtotal < data.voucher.min_order_amount) {
        setVoucherError(`Minimum order amount of $${data.voucher.min_order_amount} required`);
        return;
      }

      setAppliedVoucher(data.voucher);
      setVoucherError('');
    } else {
      setVoucherError(data.message || 'Invalid voucher code');
      setAppliedVoucher(null);
    }
  } catch (error) {
    setVoucherError('Failed to apply voucher. Please try again.');
    setAppliedVoucher(null);
  }

  setIsApplyingVoucher(false);
};
```

#### Discount Calculation
```typescript
let discount = 0;
if (appliedVoucher) {
  if (appliedVoucher.discount_type === 'percentage') {
    discount = subtotal * (appliedVoucher.discount_value / 100);
    // Apply max discount if specified
    if (appliedVoucher.max_discount && discount > appliedVoucher.max_discount) {
      discount = appliedVoucher.max_discount;
    }
  } else if (appliedVoucher.discount_type === 'fixed') {
    discount = appliedVoucher.discount_value;
  }
  // Ensure discount doesn't exceed subtotal
  if (discount > subtotal) {
    discount = subtotal;
  }
}

const total = subtotal - discount + shipping;
```

#### UI Component
```tsx
{/* Voucher Input */}
<div className="mb-6">
  <label className="block text-sm font-bold text-gray-700 mb-2">
    Voucher Code
  </label>
  <div className="flex gap-2">
    <input
      type="text"
      value={voucherCode}
      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
      placeholder="Enter code"
      disabled={!!appliedVoucher}
      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
    />
    {appliedVoucher ? (
      <button onClick={removeVoucher}>Remove</button>
    ) : (
      <button onClick={applyVoucher}>Apply</button>
    )}
  </div>
  {voucherError && <p className="text-red-500 text-sm mt-2">{voucherError}</p>}
  {appliedVoucher && (
    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
      <p>Voucher Applied: {appliedVoucher.code}</p>
    </div>
  )}
</div>
```

### 2. Checkout Integration

When placing an order, the voucher information is included:

```typescript
const orderData = {
  customer_name: formData.fullName,
  customer_email: formData.email,
  customer_phone: formData.phone,
  shipping_address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
  items: cart.map(item => ({
    product_id: item.id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  })),
  total_amount: total,
  voucher_code: appliedVoucher?.code || null,
  discount_amount: discount || 0,
  payment_method: 'cash_on_delivery',
  notes: formData.notes,
};

// Submit order
const response = await fetch('http://localhost:5000/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData),
});

// If successful, increment voucher usage
if (data.success && appliedVoucher) {
  await fetch(`http://localhost:5000/api/vouchers/apply/${appliedVoucher.code}`, {
    method: 'POST',
  });
}
```

## Admin Panel

### Location
```
/admin/vouchers
```

### Features
1. **List View**: Display all vouchers with key information
2. **Search**: Search by voucher code
3. **Filter**: Filter by status (all/active/inactive) and type (all/percentage/fixed)
4. **Statistics**: Show total vouchers, active/inactive counts, total usage
5. **Create**: Add new vouchers with full configuration
6. **Edit**: Update existing vouchers
7. **Delete**: Remove vouchers (with confirmation)
8. **Toggle Status**: Quickly activate/deactivate vouchers

### UI Components

#### Voucher Table
Displays vouchers with columns:
- Code
- Type
- Discount Value
- Min Order
- Usage (used/limit)
- Valid From/Until
- Status
- Actions (Edit/Delete/Toggle)

#### Voucher Modal
Form for creating/editing vouchers:
- Code (required)
- Description
- Discount Type (percentage/fixed)
- Discount Value
- Minimum Order Amount
- Maximum Discount (for percentage)
- Usage Limit
- Valid From/Until dates
- Status

## Sample Vouchers

The system comes with pre-configured sample vouchers:

1. **WELCOME10**
   - Type: 10% off
   - Min Order: $50
   - Limit: 100 uses
   - Valid: All year

2. **SAVE20**
   - Type: 20% off
   - Min Order: $100
   - Max Discount: $50
   - Limit: 50 uses

3. **FREESHIP**
   - Type: $10 fixed
   - Min Order: $30
   - Unlimited uses

4. **VIP30**
   - Type: 30% off
   - Min Order: $200
   - Max Discount: $100
   - Limit: 20 uses

5. **FIRSTORDER**
   - Type: 15% off
   - Min Order: $0
   - Limit: 1000 uses

## Testing the System

### 1. Start Backend Server
```bash
cd backend
npm start
```

### 2. Start Frontend
```bash
npm run dev
```

### 3. Test Workflow
1. Add products to cart
2. Go to cart page
3. Enter voucher code (e.g., "WELCOME10")
4. Click "Apply"
5. Verify discount is calculated correctly
6. Proceed to checkout
7. Confirm discount appears in order summary
8. Place order
9. Check admin panel to see usage count incremented

### 4. Test Admin Panel
1. Navigate to `/admin/vouchers`
2. View list of vouchers
3. Create new voucher
4. Edit existing voucher
5. Toggle status
6. Delete voucher
7. View statistics

## Error Handling

### Common Validation Errors
- **"Voucher not found"**: Invalid code
- **"Voucher has expired"**: Past valid_until date
- **"Voucher is not yet active"**: Before valid_from date
- **"Voucher is inactive"**: Status is "inactive"
- **"Voucher usage limit reached"**: used_count >= usage_limit
- **"Minimum order amount of $X required"**: Cart total below min_order_amount

## Best Practices

1. **Code Format**: Use uppercase, alphanumeric codes (e.g., SAVE20, WELCOME10)
2. **Descriptions**: Provide clear descriptions for admin reference
3. **Limits**: Set reasonable usage limits to prevent abuse
4. **Expiration**: Always set expiration dates for promotional vouchers
5. **Testing**: Test vouchers before making them public
6. **Monitoring**: Regularly check usage statistics
7. **Security**: Validate vouchers server-side (already implemented)

## Future Enhancements

Potential improvements:
- Per-user voucher usage tracking
- Category/product-specific vouchers
- Automatic voucher suggestions
- Voucher stacking rules
- Email voucher codes to customers
- Referral voucher system
- Bulk voucher generation
- Advanced reporting and analytics
- Integration with email marketing
- Time-based restrictions (e.g., weekends only)

## Support

For issues or questions about the voucher system, refer to:
- Backend code: `backend/routes/vouchers.js`
- Frontend code: `src/app/cart/page.tsx`
- Admin panel: `src/app/admin/vouchers/page.tsx`
- Database schema: `backend/initDatabase.js`

## Summary

The voucher system is fully functional and ready to use:
- ✅ Backend API with all CRUD operations
- ✅ Database schema and sample data
- ✅ Frontend cart integration
- ✅ Checkout integration
- ✅ Admin panel management
- ✅ Real-time validation
- ✅ Usage tracking
- ✅ Statistics and reporting

Users can now apply voucher codes during checkout to receive discounts, and administrators can manage vouchers through the admin panel.
