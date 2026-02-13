# Voucher System Testing Checklist

## Prerequisites
- [ ] Backend server is running (`cd backend && npm start`)
- [ ] Frontend server is running (`npm run dev`)
- [ ] Database is initialized (`cd backend && npm run init-db`)

## Backend API Tests

### 1. Test Health Check
```bash
curl http://localhost:5000/
```
**Expected**: JSON response with endpoints list including vouchers

### 2. Get All Vouchers
```bash
curl http://localhost:5000/api/vouchers
```
**Expected**: List of 5 sample vouchers

### 3. Get Single Voucher
```bash
curl http://localhost:5000/api/vouchers/1
```
**Expected**: Details of voucher with ID 1

### 4. Validate Voucher (Valid)
```bash
curl http://localhost:5000/api/vouchers/validate/WELCOME10
```
**Expected**: 
```json
{
  "success": true,
  "valid": true,
  "message": "Voucher is valid",
  "voucher": { ... }
}
```

### 5. Validate Voucher (Invalid)
```bash
curl http://localhost:5000/api/vouchers/validate/INVALID
```
**Expected**: 
```json
{
  "success": false,
  "valid": false,
  "message": "Voucher not found"
}
```

### 6. Create Voucher
```bash
curl -X POST http://localhost:5000/api/vouchers \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TEST50",
    "description": "Test 50% off",
    "discount_type": "percentage",
    "discount_value": 50,
    "min_order_amount": 100,
    "max_discount": 25,
    "usage_limit": 10,
    "valid_from": "2024-01-01",
    "valid_until": "2024-12-31",
    "status": "active"
  }'
```
**Expected**: Success response with created voucher

### 7. Update Voucher
```bash
curl -X PUT http://localhost:5000/api/vouchers/1 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description"
  }'
```
**Expected**: Success response with updated voucher

### 8. Toggle Voucher Status
```bash
curl -X PATCH http://localhost:5000/api/vouchers/1/toggle
```
**Expected**: Success response with toggled status

### 9. Apply Voucher (Increment Usage)
```bash
curl -X POST http://localhost:5000/api/vouchers/apply/WELCOME10
```
**Expected**: Success response with incremented usage count

### 10. Get Statistics
```bash
curl http://localhost:5000/api/vouchers/stats/summary
```
**Expected**: Statistics object with counts

### 11. Filter by Status
```bash
curl http://localhost:5000/api/vouchers?status=active
```
**Expected**: Only active vouchers

### 12. Filter by Type
```bash
curl http://localhost:5000/api/vouchers?type=percentage
```
**Expected**: Only percentage-based vouchers

### 13. Delete Voucher
```bash
curl -X DELETE http://localhost:5000/api/vouchers/6
```
**Expected**: Success response (if voucher 6 exists)

## Frontend Tests (Browser)

### Cart Page Tests
1. **Navigate to Cart**
   - [ ] Go to `http://localhost:3000/cart`
   - [ ] Login if not authenticated
   - [ ] Add some products to cart

2. **Voucher Input Visibility**
   - [ ] Verify "Voucher Code" input field is visible
   - [ ] Verify "Apply" button is present

3. **Apply Valid Voucher**
   - [ ] Enter code: `WELCOME10`
   - [ ] Click "Apply"
   - [ ] Verify green success message appears
   - [ ] Verify voucher code is displayed
   - [ ] Verify discount line appears in order summary
   - [ ] Verify total is reduced correctly

4. **Test Percentage Discount (10% off)**
   - [ ] Cart subtotal: $100
   - [ ] Apply `WELCOME10` (10% off, min $50)
   - [ ] Expected discount: $10
   - [ ] Expected total: $90 (or $100 if free shipping)

5. **Test Percentage with Max Discount**
   - [ ] Cart subtotal: $500
   - [ ] Apply `SAVE20` (20% off, max $50)
   - [ ] Expected discount: $50 (not $100)
   - [ ] Expected total: $450

6. **Test Fixed Discount**
   - [ ] Cart subtotal: $50
   - [ ] Apply `FREESHIP` ($10 off)
   - [ ] Expected discount: $10
   - [ ] Expected total: $40 + shipping

7. **Test Minimum Order Requirement**
   - [ ] Cart subtotal: $30
   - [ ] Try to apply `WELCOME10` (requires $50 min)
   - [ ] Verify error message: "Minimum order amount of $50 required"

8. **Test Invalid Voucher**
   - [ ] Enter code: `INVALID123`
   - [ ] Click "Apply"
   - [ ] Verify red error message appears

9. **Remove Voucher**
   - [ ] Apply any valid voucher
   - [ ] Click "Remove" button
   - [ ] Verify voucher is removed
   - [ ] Verify discount is removed from total
   - [ ] Verify input is enabled again

10. **Apply Another Voucher**
    - [ ] Remove current voucher
    - [ ] Apply different voucher
    - [ ] Verify new discount is calculated

### Checkout Tests
1. **Proceed with Voucher**
   - [ ] Apply voucher in cart
   - [ ] Click "Proceed to Checkout"
   - [ ] Verify discount shows in checkout summary
   - [ ] Verify total includes discount

2. **Complete Order**
   - [ ] Fill in checkout form
   - [ ] Submit order
   - [ ] Verify success message shows discount saved
   - [ ] Verify voucher code is mentioned

