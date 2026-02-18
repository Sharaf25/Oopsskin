'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useLanguage } from '@/app/context/LanguageContext';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  item_img: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  colors?: string[];
}

export function ProductCarousel() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  // Fetch best sellers from API
  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products?sort=asc&limit=6');
      
      if (response.ok) {
        const data = await response.json();
        
        // Styling data for visual variety
        const badges = ['EXCLUSIVE', 'BESTSELLER', null, 'NEW', null, null];
        const colorSets = [
          ['#FFE4E1', '#F5DEB3', '#DEB887', '#D2691E', '#8B4513'],
          ['#FFE4E1', '#F5DEB3', '#DEB887', '#D2691E'],
          ['#FFE4E1', '#F5DEB3', '#DEB887'],
          ['#FFE4E1', '#F5DEB3', '#DEB887', '#D2691E'],
          ['#FFE4E1', '#F5DEB3'],
          ['#DEB887', '#D2691E', '#8B4513'],
        ];
        
        const transformedProducts: Product[] = data.data.slice(0, 6).map((item: any, index: number) => ({
          id: item.id,
          name: item.name,
          description: item.name_e || '',
          price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
          item_img: item.item_img,
          rating: 4.5 + Math.random() * 0.5,
          reviewCount: Math.floor(Math.random() * 100) + 10,
          badge: badges[index % badges.length] || undefined,
          colors: colorSets[index % colorSets.length],
        }));
        setProducts(transformedProducts);
      }
    } catch (error) {
      console.error('Error fetching best sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
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
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const getVisibleProducts = () => {
    if (products.length === 0) return [];
    const visible = [];
    for (let i = 0; i < Math.min(4, products.length); i++) {
      visible.push(products[(currentIndex + i) % products.length]);
    }
    return visible;
  };

  if (loading) {
    return (
      <section id="best-sellers" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-pink-500 text-center mb-12 uppercase">
            {t('bestSellers')}
          </h2>
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section id="best-sellers" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-black text-pink-500 text-center mb-12 uppercase">
          {t('bestSellers')}
        </h2>

        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full shadow-lg transition-all"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full shadow-lg transition-all"
          >
            <ChevronRight size={24} />
          </button>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getVisibleProducts().map((product) => (
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
                      src={product.item_img} 
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
                  {/* Product Name (Arabic) - Clickable */}
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-bold text-base text-gray-900 mb-1 line-clamp-1 hover:text-pink-500 transition-colors cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {/* Product Description (English) */}
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{product.description}</p>
                  )}

                  {/* Price */}
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  </div>

                  {/* Color Swatches */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="flex items-center gap-1.5 mb-3">
                      {product.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-7 h-7 rounded-full border-2 border-gray-300 cursor-pointer hover:border-pink-500 transition-all"
                          style={{ backgroundColor: color }}
                          title={`Color ${idx + 1}`}
                        />
                      ))}
                      {product.colors.length > 5 && (
                        <button className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white hover:border-pink-500 transition-all">
                          <span className="text-xs text-gray-600 font-medium">+</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-pink-500">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-lg">
                            {i < Math.floor(product.rating!) ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-700 font-medium">
                        {product.rating.toFixed(1)} ({product.reviewCount})
                      </span>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-full uppercase text-sm transition-all transform hover:scale-105 shadow-md"
                  >
                    {t('addToCart')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
