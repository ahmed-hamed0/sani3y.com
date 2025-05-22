
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

interface ReviewFormProps {
  craftsmanId: string;
  onReviewSubmit: () => void;
}

export const ReviewForm = ({ craftsmanId, onReviewSubmit }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(true);
  const { user } = useAuth();

  // Check if the current user is the craftsman (can't review themselves)
  useEffect(() => {
    if (user && user.id === craftsmanId) {
      setCanReview(false);
    } else {
      setCanReview(true);
    }
  }, [user, craftsmanId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast("يرجى إضافة تقييم", { 
        style: { backgroundColor: 'rgb(220, 38, 38)', color: 'white' } 
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Allow reviews even if not logged in by using a temporary reviewer_id
      const reviewer_id = user?.id || '00000000-0000-0000-0000-000000000000';

      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            reviewed_id: craftsmanId,
            reviewer_id: reviewer_id,
            rating,
            comment: comment.trim() || null,
            is_public: true // Make sure reviews are public by default
          },
        ])
        .select();

      if (error) {
        console.error('Error submitting review:', error);
        throw error;
      }

      toast("تم إضافة التقييم بنجاح");
      setRating(0);
      setComment('');
      onReviewSubmit();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast("حدث خطأ أثناء إضافة التقييم", { 
        style: { backgroundColor: 'rgb(220, 38, 38)', color: 'white' } 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If the user is the craftsman, show reply option instead of review form
  if (!canReview) {
    return (
      <Card className="p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">الرد على التقييمات</h3>
        <p className="text-muted-foreground mb-4">
          كصنايعي، يمكنك الرد على التقييمات الموجودة ولكن لا يمكنك تقييم نفسك.
        </p>
        <Button 
          variant="outline"
          onClick={() => {
            // Logic for showing replies UI would go here
            toast("سيتم إضافة ميزة الرد على التقييمات قريباً");
          }}
        >
          عرض التقييمات للرد عليها
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3">أضف تقييمك</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="flex items-center">
            <p className="ml-2">التقييم:</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className="text-2xl focus:outline-none"
                  onClick={() => setRating(i + 1)}
                >
                  <span className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="comment" className="block mb-1">التعليق (اختياري):</label>
          <textarea
            id="comment"
            className="w-full p-2 border border-gray-300 rounded"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div className="text-left">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner className="mr-2" size="sm" /> : null}
            {isSubmitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
