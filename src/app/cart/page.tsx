'use client';

import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useLanguage } from '@/app/context/LanguageContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import CheckoutForm from './CheckoutForm';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<any>(null);
  const [voucherError, setVoucherError] = useState('');
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <main className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500"></div>
      </main>
    );
  }

  // Require authentication
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl shadow-xl p-12">
            <Lock className="mx-auto mb-6 text-pink-500" size={80} />
            <h1 className="text-4xl font-black text-gray-900 mb-4">{t('signInRequired')}</h1>
            <p className="text-gray-600 mb-8">
              {t('signInToViewCart')}
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/login"
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-8 rounded-full uppercase text-sm transition-all transform hover:scale-105"
              >
                {t('signIn').toUpperCase()}
              </Link>
              <Link
                href="/register"
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-4 px-8 rounded-full uppercase text-sm transition-all"
              >
                {t('createAccount').toUpperCase()}
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  
  // Calculate discount
  let discount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discount_type === 'percentage') {
      discount = subtotal * (appliedVoucher.discount_value / 100);
      // Apply max discount if specified
      if (appliedVoucher.max_discount && discount > appliedVoucher.max_discount) {
        discount = appliedVoucher.max_discount;
      }
    } else if (appliedVoucher.discount_type === 'fixed') {
      discount = appliedVoucher.discount_value;
    }
    // Ensure discount doesn't exceed subtotal
    if (discount > subtotal) {
      discount = subtotal;
    }
  }
  
  const total = subtotal - discount + shipping;

  // Apply voucher function
  const applyVoucher = async () => {
    if (!voucherCode.trim()) {
      setVoucherError(t('enterVoucherCode'));
      return;
    }

    setIsApplyingVoucher(true);
    setVoucherError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vouchers/validate/${voucherCode}`);
      const data = await response.json();

      if (data.success) {
        // Check minimum order requirement
        if (data.voucher.min_order_amount && subtotal < data.voucher.min_order_amount) {
          setVoucherError(`${t('minimumOrderAmount')}${data.voucher.min_order_amount}${t('required')}`);
          setIsApplyingVoucher(false);
          return;
        }

        setAppliedVoucher(data.voucher);
        setVoucherError('');
      } else {
        setVoucherError(data.message || t('invalidVoucher'));
        setAppliedVoucher(null);
      }
    } catch (error) {
      setVoucherError(t('failedToApplyVoucher'));
      setAppliedVoucher(null);
    }

    setIsApplyingVoucher(false);
  };

  // Remove voucher function
  const removeVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
    setVoucherError('');
  };

  if (cart.length === 0 && !showCheckout) {
    return (
      <main className="min-h-screen pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="mx-auto mb-6 text-gray-400" size={80} />
            <h1 className="text-4xl font-black text-gray-900 mb-4">{t('yourCartIsEmpty')}</h1>
            <p className="text-gray-600 mb-8">
              {t('notAddedYet')}
            </p>
            <Link
              href="/all-products"
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-8 rounded-full uppercase text-sm transition-all transform hover:scale-105"
            >
              {t('startShopping')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (showCheckout) {
    return <CheckoutForm total={total} discount={discount} appliedVoucher={appliedVoucher} onBack={() => setShowCheckout(false)} />;
  }

  return (
    <main className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase">
              {t('shoppingCart')}
            </h1>
            <p className="text-gray-600 mt-2">{cart.length} {t('itemsInCart')}</p>
          </div>
          <Link
            href="/all-products"
            className="flex items-center gap-2 text-pink-500 hover:text-pink-600 font-medium"
          >
            <ArrowLeft size={20} />
            {t('continueShoppingButton')}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {cart.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex flex-col md:flex-row gap-4 py-6 border-b border-gray-200 last:border-b-0"
                >
                  {/* Product Image */}
                  <div className="w-full md:w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <div className="w-20 h-20 bg-pink-400 rounded-full"></div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
                    {item.category && (
                      <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                    )}
                    <p className="text-xl font-bold text-pink-500">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex md:flex-col items-center justify-between md:justify-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                      <button
                        onClick={async () => {
                          if (item.quantity > 1) {
                            const result = await updateQuantity(item.id, item.quantity - 1);
                            if (!result.success) {
                              alert(result.error || 'Failed to update quantity');
                            }
                          }
                        }}
                        disabled={item.quantity <= 1}
                        className={`w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-pink-500 hover:text-white transition-colors ${
                          item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={async () => {
                          const result = await updateQuantity(item.id, item.quantity + 1);
                          if (!result.success) {
                            alert(result.error || 'Failed to update quantity');
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-pink-500 hover:text-white transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={async () => {
                        if (confirm('Remove this item from cart?')) {
                          const result = await removeFromCart(item.id);
                          if (!result.success) {
                            alert(result.error || 'Failed to remove item');
                          }
                        }
                      }}
                      className="text-red-500 hover:text-red-600 transition-colors p-2"
                      title="Remove from cart"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="md:text-right">
                    <p className="text-sm text-gray-500 mb-1">{t('itemTotal')}</p>
                    <p className="text-xl font-black text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-600 font-medium flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  {t('clearCart')}
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase">
                {t('orderSummary')}
              </h2>

              {/* Voucher Input */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {t('voucherCode')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder={t('enterCode')}
                    disabled={!!appliedVoucher}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  {appliedVoucher ? (
                    <button
                      onClick={removeVoucher}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
                    >
                      {t('removeVoucher')}
                    </button>
                  ) : (
                    <button
                      onClick={applyVoucher}
                      disabled={isApplyingVoucher}
                      className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isApplyingVoucher ? '...' : t('applyVoucher')}
                    </button>
                  )}
                </div>
                {voucherError && (
                  <p className="text-red-500 text-sm mt-2">{voucherError}</p>
                )}
                {appliedVoucher && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 text-sm font-bold flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {t('voucherApplied')}: {appliedVoucher.code}
                    </p>
                    <p className="text-green-600 text-xs mt-1">
                      {appliedVoucher.discount_type === 'percentage' 
                        ? `${appliedVoucher.discount_value}% off` 
                        : `$${appliedVoucher.discount_value} off`}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>{t('subtotal')}</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {appliedVoucher && discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t('discount')} ({appliedVoucher.code})</span>
                    <span className="font-semibold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>{t('shipping')}</span>
                  <span className="font-semibold">
                    {shipping === 0 ? t('free').toUpperCase() : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-sm text-green-600 font-medium">
                    {t('freeShipping')}
                  </p>
                )}
                {subtotal < 100 && subtotal > 0 && (
                  <p className="text-sm text-pink-500 font-medium">
                    {t('addMoreForFreeShipping')}{(100 - subtotal).toFixed(2)}{t('moreForFreeShipping')}
                  </p>
                )}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-gray-900 text-xl font-black">
                    <span>{t('total')}</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-6 rounded-full uppercase text-sm transition-all transform hover:scale-105 mb-4"
              >
                {t('proceedToCheckout')}
              </button>

              <Link
                href="/all-products"
                className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-4 px-6 rounded-full uppercase text-sm transition-all"
              >              {t('continueShoppingButton')}
            </Link>

              {/* Payment Info */}
              <div className="mt-6 p-4 bg-pink-50 rounded-lg">
                <p className="text-sm text-gray-700 font-medium mb-2">
                  {t('paymentMethod')}
                </p>
                <p className="text-sm text-gray-600">
                  {t('cashOnDelivery')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
