
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

export function useJobApplication(jobId: string) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitApplication = async (data: { proposal: string; budget?: number }) => {
    if (!user) {
      setError('يجب تسجيل الدخول لتقديم طلب');
      return false;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // التحقق من وجود طلب سابق
      const { data: existingData, error: existingError } = await supabase
        .from('job_applications')
        .select('id')
        .eq('job_id', jobId)
        .eq('craftsman_id', user.id)
        .maybeSingle();

      if (existingData) {
        setError('لقد قدمت طلباً بالفعل لهذه المهمة');
        return false;
      }

      // التحقق من عدد الطلبات المستخدمة
      const { data: appCountData, error: countError } = await supabase
        .from('user_applications_count')
        .select('free_applications_used, id')
        .eq('user_id', user.id)
        .maybeSingle();
        
      // إنشاء سجل جديد إذا لم يكن موجوداً
      if (!appCountData) {
        await supabase
          .from('user_applications_count')
          .insert({
            user_id: user.id,
            free_applications_used: 0
          });
      }

      // إضافة الطلب الجديد
      const { error: applicationError } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          craftsman_id: user.id,
          proposal: data.proposal,
          budget: data.budget || null
        });

      if (applicationError) {
        throw applicationError;
      }

      // تحديث عدد الطلبات المستخدمة
      const appCountId = appCountData?.id;
      if (appCountId) {
        await supabase
          .from('user_applications_count')
          .update({
            free_applications_used: (appCountData.free_applications_used || 0) + 1
          })
          .eq('id', appCountId);
      }

      setSuccess(true);
      return true;

    } catch (err) {
      console.error('Error submitting application:', err);
      setError('حدث خطأ أثناء تقديم الطلب');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    submitApplication
  };
}
