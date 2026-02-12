'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations = {
  en: {
    // Navbar
    home: 'Home',
    bestSellers: 'Best Sellers',
    new: 'New',
    makeup: 'Makeup',
    packages: 'Packages',
    skincare: 'Skincare',
    allProducts: 'All Products',
    shopAllProducts: 'SHOP ALL PRODUCTS',
    logout: 'Logout',
    
    // Categories
    face: 'FACE',
    eyes: 'EYES',
    lips: 'LIPS',
    cheek: 'CHEEK',
    brushesTools: 'BRUSHES & TOOLS',
    minis: 'MINIS',
    
    // Sub-categories
    foundation: 'Foundation',
    powderSettingSpray: 'Powder & Setting Spray',
    primer: 'Primer',
    concealerCorrector: 'Concealer & Corrector',
    contourHighlight: 'Contour & Highlight',
    eyeshadow: 'Eyeshadow',
    eyebrows: 'Eyebrows',
    eyeliner: 'Eyeliner',
    mascara: 'Mascara',
    fakeEyelashes: 'Fake Eyelashes',
    jellyStainedLips: 'Jelly Stained Lips',
    lipGloss: 'Lip Gloss',
    lipstick: 'Lipstick',
    lipLiner: 'Lip Liner',
    lipBalm: 'Lip Balm',
    blush: 'Blush',
    bronzer: 'Bronzer',
    brushes: 'Brushes',
    toolsAccessories: 'Tools & Accessories',
    miniProducts: 'Mini Products',
    
    // Products Page
    showing: 'Showing',
    products: 'products',
    shopOurCompleteCollection: 'Shop our complete collection',
    sortByFeatured: 'Sort by: Featured',
    priceLowToHigh: 'Price: Low to High',
    priceHighToLow: 'Price: High to Low',
    bestSelling: 'Best Selling',
    newest: 'Newest',
    addToCart: 'ADD TO CART',
    categories: 'Categories',
    
    // Cart
    cart: 'Cart',
    yourCart: 'Your Cart',
    cartEmpty: 'Your cart is empty',
    continueShopping: 'Continue Shopping',
    remove: 'Remove',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    free: 'Free',
    total: 'Total',
    proceedToCheckout: 'PROCEED TO CHECKOUT',
    
    // Authentication
    signIn: 'Sign In',
    signUp: 'Sign Up',
    register: 'Register',
    login: 'Login',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    
    // Messages
    addedToCart: 'added to cart!',
    needSignIn: 'You need to sign in to add items to cart. Go to login page?',
    loadingProducts: 'Loading products...',
    
    // Footer
    heyBeautiful: "Hey Beautiful, Let's Connect",
    joinNewsletter: 'join our newsletter',
    aboutUs: 'About Us',
    vipProgram: "Huda's VIP/Loyalty Program",
    ambassadorProgram: 'Ambassador Program',
    affiliateProgram: 'Affiliate Program',
    blog: 'Blog',
    ourCommunity: 'Our Community',
    accessibility: 'Accessibility',
    contactUs: 'Contact Us',
    shippingInfo: 'Shipping and Delivery Info',
    trackOrder: 'Track My Order',
    findOrder: 'Find My Order',
    returns: 'Returns',
    termsConditions: 'Terms and Conditions of Sale',
    termsPromotions: 'Terms and Conditions of Promotions',
    privacyPolicy: 'Privacy Policy',
    doNotSell: 'Do Not Sell My Personal Information',
    cookiePolicy: 'Cookie Policy',
    prop65Warning: 'Prop 65 Warning',
    thirdPartyStandards: 'Third Party Ethical Standards',
    allRightsReserved: 'All Rights Reserved',
    
    // Home Page
    shopNow: 'SHOP NOW',
    discoverBeauty: 'Discover Your Beauty',
    premiumProducts: 'Premium beauty products for every occasion',
    featuredCollection: 'FEATURED COLLECTION',
    viewAll: 'VIEW ALL',
    joinCommunity: 'JOIN OUR COMMUNITY',
    communityDescription: 'Connect with beauty enthusiasts worldwide',
    
    // Product Cards
    quickView: 'Quick View',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
  },
  ar: {
    // Navbar
    home: 'الرئيسية',
    bestSellers: 'الأكثر مبيعاً',
    new: 'جديد',
    makeup: 'مكياج',
    packages: 'عروض',
    skincare: 'العناية بالبشرة',
    allProducts: 'كل المنتجات',
    shopAllProducts: 'تسوق جميع المنتجات',
    logout: 'تسجيل الخروج',
    
    // Categories
    face: 'الوجه',
    eyes: 'العيون',
    lips: 'الشفاه',
    cheek: 'الخدود',
    brushesTools: 'الفرش والأدوات',
    minis: 'الصغيرة',
    
    // Sub-categories
    foundation: 'كريم الأساس',
    powderSettingSpray: 'البودرة والمثبت',
    primer: 'البرايمر',
    concealerCorrector: 'الكونسيلر والمصحح',
    contourHighlight: 'الكونتور والهايلايت',
    eyeshadow: 'ظلال العيون',
    eyebrows: 'الحواجب',
    eyeliner: 'الآيلاينر',
    mascara: 'الماسكارا',
    fakeEyelashes: 'الرموش الصناعية',
    jellyStainedLips: 'الصبغات الجيلي للشفاه',
    lipGloss: 'ملمع الشفاه',
    lipstick: 'أحمر الشفاه',
    lipLiner: 'محدد الشفاه',
    lipBalm: 'مرطب الشفاه',
    blush: 'أحمر الخدود',
    bronzer: 'البرونزر',
    brushes: 'الفرش',
    toolsAccessories: 'الأدوات والإكسسوارات',
    miniProducts: 'المنتجات الصغيرة',
    
    // Products Page
    showing: 'عرض',
    products: 'منتجات',
    shopOurCompleteCollection: 'تسوق مجموعتنا الكاملة',
    sortByFeatured: 'الترتيب: مميز',
    priceLowToHigh: 'السعر: من الأقل للأعلى',
    priceHighToLow: 'السعر: من الأعلى للأقل',
    bestSelling: 'الأكثر مبيعاً',
    newest: 'الأحدث',
    addToCart: 'أضف للسلة',
    categories: 'الفئات',
    
    // Cart
    cart: 'السلة',
    yourCart: 'سلة التسوق',
    cartEmpty: 'سلة التسوق فارغة',
    continueShopping: 'متابعة التسوق',
    remove: 'حذف',
    orderSummary: 'ملخص الطلب',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    free: 'مجاني',
    total: 'الإجمالي',
    proceedToCheckout: 'إتمام الطلب',
    
    // Authentication
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    register: 'تسجيل',
    login: 'دخول',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    fullName: 'الاسم الكامل',
    phoneNumber: 'رقم الهاتف',
    dontHaveAccount: 'ليس لديك حساب؟',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    
    // Messages
    addedToCart: 'تمت الإضافة للسلة!',
    needSignIn: 'يجب تسجيل الدخول لإضافة المنتجات. الذهاب لصفحة تسجيل الدخول؟',
    loadingProducts: 'جاري تحميل المنتجات...',
    
    // Footer
    heyBeautiful: 'مرحباً جميلتي، لنبقى على تواصل',
    joinNewsletter: 'انضمي للنشرة البريدية',
    aboutUs: 'عن الشركة',
    vipProgram: 'برنامج الولاء VIP',
    ambassadorProgram: 'برنامج السفراء',
    affiliateProgram: 'برنامج التسويق بالعمولة',
    blog: 'المدونة',
    ourCommunity: 'مجتمعنا',
    accessibility: 'إمكانية الوصول',
    contactUs: 'اتصل بنا',
    shippingInfo: 'معلومات الشحن والتوصيل',
    trackOrder: 'تتبع طلبي',
    findOrder: 'العثور على طلبي',
    returns: 'الإرجاع والاستبدال',
    termsConditions: 'الشروط والأحكام',
    termsPromotions: 'شروط العروض الترويجية',
    privacyPolicy: 'سياسة الخصوصية',
    doNotSell: 'عدم بيع معلوماتي الشخصية',
    cookiePolicy: 'سياسة ملفات تعريف الارتباط',
    prop65Warning: 'تحذير 65',
    thirdPartyStandards: 'معايير الطرف الثالث الأخلاقية',
    allRightsReserved: 'جميع الحقوق محفوظة',
    
    // Home Page
    shopNow: 'تسوق الآن',
    discoverBeauty: 'اكتشفي جمالك',
    premiumProducts: 'منتجات تجميل فاخرة لكل مناسبة',
    featuredCollection: 'المجموعة المميزة',
    viewAll: 'عرض الكل',
    joinCommunity: 'انضمي لمجتمعنا',
    communityDescription: 'تواصلي مع عشاق الجمال حول العالم',
    
    // Product Cards
    quickView: 'عرض سريع',
    outOfStock: 'غير متوفر',
    inStock: 'متوفر',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguageState(savedLanguage);
      document.documentElement.lang = savedLanguage;
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
