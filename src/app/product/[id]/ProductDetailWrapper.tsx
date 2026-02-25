'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import ProductDetailClient from './ProductDetailClient';
import { API_ENDPOINTS, API_BASE_URL } from '@/config/api';
import Link from 'next/link';

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
  userRating?: number | null; // Add user rating
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

export default function ProductDetailWrapper({ 
  initialProduct, 
  initialRelatedProducts 
}: { 
  initialProduct: Product; 
  initialRelatedProducts: any[] 
}) {
  const params = useParams();
  const { language } = useLanguage();
  const [product, setProduct] = useState<Product>(initialProduct);
  const [relatedProducts, setRelatedProducts] = useState<any[]>(initialRelatedProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productId = params?.id as string;

  // Fetch product data when language changes
  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;
      
      setLoading(true);
      setError(null);

      try {
        // Fetch product details
        const productResponse = await fetch(`${API_ENDPOINTS.PRODUCTS.BY_ID(productId)}?lang=${language}`);
        
        if (!productResponse.ok) {
          throw new Error('Failed to fetch product');
        }

        const data: APIProduct = await productResponse.json();
        
        const updatedProduct: Product = {
          id: data.id.toString(),
          name: data.name,
          description: data.details || '',
          price: data.price,
          before_price: data.before_price || undefined,
          stock: data.stock,
          rating: data.star_rating || 0,
          reviewCount: data.rating_count || 0,
          userRating: data.user_rating || null, // Add user rating
          badge: data.badge || undefined,
          category: data.category,
          tags: data.tags || [],
          images: data.images.map((img) => 
            img.image_url.startsWith('http') 
              ? img.image_url 
              : `${API_BASE_URL.replace('/api', '')}/${img.image_url}`
          ),
          colors: ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB'],
          features: data.tags || [],
        };
        
        setProduct(updatedProduct);

        // Fetch related products
        const relatedResponse = await fetch(`${API_ENDPOINTS.PRODUCTS.BASE}?lang=${language}&limit=4&sort=asc`);
        
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          
          const updatedRelated = relatedData.data.map((item: any) => ({
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
          
          setRelatedProducts(updatedRelated);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId, language]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/all-products" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}

