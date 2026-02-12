import Link from 'next/link';
import { Instagram, Youtube, Twitter, Facebook, Github } from 'lucide-react';

export function Footer() {
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
              <h3 className="font-bold text-xl mb-4 uppercase">Hey Beautiful,<br />Let&apos;s Connect</h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="join our newsletter"
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
            <h4 className="font-bold text-lg mb-4 uppercase">About Us</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-pink-200 transition-colors">Huda&apos;s VIP/Loyalty Program</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">Ambassador Program</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">Affiliate Program</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">Our Community</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">Accessibility</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-bold text-lg mb-4 uppercase">Contact Us</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-pink-200 transition-colors">Shipping and Delivery Info</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">Track My Order</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">Find My Order</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">Returns</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-lg mb-4 uppercase">Terms and Conditions of Sale</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-pink-200 transition-colors">Terms and Conditions of Promotions</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">Do Not Sell My Personal Information</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">Prop 65 Warning</Link></li>
              <li><Link href="#" className="hover:text-pink-200 transition-colors">Third Party Ethical Standards</Link></li>
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
            © 2026 | oopsskin, All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
