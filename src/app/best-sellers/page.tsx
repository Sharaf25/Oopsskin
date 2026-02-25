'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';

export default function BestSellers() {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    router.push('/#best-sellers');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">{t('redirectingBestSellers')}</p>
    </div>
  );
}
