'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, LogOut, Languages } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useLanguage } from '@/app/context/LanguageContext';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getCartCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/all-products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('bestSellers'), href: '/best-sellers' },
    { name: t('new'), href: '/new' },
    { name: t('makeup'), href: '/makeup' },
    { name: t('packages'), href: '/packages' },
    { name: t('skincare'), href: '/skincare' },
  ];

  const categories = [
    { name: 'FACE', items: ['Foundation', 'Powder & Setting Spray', 'Primer', 'Concealer & Corrector', 'Contour & Highlight'] },
    { name: 'EYES', items: ['Eyeshadow', 'Eyebrows', 'Eyeliner', 'Mascara', 'Fake Eyelashes'] },
    { name: 'LIPS', items: ['Jelly Stained Lips', 'Lip Gloss', 'Lipstick', 'Lip Liner', 'Lip Balm'] },
    { name: 'CHEEK', items: ['Blush', 'Bronzer'] },
    { name: 'BRUSHES & TOOLS', items: ['Brushes', 'Tools & Accessories'] },
    { name: 'MINIS', items: ['Mini Products'] },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-pink-500 shadow-lg' : 'bg-pink-500'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between transition-all duration-500 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className={`font-bold text-white transition-all duration-500 group-hover:scale-110 ${
              isScrolled ? 'text-2xl' : 'text-3xl'
            }`}>
              oopsskin
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isScrolled && (
            <div className="hidden lg:flex items-center space-x-2 animate-fade-in">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white hover:text-white hover:bg-pink-600 transition-all duration-300 px-4 py-2 rounded-full text-sm font-medium transform hover:scale-105"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* All Products Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <Link
                  href="/all-products"
                  className="text-white hover:text-white hover:bg-pink-600 transition-all duration-300 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 transform hover:scale-105"
                >
                  {t('allProducts')}
                  <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </Link>

                {/* Dropdown Menu - Enhanced with animations */}
                <div className={`absolute top-full left-0 pt-2 -translate-x-1/3 z-50 transition-all duration-300 ${
                  isDropdownOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}>
                    {/* Invisible bridge to prevent gap */}
                    <div className="h-2 w-full" />
                    
                    <div className="bg-white rounded-lg shadow-2xl p-6 w-[800px]">
                      <div className="grid grid-cols-3 gap-8">
                        {categories.map((category) => (
                          <div key={category.name}>
                            <h3 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wide">
                              {category.name}
                            </h3>
                            <ul className="space-y-2">
                              {category.items.map((item) => (
                                <li key={item}>
                                  <Link
                                    href={`/all-products?category=${encodeURIComponent(item)}`}
                                    className="text-sm text-gray-600 hover:text-pink-500 transition-colors block"
                                    onClick={() => setIsDropdownOpen(false)}
                                  >
                                    {item}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                        <Link
                          href="/all-products"
                          className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full uppercase text-sm transition-all transform hover:scale-105"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          {t('shopAllProducts')}
                        </Link>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          )}

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className="text-white hover:text-pink-200 transition-all duration-300 flex items-center gap-1 font-medium transform hover:scale-110"
              title={language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
            >
              <Languages size={20} />
              <span className="text-sm">{language === 'en' ? 'AR' : 'EN'}</span>
            </button>
            
            {/* Search Button */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-white hover:text-pink-200 transition-all duration-300 transform hover:scale-110"
            >
              <Search size={20} />
            </button>
            
            {/* User Menu */}
            {isAuthenticated ? (
              <div 
                className="relative group"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <Link 
                  href="/profile"
                  className="text-white hover:text-pink-200 transition-all duration-300 flex items-center gap-1 transform hover:scale-110"
                >
                  <User size={20} />
                </Link>
                
                {/* User Dropdown with animation */}
                <div className={`absolute top-full right-0 pt-2 z-50 transition-all duration-300 ${
                  isUserMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}>
                    {/* Invisible bridge to prevent gap - keeps menu open while moving mouse */}
                    <div className="h-2 w-full" />
                    
                    <div className="bg-white rounded-lg shadow-2xl p-4 w-64">
                      <div className="border-b border-gray-200 pb-3 mb-3">
                        <p className="font-bold text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 text-gray-700 hover:text-pink-500 hover:bg-pink-50 font-medium w-full py-2 px-2 rounded transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User size={18} />
                          {t('myProfile')}
                        </Link>
                        
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 font-medium w-full py-2 px-2 rounded transition-colors"
                        >
                          <LogOut size={18} />
                          {t('logout')}
                        </button>
                      </div>
                    </div>
                  </div>
              </div>
            ) : (
              <Link href="/login" className="text-white hover:text-pink-200 transition-all duration-300 transform hover:scale-110">
                <User size={20} />
              </Link>
            )}
            
            <Link href="/cart" className="text-white hover:text-pink-200 transition-all duration-300 relative transform hover:scale-110">
              <ShoppingCart size={20} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-pink-500 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce">
                  {getCartCount()}
                </span>
              )}
            </Link>
            <button
              className="lg:hidden text-white transition-all duration-300 transform hover:scale-110"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-slide-down">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-white hover:text-pink-200 transition-colors py-2 px-4 rounded hover:bg-pink-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/all-products"
              className="block text-white hover:text-pink-200 transition-colors py-2 px-4 rounded hover:bg-pink-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('allProducts')}
            </Link>
          </div>
        )}
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 animate-fade-in" onClick={() => setIsSearchOpen(false)}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 animate-slide-down" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{t('searchProducts')}</h3>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none text-gray-900"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <Search size={20} />
                  {t('search')}
                </button>
              </form>
              
              <div className="mt-4 text-sm text-gray-600">
                <p>{t('searchHint')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
