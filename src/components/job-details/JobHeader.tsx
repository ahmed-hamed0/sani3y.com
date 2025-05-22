
import { MapPin, CalendarClock, DollarSign } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';

interface JobHeaderProps {
  job: {
    title: string;
    governorate: string;
    city?: string;
    created_at: string;
    budget_min?: number;
    budget_max?: number;
  };
  statusBadge: React.ReactNode;
}

export const JobHeader = ({ job, statusBadge }: JobHeaderProps) => {
  if (!job) {
    return null;
  }
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
          <div className="flex items-center flex-wrap gap-x-6 gap-y-2">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="w-4 h-4 ml-1" />
              <span>{job.governorate}{job.city ? ` - ${job.city}` : ''}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <CalendarClock className="w-4 h-4 ml-1" />
              <span>
                {job.created_at ? formatDistanceToNow(parseISO(job.created_at), { 
                  addSuffix: true, 
                  locale: ar 
                }) : ''}
              </span>
            </div>
            {(job.budget_min || job.budget_max) && (
              <div className="flex items-center text-primary font-medium">
                <DollarSign className="w-4 h-4 ml-1" />
                <span>
                  {job.budget_min && job.budget_max ? 
                    `${job.budget_min} - ${job.budget_max} جنيه` : 
                    job.budget_min ? `${job.budget_min} جنيه` : 
                    job.budget_max ? `${job.budget_max} جنيه` : ''}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end">
          {statusBadge}
        </div>
      </div>
    </div>
  );
};
