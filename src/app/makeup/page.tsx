'use client';

import { ProductCarousel } from '@/app/components/ProductCarousel';
import { useLanguage } from '@/app/context/LanguageContext';

export default function MakeupPage() {
  const { t } = useLanguage();

  const categories = [
    { name: t('face'), color: 'from-pink-400 to-pink-500' },
    { name: t('eyes'), color: 'from-purple-400 to-purple-500' },
    { name: t('lips'), color: 'from-red-400 to-red-500' },
    { name: t('cheek'), color: 'from-pink-300 to-pink-400' },
    { name: t('brushesTools'), color: 'from-gray-600 to-gray-700' },
    { name: t('foundation'), color: 'from-amber-400 to-amber-500' },
    { name: t('eyeshadow'), color: 'from-indigo-400 to-indigo-500' },
    { name: t('lipstick'), color: 'from-rose-400 to-rose-500' },
  ];

  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 uppercase">
            {t('makeupTitle')}
          </h1>
          <p className="text-xl text-white mb-6">{t('makeupSubtitle')}</p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
            {categories.map((category) => (
              <div
                key={category.name}
                className={`bg-gradient-to-br ${category.color} rounded-lg p-8 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform h-40`}
              >
                <h3 className="text-2xl font-black text-white uppercase text-center">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-pink-500 text-center mb-12 uppercase">
            {t('featuredMakeup')}
          </h2>
          <ProductCarousel />
        </div>
      </section>
    </main>
  );
}
