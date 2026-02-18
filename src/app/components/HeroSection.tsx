'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function HeroSection() {
  const { t } = useLanguage();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slider images
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&h=800&fit=crop',
      alt: 'Beauty Products Collection 1'
    },
    {
      image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=1920&h=800&fit=crop',
      alt: 'Beauty Products Collection 2'
    },
    {
      image: 'https://cdn.britannica.com/35/222035-050-C68AD682/makeup-cosmetics.jpg',
      alt: 'Beauty Products Collection 3'
    },
  ];

  // Auto-advance slider every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleShopNow = () => {
    router.push('/all-products');
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden mt-16">
      {/* Image Slider Background */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 uppercase drop-shadow-lg">
            {t('discoverBeauty')}
          </h1>
          <p className="text-xl text-white mb-6 drop-shadow-md">{t('premiumProducts')}</p>
          <button 
            onClick={handleShopNow}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full uppercase text-sm transition-all transform hover:scale-105 shadow-lg"
          >
            {t('shopNow')}
          </button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
