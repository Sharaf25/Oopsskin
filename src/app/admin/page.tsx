'use client';

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, TrendingUp, AlertCircle, Ticket } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalVouchers: number;
  activeVouchers: number;
}

interface RecentOrder {
  id: number;
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalVouchers: 0,
    activeVouchers: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch order statistics
      const statsRes = await fetch('http://localhost:5000/api/orders/stats/summary');
      const statsData = await statsRes.json();
      
      // Fetch recent orders
      const ordersRes = await fetch('http://localhost:5000/api/orders?limit=5');
      const ordersData = await ordersRes.json();
      
      // Fetch products count
      const productsRes = await fetch('http://localhost:5000/api/products');
      const productsData = await productsRes.json();

      // Fetch vouchers statistics
      const vouchersRes = await fetch('http://localhost:5000/api/vouchers/stats/summary');
      const vouchersData = await vouchersRes.json();

      if (statsData.success) {
        setStats({
          totalProducts: productsData.count || 0,
          totalOrders: statsData.data.total_orders || 0,
          totalRevenue: statsData.data.total_revenue || 0,
          pendingOrders: statsData.data.pending_orders || 0,
          totalVouchers: vouchersData.success ? vouchersData.data.total_vouchers : 0,
          activeVouchers: vouchersData.success ? vouchersData.data.active_vouchers : 0
        });
      }

      if (ordersData.success) {
        setRecentOrders(ordersData.data || []);
      }
      
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      link: '/admin/products'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
      link: '/admin/orders'
    },
    {
      title: 'Active Vouchers',
      value: stats.activeVouchers,
      icon: Ticket,
      color: 'bg-pink-500',
      link: '/admin/vouchers'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      link: '/admin/orders'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: 'bg-orange-500',
      link: '/admin/orders?status=pending'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to Oopsskin Admin Panel</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.link}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-full`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-pink-500 hover:text-pink-600 font-medium text-sm"
            >
              View All →
            </Link>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-pink-500 hover:text-pink-600 font-medium"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-semibold">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/admin/products/new"
          className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg p-6 text-center transition-colors"
        >
          <Package size={32} className="mx-auto mb-2" />
          <h3 className="font-bold text-lg">Add New Product</h3>
          <p className="text-sm text-pink-100 mt-1">Create a new product listing</p>
        </Link>
        
        <Link
          href="/admin/orders"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-6 text-center transition-colors"
        >
          <ShoppingCart size={32} className="mx-auto mb-2" />
          <h3 className="font-bold text-lg">Manage Orders</h3>
          <p className="text-sm text-blue-100 mt-1">View and update order status</p>
        </Link>
        
        <Link
          href="/admin/vouchers"
          className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-6 text-center transition-colors"
        >
          <Ticket size={32} className="mx-auto mb-2" />
          <h3 className="font-bold text-lg">Manage Vouchers</h3>
          <p className="text-sm text-green-100 mt-1">Create and manage discount codes</p>
        </Link>
        
        <Link
          href="/admin/products"
          className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg p-6 text-center transition-colors"
        >
          <TrendingUp size={32} className="mx-auto mb-2" />
          <h3 className="font-bold text-lg">Product Analytics</h3>
          <p className="text-sm text-purple-100 mt-1">View product performance</p>
        </Link>
      </div>
    </div>
  );
}
