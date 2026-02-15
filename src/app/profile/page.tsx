'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Heart, 
  Edit2, 
  Save, 
  X,
  Lock,
  Package,
  CreditCard,
  Settings
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'favourites'>('info');
  const [isLoaded, setIsLoaded] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
      });
    }
  }, [user]);

  // Show loading state
  if (!isLoaded || loading) {
    return (
      <main className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500"></div>
      </main>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl shadow-xl p-12">
            <Lock className="mx-auto mb-6 text-pink-500" size={80} />
            <h1 className="text-4xl font-black text-gray-900 mb-4">SIGN IN REQUIRED</h1>
            <p className="text-gray-600 mb-8">
              Please sign in to your account to access your profile
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // TODO: API call to update user profile will be added later
    console.log('Saving profile:', formData);
    setIsEditing(false);
    // Show success message (you can add a toast notification here)
    alert('Profile updated successfully! (API integration pending)');
  };

  const handleCancel = () => {
    // Reset form to original user data
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
      });
    }
    setIsEditing(false);
  };

  // Mock data for orders (will be replaced with API data later)
  const mockOrders = [
    {
      id: '1',
      date: '2026-02-10',
      total: 125.99,
      status: 'Delivered',
      items: 3,
    },
    {
      id: '2',
      date: '2026-02-05',
      total: 89.50,
      status: 'Shipped',
      items: 2,
    },
    {
      id: '3',
      date: '2026-01-28',
      total: 156.75,
      status: 'Processing',
      items: 4,
    },
  ];

  // Mock data for favourites (will be replaced with API data later)
  const mockFavourites = [
    {
      id: '1',
      name: 'Hydrating Face Serum',
      price: 45.99,
      category: 'Skincare',
      inStock: true,
    },
    {
      id: '2',
      name: 'Matte Lipstick - Ruby Red',
      price: 24.99,
      category: 'Makeup',
      inStock: true,
    },
    {
      id: '3',
      name: 'Eyeshadow Palette Pro',
      price: 58.00,
      category: 'Makeup',
      inStock: false,
    },
    {
      id: '4',
      name: 'Vitamin C Night Cream',
      price: 39.99,
      category: 'Skincare',
      inStock: true,
    },
  ];

  return (
    <main className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase">
            My Profile
          </h1>
          <p className="text-gray-600 mt-2">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              {/* Profile Avatar */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="text-white" size={48} />
                </div>
                <h2 className="font-bold text-xl text-gray-900">{user?.name}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'info'
                      ? 'bg-pink-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings size={20} />
                  Personal Info
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-pink-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Package size={20} />
                  My Orders
                </button>
                <button
                  onClick={() => setActiveTab('favourites')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'favourites'
                      ? 'bg-pink-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Heart size={20} />
                  Favourites
                </button>
                <Link
                  href="/cart"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <ShoppingBag size={20} />
                  Shopping Cart
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Personal Information Tab */}
            {activeTab === 'info' && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-gray-900 uppercase">
                    Personal Information
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-all"
                    >
                      <Edit2 size={18} />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-all"
                      >
                        <Save size={18} />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition-all"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                          !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                          !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Street Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Enter your street address"
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                          !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your city"
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                        !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter postal code"
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                        !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Account Info */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Account Status</p>
                      <p className="font-bold text-green-600">Active</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Member Since</p>
                      <p className="font-bold text-gray-900">February 2026</p>
                    </div>
                  </div>
                </div>

                {/* API Notice */}
                {isEditing && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Profile update API integration is pending. Changes will be saved once the backend is connected.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-gray-900 uppercase">
                    My Orders
                  </h2>
                  <span className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full font-bold text-sm">
                    {mockOrders.length} Orders
                  </span>
                </div>

                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Package className="text-pink-500" size={24} />
                            <div>
                              <h3 className="font-bold text-gray-900">Order #{order.id}</h3>
                              <p className="text-sm text-gray-500">{order.date}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 mt-3">
                            <div>
                              <p className="text-xs text-gray-500">Total Amount</p>
                              <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Items</p>
                              <p className="font-bold text-gray-900">{order.items}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Status</p>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                  order.status === 'Delivered'
                                    ? 'bg-green-100 text-green-700'
                                    : order.status === 'Shipped'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-full transition-all self-start md:self-center">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* API Notice */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This is sample data. Order history will be loaded from the API once integrated.
                  </p>
                </div>
              </div>
            )}

            {/* Favourites Tab */}
            {activeTab === 'favourites' && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-gray-900 uppercase">
                    My Favourites
                  </h2>
                  <span className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full font-bold text-sm">
                    {mockFavourites.length} Items
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockFavourites.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        {/* Product Image Placeholder */}
                        <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <div className="w-16 h-16 bg-pink-400 rounded-full"></div>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                          <p className="text-xl font-bold text-pink-500 mb-2">
                            ${item.price.toFixed(2)}
                          </p>
                          <div className="flex gap-2">
                            <button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all">
                              Add to Cart
                            </button>
                            <button className="p-2 border border-red-300 hover:bg-red-50 rounded-lg text-red-500 transition-all">
                              <Heart size={20} fill="currentColor" />
                            </button>
                          </div>
                          {!item.inStock && (
                            <p className="text-xs text-red-500 font-medium mt-2">Out of Stock</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* API Notice */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This is sample data. Favourites will be loaded from the API once integrated.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
