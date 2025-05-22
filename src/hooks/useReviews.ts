
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CraftsmanReview, ReviewsResponse } from '@/utils/supabaseTypes';

export const useReviews = (craftsmanId?: string) => {
  const [reviews, setReviews] = useState<CraftsmanReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [ratingCounts, setRatingCounts] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  });

  const fetchReviews = async () => {
    if (!craftsmanId) return;

    setLoading(true);
    setError(null);

    try {
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          reviewer_id,
          reviewed_id,
          rating,
          comment,
          created_at,
          is_public,
          reviewer:profiles (full_name, avatar_url)
        `)
        .eq('reviewed_id', craftsmanId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        throw new Error(reviewsError.message);
      }

      if (reviewsData) {
        const typedReviews = reviewsData as unknown as CraftsmanReview[];
        setReviews(typedReviews);
        calculateStats(typedReviews);
        setReviewsCount(typedReviews.length);
      }
    } catch (error: any) {
      console.error("Error fetching reviews:", error.message);
      setError(error.message);
      toast.error("Failed to fetch reviews: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (craftsmanId) {
      fetchReviews();
    } else {
      setLoading(false);
    }
  }, [craftsmanId]);

  const calculateStats = (reviews: CraftsmanReview[]) => {
    let totalRating = 0;
    const newRatingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviews.forEach(review => {
      totalRating += review.rating;
      newRatingCounts[review.rating] = (newRatingCounts[review.rating] || 0) + 1;
    });

    const count = reviews.length;
    const calculatedAverage = count > 0 ? totalRating / count : 0;

    setAverageRating(parseFloat(calculatedAverage.toFixed(1)));
    setRatingCounts(newRatingCounts);
  };

  return {
    reviews,
    loading,
    isLoading: loading,
    error,
    averageRating,
    ratingCounts,
    reviewsCount,
    fetchReviews,
    refreshReviews: fetchReviews
  };
};