### Admin Panel Tests
1. **Navigate to Admin**
   - [ ] Go to `http://localhost:3000/admin/vouchers`
   - [ ] Verify page loads

2. **View Vouchers List**
   - [ ] Verify all vouchers are displayed
   - [ ] Verify columns: Code, Type, Discount, Min Order, Usage, Status
   - [ ] Verify actions: Edit, Delete, Toggle

3. **View Statistics**
   - [ ] Verify statistics section shows:
     - [ ] Total vouchers
     - [ ] Active vouchers
     - [ ] Inactive vouchers
     - [ ] Total usage count

4. **Search Vouchers**
   - [ ] Enter "WELCOME" in search
   - [ ] Verify only matching vouchers show

5. **Filter by Status**
   - [ ] Select "Active Only"
   - [ ] Verify only active vouchers show
   - [ ] Select "Inactive Only"
   - [ ] Verify only inactive vouchers show

6. **Filter by Type**
   - [ ] Select "Percentage"
   - [ ] Verify only percentage vouchers show
   - [ ] Select "Fixed Amount"
   - [ ] Verify only fixed vouchers show

7. **Create New Voucher**
   - [ ] Click "Create Voucher" button
   - [ ] Fill in form:
     - Code: `NEWCODE`
     - Description: `Test voucher`
     - Type: Percentage
     - Value: 25
     - Min Order: 75
     - Max Discount: 20
     - Usage Limit: 50
     - Valid From: Today
     - Valid Until: Next month
     - Status: Active
   - [ ] Click "Save"
   - [ ] Verify voucher appears in list
   - [ ] Verify success message

8. **Edit Voucher**
   - [ ] Click "Edit" on any voucher
   - [ ] Modify description
   - [ ] Click "Save"
   - [ ] Verify changes are reflected

9. **Toggle Status**
   - [ ] Click toggle icon on active voucher
   - [ ] Verify status changes to inactive
   - [ ] Click toggle again
   - [ ] Verify status changes to active

10. **Delete Voucher**
    - [ ] Click delete icon
    - [ ] Confirm deletion
    - [ ] Verify voucher is removed from list

## Integration Tests

### Test Complete Flow
1. **Customer Journey**
   - [ ] Browse products
   - [ ] Add 3 items totaling $120 to cart
   - [ ] Navigate to cart
   - [ ] Apply voucher `SAVE20` (20% off over $100)
   - [ ] Verify discount: $20 (20% of $100)
   - [ ] Proceed to checkout
   - [ ] Complete order
   - [ ] Verify order placed successfully

2. **Verify Backend Updates**
   - [ ] Check admin panel
   - [ ] Verify voucher usage count increased
   - [ ] Check order in orders table (if implemented)

3. **Test Usage Limit**
   - [ ] Create voucher with limit of 2
   - [ ] Apply voucher twice in separate orders
   - [ ] Try to apply third time
   - [ ] Verify error: "Voucher usage limit reached"

4. **Test Expiration**
   - [ ] Create voucher with past expiry date
   - [ ] Try to apply
   - [ ] Verify error: "Voucher has expired"

5. **Test Future Activation**
   - [ ] Create voucher with future valid_from date
   - [ ] Try to apply
   - [ ] Verify error: "Voucher is not yet active"

## Edge Cases

### Test Error Handling
- [ ] Empty voucher code
- [ ] Voucher with spaces
- [ ] Lowercase voucher code (should auto-uppercase)
- [ ] Very long voucher code
- [ ] Special characters in code
- [ ] Inactive voucher
- [ ] Expired voucher
- [ ] Not yet active voucher
- [ ] Usage limit reached
- [ ] Backend server down
- [ ] Network error

### Test Calculations
- [ ] 0% discount
- [ ] 100% discount
- [ ] Discount larger than subtotal
- [ ] Very small order ($1)
- [ ] Very large order ($10000)
- [ ] Max discount boundary
- [ ] Min order boundary

## Performance Tests
- [ ] Load 100+ vouchers in admin panel
- [ ] Apply voucher with large cart
- [ ] Rapid apply/remove voucher
- [ ] Concurrent voucher applications

## Browser Compatibility
Test in:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Mobile Responsiveness
- [ ] Cart page on mobile
- [ ] Voucher input on small screen
- [ ] Admin panel on tablet
- [ ] Touch interactions

## Results Summary

### Passed Tests: ____ / ____
### Failed Tests: ____ / ____
### Notes:

---

## Common Issues and Solutions

### Issue: Voucher not applying
**Solution**: 
- Check voucher code spelling
- Verify voucher is active
- Check minimum order requirement
- Verify expiration date
- Check usage limit

### Issue: Wrong discount calculation
**Solution**:
- Verify discount_type (percentage vs fixed)
- Check max_discount for percentage vouchers
- Ensure discount doesn't exceed subtotal
- Check for rounding issues

### Issue: Admin panel not loading
**Solution**:
- Verify backend is running
- Check API URL in code
- Check browser console for errors
- Verify CORS settings

### Issue: Voucher usage not incrementing
**Solution**:
- Verify apply endpoint is called
- Check database connection
- Review server logs
- Ensure transaction completes

## Test Completion Date: ___________
## Tested By: ___________
## Sign-off: ___________
