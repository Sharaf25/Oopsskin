'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Star, Gift, Plus, Minus } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useLanguage } from '@/app/context/LanguageContext';
import Link from 'next/link';

// This tells Next.js to use dynamic rendering for this page
export const dynamic = 'force-dynamic';

// Product interface - will be populated with API data later
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  badge?: string;
  colors?: string[];
  category?: string;
  dimensions?: string;
  features?: string[];
}

// Mock data - will be replaced with API call
const getMockProduct = (id: string): Product => ({
  id: id,
  name: 'LARGE VANITY BAG',
  description: 'The ultimate Power Pink vanity that fits all your favs. ● H: 23.5 cm X W 26 cm X D 9.5 cm',
  price: 59.00,
  rating: 4.9,
  reviewCount: 234,
  badge: 'NEW',
  category: 'VIP Access Week',
  dimensions: 'H: 23.5 cm X W 26 cm X D 9.5 cm',
  images: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&h=800&fit=crop',
    'https://cdn.britannica.com/35/222035-050-C68AD682/makeup-cosmetics.jpg',
    'https://cdn.britannica.com/35/222035-050-C68AD682/makeup-cosmetics.jpg',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=800&fit=crop',
  ],
  colors: ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB'],
  features: [
    'Premium quality materials',
    'Multiple compartments',
    'Easy to clean',
    'Zipper closure',
    'Perfect gift for makeup lovers',
  ],
});

// Mock related products
const getRelatedProducts = () => [
  {
    id: '2',
    name: 'بودر نصر كم',
    description: 'Super fine pressed powder for flawless finish',
    price: 25.00,
    rating: 5.0,
    reviewCount: 45,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop',
    badge: 'BESTSELLER',
    colors: ['#FFE4E1', '#F5DEB3', '#DEB887', '#D2691E', '#8B4513'],
  },
  {
    id: '3',
    name: 'لادي نص كم',
    description: 'Premium makeup setting spray',
    price: 25.00,
    rating: 4.9,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    colors: ['#FFE4E1', '#F5DEB3', '#DEB887', '#D2691E'],
  },
  {
    id: '4',
    name: 'روج مطفي',
    description: 'Long-lasting matte lipstick',
    price: 25.00,
    rating: 5.0,
    reviewCount: 156,
    image: 'https://cdn.britannica.com/35/222035-050-C68AD682/makeup-cosmetics.jpg',
    badge: 'EXCLUSIVE',
    colors: ['#FFE4E1', '#F5DEB3', '#DEB887'],
  },
  {
    id: '5',
    name: 'ماسكارا فاخرة',
    description: 'Volumizing mascara for dramatic lashes',
    price: 25.00,
    rating: 4.8,
    reviewCount: 67,
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=400&fit=crop',
    colors: ['#000000', '#8B4513'],
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showProductInfo, setShowProductInfo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    // fetchProduct(params.id);
    
    // For now, use mock data
    setTimeout(() => {
      const mockProduct = getMockProduct(params.id as string);
      setProduct(mockProduct);
      setRelatedProducts(getRelatedProducts());
      setLoading(false);
    }, 500);
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!product) return;

    const result = await addToCart(product.id, quantity);
    if (result.success) {
      alert(`${product.name} added to cart!`);
    } else {
      alert(result.error || 'Failed to add to cart');
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link href="/all-products" className="text-pink-500 hover:underline">
            Return to All Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-pink-500">Shop All</Link>
            <span>/</span>
            {product.category && (
              <>
                <span>{product.category}</span>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Left Side - Image Gallery */}
            <div className="flex gap-4">
              {/* Thumbnail Column */}
              <div className="flex flex-col gap-3 w-20">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-pink-500 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 relative">
                <div className="aspect-square bg-gradient-to-br from-[#f5e6d3] to-[#e8d4ba] rounded-2xl overflow-hidden">
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Product Details */}
            <div className="flex flex-col">
              {/* Badge */}
              {product.badge && (
                <div className="mb-3">
                  <span className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase">
                    {product.badge}
                  </span>
                </div>
              )}

              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 uppercase">
                {product.name}
              </h1>

              {/* Description */}
              <p className="text-gray-600 mb-4 leading-relaxed">
                {product.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex text-pink-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                      className={i < Math.floor(product.rating) ? '' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-lg font-bold text-gray-900">{product.rating}</span>
                <span className="text-gray-500">({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-black text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* Color Swatches */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-bold text-gray-700 mb-3 uppercase">Select Color</p>
                  <div className="flex items-center gap-2">
                    {product.colors.map((color, idx) => (
                      <button
                        key={idx}
                        className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-pink-500 transition-all hover:scale-110"
                        style={{ backgroundColor: color }}
                        title={`Color ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <p className="text-sm font-bold text-gray-700 mb-3 uppercase">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementQuantity}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-pink-500 hover:text-pink-500 transition-all"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-xl font-bold text-gray-900 w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-pink-500 hover:text-pink-500 transition-all"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-black py-4 px-8 rounded-full uppercase text-lg transition-all transform hover:scale-105 shadow-lg mb-4"
              >
                {isAuthenticated ? 'Add to Cart' : 'Login to Shop'}
              </button>

              {/* Points Info */}
              {isAuthenticated && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                  <Gift size={18} className="text-pink-500" />
                  <span>
                    You could earn up to <strong className="text-gray-900">59 Points</strong> with VIPs
                  </span>
                </div>
              )}

              {/* Product Info Accordion */}
              <div className="border-t border-gray-200 pt-6">
                <button
                  onClick={() => setShowProductInfo(!showProductInfo)}
                  className="w-full flex items-center justify-between text-left font-bold text-gray-900 uppercase"
                >
                  <span>Product Info</span>
                  <span className="text-2xl">{showProductInfo ? '−' : '+'}</span>
                </button>
                
                {showProductInfo && (
                  <div className="mt-4 space-y-3 text-gray-600">
                    {product.features && product.features.map((feature, idx) => (
                      <p key={idx} className="flex items-start gap-2">
                        <span className="text-pink-500 mt-1">•</span>
                        <span>{feature}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-pink-500 uppercase">
              You May Also Like
            </h2>
          </div>

          {/* Related Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/product/${relatedProduct.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gradient-to-br from-[#f5e6d3] to-[#e8d4ba] overflow-hidden">
                  {relatedProduct.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-lg">
                        {relatedProduct.badge}
                      </span>
                    </div>
                  )}
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="font-bold text-base text-gray-900 mb-1 line-clamp-1">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                    {relatedProduct.description}
                  </p>

                  {/* Price */}
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-gray-900">
                      ${relatedProduct.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Color Swatches */}
                  {relatedProduct.colors && relatedProduct.colors.length > 0 && (
                    <div className="flex items-center gap-1.5 mb-3">
                      {relatedProduct.colors.slice(0, 5).map((color: string, idx: number) => (
                        <div
                          key={idx}
                          className="w-7 h-7 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-pink-500">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-lg">
                          {i < Math.floor(relatedProduct.rating) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">
                      {relatedProduct.rating.toFixed(1)} ({relatedProduct.reviewCount})
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
