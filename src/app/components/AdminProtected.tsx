'use client';

import { useAdminAuth } from '@/app/hooks/useAdminAuth';
import { ReactNode } from 'react';

interface AdminProtectedProps {
  children: ReactNode;
}

/**
 * Component that protects admin routes
 * Only renders children if user is authenticated and has admin role
 */
export function AdminProtected({ children }: AdminProtectedProps) {
  const { isAdmin, loading } = useAdminAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not admin (redirect will happen in useAdminAuth)
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Redirecting...</p>
        </div>
      </div>
    );
  }

  // User is admin, render the protected content
  return <>{children}</>;
}
