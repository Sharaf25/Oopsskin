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
  user_rating?: number | null; // Add user_rating
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
  userRating?: number | null; // Add user_rating
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
    const response = await fetch(`${API_ENDPOINTS.PRODUCTS.BY_ID(id)}?lang=${lang}`, {
      cache: 'force-cache',
    });

    if (!response.ok) {
      console.error(`❌ Failed to fetch product ${id}:`, response.status);
      return null;
    }

    const data: APIProduct = await response.json();

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
      userRating: data.user_rating || null, // Add user_rating
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
      cache: 'force-cache',
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

// Tell Next.js not to try to render any path beyond what generateStaticParams returns
export const dynamicParams = false;

// ✅ Generate static params for pre-rendering — English only, no URL changes
export async function generateStaticParams(): Promise<{ id: string }[]> {
  // Use the build-time API URL from the environment
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const response = await fetch(`${apiBase}/products?limit=100`, {
    // no-store ensures fresh data at every build rather than a stale cache
    cache: 'no-store',
  });

  if (!response.ok) {
    // Throw so the build fails loudly instead of silently producing no pages
    throw new Error(
      `generateStaticParams: failed to fetch products (HTTP ${response.status}). ` +
      'Ensure the API server is running and NEXT_PUBLIC_API_URL is set correctly.'
    );
  }

  const data = await response.json();
  const products: { id: number | string }[] = data.data ?? [];

  return products.map((product) => ({ id: product.id.toString() }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params in Next.js 15+
  const resolvedParams = await params;

  const productId = resolvedParams.id;
  // English only — the client-side LanguageContext handles runtime language switching
  const lang = 'en';

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
