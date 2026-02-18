# Product Carousel Animation - Simple Sliding Effect

## Summary
Added smooth, simple sliding animation to the ProductCarousel component with **auto-advance functionality**. The carousel automatically loops through products every 4 seconds with a clean sliding animation.

## Changes Made

### 1. ProductCarousel Component (`src/app/components/ProductCarousel.tsx`)

#### Added Import
```tsx
import { useState, useEffect, useCallback } from 'react';
```

#### Added State
- `isAnimating`: Boolean flag to prevent multiple clicks during transition (600ms duration)

#### Handler Functions (with useCallback)
```tsx
const handlePrevious = useCallback(() => {
  if (isAnimating) return;
  setIsAnimating(true);
  setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  setTimeout(() => setIsAnimating(false), 600);
}, [isAnimating, products.length]);

const handleNext = useCallback(() => {
  if (isAnimating) return;
  setIsAnimating(true);
  setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  setTimeout(() => setIsAnimating(false), 600);
}, [isAnimating, products.length]);
```

#### Auto-Advance Timer (Fixed with useCallback)
```tsx
useEffect(() => {
  if (products.length === 0) return;
  
  const timer = setInterval(() => {
    handleNext();
  }, 4000); // Auto-advance every 4 seconds
  
  return () => clearInterval(timer);
}, [products.length, handleNext]);
```

**Key Fix**: Used `useCallback` to memoize `handleNext` and `handlePrevious` functions, preventing infinite re-renders and ensuring the auto-advance timer works correctly.

#### Smooth Transition Effect
```tsx
<div 
  className="grid ... transition-transform duration-600 ease-in-out"
  style={{
    transform: isAnimating ? 'translateX(-20px)' : 'translateX(0)',
  }}
>
```

### 2. Updated Layout
- **Container**: Added responsive padding (`px-4 sm:px-6 lg:px-8`)
- **Wrapper**: Added `px-12` for arrow spacing
- **Grid**: Reduced gap from `gap-6` to `gap-3` for 4 full cards
- **Cards**: Added `flex-shrink-0` to prevent card shrinking
- **Overflow**: Wrapped grid in `overflow-hidden` div for clean animations

### 3. Global Styles (`src/app/globals.css`)

```css
.duration-600 {
  transition-duration: 600ms;
}
```

## Animation Behavior

### Visual Effect
1. **Smooth Slide**: Cards slightly shift left (20px) during transition
2. **Ease In-Out**: Natural acceleration and deceleration
3. **No Flashing**: Content stays visible throughout transition
4. **No Jumping**: Products smoothly replace each other

### Timing
- **Auto-Advance**: Every 4 seconds
- **Transition Duration**: 600ms (0.6 seconds)
- **Button Cooldown**: 600ms to match transition

### User Interaction
- **Next Button**: Advances to next product set
- **Previous Button**: Goes back to previous product set
- **Disabled State**: Buttons show 50% opacity during animation
- **Click Protection**: Can't spam click during transition

## Technical Details

### Simple Animation Approach
- Uses CSS `transform: translateX()` for smooth GPU-accelerated movement
- No complex keyframes or multiple animations
- Single transition property for consistent behavior
- No opacity changes - products stay fully visible

### Performance
- Hardware-accelerated (transform property)
- Minimal re-renders
- Clean state management
- No animation libraries required

### Responsive Design
- Works on all screen sizes
- 4 cards on large screens (`lg:grid-cols-4`)
- 2 cards on tablets (`md:grid-cols-2`)
- 1 card on mobile (`grid-cols-1`)

## Benefits

✅ **Smooth & Simple**: Clean sliding motion without complexity
✅ **No Flashing**: Products remain visible during transition
✅ **Auto-Advance**: Keeps content dynamic (every 4s)
✅ **Click Protection**: Prevents animation glitches from spam clicks
✅ **Professional**: Polished UX without being overdone
✅ **Performant**: GPU-accelerated transforms
✅ **Accessible**: Clear visual feedback during transitions

## Configuration

### Adjust Timing
```tsx
// Auto-advance interval (currently 4000ms = 4 seconds)
setInterval(() => handleNext(), 4000);

// Animation duration (currently 600ms)
setTimeout(() => setIsAnimating(false), 600);
```

### Adjust Animation Distance
```tsx
// Slide distance (currently 20px)
transform: isAnimating ? 'translateX(-20px)' : 'translateX(0)'
```

## Testing Checklist

- [x] Auto-advances every 4 seconds
- [x] Smooth sliding animation (no flash)
- [x] Next button works correctly
- [x] Previous button works correctly
- [x] Can't spam click during animation
- [x] Shows exactly 4 cards on desktop
- [x] Loops infinitely (6 products cycling)
- [x] Responsive on all screen sizes
- [x] No layout shifts or jumps

---

**Status**: ✅ Complete
**Date**: February 18, 2026
**Animation Style**: Simple horizontal slide with translateX
**Files Modified**: 
- `src/app/components/ProductCarousel.tsx`
- `src/app/globals.css`
