'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';

function AllProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedSubcategory(category);
    }
  }, [searchParams]);

  const categories = [
    {
      name: 'FACE',
      items: ['Foundation', 'Powder & Setting Spray', 'Primer', 'Concealer & Corrector', 'Contour & Highlight'],
    },
    {
      name: 'EYES',
      items: ['Eyeshadow', 'Eyebrows', 'Eyeliner', 'Mascara', 'Fake Eyelashes'],
    },
    {
      name: 'LIPS',
      items: ['Jelly Stained Lips', 'Lip Gloss', 'Lipstick', 'Lip Liner', 'Lip Balm'],
    },
    {
      name: 'CHEEK',
      items: ['Blush', 'Bronzer'],
    },
    {
      name: 'BRUSHES & TOOLS',
      items: ['Brushes', 'Tools & Accessories'],
    },
    {
      name: 'MINIS',
      items: ['Mini Products'],
    },
  ];

  // Sample products
  const allProducts = [
    { id: 1, name: 'Flawless Foundation', category: 'Foundation', price: 48.0, rating: 4.9 },
    { id: 2, name: 'HD Powder', category: 'Powder & Setting Spray', price: 43.0, rating: 4.8 },
    { id: 3, name: 'Velvet Primer', category: 'Primer', price: 35.0, rating: 4.7 },
    { id: 4, name: 'Perfecting Concealer', category: 'Concealer & Corrector', price: 32.0, rating: 4.9 },
    { id: 5, name: 'Contour Stick', category: 'Contour & Highlight', price: 28.0, rating: 4.6 },
    { id: 6, name: 'Eyeshadow Palette', category: 'Eyeshadow', price: 65.0, rating: 5.0 },
    { id: 7, name: 'Brow Pencil', category: 'Eyebrows', price: 22.0, rating: 4.8 },
    { id: 8, name: 'Liquid Eyeliner', category: 'Eyeliner', price: 24.0, rating: 4.9 },
    { id: 9, name: 'Volume Mascara', category: 'Mascara', price: 29.0, rating: 4.7 },
    { id: 10, name: 'Lash Extensions', category: 'Fake Eyelashes', price: 18.0, rating: 4.8 },
    { id: 11, name: 'Jelly Lip Stain', category: 'Jelly Stained Lips', price: 26.0, rating: 4.9 },
    { id: 12, name: 'Glossy Lip Oil', category: 'Lip Gloss', price: 22.0, rating: 4.6 },
    { id: 13, name: 'Matte Lipstick', category: 'Lipstick', price: 28.0, rating: 4.9 },
    { id: 14, name: 'Precision Lip Liner', category: 'Lip Liner', price: 20.0, rating: 4.7 },
    { id: 15, name: 'Nourishing Lip Balm', category: 'Lip Balm', price: 15.0, rating: 4.8 },
    { id: 16, name: 'Cream Blush', category: 'Blush', price: 32.0, rating: 4.9 },
    { id: 17, name: 'Bronzing Powder', category: 'Bronzer', price: 38.0, rating: 4.8 },
    { id: 18, name: 'Makeup Brush Set', category: 'Brushes', price: 89.0, rating: 5.0 },
    { id: 19, name: 'Beauty Sponge', category: 'Tools & Accessories', price: 18.0, rating: 4.7 },
    { id: 20, name: 'Mini Kit Collection', category: 'Mini Products', price: 45.0, rating: 4.9 },
  ];

  const filteredProducts = selectedSubcategory && selectedSubcategory !== 'All'
    ? allProducts.filter((p) => p.category === selectedSubcategory)
    : allProducts;

  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 uppercase">
            ALL PRODUCTS
          </h1>
          <p className="text-xl text-white">
            {selectedSubcategory && selectedSubcategory !== 'All'
              ? `Showing: ${selectedSubcategory}`
              : 'Shop our complete collection'}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase">Categories</h2>
              
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
                All Products
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
                Showing {filteredProducts.length} products
              </p>
              <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Selling</option>
                <option>Newest</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-pink-100 to-purple-100 p-4">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-32 h-32 bg-pink-400 rounded-full" />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1 uppercase">{product.category}</p>
                    <h3 className="font-bold text-lg mb-2 text-gray-900">{product.name}</h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-pink-500 text-sm">
                        {'★'.repeat(Math.floor(product.rating))}
                      </div>
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                      onClick={() => {
                        if (!isAuthenticated) {
                          if (confirm('You need to sign in to add items to cart. Go to login page?')) {
                            router.push('/login');
                          }
                          return;
                        }
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          category: product.category,
                        });
                        alert(`${product.name} added to cart!`);
                      }}
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
