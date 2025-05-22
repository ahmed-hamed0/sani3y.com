
import { Form } from '@/components/ui/form';
import { useSignUpForm } from '@/hooks/useSignUpForm';
import FormStepper from './FormStepper';
import SignUpLoading from './SignUpLoading';
import { useEffect } from 'react';

interface SignUpFormProps {
  initialRole?: 'client' | 'craftsman';
}

const SignUpForm = ({ initialRole = 'client' }: SignUpFormProps) => {
  const {
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
  } = useSignUpForm(initialRole);

  // تحسين: نقل تحقق رقم الهاتف إلى useEffect لتجنب إعادة التصيير اللانهائي
  useEffect(() => {
    if (countryCode === '+20' && phone) {
      const isValid = phone.startsWith('1') && phone.length === 10 && /^\d+$/.test(phone);
      if (!isValid && phone.length > 0) {
        form.setError('phone', {
          type: 'manual',
          message: 'رقم الهاتف المصري يجب أن يكون 10 أرقام تبدأ برقم 1'
        });
      } else {
        // مسح الخطأ إذا كان رقم الهاتف صالحًا الآن
        form.clearErrors('phone');
      }
    }
  }, [countryCode, phone, form]);

  if (isLoading) {
    return <SignUpLoading />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormStepper
          step={step}
          form={form}
          role={role}
          isLoading={isLoading}
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
          goToCraftsmanDetails={goToCraftsmanDetails}
        />
      </form>
    </Form>
  );
};

export default SignUpForm;
