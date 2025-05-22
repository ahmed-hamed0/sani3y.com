
import React from 'react';
import { Spinner } from '@/components/ui/spinner';

const SignUpLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      <Spinner size="lg" />
      <p className="mt-4 text-center text-muted-foreground">جاري إنشاء الحساب...</p>
    </div>
  );
};

export default SignUpLoading;
