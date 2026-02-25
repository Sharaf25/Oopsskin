'use client';

import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';

export default function ProductNotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('productNotFound')}</h2>
          <p className="text-gray-600 mb-6">{t('productDoesNotExist')}</p>
          <Link
            href="/all-products"
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            {t('backToProducts')}
          </Link>
        </div>
      </div>
    </div>
  );
}
