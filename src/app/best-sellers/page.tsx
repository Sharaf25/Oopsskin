'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BestSellers() {
  const router = useRouter();

  useEffect(() => {
    router.push('/#best-sellers');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Redirecting to Best Sellers...</p>
    </div>
  );
}
