'use client';

import Link from 'next/link';
import { Instagram, Youtube, Facebook } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useState, useEffect, useRef } from 'react';

export function Footer() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = footerRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <footer ref={footerRef} className="bg-pink-500 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          {/* Logo */}
          <div 
            className={`md:col-span-1 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="text-6xl font-black mb-1">
              oopsskin
            </div>
            <p className="text-pink-100">
              {t('yourBeautyDestination') || 'Your beauty destination'}
            </p>
          </div>

          {/* Shop Pages */}
          <div 
            className={`transition-all duration-700 delay-150 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h4 className="font-bold mb-2 uppercase">{t('shop') || 'Shop'}</h4>
            <ul className="space-y-1">
              <li><Link href="/new" className="hover:text-pink-200 transition-colors">{t('newItems') || 'New Items'}</Link></li>
              <li><Link href="/best-sellers" className="hover:text-pink-200 transition-colors">{t('bestSellers') || 'Best Sellers'}</Link></li>
              <li><Link href="/all-products" className="hover:text-pink-200 transition-colors">{t('allProducts') || 'All Products'}</Link></li>
              <li><Link href="/makeup" className="hover:text-pink-200 transition-colors">{t('makeup') || 'Makeup'}</Link></li>
              <li><Link href="/packages" className="hover:text-pink-200 transition-colors">{t('packages') || 'Packages'}</Link></li>
            </ul>
          </div>

          {/* Account Pages */}
          <div 
            className={`transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h4 className="font-bold mb-2 uppercase">{t('account') || 'Account'}</h4>
            <ul className="space-y-1">
              <li><Link href="/profile" className="hover:text-pink-200 transition-colors">{t('myProfile') || 'My Profile'}</Link></li>
              <li><Link href="/cart" className="hover:text-pink-200 transition-colors">{t('cart') || 'Shopping Cart'}</Link></li>
              <li><Link href="/login" className="hover:text-pink-200 transition-colors">{t('signIn') || 'Sign In'}</Link></li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div 
          className={`border-t border-pink-400 pt-4 flex flex-col md:flex-row justify-between items-center transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex gap-4 mb-4 md:mb-0">
            <a href="#" className="hover:text-pink-200 transition-colors" aria-label="Instagram">
              <Instagram size={24} />
            </a>
            <a href="#" className="hover:text-pink-200 transition-colors" aria-label="YouTube">
              <Youtube size={24} />
            </a>
            <a href="#" className="hover:text-pink-200 transition-colors" aria-label="Facebook">
              <Facebook size={24} />
            </a>
          </div>
          <div className="text-sm">
            © 2026 | oopsskin, {t('allRightsReserved') || 'All Rights Reserved'}.
          </div>
        </div>
      </div>
    </footer>
  );
}
