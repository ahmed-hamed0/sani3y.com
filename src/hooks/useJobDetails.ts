
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

interface JobLocation {
  governorate: string;
  city: string;
  address?: string;
}

interface JobBudget {
  min?: number;
  max?: number;
}

export interface JobDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'open' | 'assigned' | 'completed';
  created_at: string;
  client: {
    id: string;
    name: string;
    avatar?: string;
    rating?: number;
  };
  craftsman?: {
    id: string;
    name: string;
    avatar?: string;
    specialty?: string;
    rating?: number;
  };
  location: JobLocation;
  budget?: JobBudget;
}

export function useJobDetails(jobId: string) {
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const isOwner = user && job?.client?.id === user.id;
  const isAssigned = job?.status === 'assigned';
  const isCompleted = job?.status === 'completed';
  const isAssignedCraftsman = user && job?.craftsman?.id === user.id;

  const fetchJobDetails = useCallback(async () => {
    if (!jobId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get basic job info
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select(`
          id, title, description, category, status, created_at,
          client_id, craftsman_id, 
          governorate, city, address,
          budget_min, budget_max
        `)
        .eq('id', jobId)
        .single();
      
      if (jobError) {
        console.error('Error fetching job details:', jobError);
        setError('تعذر العثور على تفاصيل المهمة');
        setLoading(false);
        return;
      }
      
      if (!jobData) {
        setError('المهمة غير موجودة');
        setLoading(false);
        return;
      }
      
      // Get client details
      const { data: clientData, error: clientError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, rating')
        .eq('id', jobData.client_id)
        .single();
      
      if (clientError) {
        console.error('Error fetching client details:', clientError);
      }
      
      // Get craftsman details if assigned
      let craftsmanData = null;
      if (jobData.craftsman_id) {
        const { data: craftsmanResult, error: craftsmanError } = await supabase
          .from('profiles')
          .select(`
            id, full_name, avatar_url, rating,
            craftsman_details (specialty)
          `)
          .eq('id', jobData.craftsman_id)
          .single();
        
        if (!craftsmanError && craftsmanResult) {
          craftsmanData = craftsmanResult;
        } else if (craftsmanError) {
          console.error('Error fetching craftsman details:', craftsmanError);
        }
      }
      
      const formattedJob: JobDetails = {
        id: jobData.id,
        title: jobData.title,
        description: jobData.description,
        category: jobData.category,
        status: jobData.status as 'open' | 'assigned' | 'completed',
        created_at: jobData.created_at,
        client: {
          id: jobData.client_id,
          name: clientData?.full_name || 'مستخدم غير معروف',
          avatar: clientData?.avatar_url || undefined,
          rating: clientData?.rating || undefined
        },
        location: {
          governorate: jobData.governorate,
          city: jobData.city,
          address: jobData.address
        },
        budget: jobData.budget_min || jobData.budget_max ? {
          min: jobData.budget_min || undefined,
          max: jobData.budget_max || undefined
        } : undefined
      };
      
      if (craftsmanData) {
        formattedJob.craftsman = {
          id: craftsmanData.id,
          name: craftsmanData.full_name,
          avatar: craftsmanData.avatar_url || undefined,
          specialty: craftsmanData.craftsman_details?.specialty,
          rating: craftsmanData.rating
        };
      }
      
      setJob(formattedJob);
    } catch (error) {
      console.error('Error in fetchJobDetails:', error);
      setError('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  const markJobAsCompleted = async () => {
    if (!user || !job || !isOwner) {
      return { success: false, error: 'غير مصرح لك بتنفيذ هذا الإجراء' };
    }
    
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'completed' })
        .eq('id', jobId);
      
      if (error) {
        console.error('Error marking job as completed:', error);
        return { success: false, error: error.message };
      }
      
      // Update local state
      setJob(prev => prev ? { ...prev, status: 'completed' } : null);
      
      return { success: true };
    } catch (error: any) {
      console.error('Error in markJobAsCompleted:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    job,
    loading,
    error,
    isOwner,
    isAssigned,
    isCompleted,
    isAssignedCraftsman,
    refreshJobDetails: fetchJobDetails,  // Export fetchJobDetails as refreshJobDetails
    markJobAsCompleted
  };
}
