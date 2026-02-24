import React from 'react';
import Link from 'next/link';
import ProductDetailWrapper from './ProductDetailWrapper';
import { API_ENDPOINTS, API_BASE_URL } from '@/config/api';

// Product interface matching API response
interface ProductImage {
  id: number;
  image_url: string;
  is_featured: boolean;
  createdAt: string;
  updatedAt: string;
  product_id: number;
}

interface APIProduct {
  id: number;
  name: string;
  details: string;
  price: number;
  before_price?: number | null;
  stock: number;
  badge?: string | null;
  star_rating: number;
  rating_count: number;
  category: string;
  tags: string[];
  images: ProductImage[];
}

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
  before_price?: number;
  stock?: number;
  tags?: string[];
}

// Fetch product from API
async function fetchProduct(id: string, lang: string = 'en'): Promise<Product | null> {
  try {
    console.log(`🔍 Fetching product ${id} with language ${lang}`);
    console.log(`📡 URL: ${API_ENDPOINTS.PRODUCTS.BY_ID(id)}?lang=${lang}`);
    
    const response = await fetch(`${API_ENDPOINTS.PRODUCTS.BY_ID(id)}?lang=${lang}`, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    console.log(`📊 Response status:`, response.status);

    if (!response.ok) {
      console.error(`❌ Failed to fetch product ${id}:`, response.status);
      return null;
    }

    const data: APIProduct = await response.json();
    console.log(`✅ Product data received:`, data);
    
    // Transform API response to match Product interface
    const product: Product = {
      id: data.id.toString(),
      name: data.name,
      description: data.details || '',
      price: data.price,
      before_price: data.before_price || undefined,
      stock: data.stock,
      rating: data.star_rating || 0,
      reviewCount: data.rating_count || 0,
      badge: data.badge || undefined,
      category: data.category,
      tags: data.tags || [],
      images: data.images.map((img) => 
        img.image_url.startsWith('http') 
          ? img.image_url 
          : `${API_BASE_URL.replace('/api', '')}/${img.image_url}`
      ),
      colors: ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB'], // Pink shades
      features: data.tags || [],
    };
    
    console.log(`✅ Transformed product:`, product);
    return product;
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    return null;
  }
}

// Fetch related products from API
async function fetchRelatedProducts(lang: string = 'en') {
  try {
    const response = await fetch(`${API_ENDPOINTS.PRODUCTS.BASE}?lang=${lang}&limit=4&sort=asc`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    
    return data.data.map((item: any) => ({
      id: item.id.toString(),
      name: item.name,
      description: item.category || '',
      price: item.price,
      rating: item.star_rating || 4.5,
      reviewCount: Math.floor(Math.random() * 100) + 10,
      image: item.featured_image 
        ? item.featured_image.startsWith('http') 
          ? item.featured_image 
          : `${API_BASE_URL.replace('/api', '')}/${item.featured_image}`
        : 'https://via.placeholder.com/400x400?text=Product',
      badge: item.badge || undefined,
      colors: ['#FFE4E1', '#F5DEB3', '#DEB887', '#D2691E'],
    }));
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

// Mock data - used as fallback if API fails
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

// Generate static params for pre-rendering
export async function generateStaticParams() {
  // Pre-render product pages 1-20 at build time
  return Array.from({ length: 20 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

export default async function ProductDetailPage({ 
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ lang?: string }>;
}) {
  // Await params in Next.js 15+
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  
  const productId = resolvedParams.id;
  const lang = resolvedSearchParams?.lang || 'en';

  console.log(`🔄 Loading product ${productId} in ${lang}`);
  
  // Fetch product from API
  const product = await fetchProduct(productId, lang);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">The product you are looking for does not exist.</p>
            <Link href="/all-products" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Fetch related products
  const relatedProducts = await fetchRelatedProducts(lang);
  
  console.log(`✅ Product loaded successfully:`, product.name);

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
      <ProductDetailWrapper initialProduct={product} initialRelatedProducts={relatedProducts} />
    </div>
  );
}
