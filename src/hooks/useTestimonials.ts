
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
  created_at: string;
}

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      // Instead of using a relationship, directly select reviews that are public
      const { data, error } = await supabase
        .from('reviews')
        .select('id, rating, comment, created_at, reviewer_id, is_public')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching testimonials:', error);
        setIsLoading(false);
        return;
      }

      if (data && data.length > 0) {
        // For each review, fetch the reviewer's profile information
        const testimonialsWithProfiles = await Promise.all(
          data.map(async (review) => {
            // Get the reviewer's profile
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name, avatar_url, role')
              .eq('id', review.reviewer_id)
              .single();

            return {
              id: review.id,
              name: profileData?.full_name || 'زائر',
              role: profileData?.role === 'client' ? 'عميل' : 'صنايعي',
              avatar: profileData?.avatar_url || '/placeholder.svg',
              text: review.comment || '',
              rating: review.rating,
              created_at: review.created_at
            };
          })
        );

        setTestimonials(testimonialsWithProfiles);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return { 
    testimonials,
    isLoading,
    fetchTestimonials 
  };
};
