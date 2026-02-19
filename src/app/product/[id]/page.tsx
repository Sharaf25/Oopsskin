import React from 'react';
import Link from 'next/link';
import ProductDetailClient from './ProductDetailClient';

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

// Mock data - used at build time for static export
const getMockProduct = (id: string): Product => ({
  id: id,
  name: `Product ${id} — LARGE VANITY BAG`,
  description: 'The ultimate Power Pink vanity that fits all your favs. ● H: 23.5 cm X W 26 cm X D 9.5 cm',
  price: 59.0,
  rating: 4.9,
  reviewCount: 234,
  badge: 'NEW',
  category: 'VIP Access Week',
  dimensions: 'H: 23.5 cm X W 26 cm X D 9.5 cm',
  images: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&h=800&fit=crop',
    'https://cdn.britannica.com/35/222035-050-C68AD682/makeup-cosmetics.jpg',
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

const getRelatedProducts = () => [
  {
    id: '2',
    name: 'بودر نصر كم',
    description: 'Super fine pressed powder for flawless finish',
    price: 25.0,
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
    price: 25.0,
    rating: 4.9,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    colors: ['#FFE4E1', '#F5DEB3', '#DEB887', '#D2691E'],
  },
  {
    id: '4',
    name: 'روج مطفي',
    description: 'Long-lasting matte lipstick',
    price: 25.0,
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
    price: 25.0,
    rating: 4.8,
    reviewCount: 67,
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=400&fit=crop',
    colors: ['#000000', '#8B4513'],
  },
];

// Provide a list of params to statically generate at build time.
// In a real app you'd fetch IDs from your backend here.
export async function generateStaticParams() {
  // For demo: pre-render product pages for ids 1..5
  return ['1', '2', '3', '4', '5'].map((id) => ({ id }));
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  // Build-time data fetch (mocked)
  const product = getMockProduct(params.id);
  const relatedProducts = getRelatedProducts();

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Render client-side interactive part */}
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
