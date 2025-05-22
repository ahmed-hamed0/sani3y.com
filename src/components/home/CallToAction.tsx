
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container-custom text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">ابدأ في الانضمام إلينا الآن</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          سواء كنت تبحث عن صنايعي محترف أو كنت صنايعي تبحث عن عملاء، منصتنا توفر لك الحلول المناسبة
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Button 
            size="lg" 
            asChild
            className="bg-white text-black hover:bg-white/90" 
          >
            <Link to="/sign-up">سجل الآن</Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            asChild
            className="border-white text-white hover:bg-white/10 hover:text-white"
          >
            <Link to="/about">معرفة المزيد</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
