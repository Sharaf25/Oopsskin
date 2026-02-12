'use client';

import Link from 'next/link';
import { Instagram, Youtube, Twitter, Facebook, Github } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-pink-500 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Newsletter */}
          <div className="md:col-span-1">
            <div className="text-4xl font-black mb-6">
              oopsskin
            </div>
            <div>
              <h3 className="font-bold text-xl mb-4 uppercase">{t('heyBeautiful')}</h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder={t('joinNewsletter')}
                  className="flex-1 px-4 py-2 rounded-full text-gray-900"
                />
                <button className="bg-white text-pink-500 hover:bg-pink-100 p-2 rounded-full transition-colors">
                  →
                </button>
              </div>
            </div>
          </div>

          {/* About Us */}
          <div>
            <h4 className="font-bold text-lg mb-4 uppercase">{t('aboutUs')}</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-pink-200 transition-colors">{t('vipProgram')}</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">{t('ambassadorProgram')}</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">{t('affiliateProgram')}</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">{t('blog')}</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">{t('ourCommunity')}</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">{t('accessibility')}</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-bold text-lg mb-4 uppercase">{t('contactUs')}</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-pink-200 transition-colors">{t('shippingInfo')}</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">{t('trackOrder')}</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">{t('findOrder')}</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">{t('returns')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-lg mb-4 uppercase">{t('termsConditions')}</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-pink-200 transition-colors">{t('termsPromotions')}</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">{t('privacyPolicy')}</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">{t('doNotSell')}</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">{t('cookiePolicy')}</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">{t('prop65Warning')}</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">{t('thirdPartyStandards')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-pink-400 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex gap-4 mb-4 md:mb-0">
            <a href="#" className="hover:text-pink-200 transition-colors"><Instagram size={24} /></a>
            <a href="#" className="hover:text-pink-200 transition-colors"><Youtube size={24} /></a>
            <a href="#" className="hover:text-pink-200 transition-colors"><Twitter size={24} /></a>
            <a href="#" className="hover:text-pink-200 transition-colors"><Facebook size={24} /></a>
            <a href="#" className="hover:text-pink-200 transition-colors"><Github size={24} /></a>
          </div>
          <div className="text-sm">
            © 2026 | oopsskin, {t('allRightsReserved')}.
          </div>
        </div>
      </div>
    </footer>
  );
}
