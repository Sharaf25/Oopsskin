'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Hook to check if the current user has admin role
 * @returns boolean indicating if user is admin
 */
export function useAdminAuth() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const isAdmin = isAuthenticated && user?.role === 'admin';

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;

    // If not authenticated or not admin, redirect to login
    if (!isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login...');
      router.push('/login?redirect=/admin');
    } else if (!isAdmin) {
      console.log('❌ Not authorized as admin, redirecting to home...');
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  return {
    isAdmin,
    loading,
    user,
  };
}
