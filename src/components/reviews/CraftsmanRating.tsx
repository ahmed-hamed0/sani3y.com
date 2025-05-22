import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useReviews } from '@/hooks/useReviews';

interface CraftsmanRatingProps {
  craftsmanId: string;
  initialRating?: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CraftsmanRating = ({
  craftsmanId,
  initialRating,
  showText = true,
  size = 'md',
  className = ''
}: CraftsmanRatingProps) => {
  const { reviewsCount, averageRating } = useReviews(craftsmanId);
  const [displayRating, setDisplayRating] = useState(initialRating || 0);

  useEffect(() => {
    // Use the average rating from reviews if available, otherwise use initialRating
    if (reviewsCount > 0) {
      setDisplayRating(averageRating);
    } else if (initialRating) {
      setDisplayRating(initialRating);
    }
  }, [averageRating, reviewsCount, initialRating]);

  // Set star size based on prop
  const starSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
  // Set text size based on prop
  const textSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base';

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center">
        <Star className={`${starSize} text-yellow-500 fill-yellow-500 mr-1`} />
        <span className={`${textSize} font-semibold mr-1`}>
          {displayRating.toFixed(1)}
        </span>
      </div>
      {showText && (
        <span className={`${textSize} text-gray-500`}>
          ({reviewsCount > 0 ? `${reviewsCount} تقييم` : 'لا توجد تقييمات'})
        </span>
      )}
    </div>
  );
};

