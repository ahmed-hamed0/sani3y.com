
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { RegisterFormValues, registerSchema, signUp } from '@/lib/auth';

export function useSignUpForm(initialRole: 'client' | 'craftsman' = 'client') {
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      countryCode: '+20',
      password: '',
      confirmPassword: '',
      governorate: '',
      city: '',
      role: initialRole,
      specialty: '',
      bio: '',
      agreeTerms: false
    }
  });

  const role = form.watch('role');
  const countryCode = form.watch('countryCode');
  const phone = form.watch('phone');

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    const step1Fields = ['name', 'email', 'phone', 'password', 'confirmPassword'];
    const step1Result = await form.trigger(step1Fields as any);
    
    if (step1Result) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };
  
  const goToCraftsmanDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const step2Fields = ['governorate', 'city', 'agreeTerms'];
    form.trigger(step2Fields as any).then(step2Result => {
      if (step2Result) {
        setStep(3);
      }
    });
  };

  const onSubmit = async (values: RegisterFormValues) => {
    // تحقق من صحة البيانات قبل الإرسال
    if (role === 'craftsman' && (!values.specialty || values.specialty.trim() === '')) {
      form.setError('specialty', { 
        type: 'manual',
        message: 'يجب اختيار التخصص'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // إضافة تأخير 1 ثانية لتجنب قيود الأمان
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { success, error } = await signUp(values);
      
      if (!success && error) {
        let errorMessage = error.message;
        
        if (error.message.includes("User already registered")) {
          errorMessage = "البريد الإلكتروني مسجل بالفعل";
        }
        
        toast({
          title: "خطأ في إنشاء الحساب",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "يمكنك الآن تسجيل الدخول",
      });
      
      // التوجيه إلى صفحة تسجيل الدخول بعد نجاح التسجيل
      navigate('/sign-in');
    } catch (error) {
      toast({
        title: "خطأ في النظام",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    step,
    isLoading,
    form,
    role,
    countryCode,
    phone,
    handleNextStep,
    handlePrevStep,
    goToCraftsmanDetails,
    onSubmit
  };
}
