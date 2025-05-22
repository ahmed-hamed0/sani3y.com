
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JobApplicationResult } from '@/utils/supabaseTypes';

export type JobApplication = JobApplicationResult;

export interface JobApplicationHookReturn {
  applications: JobApplication[];
  loading: boolean;
  error: string | null;
  acceptApplication: (applicationId: string) => Promise<boolean>;
  rejectApplication: (applicationId: string) => Promise<boolean>;
}

export function useJobApplications(jobId: string): JobApplicationHookReturn {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobApplications();
  }, [jobId]);

  const fetchJobApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use a simple select query instead of RPC to avoid type issues
      const { data, error: fetchError } = await supabase
        .from('job_applications')
        .select(`
          id, 
          job_id, 
          craftsman_id, 
          proposal, 
          budget, 
          status, 
          submitted_at,
          profiles:craftsman_id (
            id,
            full_name,
            avatar_url,
            governorate,
            city
          )
        `)
        .eq('job_id', jobId);

      if (fetchError) throw fetchError;

      // Transform the data to match JobApplication type
      const transformedData: JobApplication[] = data?.map(app => ({
        id: app.id,
        job_id: app.job_id,
        craftsman_id: app.craftsman_id,
        proposal: app.proposal,
        budget: app.budget,
        status: app.status as "pending" | "accepted" | "rejected",
        submitted_at: app.submitted_at,
        craftsman_name: app.profiles?.full_name || '',
        craftsman_avatar: app.profiles?.avatar_url || '',
        craftsman_specialty: '',  // This will be empty as we don't have specialty in the query
        craftsman: app.profiles ? {
          id: app.profiles.id,
          name: app.profiles.full_name,
          avatar: app.profiles.avatar_url,
          specialty: '',  // We don't have specialty in our query
          rating: 0,
          completed_jobs: 0
        } : undefined
      })) || [];

      setApplications(transformedData);
    } catch (err: any) {
      console.error('Error fetching job applications:', err);
      setError(err.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const acceptApplication = async (applicationId: string): Promise<boolean> => {
    try {
      // First update the application status to accepted
      const { error: appError } = await supabase
        .from('job_applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId);

      if (appError) throw appError;

      // Get the application to find craftsmanId
      const { data: appData, error: getAppError } = await supabase
        .from('job_applications')
        .select('craftsman_id')
        .eq('id', applicationId)
        .single();

      if (getAppError || !appData) throw getAppError || new Error('Application not found');

      // Update job status to in-progress and set craftsman_id
      const { error: jobError } = await supabase
        .from('jobs')
        .update({
          status: 'in-progress',
          craftsman_id: appData.craftsman_id
        })
        .eq('id', jobId);

      if (jobError) throw jobError;

      // Reject all other applications for this job
      const { error: rejectError } = await supabase
        .from('job_applications')
        .update({ status: 'rejected' })
        .eq('job_id', jobId)
        .neq('id', applicationId);

      if (rejectError) {
        console.error('Error rejecting other applications:', rejectError);
        // Continue anyway, not a critical error
      }

      // Refresh applications list
      await fetchJobApplications();
      return true;
      
    } catch (err: any) {
      console.error('Error accepting application:', err);
      setError(err.message || 'Failed to accept application');
      return false;
    }
  };

  const rejectApplication = async (applicationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: 'rejected' })
        .eq('id', applicationId);

      if (error) throw error;

      // Refresh applications list
      await fetchJobApplications();
      return true;
      
    } catch (err: any) {
      console.error('Error rejecting application:', err);
      setError(err.message || 'Failed to reject application');
      return false;
    }
  };

  return {
    applications,
    loading,
    error,
    acceptApplication,
    rejectApplication
  };
}
