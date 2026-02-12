'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Best Sellers', href: '/best-sellers' },
    { name: 'New', href: '/new' },
    { name: 'Makeup', href: '/makeup' },
    { name: 'Packages', href: '/packages' },
    { name: 'Skincare', href: '/skincare' },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-pink-500 shadow-lg' : 'bg-pink-500'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">
              oopsskin
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isScrolled && (
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white hover:text-white hover:bg-pink-600 transition-all px-4 py-2 rounded-full text-sm font-medium"
                >
                  {link.name}
                </Link>
              ))}
              
              {/* All Products Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <Link
                  href="/all-products"
                  className="text-white hover:text-white hover:bg-pink-600 transition-all px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1"
                >
                  All Products
                  <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </Link>

                {/* Dropdown Menu - with extended hover area */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 pt-0 -translate-x-1/3 z-50">
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
                          SHOP ALL PRODUCTS
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-white hover:text-pink-200 transition-colors">
              <Search size={20} />
            </button>
            
            {/* User Menu */}
            {isAuthenticated ? (
              <div 
                className="relative"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button className="text-white hover:text-pink-200 transition-colors flex items-center gap-1">
                  <User size={20} />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-2xl p-4 w-64 z-50">
                    <div className="border-b border-gray-200 pb-3 mb-3">
                      <p className="font-bold text-gray-900">{user?.fullName}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium w-full"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-white hover:text-pink-200 transition-colors">
                <User size={20} />
              </Link>
            )}
            
            <Link href="/cart" className="text-white hover:text-pink-200 transition-colors relative">
              <ShoppingCart size={20} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-pink-500 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getCartCount()}
                </span>
              )}
            </Link>
            <button
              className="lg:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4">
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
              All Products
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
