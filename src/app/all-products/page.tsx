'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useLanguage } from '@/app/context/LanguageContext';
import { API_ENDPOINTS, API_BASE_URL } from '@/config/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductRating from '@/app/components/ProductRating';
import Link from 'next/link';

// Product interface from new API (actual response structure)
interface Product {
  id: number;
  name: string;
  price: number;
  before_price?: number | null;
  badge?: string | null;
  star_rating: number;
  user_rating?: number | null;
  stock: number;
  featured_image: string;
  category: string;
  tags: string[];
  // Optional computed fields
  colors?: string[];
}

function AllProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'asc' | 'desc' | 'featured'>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();

  useEffect(() => {
    const category = searchParams?.get('category');
    if (category) {
      setSelectedSubcategory(category);
    }
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build URL with all query parameters
      let url = `${API_ENDPOINTS.PRODUCTS.BASE}?lang=${language}&page=${currentPage}&limit=${itemsPerPage}`;
      
      // Add sort parameter if not featured
      if (sortBy !== 'featured') {
        url += `&sort=${sortBy}`;
      }
      
      // Add price range filters
      if (priceRange[0] > 0) {
        url += `&minPrice=${priceRange[0]}`;
      }
      if (priceRange[1] < 1000) {
        url += `&maxPrice=${priceRange[1]}`;
      }
      
      // Add search query if present
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data = await response.json();

      // Handle the API response structure
      if (data && data.data && Array.isArray(data.data)) {
        // Use real rating data from API, add only colors for UI
        const enhancedProducts = data.data.map((product: Product) => ({
          ...product,
          price: parseFloat(product.price as unknown as string) || 0,
          before_price: product.before_price != null ? parseFloat(product.before_price as unknown as string) : null,
          colors: ['#FFE4E1', '#F5DEB3', '#DEB887', '#D2691E'].slice(0, Math.floor(Math.random() * 4) + 2),
        }));
        
        setProducts(enhancedProducts);
        setTotalCount(data.totalItems || data.data.length);
        setTotalPages(data.totalPages || Math.ceil((data.totalItems || data.data.length) / itemsPerPage));
      } else {
        setError(t('failedToLoad'));
      }
      
    } catch (err: any) {
      setError(t('failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, [sortBy, currentPage, language, priceRange, searchQuery]);

  // Reset to page 1 when category, sort, price range, or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubcategory, sortBy, priceRange, searchQuery]);

  const categories = [
    {
      name: t('face'),
      items: [t('foundation'), t('powderSettingSpray'), t('primer'), t('concealerCorrector'), t('contourHighlight')],
    },
    {
      name: t('eyes'),
      items: [t('eyeshadow'), t('eyebrows'), t('eyeliner'), t('mascara'), t('fakeEyelashes')],
    },
    {
      name: t('lips'),
      items: [t('jellyStainedLips'), t('lipGloss'), t('lipstick'), t('lipLiner'), t('lipBalm')],
    },
    {
      name: t('cheek'),
      items: [t('blush'), t('bronzer')],
    },
    {
      name: t('brushesTools'),
      items: [t('brushes'), t('toolsAccessories')],
    },
    {
      name: t('minis'),
      items: [t('miniProducts')],
    },
  ];

  // Filter products (client-side filtering for now)
  const filteredProducts = selectedSubcategory && selectedSubcategory !== 'All'
    ? products.filter((p) => p.category === selectedSubcategory)
    : products;

  // Use products from current page (already paginated by API)
  const currentProducts = filteredProducts;

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 uppercase">
            {t('allProducts')}
          </h1>
          <p className="text-xl text-white">
            {selectedSubcategory && selectedSubcategory !== 'All'
              ? `${t('showing')}: ${selectedSubcategory}`
              : t('shopOurCompleteCollection')}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase">{t('categories')}</h2>
              
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSubcategory(null);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg mb-2 font-bold transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-700 hover:bg-pink-50'
                }`}
              >
                {t('allProducts')}
              </button>

              {categories.map((category) => (
                <div key={category.name} className="mb-4">
                  <button
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-colors ${
                      selectedCategory === category.name
                        ? 'bg-pink-100 text-pink-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {category.name}
                  </button>
                  {selectedCategory === category.name && (
                    <div className="ml-4 mt-2 space-y-1">
                      {category.items.map((item) => (
                        <button
                          key={item}
                          onClick={() => setSelectedSubcategory(item)}
                          className={`block w-full text-left px-4 py-2 text-sm rounded transition-colors ${
                            selectedSubcategory === item
                              ? 'bg-pink-500 text-white'
                              : 'text-gray-600 hover:bg-pink-50'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Price Range Filter */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-black text-gray-900 mb-4 uppercase">{t('priceRange')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  
                  {/* Dual-Handle Range Slider */}
                  <div className="relative h-6">
                    {/* Track */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-gray-200 rounded-lg"></div>
                    
                    {/* Active Track */}
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 h-2 bg-pink-500 rounded-lg"
                      style={{
                        left: `${(priceRange[0] / 1000) * 100}%`,
                        right: `${100 - (priceRange[1] / 1000) * 100}%`
                      }}
                    ></div>
                    
                    {/* Min Handle */}
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const newMin = parseInt(e.target.value);
                        if (newMin <= priceRange[1] - 10) {
                          setPriceRange([newMin, priceRange[1]]);
                        }
                      }}
                      className="absolute top-0 w-full h-full appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-pink-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:bg-pink-50 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-pink-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:bg-pink-50"
                    />
                    
                    {/* Max Handle */}
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const newMax = parseInt(e.target.value);
                        if (newMax >= priceRange[0] + 10) {
                          setPriceRange([priceRange[0], newMax]);
                        }
                      }}
                      className="absolute top-0 w-full h-full appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-pink-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:bg-pink-50 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-pink-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:bg-pink-50"
                    />
                  </div>

                  {/* Reset Price Filter */}
                  <button
                    onClick={() => setPriceRange([0, 1000])}
                    className="w-full text-sm text-pink-500 hover:text-pink-600 font-medium"
                  >
                    {t('resetPriceFilter')}
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('searchProducts')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {t('showing')} {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalCount)} {t('of')} {totalCount} {t('products')}
              </p>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'asc' | 'desc' | 'featured')}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700"
              >
                <option value="featured">{t('sortByFeatured')}</option>
                <option value="asc">{t('priceLowToHigh')}</option>
                <option value="desc">{t('priceHighToLow')}</option>
              </select>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">{t('loadingProducts')}</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 font-medium">{error}</p>
                <button 
                  onClick={fetchProducts}
                  className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-lg"
                >
                  {t('tryAgain')}
                </button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && currentProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Product Image - Clickable */}
                    <Link href={`/product/${product.id}`}>
                      <div className="relative aspect-square bg-gradient-to-br from-[#f5e6d3] to-[#e8d4ba] overflow-hidden cursor-pointer">
                        {/* Badge */}
                        {product.badge && (
                          <div className="absolute top-3 left-3 z-10">
                            <span className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-lg">
                              {product.badge}
                            </span>
                          </div>
                        )}
                        
                        <img 
                          src={
                            product.featured_image 
                              ? product.featured_image.startsWith('http') 
                                ? product.featured_image 
                                : `${API_BASE_URL.replace('/api', '')}/${product.featured_image}`
                              : 'https://via.placeholder.com/400x400?text=Product'
                          } 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Product';
                          }}
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-5">
                      {/* Product Name - Clickable */}
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-bold text-base text-gray-900 mb-1 line-clamp-1 hover:text-pink-500 transition-colors cursor-pointer">
                          {product.name}
                        </h3>
                      </Link>
                      
                      {/* Product Category */}
                      <p className="text-sm text-gray-600 mb-3">{product.category}</p>

                      {/* Price */}
                      <div className="mb-3">
                        {product.before_price && (
                          <span className="text-sm text-gray-400 line-through mr-2">
                            ${product.before_price.toFixed(2)}
                          </span>
                        )}
                        <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      </div>

                      {/* Color Swatches */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center gap-1.5 mb-3">
                          {product.colors.slice(0, 5).map((color, idx) => (
                            <div
                              key={idx}
                              className="w-7 h-7 rounded-full border-2 border-gray-300 cursor-pointer hover:border-pink-500 transition-all"
                              style={{ backgroundColor: color }}
                              title={`${t('color')} ${idx + 1}`}
                            />
                          ))}
                          {product.colors.length > 5 && (
                            <button className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white hover:border-pink-500 transition-all">
                              <span className="text-xs text-gray-600 font-medium">+</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Rating - Interactive */}
                      <div className="mb-4">
                        <ProductRating
                          productId={product.id}
                          currentRating={product.star_rating || 0}
                          ratingCount={0}
                          userRating={product.user_rating || undefined}
                          onRatingSubmitted={(newRating, newCount) => {
                            // Update the product in the list with new rating
                            setProducts(prev => prev.map(p => 
                              p.id === product.id 
                                ? { ...p, star_rating: newRating }
                                : p
                            ));
                          }}
                          size="small"
                          showCount={false}
                          interactive={true}
                          showUserRating={false}
                        />
                      </div>

                      {/* Add to Cart Button */}
                      <button 
                        onClick={async () => {
                          if (!isAuthenticated) {
                            if (confirm(t('needSignIn'))) {
                              router.push('/login');
                            }
                            return;
                          }
                          
                          const result = await addToCart(product.id.toString(), 1);
                          if (result.success) {
                            alert(`${product.name} ${t('addedToCart')}`);
                          } else {
                            alert(result.error || t('failedToLoad'));
                          }
                        }}
                        className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-full uppercase text-sm transition-all transform hover:scale-105 shadow-md"
                      >
                        {t('addToCart')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && currentProducts.length === 0 && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <p className="text-2xl text-gray-600 mb-4">{t('noProductsFound')}</p>
                  <p className="text-gray-500">{t('adjustFilters')}</p>
                  <button 
                    onClick={fetchProducts}
                    className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-lg"
                  >
                    {t('reloadProducts')}
                  </button>
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && !loading && !error && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page Info */}
                <div className="text-sm text-gray-600">
                  {t('page')} {currentPage} {t('of')} {totalPages}
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-pink-50 hover:border-pink-300'
                    }`}
                  >
                    <ChevronLeft size={18} />
                    <span className="hidden sm:inline">{t('previous')}</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() => typeof page === 'number' && goToPage(page)}
                        disabled={page === '...'}
                        className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg font-bold transition-all ${
                          page === currentPage
                            ? 'bg-pink-500 text-white'
                            : page === '...'
                            ? 'bg-transparent text-gray-400 cursor-default'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-pink-50 hover:border-pink-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-pink-50 hover:border-pink-300'
                    }`}
                  >
                    <span className="hidden sm:inline">{t('next')}</span>
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* Items Per Page Info */}
                <div className="text-sm text-gray-600">
                  {itemsPerPage} {t('itemsPerPage')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AllProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500"></div>
      </div>
    }>
      <AllProductsContent />
    </Suspense>
  );
}
