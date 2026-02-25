'use client';

import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useLanguage } from '@/app/context/LanguageContext';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface CheckoutFormProps {
  total: number;
  discount: number;
  appliedVoucher: any;
  onBack: () => void;
}

export default function CheckoutForm({ total, discount, appliedVoucher, onBack }: CheckoutFormProps) {
  const { clearCart, cart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    postalCode: user?.postalCode || '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
        items: cart.map(item => ({
          product_id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total_amount: total,
        voucher_code: appliedVoucher?.code || null,
        discount_amount: discount || 0,
        payment_method: 'cash_on_delivery',
        notes: formData.notes,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        if (appliedVoucher) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vouchers/apply/${appliedVoucher.code}`, {
            method: 'POST',
          });
        }
        setOrderPlaced(true);
        clearCart();
      } else {
        alert(t('failedToLoad'));
      }
    } catch {
      alert(t('failedToLoad'));
    }

    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (orderPlaced) {
    return (
      <main className="min-h-screen pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center bg-white rounded-lg shadow-lg p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">{t('orderPlaced').toUpperCase()}!</h1>
            <p className="text-gray-600 mb-2">{t('thankYou')}</p>
            <p className="text-gray-600 mb-8">
              {t('orderTotal')}: <span className="font-bold text-pink-500">${total.toFixed(2)}</span>
            </p>
            {discount > 0 && (
              <p className="text-sm text-green-600 mb-4">
                {t('save')} ${discount.toFixed(2)} — {t('voucherCode')}: <span className="font-bold">{appliedVoucher?.code}</span>
              </p>
            )}
            <p className="text-sm text-gray-500 mb-8">
              {t('paymentMethod')} <span className="font-semibold">{t('cashOnDelivery')}</span>
            </p>
            <Link
              href="/"
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-8 rounded-full uppercase text-sm transition-all transform hover:scale-105"
            >
              {t('backToHome')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-pink-500 hover:text-pink-600 font-medium mb-4"
            >
              <ArrowLeft size={20} />
              {t('backToCart')}
            </button>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase">
              {t('checkoutTitle')}
            </h1>
            <p className="text-gray-600 mt-2">{t('completeOrder')}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit}>
              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase">
                  {t('contactInformation')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('fullNameRequired')}</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('phoneNumberRequired')}</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('emailAddressRequired')}</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase">
                  {t('deliveryAddress')}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('streetAddress')}</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="123 Main Street, Apt 4B"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('city')} *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('postalCode')} *</label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('deliveryNotes')}</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder={t('anySpecialDelivery')}
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mb-8 p-6 bg-pink-50 rounded-lg">
                <h3 className="text-xl font-black text-gray-900 mb-4">{t('orderSummary')}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>{t('subtotal')}:</span>
                    <span className="font-bold">${(total - discount).toFixed(2)}</span>
                  </div>
                  {discount > 0 && appliedVoucher && (
                    <div className="flex justify-between text-green-600">
                      <span>{t('discount')} ({appliedVoucher.code}):</span>
                      <span className="font-bold">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-700 pt-2 border-t border-pink-200">
                    <span className="font-bold">{t('orderTotal')}:</span>
                    <span className="font-bold text-pink-500">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-bold">{t('paymentMethod')}</span>
                    <span className="font-bold text-pink-500">{t('cashOnDelivery')}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-6 rounded-full uppercase text-sm transition-all transform hover:scale-105 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? t('placingOrder') : t('placeOrder')}
              </button>

              <p className="text-sm text-gray-500 text-center mt-4">
                {t('byPlacingOrder')}
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
