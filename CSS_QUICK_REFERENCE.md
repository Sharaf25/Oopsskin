# Quick Reference: CSS Refactoring

## ✅ Complete - All Changes Applied

### Build Status
- ✅ Build successful
- ✅ No TypeScript errors
- ✅ No console logs
- ✅ All colors moved to CSS variables
- ✅ All reusable classes created

---

## Common Replacements

### Buttons

```tsx
// ❌ Before
<button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-bold transition-colors">

// ✅ After
<button className="btn-primary px-6 py-2">
```

```tsx
// ❌ Before
<button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border border-gray-300">

// ✅ After
<button className="btn-outline px-4 py-2">
```

### Form Inputs

```tsx
// ❌ Before
<input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />

// ✅ After
<input className="input-field" />
```

```tsx
// ❌ Before
<select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">

// ✅ After
<select className="select-field">
```

### Loading Spinners

```tsx
// ❌ Before
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />

// ✅ After
<div className="spinner h-12 w-12" />
```

### Status Badges

```tsx
// ❌ Before
<span className={`px-3 py-1 text-xs font-semibold rounded-full ${
  status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
}`}>

// ✅ After
<span className={`badge-${status === 'active' ? 'active' : 'inactive'}`}>
```

---

## Available Classes

### Buttons
- `.btn-primary` - Pink button for primary actions
- `.btn-secondary` - Purple button for secondary actions
- `.btn-success` - Green button for success actions
- `.btn-danger` - Red button for delete/danger actions
- `.btn-outline` - Gray outlined button

### Forms
- `.input-field` - Standard text/number input
- `.select-field` - Standard select dropdown

### Badges
- `.badge-active` - Green (active status)
- `.badge-inactive` - Gray (inactive status)
- `.badge-pending` - Yellow (pending status)
- `.badge-success` - Green (success)
- `.badge-danger` - Red (error/cancelled)

### Cards
- `.card` - Basic white card with shadow
- `.card-hover` - Card with hover effect

### Utilities
- `.spinner` - Loading spinner
- `.line-clamp-1` - Single line truncation
- `.line-clamp-2` - Two line truncation
- `.duration-600` - 600ms transition
- `.animate-fade-in` - Fade in animation
- `.animate-slide-down` - Slide down animation

---

## Color Variables

Use these in inline styles when needed:

```tsx
<div style={{ backgroundColor: 'var(--primary)' }}>
<span style={{ color: 'var(--success)' }}>
```

### Available Variables
- `--primary` (#EC4899 - Pink)
- `--primary-hover` (#DB2777 - Darker Pink)
- `--secondary` (#8B5CF6 - Purple)
- `--success` (#10B981 - Green)
- `--danger` (#EF4444 - Red)
- `--warning` (#F59E0B - Amber)
- `--info` (#3B82F6 - Blue)

---

## Files Modified

✅ `src/app/globals.css` - Added all custom classes and variables
✅ `src/app/admin/vouchers/page.tsx` - Refactored to use new classes

---

## Next Steps

Apply these classes to other components for consistency:

1. Admin pages (orders, products, customers, settings)
2. Product pages (all-products, product detail)
3. User pages (cart, profile, login, register)
4. Components (Navbar, Footer, ProductCarousel, etc.)

Just search for:
- `bg-pink-500` → Replace with `btn-primary` or `bg-primary`
- `bg-green-` → Consider using `.badge-success` or `var(--success)`
- `animate-spin` → Replace with `.spinner`
- Long form input classes → Replace with `.input-field`
