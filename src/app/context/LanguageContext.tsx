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
    profile: 'Profile',
    
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
    of: 'of',
    products: 'products',
    shopOurCompleteCollection: 'Shop our complete collection',
    sortByFeatured: 'Sort by: Featured',
    priceLowToHigh: 'Price: Low to High',
    priceHighToLow: 'Price: High to Low',
    bestSelling: 'Best Selling',
    newest: 'Newest',
    addToCart: 'ADD TO CART',
    categories: 'Categories',
    page: 'Page',
    previous: 'Previous',
    next: 'Next',
    itemsPerPage: 'items per page',
    searchProducts: 'Search products...',
    priceRange: 'Price Range',
    resetPriceFilter: 'Reset Price Filter',
    tryAgain: 'Try Again',
    noProductsFound: 'No products found',
    adjustFilters: 'Try adjusting your filters or check back later.',
    reloadProducts: 'Reload Products',
    search: 'Search',
    searchPlaceholder: 'Search for products...',
    searchHint: 'Try searching for "lipstick", "foundation", "mascara"...',
    yourBeautyDestination: 'Your beauty destination',
    
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
    orderTotal: 'Order Total',
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
    loginToShop: 'Login to Shop',
    
    // Messages
    addedToCart: 'added to cart!',
    needSignIn: 'You need to sign in to add items to cart. Go to login page?',
    loadingProducts: 'Loading products...',
    failedToLoad: 'Failed to load products',
    
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
    account: 'ACCOUNT',
    shop: 'SHOP',
    newItems: 'NEW ITEMS',
    
    // Home Page
    shopNow: 'SHOP NOW',
    discoverBeauty: 'Discover Your Beauty',
    premiumProducts: 'Premium beauty products for every occasion',
    featuredCollection: 'FEATURED COLLECTION',
    viewAll: 'VIEW ALL',
    joinCommunity: 'JOIN OUR COMMUNITY',
    communityDescription: 'Connect with beauty enthusiasts worldwide',
    
    // Featured Banner (Habibti Kits)
    habibtiKits: 'HABIBTI KITS',
    habibtiDescription: 'Discover our exclusive makeup kits designed for every occasion. Complete sets with everything you need to create stunning looks! 💄✨',
    premiumQuality: 'Premium Quality',
    
    // Skin Care Section
    skinCare: 'SKIN CARE',
    skinCareDescription: 'Discover our luxurious skincare collection designed to nourish, hydrate, and rejuvenate your skin',
    viewAllSkincareProducts: 'View All Skincare Products',
    hydratingFaceSerum: 'Hydrating Face Serum',
    hydratingDescription: 'Deep hydration with Hyaluronic Acid',
    vitaminCGlowCream: 'Vitamin C Glow Cream',
    vitaminCDescription: 'Brightening moisturizer with Vitamin C',
    nightRecoveryMask: 'Night Recovery Mask',
    nightMaskDescription: 'Overnight repair and rejuvenation',
    hydrates: 'Hydrates',
    brightens: 'Brightens',
    smooths: 'Smooths',
    antiAging: 'Anti-aging',
    radiance: 'Radiance',
    evenTone: 'Even tone',
    repairs: 'Repairs',
    nourishes: 'Nourishes',
    restores: 'Restores',
    quickView: 'Quick View',
    
    // Product Detail Page
    productInfo: 'Product Info',
    tags: 'Tags',
    features: 'Features',
    category: 'Category',
    selectColor: 'Select Color',
    quantity: 'Quantity',
    addToCartButton: 'Add to Cart',
    save: 'SAVE',
    inStock: 'in stock',
    outOfStock: 'Out of stock',
    productNotFound: 'Product Not Found',
    returnToAllProducts: 'Return to All Products',
    backToProducts: 'Back to Products',
    shopAll: 'Shop All',
    youMayAlsoLike: 'You May Also Like',
    earnPoints: 'You could earn up to',
    pointsWithVIPs: 'Points with VIPs',
    productDoesNotExist: 'The product you are looking for does not exist.',
    loadingProductDetails: 'Loading product details...',
    error: 'Error',
    color: 'Color',
    
    // Rating
    reviews: 'reviews',
    review: 'review',
    youRated: 'You rated',
    rateStars: 'Rate',
    signInToRate: 'Sign in to rate',
    saving: 'Saving...',
    
    // Admin
    admin: 'Admin',
    dashboard: 'Dashboard',
    customers: 'Customers',
    orders: 'Orders',
    settings: 'Settings',
    vouchers: 'Vouchers',
    
    // Login Page
    signInToAccount: 'Sign in to your account',
    emailAddress: 'Email Address',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot Password?',
    signingIn: 'SIGNING IN...',
    createAccount: 'Create Account',
    or: 'or',
    loading: 'Loading...',
    
    // Register Page
    createYourAccount: 'Create your account',
    fullNameRequired: 'Full Name *',
    emailAddressRequired: 'Email Address *',
    phoneNumberRequired: 'Phone Number *',
    passwordRequired: 'Password * (min. 6 characters)',
    confirmPassword: 'Confirm Password *',
    agreeToTerms: 'I agree to the',
    termsAndConditions: 'Terms & Conditions',
    and: 'and',
    creatingAccount: 'CREATING ACCOUNT...',
    
    // Cart Page
    shoppingCart: 'Shopping Cart',
    itemsInCart: 'items in your cart',
    continueShoppingButton: 'Continue Shopping',
    itemTotal: 'Item Total',
    clearCart: 'Clear Cart',
    voucherCode: 'Voucher Code',
    enterCode: 'Enter code',
    applyVoucher: 'Apply',
    removeVoucher: 'Remove',
    voucherApplied: 'Voucher Applied',
    discount: 'Discount',
    freeShipping: '🎉 You got free shipping!',
    addMoreForFreeShipping: 'Add $',
    moreForFreeShipping: ' more for free shipping!',
    paymentMethod: '💰 Payment Method:',
    cashOnDelivery: 'Cash on Delivery available for all orders',
    yourCartIsEmpty: 'YOUR CART IS EMPTY',
    notAddedYet: "Looks like you haven't added anything to your cart yet",
    startShopping: 'START SHOPPING',
    signInRequired: 'SIGN IN REQUIRED',
    signInToViewCart: 'Please sign in to your account to view your cart and proceed with checkout',
    removeItemConfirm: 'Remove this item from cart?',
    
    // Profile Page
    myProfile: 'My Profile',
    accountInformation: 'Account Information',
    myOrders: 'My Orders',
    myFavourites: 'My Favourites',
    editProfile: 'Edit Profile',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    name: 'Name',
    phone: 'Phone',
    address: 'Address',
    city: 'City',
    postalCode: 'Postal Code',
    orderHistory: 'Order History',
    orderDate: 'Order Date',
    orderStatus: 'Status',
    orderItems: 'Items',
    viewDetails: 'View Details',
    noOrders: 'No orders yet',
    startShoppingToSeeOrders: 'Start shopping to see your orders here',
    favouriteProducts: 'Favourite Products',
    noFavourites: 'No favourites yet',
    addFavourites: 'Add products to your favourites to see them here',
    delivered: 'Delivered',
    shipped: 'Shipped',
    processing: 'Processing',
    emailCannotChange: 'Email cannot be changed',
    enterStreetAddress: 'Enter your street address',
    enterCity: 'Enter your city',
    enterPostalCode: 'Enter postal code',
    
    // Checkout
    checkoutTitle: 'Checkout',
    deliveryInformation: 'Delivery Information',
    paymentInformation: 'Payment Information',
    placeOrder: 'PLACE ORDER',
    orderPlaced: 'ORDER PLACED SUCCESSFULLY',
    thankYou: 'Thank you for your order',
    orderNumber: 'Order Number',
    backToHome: 'BACK TO HOME',
    contactInformation: 'Contact Information',
    deliveryAddress: 'Delivery Address',
    streetAddress: 'Street Address *',
    deliveryNotes: 'Delivery Notes (Optional)',
    placingOrder: 'PLACING ORDER...',
    backToCart: 'Back to Cart',
    completeOrder: 'Complete your order with Cash on Delivery',
    anySpecialDelivery: 'Any special delivery instructions...',
    byPlacingOrder: 'By placing an order, you agree to our terms and conditions',
    
    // Best Sellers / Redirect Page
    redirectingBestSellers: 'Redirecting to Best Sellers...',

    // New Arrivals Page
    newArrivals: 'New Arrivals',
    newArrivalsSubtitle: 'Discover the latest beauty innovations',

    // Makeup Page
    makeupTitle: 'Makeup',
    makeupSubtitle: 'Your complete makeup collection',
    featuredMakeup: 'Featured Makeup',

    // Skincare Page
    skincareTitle: 'Skincare',
    skincareSubtitle: 'Healthy skin is beautiful skin',
    shopSkincare: 'Shop Skincare',
    yourSkincareRoutine: 'Your Skincare Routine',
    skincareRoutineSubtitle: 'Build the perfect skincare routine with our expertly curated products',
    whyOopsskinSkincare: 'Why Oopsskin Skincare?',
    naturalIngredients: 'Natural Ingredients',
    naturalIngredientsDesc: 'Formulated with the finest natural and organic ingredients for gentle, effective care',
    scientificallyProven: 'Scientifically Proven',
    scientificallyProvenDesc: 'Backed by dermatological research and clinical testing for visible results',
    crueltyFree: 'Cruelty Free',
    crueltyFreeDesc: 'Never tested on animals - beauty with a conscience',
    bestsellingSkincareTitle: 'Bestselling Skincare',
    skincareProductName: 'Hydrating Serum',
    skincareProductDesc: 'Deep hydration for all skin types',
    cleansers: 'Cleansers',
    toners: 'Toners',
    serums: 'Serums',
    moisturizers: 'Moisturizers',
    masks: 'Masks',
    eyeCare: 'Eye Care',
    sunscreen: 'Sunscreen',
    nightCare: 'Night Care',

    // Packages Page
    packagesTitle: 'Packages & Sets',
    packagesSubtitle: 'Curated collections for every beauty need',
    includes: 'Includes:',
    whyBuyPackages: 'Why Buy Packages?',
    saveMore: 'Save More',
    saveMoreDesc: 'Get up to 30% off when buying sets',
    curatedCollections: 'Curated Collections',
    curatedCollectionsDesc: 'Products that work perfectly together',
    perfectGifts: 'Perfect Gifts',
    perfectGiftsDesc: 'Ready-to-gift packaging available',

    // Error Messages
    passwordsDoNotMatch: 'Passwords do not match!',
    passwordTooShort: 'Password must be at least 6 characters!',
    loginFailed: 'Login failed. Please try again.',
    registrationFailed: 'Registration failed. Please try again.',
    enterVoucherCode: 'Please enter a voucher code',
    invalidVoucher: 'Invalid voucher code',
    minimumOrderAmount: 'Minimum order amount of $',
    required: ' required',
    failedToApplyVoucher: 'Failed to apply voucher. Please try again.',
    failedToUpdateQuantity: 'Failed to update quantity',
    failedToRemove: 'Failed to remove item',
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
    profile: 'الملف الشخصي',
    
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
    of: 'من',
    products: 'منتجات',
    shopOurCompleteCollection: 'تسوق مجموعتنا الكاملة',
    sortByFeatured: 'الترتيب: مميز',
    priceLowToHigh: 'السعر: من الأقل للأعلى',
    priceHighToLow: 'السعر: من الأعلى للأقل',
    bestSelling: 'الأكثر مبيعاً',
    newest: 'الأحدث',
    addToCart: 'أضف للسلة',
    categories: 'الفئات',
    page: 'صفحة',
    previous: 'السابق',
    next: 'التالي',
    itemsPerPage: 'عناصر في الصفحة',
    searchProducts: 'البحث عن المنتجات...',
    priceRange: 'نطاق السعر',
    resetPriceFilter: 'إعادة تعيين فلتر السعر',
    tryAgain: 'حاول مرة أخرى',
    noProductsFound: 'لم يتم العثور على منتجات',
    adjustFilters: 'حاول تعديل الفلاتر أو تحقق لاحقاً.',
    reloadProducts: 'إعادة تحميل المنتجات',
    search: 'بحث',
    searchPlaceholder: 'البحث عن المنتجات...',
    searchHint: 'جرب البحث عن "أحمر شفاه"، "كريم أساس"، "ماسكارا"...',
    yourBeautyDestination: 'وجهتك للجمال',
    
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
    orderTotal: 'إجمالي الطلب',
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
    loginToShop: 'تسجيل الدخول للتسوق',
    
    // Messages
    addedToCart: 'تمت الإضافة للسلة!',
    needSignIn: 'يجب تسجيل الدخول لإضافة المنتجات. الذهاب لصفحة تسجيل الدخول؟',
    loadingProducts: 'جاري تحميل المنتجات...',
    failedToLoad: 'فشل تحميل المنتجات',
    
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
    account: 'الحساب',
    shop: 'المتجر',
    newItems: 'منتجات جديدة',
    
    // Home Page
    shopNow: 'تسوق الآن',
    discoverBeauty: 'اكتشفي جمالك',
    premiumProducts: 'منتجات تجميل فاخرة لكل مناسبة',
    featuredCollection: 'المجموعة المميزة',
    viewAll: 'عرض الكل',
    joinCommunity: 'انضمي لمجتمعنا',
    communityDescription: 'تواصلي مع عشاق الجمال حول العالم',
    
    // Featured Banner (Habibti Kits)
    habibtiKits: 'حقائب حبيبتي',
    habibtiDescription: 'اكتشفي مجموعاتنا الحصرية للمكياج المصممة لكل مناسبة. مجموعات كاملة مع كل ما تحتاجينه لإطلالات مذهلة! 💄✨',
    premiumQuality: 'جودة فاخرة',
    
    // Skin Care Section
    skinCare: 'العناية بالبشرة',
    skinCareDescription: 'اكتشفي مجموعتنا الفاخرة للعناية بالبشرة المصممة لتغذية وترطيب وتجديد بشرتك',
    viewAllSkincareProducts: 'عرض جميع منتجات العناية بالبشرة',
    hydratingFaceSerum: 'سيروم الوجه المرطب',
    hydratingDescription: 'ترطيب عميق بحمض الهيالورونيك',
    vitaminCGlowCream: 'كريم فيتامين سي المشرق',
    vitaminCDescription: 'مرطب منير بفيتامين سي',
    nightRecoveryMask: 'قناع الليل المجدد',
    nightMaskDescription: 'إصلاح وتجديد طوال الليل',
    hydrates: 'يرطب',
    brightens: 'ينير',
    smooths: 'ينعم',
    antiAging: 'مضاد للشيخوخة',
    radiance: 'إشراقة',
    evenTone: 'توحيد اللون',
    repairs: 'يصلح',
    nourishes: 'يغذي',
    restores: 'يجدد',
    quickView: 'عرض سريع',
    
    // Product Detail Page
    productInfo: 'معلومات المنتج',
    tags: 'الوسوم',
    features: 'المميزات',
    category: 'الفئة',
    selectColor: 'اختر اللون',
    quantity: 'الكمية',
    addToCartButton: 'أضف للسلة',
    save: 'وفر',
    inStock: 'متوفر',
    outOfStock: 'غير متوفر',
    productNotFound: 'المنتج غير موجود',
    returnToAllProducts: 'العودة لكل المنتجات',
    backToProducts: 'العودة للمنتجات',
    shopAll: 'تسوق الكل',
    youMayAlsoLike: 'قد يعجبك أيضاً',
    earnPoints: 'يمكنك كسب حتى',
    pointsWithVIPs: 'نقطة مع برنامج VIP',
    productDoesNotExist: 'المنتج الذي تبحث عنه غير موجود.',
    loadingProductDetails: 'جاري تحميل تفاصيل المنتج...',
    error: 'خطأ',
    color: 'اللون',
    
    // Rating
    reviews: 'تقييمات',
    review: 'تقييم',
    youRated: 'قيمت بـ',
    rateStars: 'قيم',
    signInToRate: 'سجل الدخول للتقييم',
    saving: 'جاري الحفظ...',
    
    // Admin
    admin: 'المشرف',
    dashboard: 'لوحة التحكم',
    customers: 'العملاء',
    orders: 'الطلبات',
    settings: 'الإعدادات',
    vouchers: 'القسائم',
    
    // Login Page
    signInToAccount: 'تسجيل الدخول إلى حسابك',
    emailAddress: 'البريد الإلكتروني',
    rememberMe: 'تذكرني',
    forgotPassword: 'نسيت كلمة المرور؟',
    signingIn: 'جاري تسجيل الدخول...',
    createAccount: 'إنشاء حساب',
    or: 'أو',
    loading: 'جاري التحميل...',
    
    // Register Page
    createYourAccount: 'إنشاء حسابك',
    fullNameRequired: 'الاسم الكامل *',
    emailAddressRequired: 'البريد الإلكتروني *',
    phoneNumberRequired: 'رقم الهاتف *',
    passwordRequired: 'كلمة المرور * (6 أحرف على الأقل)',
    confirmPassword: 'تأكيد كلمة المرور *',
    agreeToTerms: 'أوافق على',
    termsAndConditions: 'الشروط والأحكام',
    and: 'و',
    creatingAccount: 'جاري إنشاء الحساب...',
    
    // Cart Page
    shoppingCart: 'سلة التسوق',
    itemsInCart: 'عناصر في سلتك',
    continueShoppingButton: 'متابعة التسوق',
    itemTotal: 'إجمالي العنصر',
    clearCart: 'إفراغ السلة',
    voucherCode: 'رمز القسيمة',
    enterCode: 'أدخل الرمز',
    applyVoucher: 'تطبيق',
    removeVoucher: 'إزالة',
    voucherApplied: 'تم تطبيق القسيمة',
    discount: 'الخصم',
    freeShipping: '🎉 حصلت على شحن مجاني!',
    addMoreForFreeShipping: 'أضف $',
    moreForFreeShipping: ' للحصول على شحن مجاني!',
    paymentMethod: '💰 طريقة الدفع:',
    cashOnDelivery: 'الدفع عند الاستلام متاح لجميع الطلبات',
    yourCartIsEmpty: 'سلة التسوق فارغة',
    notAddedYet: 'يبدو أنك لم تضف أي شيء إلى سلتك بعد',
    startShopping: 'ابدأ التسوق',
    signInRequired: 'يجب تسجيل الدخول',
    signInToViewCart: 'يرجى تسجيل الدخول إلى حسابك لعرض سلتك ومتابعة الطلب',
    removeItemConfirm: 'إزالة هذا العنصر من السلة؟',
    
    // Profile Page
    myProfile: 'ملفي الشخصي',
    accountInformation: 'معلومات الحساب',
    myOrders: 'طلباتي',
    myFavourites: 'المفضلة',
    editProfile: 'تعديل الملف',
    saveChanges: 'حفظ التغييرات',
    cancel: 'إلغاء',
    name: 'الاسم',
    phone: 'الهاتف',
    address: 'العنوان',
    city: 'المدينة',
    postalCode: 'الرمز البريدي',
    orderHistory: 'سجل الطلبات',
    orderDate: 'تاريخ الطلب',
    orderStatus: 'الحالة',
    orderItems: 'العناصر',
    viewDetails: 'عرض التفاصيل',
    noOrders: 'لا توجد طلبات بعد',
    startShoppingToSeeOrders: 'ابدأ التسوق لرؤية طلباتك هنا',
    favouriteProducts: 'المنتجات المفضلة',
    noFavourites: 'لا توجد مفضلات بعد',
    addFavourites: 'أضف منتجات إلى مفضلتك لرؤيتها هنا',
    delivered: 'تم التوصيل',
    shipped: 'تم الشحن',
    processing: 'قيد المعالجة',
    emailCannotChange: 'لا يمكن تغيير البريد الإلكتروني',
    enterStreetAddress: 'أدخل عنوان الشارع',
    enterCity: 'أدخل المدينة',
    enterPostalCode: 'أدخل الرمز البريدي',
    
    // Checkout
    checkoutTitle: 'إتمام الطلب',
    deliveryInformation: 'معلومات التوصيل',
    paymentInformation: 'معلومات الدفع',
    placeOrder: 'تأكيد الطلب',
    orderPlaced: 'تم تقديم الطلب بنجاح',
    thankYou: 'شكراً لك على طلبك',
    orderNumber: 'رقم الطلب',
    backToHome: 'العودة للرئيسية',
    contactInformation: 'معلومات الاتصال',
    deliveryAddress: 'عنوان التوصيل',
    streetAddress: 'عنوان الشارع *',
    deliveryNotes: 'ملاحظات التوصيل (اختياري)',
    placingOrder: 'جاري تقديم الطلب...',
    backToCart: 'العودة للسلة',
    completeOrder: 'أكمل طلبك مع الدفع عند الاستلام',
    anySpecialDelivery: 'أي تعليمات خاصة بالتوصيل...',
    byPlacingOrder: 'بتقديم الطلب، أنت توافق على الشروط والأحكام',
    
    // Best Sellers / Redirect Page
    redirectingBestSellers: 'جاري التوجيه للأكثر مبيعاً...',

    // New Arrivals Page
    newArrivals: 'وصل حديثاً',
    newArrivalsSubtitle: 'اكتشفي أحدث ابتكارات الجمال',

    // Makeup Page
    makeupTitle: 'المكياج',
    makeupSubtitle: 'مجموعة المكياج الكاملة',
    featuredMakeup: 'مكياج مميز',

    // Skincare Page
    skincareTitle: 'العناية بالبشرة',
    skincareSubtitle: 'البشرة الصحية جمال حقيقي',
    shopSkincare: 'تسوق العناية بالبشرة',
    yourSkincareRoutine: 'روتين العناية ببشرتك',
    skincareRoutineSubtitle: 'ابني روتين العناية المثالي ببشرتك مع منتجاتنا المختارة بعناية',
    whyOopsskinSkincare: 'لماذا عناية oopsskin بالبشرة؟',
    naturalIngredients: 'مكونات طبيعية',
    naturalIngredientsDesc: 'مُصاغة بأفضل المكونات الطبيعية والعضوية للعناية اللطيفة والفعالة',
    scientificallyProven: 'مثبت علمياً',
    scientificallyProvenDesc: 'مدعوم بالأبحاث الجلدية والاختبارات السريرية لنتائج ملموسة',
    crueltyFree: 'لم يُختبر على الحيوانات',
    crueltyFreeDesc: 'لا يُختبر على الحيوانات أبداً - جمال بضمير',
    bestsellingSkincareTitle: 'الأكثر مبيعاً في العناية بالبشرة',
    skincareProductName: 'سيروم الترطيب',
    skincareProductDesc: 'ترطيب عميق لجميع أنواع البشرة',
    cleansers: 'المنظفات',
    toners: 'التونر',
    serums: 'السيروم',
    moisturizers: 'المرطبات',
    masks: 'الأقنعة',
    eyeCare: 'العناية بالعيون',
    sunscreen: 'واقي الشمس',
    nightCare: 'العناية الليلية',

    // Packages Page
    packagesTitle: 'العروض والمجموعات',
    packagesSubtitle: 'مجموعات مختارة لكل احتياج جمالي',
    includes: 'يتضمن:',
    whyBuyPackages: 'لماذا تشتري المجموعات؟',
    saveMore: 'وفري أكثر',
    saveMoreDesc: 'احصلي على خصم يصل إلى 30% عند شراء المجموعات',
    curatedCollections: 'مجموعات مختارة',
    curatedCollectionsDesc: 'منتجات تعمل معاً بشكل مثالي',
    perfectGifts: 'هدايا مثالية',
    perfectGiftsDesc: 'تغليف هدايا جاهز متاح',

    // Error Messages
    passwordsDoNotMatch: 'كلمات المرور غير متطابقة!',
    passwordTooShort: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل!',
    loginFailed: 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.',
    registrationFailed: 'فشل التسجيل. يرجى المحاولة مرة أخرى.',
    enterVoucherCode: 'يرجى إدخال رمز القسيمة',
    invalidVoucher: 'رمز قسيمة غير صالح',
    minimumOrderAmount: 'الحد الأدنى لمبلغ الطلب $',
    required: ' مطلوب',
    failedToApplyVoucher: 'فشل تطبيق القسيمة. يرجى المحاولة مرة أخرى.',
    failedToUpdateQuantity: 'فشل تحديث الكمية',
    failedToRemove: 'فشلت الإزالة',
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
