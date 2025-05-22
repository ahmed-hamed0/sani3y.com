
import MainLayout from '@/components/layouts/MainLayout';
import { Card } from '@/components/ui/card';
import { Review } from '@/components/reviews/Review';
import { StarRating } from '@/components/reviews/StarRating';
import { useTestimonials } from '@/hooks/useTestimonials';
import { useEffect } from 'react';

const AllTestimonials = () => {
  const { testimonials, isLoading, fetchTestimonials } = useTestimonials();

  // Refresh testimonials when component mounts
  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <MainLayout>
      <div className="container-custom py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">جميع التقييمات</h1>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="mr-3">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <StarRating rating={testimonial.rating} />
                </div>
                <p className="mt-3 text-gray-700">{testimonial.text}</p>
                <p className="mt-2 text-xs text-gray-400 text-left">
                  {new Date(testimonial.created_at).toLocaleDateString('ar-EG')}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">لا توجد تقييمات بعد</p>
            <p className="mt-2 text-gray-500">يمكنك إضافة تقييم من الصفحة الرئيسية</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AllTestimonials;
