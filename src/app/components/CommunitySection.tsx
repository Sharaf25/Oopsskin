'use client';

import { useLanguage } from '@/app/context/LanguageContext';

export function CommunitySection() {
  const { t } = useLanguage();
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-black text-pink-500 text-center mb-12 uppercase">
          {t('ourCommunity')}
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Easy Bake Card */}
          <div className="relative overflow-hidden rounded-lg group cursor-pointer h-96 bg-gradient-to-br from-pink-500 to-pink-600">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-white">
              <div className="text-6xl font-black mb-4">Easy<br />Bake</div>
              <button className="bg-white text-pink-500 hover:bg-pink-50 font-bold py-3 px-6 rounded-full uppercase text-sm transition-all transform hover:scale-105 mt-4">
                JOIN HUDA&apos;S VIPS
              </button>
            </div>
          </div>

          {/* Creator Squad Card */}
          <div className="relative overflow-hidden rounded-lg group cursor-pointer h-96 bg-gradient-to-br from-purple-500 to-purple-600">
            <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-white">
              <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-full uppercase text-sm transition-all transform hover:scale-105">
                CREATOR SQUAD
              </button>
            </div>
          </div>

          {/* Pro Squad Card */}
          <div className="relative overflow-hidden rounded-lg group cursor-pointer h-96 bg-gradient-to-br from-gray-700 to-gray-900">
            <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-white">
              <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-full uppercase text-sm transition-all transform hover:scale-105">
                PRO SQUAD
              </button>
              <button className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold py-3 px-6 rounded-full uppercase text-sm transition-all transform hover:scale-105 mt-3">
                JOIN AMBASSADORS
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
