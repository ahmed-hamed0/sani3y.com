
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layouts/MainLayout';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send form data logic would go here
      // For now, just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        description: 'تم إرسال رسالتك بنجاح. سنقوم بالرد عليك قريباً.',
      });
      
      // Reset form
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">اتصل بنا</h1>
          <p className="mb-8 text-muted-foreground">
            نحن هنا للمساعدة! أرسل لنا رسالة وسنرد عليك في أقرب وقت ممكن.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم</Label>
              <Input 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">الرسالة</Label>
              <Textarea 
                id="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال'}
            </Button>
          </form>
          
          <div className="mt-12 grid sm:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">البريد الإلكتروني</h3>
              <p className="text-muted-foreground">support@sani3y.com</p>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">رقم الهاتف</h3>
              <p className="text-muted-foreground">+20 123 456 7890</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Contact;
