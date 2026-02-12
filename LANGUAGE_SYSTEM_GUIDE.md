# Language Switcher Guide

## Overview
The application now supports bilingual functionality with English and Arabic languages. Users can easily switch between languages using the language icon in the navigation bar.

## Features Implemented

### 1. Language Context (`src/app/context/LanguageContext.tsx`)
- Manages language state across the entire application
- Provides translation function `t()` for all components
- Persists language preference in localStorage
- Automatically sets document direction (RTL for Arabic, LTR for English)
- Includes comprehensive translations for:
  - Navigation menu items
  - Product categories and subcategories
  - Cart system
  - Authentication pages
  - Common messages and labels

### 2. Language Switcher in Navbar
- **Location**: Top right corner of the navigation bar
- **Icon**: Globe/Languages icon with language code (EN/AR)
- **Functionality**: Click to toggle between English and Arabic
- **Tooltip**: Shows "Switch to Arabic" or "التبديل إلى الإنجليزية"

### 3. Translation Coverage
Current translations include:
- ✅ Navbar links
- ✅ All product categories
- ✅ Cart and checkout pages
- ✅ Authentication forms
- ✅ Common UI elements
- ✅ Messages and alerts

## How to Use

### For Users
1. Look for the language switcher icon (🌐) in the top right of the navbar
2. Click the icon or the language code (EN/AR) to switch languages
3. The entire interface will update to the selected language
4. Your preference is saved and will persist on next visit

### For Developers

#### Adding New Translations
Edit `src/app/context/LanguageContext.tsx` and add translations to both `en` and `ar` objects:

```typescript
const translations = {
  en: {
    yourNewKey: 'English Text',
    // ... other translations
  },
  ar: {
    yourNewKey: 'النص العربي',
    // ... other translations
  },
};
```

#### Using Translations in Components
```typescript
import { useLanguage } from '@/app/context/LanguageContext';

function YourComponent() {
  const { t, language } = useLanguage();
  
  return (
    <div>
      <h1>{t('yourNewKey')}</h1>
      <p>Current language: {language}</p>
    </div>
  );
}
```

#### Manual Language Switch
```typescript
const { setLanguage, toggleLanguage } = useLanguage();

// Set specific language
setLanguage('ar');

// Toggle between languages
toggleLanguage();
```

## Technical Details

### RTL Support
- Arabic language automatically sets `dir="rtl"` on the HTML element
- Tailwind CSS handles most RTL styling automatically
- Custom RTL styles can be added using Tailwind's `rtl:` modifier

### Language Persistence
- Language preference is stored in `localStorage`
- Loaded on application startup
- Survives page refreshes and browser sessions

### Context Structure
```
LanguageProvider (Root)
  ├── AuthProvider
  │   ├── CartProvider
  │   │   ├── Navbar
  │   │   ├── Page Content
  │   │   └── Footer
```

## Extending Translations

### To add a new page or component with translations:

1. **Add translation keys** to `LanguageContext.tsx`
2. **Import the hook** in your component:
   ```typescript
   import { useLanguage } from '@/app/context/LanguageContext';
   ```
3. **Use the translation function**:
   ```typescript
   const { t } = useLanguage();
   return <h1>{t('myKey')}</h1>;
   ```

### Best Practices
- Use descriptive key names (e.g., `addToCart` not `btn1`)
- Keep translations consistent across the app
- Test both languages thoroughly
- Consider text length differences between languages
- Use proper Arabic typography and right-to-left flow

## Future Enhancements
Potential additions:
- [ ] More language options (French, Spanish, etc.)
- [ ] Dynamic content translation (product names, descriptions)
- [ ] Language-specific date and currency formatting
- [ ] Browser language detection
- [ ] Translation management system integration

## Troubleshooting

### Language not switching
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`
- Verify LanguageProvider wraps your app in layout.tsx

### Missing translations
- Check if key exists in translations object
- Verify spelling of translation key
- Add missing translations to both `en` and `ar` objects

### RTL issues
- Ensure Tailwind CSS is properly configured
- Use `rtl:` modifier for custom RTL styles
- Check HTML element has correct `dir` attribute

## Support
For issues or questions about the language system, refer to the LanguageContext.tsx file or consult the development team.
