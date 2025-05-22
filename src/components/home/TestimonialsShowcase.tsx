
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from '@/components/reviews/StarRating';
import { useTestimonials } from '@/hooks/useTestimonials';

export const TestimonialsShowcase = () => {
  const { testimonials, isLoading } = useTestimonials();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const featuredTestimonials = testimonials
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-center mb-6">أفضل التقييمات</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="mr-3">
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="mb-3">
                <StarRating rating={testimonial.rating} />
              </div>
              
              <p className="text-gray-700 line-clamp-3">{testimonial.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        <Button asChild variant="outline" className="px-6">
          <Link to="/testimonials">عرض كل التقييمات</Link>
        </Button>
      </div>
    </div>
  );
};
