'use client';

import { useLanguage } from '@/app/context/LanguageContext';

export default function SkincarePage() {
  const { t } = useLanguage();

  const skincareCategories = [
    { name: t('cleansers'), icon: '🧼', color: 'from-blue-400 to-blue-500' },
    { name: t('toners'), icon: '💧', color: 'from-cyan-400 to-cyan-500' },
    { name: t('serums'), icon: '✨', color: 'from-purple-400 to-purple-500' },
    { name: t('moisturizers'), icon: '🌸', color: 'from-pink-400 to-pink-500' },
    { name: t('masks'), icon: '🎭', color: 'from-green-400 to-green-500' },
    { name: t('eyeCare'), icon: '👁️', color: 'from-indigo-400 to-indigo-500' },
    { name: t('sunscreen'), icon: '☀️', color: 'from-yellow-400 to-orange-500' },
    { name: t('nightCare'), icon: '🌙', color: 'from-purple-600 to-indigo-700' },
  ];

  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 uppercase">
            {t('skincareTitle')}
          </h1>
          <p className="text-2xl text-white mb-6">{t('skincareSubtitle')}</p>
          <button className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full uppercase text-sm transition-all transform hover:scale-105">
            {t('shopSkincare')}
          </button>
        </div>
      </section>

      {/* Skincare Routine Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-pink-500 text-center mb-4 uppercase">
            {t('yourSkincareRoutine')}
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {t('skincareRoutineSubtitle')}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {skincareCategories.map((product) => (
              <div
                key={product.name}
                className={`bg-gradient-to-br ${product.color} rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform h-48 text-center`}
              >
                <div className="text-5xl mb-3">{product.icon}</div>
                <h3 className="text-xl font-black text-white uppercase">
                  {product.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-pink-500 text-center mb-12 uppercase">
            {t('whyOopsskinSkincare')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-shadow">
              <div className="text-6xl mb-4">🌿</div>
              <h3 className="text-2xl font-bold mb-3">{t('naturalIngredients')}</h3>
              <p className="text-gray-600">{t('naturalIngredientsDesc')}</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-shadow">
              <div className="text-6xl mb-4">🔬</div>
              <h3 className="text-2xl font-bold mb-3">{t('scientificallyProven')}</h3>
              <p className="text-gray-600">{t('scientificallyProvenDesc')}</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-shadow">
              <div className="text-6xl mb-4">🐰</div>
              <h3 className="text-2xl font-bold mb-3">{t('crueltyFree')}</h3>
              <p className="text-gray-600">{t('crueltyFreeDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-pink-500 text-center mb-12 uppercase">
            {t('bestsellingSkincareTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-pink-300 transition-all"
              >
                <div className="h-80 bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
                  <div className="w-40 h-40 bg-white rounded-full"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{t('skincareProductName')}</h3>
                  <p className="text-gray-600 mb-4">{t('skincareProductDesc')}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black">$49.99</span>
                    <div className="flex text-pink-500">★★★★★</div>
                  </div>
                  <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-full uppercase text-sm transition-all">
                    {t('addToCart')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
