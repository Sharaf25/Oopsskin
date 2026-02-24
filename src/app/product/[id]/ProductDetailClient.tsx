'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Gift, Plus, Minus } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  before_price?: number;
  stock?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  badge?: string;
  colors?: string[];
  category?: string;
  dimensions?: string;
  features?: string[];
  tags?: string[];
}

export default function ProductDetailClient({ 
  product: initialProduct, 
  relatedProducts: initialRelatedProducts 
}: { 
  product: Product; 
  relatedProducts: any[] 
}) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product>(initialProduct);
  const [relatedProducts, setRelatedProducts] = useState(initialRelatedProducts);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showProductInfo, setShowProductInfo] = useState(false);

  // Update local state when props change (due to language switch in parent)
  useEffect(() => {
    setProduct(initialProduct);
    setRelatedProducts(initialRelatedProducts);
    setSelectedImage(0); // Reset to first image when product changes
  }, [initialProduct, initialRelatedProducts]);

  useEffect(() => {
    setQuantity(1);
  }, [product?.id]);

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
            <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>

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
              {product.before_price && product.before_price > product.price && (
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl text-gray-400 line-through">${product.before_price.toFixed(2)}</span>
                  <span className="bg-red-100 text-red-600 text-sm font-bold px-3 py-1 rounded-full">
                    SAVE ${(product.before_price - product.price).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-gray-900">${product.price.toFixed(2)}</span>
                {product.stock !== undefined && (
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    product.stock > 10 
                      ? 'bg-green-100 text-green-600' 
                      : product.stock > 0 
                      ? 'bg-yellow-100 text-yellow-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                )}
              </div>
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
                <span className="text-xl font-bold text-gray-900 w-12 text-center">{quantity}</span>
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
                <div className="mt-4 space-y-4">
                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div>
                      <p className="font-bold text-gray-900 mb-2">Tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-pink-100 text-pink-600 text-sm font-medium px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="space-y-2 text-gray-600">
                      {product.features.map((feature, idx) => (
                        <p key={idx} className="flex items-start gap-2">
                          <span className="text-pink-500 mt-1">•</span>
                          <span>{feature}</span>
                        </p>
                      ))}
                    </div>
                  )}
                  
                  {/* Category */}
                  {product.category && (
                    <p className="text-gray-600">
                      <span className="font-bold text-gray-900">Category:</span> {product.category}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-pink-500 uppercase">You May Also Like</h2>
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
                <img src={relatedProduct.image} alt={relatedProduct.name} className="w-full h-full object-cover" />
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="font-bold text-base text-gray-900 mb-1 line-clamp-1">{relatedProduct.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">{relatedProduct.description}</p>

                {/* Price */}
                <div className="mb-3">
                  <span className="text-2xl font-bold text-gray-900">${relatedProduct.price.toFixed(2)}</span>
                </div>

                {/* Color Swatches */}
                {relatedProduct.colors && relatedProduct.colors.length > 0 && (
                  <div className="flex items-center gap-1.5 mb-3">
                    {relatedProduct.colors.slice(0, 5).map((color: string, idx: number) => (
                      <div key={idx} className="w-7 h-7 rounded-full border-2 border-gray-300" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-pink-500">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg">{i < Math.floor(relatedProduct.rating) ? '★' : '☆'}</span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{relatedProduct.rating.toFixed(1)} ({relatedProduct.reviewCount})</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
