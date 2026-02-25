'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { API_ENDPOINTS, getAuthHeaders } from '@/config/api';
import { useRouter } from 'next/navigation';

interface ProductRatingProps {
  productId: string | number;
  currentRating?: number;
  ratingCount?: number;
  userRating?: number;
  onRatingSubmitted?: (newRating: number, newCount: number) => void;
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
  interactive?: boolean;
  showUserRating?: boolean; // New prop to control "You rated" message
}

export default function ProductRating({
  productId,
  currentRating = 0,
  ratingCount = 0,
  userRating,
  onRatingSubmitted,
  size = 'medium',
  showCount = true,
  interactive = true,
  showUserRating = false, // Default to false (hide on cards)
}: ProductRatingProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(userRating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localRating, setLocalRating] = useState(currentRating);
  const [localCount, setLocalCount] = useState(ratingCount);

  // Update local state when props change
  useEffect(() => {
    setLocalRating(currentRating);
    setLocalCount(ratingCount);
    setSelectedRating(userRating || 0);
  }, [currentRating, ratingCount, userRating]);

  // Reset preview when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setHoveredStar(null);
      setSelectedRating(0);
    }
  }, [isAuthenticated]);

  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl',
  };

  const starSizes = {
    small: 16,
    medium: 20,
    large: 24,
  };

  const handleStarClick = async (rating: number) => {
    if (!interactive) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const authHeaders = getAuthHeaders();
      
      if (!authHeaders.Authorization) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(API_ENDPOINTS.PRODUCTS.RATE(productId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({ rating }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit rating');
      }

      const data = await response.json();

      // Update local state
      setSelectedRating(rating);
      setLocalRating(data.star_rating);
      setLocalCount(data.rating_count);

      // Notify parent component
      if (onRatingSubmitted) {
        onRatingSubmitted(data.star_rating, data.rating_count);
      }

      // Silent success (no alert popup)
    } catch (error: any) {
      // Silent error (just log it, no alert)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMouseEnter = (star: number) => {
    if (!interactive || !isAuthenticated) return;
    setHoveredStar(star);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoveredStar(null);
  };

  // Determine which rating to display
  const displayRating = hoveredStar !== null ? hoveredStar : (selectedRating || localRating);

  // Function to render stars with half-star support
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(displayRating);
    const hasHalfStar = displayRating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= fullStars;
      const isHalf = i === fullStars + 1 && hasHalfStar;

      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          disabled={isSubmitting || !interactive}
          className={`transition-all relative ${
            interactive && isAuthenticated
              ? 'cursor-pointer hover:scale-110'
              : interactive
              ? 'cursor-pointer'
              : 'cursor-default'
          } ${isSubmitting ? 'opacity-50' : ''}`}
          title={
            interactive
              ? isAuthenticated
                ? `Rate ${i} star${i !== 1 ? 's' : ''}`
                : 'Sign in to rate'
              : undefined
          }
        >
          {isHalf ? (
            // Half star using gradient
            <div className="relative inline-block">
              <Star
                size={starSizes[size]}
                fill="none"
                className="text-gray-300"
              />
              <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
                <Star
                  size={starSizes[size]}
                  fill="#EC4899"
                  className="text-pink-500"
                />
              </div>
            </div>
          ) : (
            <Star
              size={starSizes[size]}
              fill={isFilled ? '#EC4899' : 'none'}
              className={`${
                isFilled ? 'text-pink-500' : 'text-gray-300'
              } transition-colors`}
            />
          )}
        </button>
      );
    }

    return stars;
  };

  return (
    <div className="flex items-center gap-2">
      {/* Stars */}
      <div className="flex items-center gap-1">
        {renderStars()}
      </div>

      {/* Rating Info */}
      {showCount && (
        <div className={`${sizeClasses[size]} font-medium text-gray-700 flex items-center gap-1`}>
          <span className="font-bold">{localRating.toFixed(1)}</span>
          <span className="text-gray-500">({localCount} {localCount === 1 ? 'review' : 'reviews'})</span>
        </div>
      )}

      {/* User's Rating Indicator - Only show if showUserRating is true */}
      {showUserRating && interactive && isAuthenticated && selectedRating > 0 && (
        <span className="text-xs text-pink-500 font-medium">
          You rated: {selectedRating} ★
        </span>
      )}

      {/* Loading Indicator */}
      {isSubmitting && (
        <div className="flex items-center gap-1">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-pink-500 border-t-transparent"></div>
          <span className="text-xs text-gray-500">Saving...</span>
        </div>
      )}
    </div>
  );
}
