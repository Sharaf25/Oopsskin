'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  colors: string[];
  rating: number;
  reviews: number;
  badge?: string;
  discount?: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Easy Bake Pressed Powder Phone Grip',
    description: 'Your favourite Easy Bake Pressed Powder, now as a phone grip for touch-ups anywhere',
    price: 29.0,
    colors: ['#FFE4E1', '#F5DEB3', '#DEB887', '#D2691E', '#8B4513'],
    rating: 5.0,
    reviews: 3,
    badge: 'EXCLUSIVE',
  },
  {
    id: 2,
    name: 'Easy Bake Pressed Powder',
    description: 'Super fine pressed powder with silky shine control for a natural, velvety matte finish',
    price: 43.0,
    colors: ['#FFE4E1', '#F5DEB3', '#DEB887', '#D2691E'],
    rating: 4.9,
    reviews: 1129,
  },
  {
    id: 3,
    name: 'Airbrush Made Easy Kit',
    description: 'Easy Bake Pressed Powder and the Marshmallow Sponge, bundled for effortless flawless ups',
    price: 53.0,
    originalPrice: 84.0,
    colors: ['#FFE4E1', '#F5DEB3', '#DEB887'],
    rating: 5.0,
    reviews: 8,
    discount: 'SAVE 37%',
  },
  {
    id: 4,
    name: 'The Prime, Blur & Press Kit',
    description: 'This Easy Routine with an airbrush finish using the Easy Bake Pressed',
    price: 85.0,
    originalPrice: 96.0,
    colors: ['#000000', '#FFE4E1', '#F5DEB3'],
    rating: 5.0,
    reviews: 10,
    discount: 'SAVE 67%',
  },
  {
    id: 5,
    name: 'Bake & Blur Setting Powder',
    description: 'Easy baking powder for a soft-focus, blurred finish',
    price: 38.0,
    colors: ['#FFE4E1', '#F5DEB3', '#DEB887'],
    rating: 4.8,
    reviews: 856,
  },
  {
    id: 6,
    name: 'Foundation Essentials Kit',
    description: 'Complete foundation kit with primer, powder and sponge',
    price: 95.0,
    originalPrice: 120.0,
    colors: ['#FFE4E1', '#F5DEB3', '#DEB887', '#D2691E'],
    rating: 5.0,
    reviews: 234,
    discount: 'SAVE 20%',
  },
];

export function ProductCarousel() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedColors, setSelectedColors] = useState<{ [key: number]: number }>({});
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      if (confirm('You need to sign in to add items to cart. Go to login page?')) {
        router.push('/login');
      }
      return;
    }

    const colorIndex = selectedColors[product.id] || 0;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      color: product.colors[colorIndex],
      category: 'Makeup',
    });
    alert(`${product.name} added to cart!`);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const getVisibleProducts = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      visible.push(products[(currentIndex + i) % products.length]);
    }
    return visible;
  };

  return (
    <section id="best-sellers" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-black text-pink-500 text-center mb-12 uppercase">
          BEST SELLERS
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
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100 p-4">
                  {product.badge && (
                    <span className="absolute top-4 left-4 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {product.badge}
                    </span>
                  )}
                  {product.discount && (
                    <span className="absolute top-4 left-4 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {product.discount}
                    </span>
                  )}
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-32 h-32 bg-pink-400 rounded-full" />
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Color Selector */}
                  <div className="flex items-center gap-2 mb-3">
                    {product.colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          setSelectedColors({ ...selectedColors, [product.id]: idx })
                        }
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColors[product.id] === idx
                            ? 'border-pink-500 scale-110'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <button className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-pink-500">
                      +
                    </button>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-pink-500">
                      {'★'.repeat(Math.floor(product.rating))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-full uppercase text-sm transition-all transform hover:scale-105"
                  >
                    ADD TO CART
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
