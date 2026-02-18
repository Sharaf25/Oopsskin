'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useLanguage } from '@/app/context/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Product interface from API
interface Product {
  id: string;
  name: string;
  name_e?: string;
  price: number;
  item_img: string;
  color_id_main?: string;
  color_id_measure?: string[];
  category?: string;
  rating?: number;
}

function AllProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Products per page
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'asc' | 'desc' | 'featured'>('featured');
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const category = searchParams?.get('category');
    if (category) {
      setSelectedSubcategory(category);
    }
  }, [searchParams]);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, [sortBy]);

  // Reset to page 1 when category or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubcategory, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (sortBy !== 'featured') {
        params.append('sort', sortBy);
      }

      const url = `http://localhost:5000/api/products${params.toString() ? '?' + params.toString() : ''}`;
      console.log('🔍 Fetching products from:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      console.log('✅ Products fetched:', data);

      // Transform API data to frontend format
      const transformedProducts: Product[] = data.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        name_e: item.name_e,
        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
        item_img: item.item_img,
        color_id_main: item.color_id_main,
        color_id_measure: item.color_id_measure,
        category: item.category || item.class_id,
        rating: 4.5 + Math.random() * 0.5, // Placeholder rating (can be removed when API provides)
      }));

      setProducts(transformedProducts);
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

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
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {t('showing')} {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} {t('of')} {filteredProducts.length} {t('products')}
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
                  <p className="text-gray-600">Loading products...</p>
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
                  Try Again
                </button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gradient-to-br from-pink-100 to-purple-100 overflow-hidden">
                      <img 
                        src={product.item_img} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails
                          e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Product';
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      {product.category && (
                        <p className="text-xs text-gray-500 mb-1 uppercase">{product.category}</p>
                      )}
                      <h3 className="font-bold text-lg mb-2 text-gray-900">{product.name}</h3>

                      {/* Rating */}
                      {product.rating && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex text-pink-500 text-sm">
                            {'★'.repeat(Math.floor(product.rating))}
                            {product.rating % 1 !== 0 && '☆'}
                          </div>
                          <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
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
                          
                          const result = await addToCart(product.id, 1);
                          if (result.success) {
                            alert(`${product.name} ${t('addedToCart')}`);
                          } else {
                            alert(result.error || 'Failed to add to cart');
                          }
                        }}
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-full uppercase text-sm transition-all transform hover:scale-105"
                      >
                        {t('addToCart')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    }>
      <AllProductsContent />
    </Suspense>
  );
}
