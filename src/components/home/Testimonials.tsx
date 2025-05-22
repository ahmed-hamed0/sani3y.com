
import { TestimonialsShowcase } from './TestimonialsShowcase';
import { TestimonialForm } from '@/components/reviews/TestimonialForm';

const Testimonials = () => {
  return (
    <section className="py-16 bg-primary/5">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">آراء المستخدمين</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            تعرف على آراء عملائنا وصنايعيتنا في تجربة استخدام المنصة
          </p>
        </div>

        {/* Featured Testimonials */}
        <TestimonialsShowcase />

        {/* Add Review Form */}
        <TestimonialForm />
      </div>
    </section>
  );
};

export default Testimonials;
