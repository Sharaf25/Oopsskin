'use client';

import { ProductCarousel } from '@/app/components/ProductCarousel';
import { useLanguage } from '@/app/context/LanguageContext';

export default function NewPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-400 via-pink-300 to-pink-400 min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 uppercase">
            {t('newArrivals')}
          </h1>
          <p className="text-xl text-white mb-6">{t('newArrivalsSubtitle')}</p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <ProductCarousel />
        </div>
      </section>
    </main>
  );
}
