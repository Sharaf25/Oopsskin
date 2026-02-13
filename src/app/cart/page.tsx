'use client';

import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
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
            <h1 className="text-4xl font-black text-gray-900 mb-4">SIGN IN REQUIRED</h1>
            <p className="text-gray-600 mb-8">
              Please sign in to your account to view your cart and proceed with checkout
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/login"
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-8 rounded-full uppercase text-sm transition-all transform hover:scale-105"
              >
                SIGN IN
              </Link>
              <Link
                href="/register"
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-4 px-8 rounded-full uppercase text-sm transition-all"
              >
                CREATE ACCOUNT
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
      setVoucherError('Please enter a voucher code');
      return;
    }

    setIsApplyingVoucher(true);
    setVoucherError('');

    try {
      const response = await fetch(`http://localhost:5000/api/vouchers/validate/${voucherCode}`);
      const data = await response.json();

      if (data.success) {
        // Check minimum order requirement
        if (data.voucher.min_order_amount && subtotal < data.voucher.min_order_amount) {
          setVoucherError(`Minimum order amount of $${data.voucher.min_order_amount} required`);
          setIsApplyingVoucher(false);
          return;
        }

        setAppliedVoucher(data.voucher);
        setVoucherError('');
      } else {
        setVoucherError(data.message || 'Invalid voucher code');
        setAppliedVoucher(null);
      }
    } catch (error) {
      setVoucherError('Failed to apply voucher. Please try again.');
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
            <h1 className="text-4xl font-black text-gray-900 mb-4">YOUR CART IS EMPTY</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven&apos;t added anything to your cart yet
            </p>
            <Link
              href="/all-products"
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-8 rounded-full uppercase text-sm transition-all transform hover:scale-105"
            >
              START SHOPPING
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
              Shopping Cart
            </h1>
            <p className="text-gray-600 mt-2">{cart.length} items in your cart</p>
          </div>
          <Link
            href="/all-products"
            className="flex items-center gap-2 text-pink-500 hover:text-pink-600 font-medium"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {cart.map((item, index) => (
                <div
                  key={`${item.id}-${item.color}-${index}`}
                  className="flex flex-col md:flex-row gap-4 py-6 border-b border-gray-200 last:border-b-0"
                >
                  {/* Product Image */}
                  <div className="w-full md:w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-20 h-20 bg-pink-400 rounded-full"></div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
                    {item.category && (
                      <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                    )}
                    {item.color && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600">Color:</span>
                        <div
                          className="w-6 h-6 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: item.color }}
                        ></div>
                      </div>
                    )}
                    <p className="text-xl font-bold text-pink-500">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex md:flex-col items-center justify-between md:justify-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-pink-500 hover:text-white transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-pink-500 hover:text-white transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 transition-colors p-2"
                      title="Remove from cart"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="md:text-right">
                    <p className="text-sm text-gray-500 mb-1">Item Total</p>
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
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase">
                Order Summary
              </h2>

              {/* Voucher Input */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Voucher Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    disabled={!!appliedVoucher}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  {appliedVoucher ? (
                    <button
                      onClick={removeVoucher}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={applyVoucher}
                      disabled={isApplyingVoucher}
                      className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isApplyingVoucher ? '...' : 'Apply'}
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
                      Voucher Applied: {appliedVoucher.code}
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
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {appliedVoucher && discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedVoucher.code})</span>
                    <span className="font-semibold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-sm text-green-600 font-medium">
                    🎉 You got free shipping!
                  </p>
                )}
                {subtotal < 100 && subtotal > 0 && (
                  <p className="text-sm text-pink-500 font-medium">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-gray-900 text-xl font-black">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-6 rounded-full uppercase text-sm transition-all transform hover:scale-105 mb-4"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/all-products"
                className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-4 px-6 rounded-full uppercase text-sm transition-all"
              >
                Continue Shopping
              </Link>

              {/* Payment Info */}
              <div className="mt-6 p-4 bg-pink-50 rounded-lg">
                <p className="text-sm text-gray-700 font-medium mb-2">
                  💰 Payment Method:
                </p>
                <p className="text-sm text-gray-600">
                  Cash on Delivery available for all orders
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function CheckoutForm({ total, discount, appliedVoucher, onBack }: { total: number; discount: number; appliedVoucher: any; onBack: () => void }) {
  const { clearCart, cart } = useCart();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
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
      // Create order object
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

      // Submit order to backend
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        // If voucher was used, increment usage count
        if (appliedVoucher) {
          await fetch(`http://localhost:5000/api/vouchers/apply/${appliedVoucher.code}`, {
            method: 'POST',
          });
        }

        setOrderPlaced(true);
        clearCart();
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }

    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
            <h1 className="text-4xl font-black text-gray-900 mb-4">ORDER PLACED!</h1>
            <p className="text-gray-600 mb-2">
              Thank you for your order! We&apos;ll contact you soon to confirm your delivery.
            </p>
            <p className="text-gray-600 mb-8">
              Order Total: <span className="font-bold text-pink-500">${total.toFixed(2)}</span>
            </p>
            {discount > 0 && (
              <p className="text-sm text-green-600 mb-4">
                You saved ${discount.toFixed(2)} with voucher code: <span className="font-bold">{appliedVoucher?.code}</span>
              </p>
            )}
            <p className="text-sm text-gray-500 mb-8">
              Payment Method: <span className="font-semibold">Cash on Delivery</span>
            </p>
            <Link
              href="/"
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-8 rounded-full uppercase text-sm transition-all transform hover:scale-105"
            >
              Back to Home
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
              Back to Cart
            </button>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase">
              Checkout
            </h1>
            <p className="text-gray-600 mt-2">Complete your order with Cash on Delivery</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit}>
              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Full Name *
                    </label>
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
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Phone Number *
                    </label>
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
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address *
                    </label>
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
                  Delivery Address
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Street Address *
                    </label>
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
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        City *
                      </label>
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
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Postal Code *
                      </label>
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
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Delivery Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Any special delivery instructions..."
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mb-8 p-6 bg-pink-50 rounded-lg">
                <h3 className="text-xl font-black text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-bold">${(total - (total - discount)).toFixed(2)}</span>
                  </div>
                  {discount > 0 && appliedVoucher && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedVoucher.code}):</span>
                      <span className="font-bold">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-700 pt-2 border-t border-pink-200">
                    <span className="font-bold">Order Total:</span>
                    <span className="font-bold text-pink-500">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-bold">Payment Method:</span>
                    <span className="font-bold text-pink-500">Cash on Delivery</span>
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
                {isSubmitting ? 'PLACING ORDER...' : 'PLACE ORDER'}
              </button>

              <p className="text-sm text-gray-500 text-center mt-4">
                By placing an order, you agree to our terms and conditions
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
