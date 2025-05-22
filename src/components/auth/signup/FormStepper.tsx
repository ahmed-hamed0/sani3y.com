
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormValues } from '@/lib/auth';
import BasicInfoStep from './BasicInfoStep';
import LocationStep from './LocationStep';
import CraftsmanDetailsStep from './CraftsmanDetailsStep';

interface FormStepperProps {
  step: number;
  form: UseFormReturn<RegisterFormValues>;
  role: 'client' | 'craftsman';
  isLoading: boolean;
  onNextStep: (e: React.FormEvent) => void;
  onPrevStep: () => void;
  goToCraftsmanDetails: (e: React.FormEvent) => void;
}

const FormStepper = ({
  step,
  form,
  role,
  isLoading,
  onNextStep,
  onPrevStep,
  goToCraftsmanDetails
}: FormStepperProps) => {
  // تعديل المكون ليعرض الخطوات بشكل صحيح
  if (step === 1) {
    return (
      <BasicInfoStep
        form={form}
        onNextStep={onNextStep}
      />
    );
  }
  
  if (step === 2) {
    return (
      <LocationStep
        form={form}
        role={role}
        isLoading={isLoading}
        onPrevStep={onPrevStep}
        onNextStep={role === 'craftsman' ? goToCraftsmanDetails : undefined}
      />
    );
  }
  
  // الخطوة الثالثة - تفاصيل الصنايعي
  return (
    <CraftsmanDetailsStep
      form={form}
      isLoading={isLoading}
      onPrevStep={onPrevStep}
    />
  );
};

export default FormStepper;
