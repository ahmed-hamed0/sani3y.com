import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks/useAuth';
import { useJobDetails } from '@/hooks/useJobDetails';
import { JobBreadcrumb } from '@/components/job-details/JobBreadcrumb';
import { JobDescription } from '@/components/job-details/JobDescription';
import { JobHeader } from '@/components/job-details/JobHeader';
import { JobStatusCard } from '@/components/job-details/JobStatusCard';
import { SecurityNoteCard } from '@/components/job-details/SecurityNoteCard';
import { ClientInfoCard } from '@/components/job-details/ClientInfoCard';
import { CraftsmanInfoCard } from '@/components/job-details/CraftsmanInfoCard';
import JobApplication from '@/components/jobs/JobApplication';
import JobApplicationsList from '@/components/jobs/JobApplicationsList';
import { supabase } from '@/integrations/supabase/client';
import { JobStatus } from '@/utils/supabaseTypes';

// Define a local JobStatus type to match the imported one
type LocalJobStatus = 'open' | 'assigned' | 'completed' | 'cancelled';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('description');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const { user, isClient, isCraftsman } = useAuth();
  
  const jobId = id || '';
  
  const { 
    job, 
    loading, 
    error, 
    isOwner, 
    isAssigned, 
    isCompleted, 
    isAssignedCraftsman,
    refreshJobDetails,
    markJobAsCompleted
  } = useJobDetails(jobId);

  const updateJobStatus = async (updateData: { status: LocalJobStatus, craftsman_id?: string | null }) => {
    if (!job || !user) return;
    
    setIsUpdatingStatus(true);
    
    try {
      const { error } = await supabase
        .from('jobs')
        .update(updateData)
        .eq('id', jobId)
        .single();
      
      if (error) {
        throw error;
      }
      
      await refreshJobDetails();
      
      toast("تم تحديث حالة الوظيفة بنجاح");
      
    } catch (error: any) {
      console.error('Error updating job status:', error);
      toast("حدث خطأ أثناء تحديث حالة الوظيفة", {
        style: { backgroundColor: 'rgb(220, 38, 38)', color: 'white' }
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  const handleAssignJob = async (craftsmanId: string) => {
    await updateJobStatus({
      status: 'assigned' as LocalJobStatus,
      craftsman_id: craftsmanId
    });
  };
  
  const handleSubmitApplication = () => {
    setActiveTab('description');
    setShowApplicationForm(false);
    toast("تم إرسال طلبك بنجاح");
  };

  const handleOpenApplicationForm = () => {
    setShowApplicationForm(true);
  };
  
  const handleUpdateJobStatus = async (status: LocalJobStatus) => {
    await updateJobStatus({
      status: status
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container-custom py-12">
          <div className="flex flex-col items-center justify-center h-64">
            <Spinner size="lg" />
            <p className="mt-4 text-lg">جارٍ تحميل تفاصيل الوظيفة...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !job) {
    return (
      <MainLayout>
        <div className="container-custom py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">حدث خطأ</h1>
            <p className="text-gray-600 mb-6">{error || 'لم يتم العثور على الوظيفة المطلوبة'}</p>
            <Button onClick={() => navigate('/jobs')}>العودة إلى قائمة الوظائف</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Prepare formatted job data for the JobHeader component
  const jobData = {
    title: job.title || '',
    governorate: job.location.governorate || '',
    city: job.location.city || '',
    created_at: job.created_at || '',
    budget_min: job.budget?.min,
    budget_max: job.budget?.max
  };
  
  return (
    <MainLayout>
      <div className="container-custom py-8">
        <JobBreadcrumb title={job.title || ''} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <JobHeader 
              job={{
                title: job?.title || '',
                governorate: job?.location?.governorate || '',
                city: job?.location?.city || '',
                created_at: job?.created_at || '',
                budget_min: job?.budget?.min,
                budget_max: job?.budget?.max
              }}
              statusBadge={
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  job?.status === 'open' ? 'bg-blue-100 text-blue-800' : 
                  job?.status === 'assigned' ? 'bg-amber-100 text-amber-800' :
                  job?.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {job?.status === 'open' ? 'مفتوح' : 
                   job?.status === 'assigned' ? 'تم التكليف' :
                   job?.status === 'completed' ? 'مكتمل' : 'ملغي'}
                </div>
              }
            />
            
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="description">التفاصيل</TabsTrigger>
                  {isCraftsman && job.status === 'open' && (
                    <TabsTrigger value="apply" onClick={handleOpenApplicationForm}>التقديم على الوظيفة</TabsTrigger>
                  )}
                  {isOwner && (
                    <TabsTrigger value="applications">طلبات التقديم</TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="description">
                  <JobDescription description={job.description || ''} />
                </TabsContent>
                
                <TabsContent value="applications">
                  <JobApplicationsList 
                    jobId={jobId} 
                    onAssign={handleAssignJob} 
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <div className="space-y-6">
            <JobStatusCard 
              status={job?.status as LocalJobStatus}
              isOwner={isOwner}
              isAssignedCraftsman={isAssignedCraftsman}
              isCompleted={isCompleted}
              isUpdating={isUpdatingStatus}
              onMarkComplete={markJobAsCompleted}
            />
            
            <SecurityNoteCard />
            
            {job?.client && (
              <ClientInfoCard client={job.client} />
            )}
            
            {job?.craftsman && job?.status !== 'open' && (
              <CraftsmanInfoCard craftsman={job.craftsman} />
            )}
          </div>
        </div>
      </div>

      {/* Application Dialog */}
      {isCraftsman && job?.status === 'open' && (
        <JobApplication 
          jobId={jobId}
          isOpen={showApplicationForm}
          onClose={() => setShowApplicationForm(false)}
          onSuccess={handleSubmitApplication}
        />
      )}
    </MainLayout>
  );
};

export default JobDetails;
