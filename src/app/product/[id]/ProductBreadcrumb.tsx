'use client';

import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';

interface ProductBreadcrumbProps {
  category?: string;
  productName: string;
}

export default function ProductBreadcrumb({ category, productName }: ProductBreadcrumbProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-pink-500">
            {t('shopAll')}
          </Link>
          <span>/</span>
          {category && (
            <>
              <span>{category}</span>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900 font-medium">{productName}</span>
        </div>
      </div>
    </div>
  );
}
