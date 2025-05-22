
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Star } from 'lucide-react';
import { StarRating } from '@/components/reviews/StarRating';

export const TestimonialForm = () => {
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("يرجى تسجيل الدخول لإضافة تقييم");
      return;
    }
    
    if (!newReview.trim()) {
      toast.error("يرجى كتابة تقييمك");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // نضيف التقييم كإستعراض عام - بحيث يظهر للجميع
      const { error } = await supabase
        .from('reviews')
        .insert({
          reviewer_id: user.id,
          reviewed_id: user.id, // يمكن تغييرها لتكون شيئًا آخر في المستقبل إذا لزم الأمر
          rating: newRating,
          comment: newReview,
          is_public: true // إضافة علامة لتوضيح أن هذا تقييم عام
        });
      
      if (error) {
        toast.error(error.message);
        console.error('Error submitting review:', error);
        return;
      }
      
      // Reset form
      setNewReview('');
      setNewRating(5);
      
      toast.success("شكرًا لمشاركتك رأيك");
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error("حدث خطأ أثناء إرسال التقييم");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetRating = (rating: number) => {
    setNewRating(rating);
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-center">شاركنا رأيك</h3>
      
      <form onSubmit={handleSubmitReview}>
        <div className="flex justify-center mb-4">
          {[...Array(5)].map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSetRating(i + 1)}
              className="focus:outline-none"
            >
              <Star 
                className={`h-8 w-8 ${i < newRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
              />
            </button>
          ))}
        </div>
        
        <Textarea
          placeholder="اكتب رأيك هنا..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          className="mb-4"
          rows={4}
          required
        />
        
        <div className="flex justify-center">
          <Button 
            type="submit" 
            disabled={isSubmitting || !newReview.trim() || !user} 
            className="flex items-center gap-2 hover:bg-[#3ab3a7]"
          >
            <Send size={18} />
            <span>{user ? 'إرسال التقييم' : 'يجب تسجيل الدخول للتقييم'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
