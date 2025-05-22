
import { useAuth } from "@/hooks/auth";
import { useJobApplications } from "@/hooks/useJobApplications";
import { ApplicationCard } from "./ApplicationCard";
import { ApplicationsLoading } from "./ApplicationsLoading";
import { EmptyApplications } from "./EmptyApplications";

export interface JobApplicationsListProps {
  jobId: string;
  isMyJob?: boolean;
  onAssign?: (craftsmanId: string) => void;
}

export function JobApplicationsList({ jobId, isMyJob = true, onAssign }: JobApplicationsListProps) {
  const { user } = useAuth();
  const { applications, loading, acceptApplication, rejectApplication } = useJobApplications(jobId);

  if (loading) {
    return <ApplicationsLoading />;
  }

  if (applications.length === 0) {
    return <EmptyApplications />;
  }
  
  const onAcceptHandler = async (applicationId: string) => {
    const success = await acceptApplication(applicationId);
    
    if (success) {
      // Find the accepted application to get craftsman ID
      const acceptedApp = applications.find(app => app.id === applicationId);
      if (acceptedApp && onAssign) {
        onAssign(acceptedApp.craftsman_id);
      }
    }
  };

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          isMyJob={isMyJob}
          onAccept={onAcceptHandler}
          onReject={rejectApplication}
        />
      ))}
    </div>
  );
}

export default JobApplicationsList;
