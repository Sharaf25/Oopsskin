'use client';

import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';

export function FeaturedBanner() {
  const { t } = useLanguage();
  
  // Fixed positions for stars to avoid hydration mismatch
  const starPositions = [
    { left: '10%', top: '15%', delay: '0s', duration: '2.5s' },
    { left: '25%', top: '8%', delay: '0.5s', duration: '3s' },
    { left: '45%', top: '12%', delay: '1s', duration: '2.8s' },
    { left: '65%', top: '18%', delay: '0.3s', duration: '3.2s' },
    { left: '80%', top: '10%', delay: '1.5s', duration: '2.6s' },
    { left: '15%', top: '85%', delay: '0.8s', duration: '3.5s' },
    { left: '30%', top: '75%', delay: '1.2s', duration: '2.9s' },
    { left: '50%', top: '80%', delay: '0.2s', duration: '3.1s' },
    { left: '70%', top: '88%', delay: '1.8s', duration: '2.7s' },
    { left: '88%', top: '78%', delay: '0.6s', duration: '3.3s' },
    { left: '5%', top: '45%', delay: '1.3s', duration: '2.4s' },
    { left: '92%', top: '50%', delay: '0.9s', duration: '3.4s' },
    { left: '38%', top: '35%', delay: '1.6s', duration: '2.5s' },
    { left: '58%', top: '55%', delay: '0.4s', duration: '3.6s' },
    { left: '75%', top: '42%', delay: '1.1s', duration: '2.3s' },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-white relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-100/30 via-purple-100/30 to-pink-100/30 animate-gradient-x"></div>
      
      {/* Decorative Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {starPositions.map((star, i) => (
          <div
            key={i}
            className="absolute text-pink-400 text-2xl opacity-60"
            style={{
              left: star.left,
              top: star.top,
              animation: `twinkle ${star.duration} infinite`,
              animationDelay: star.delay,
            }}
          >
            ★
          </div>
        ))}
      </div>

      {/* Floating Circles */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 blur-2xl animate-float"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200 rounded-full opacity-20 blur-2xl animate-float-delayed"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Text Content */}
          <div className="order-2 md:order-1 text-center md:text-left">
            {/* Title */}
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-pink-500 mb-6 uppercase leading-tight">
              {t('habibtiKits')}
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-md mx-auto md:mx-0">
              {t('habibtiDescription')}
            </p>

            {/* Shop Now Button */}
            <Link href="/packages">
              <button className="group relative bg-pink-500 hover:bg-pink-600 text-white font-black py-5 px-10 rounded-full uppercase text-sm transition-all transform hover:scale-110 shadow-2xl hover:shadow-pink-500/50">
                <span className="relative z-10 flex items-center gap-2">
                  {t('shopNow')}
                  <svg 
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                {/* Shine Effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shine"></div>
              </button>
            </Link>

            {/* Trust Badge */}
            <div className="mt-8 flex items-center justify-center md:justify-start gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium">{t('premiumQuality')}</span>
              </div>
            </div>
          </div>

          {/* Right Side - Product Images */}
          <div className="order-1 md:order-2">
            <div className="relative h-[500px]">
              {/* Glowing Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-3xl blur-3xl"></div>

              {/* Image Grid with Animations */}
              <div className="relative h-full flex items-center justify-center gap-6">
                {/* Left Image - Floating Up & Down */}
                <div className="relative group" style={{ animation: 'float 3s ease-in-out infinite' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl transform rotate-6 group-hover:rotate-12 transition-transform duration-500 shadow-2xl"></div>
                  <div className="relative bg-white p-3 rounded-2xl transform -rotate-6 group-hover:-rotate-12 transition-all duration-500 shadow-xl hover:shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop" 
                      alt="Makeup Kit 1"
                      className="w-48 h-64 object-cover rounded-xl"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x500?text=Makeup+Kit';
                      }}
                    />
                    {/* Sparkle Effect */}
                    <div className="absolute -top-2 -right-2 text-3xl" style={{ animation: 'spin-slow 3s linear infinite' }}>✨</div>
                  </div>
                </div>

                {/* Right Image - Floating Up & Down (Delayed) */}
                <div className="relative group mt-12" style={{ animation: 'float 3s ease-in-out infinite 1.5s' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl transform -rotate-6 group-hover:-rotate-12 transition-transform duration-500 shadow-2xl"></div>
                  <div className="relative bg-white p-3 rounded-2xl transform rotate-6 group-hover:rotate-12 transition-all duration-500 shadow-xl hover:shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=500&fit=crop" 
                      alt="Makeup Kit 2"
                      className="w-48 h-64 object-cover rounded-xl"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x500?text=Makeup+Collection';
                      }}
                    />
                    {/* Sparkle Effect */}
                    <div className="absolute -bottom-2 -left-2 text-3xl" style={{ animation: 'spin-slow 3s linear infinite 1s' }}>💄</div>
                  </div>
                </div>
              </div>

              {/* Decorative Hearts */}
              <div className="absolute top-10 right-10 text-4xl animate-pulse opacity-60">💖</div>
              <div className="absolute bottom-10 left-10 text-3xl animate-bounce-slow opacity-60">✨</div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations Styles */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-shine {
          animation: shine 1.5s ease-in-out;
        }
      `}</style>
    </section>
  );
}
