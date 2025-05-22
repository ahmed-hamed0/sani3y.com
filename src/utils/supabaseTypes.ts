
export interface JobApplicationCheckResult {
  exists: boolean;
}

export interface JobApplicationCheckResponse {
  result: JobApplicationCheckResult;
}

export interface CanApplyResult {
  can_apply: boolean;
  is_premium: boolean;
  free_applications_used: number;
  free_applications_limit: number;
}

export interface CanApplyResponse {
  result: CanApplyResult;
}

export type JobStatus = 'open' | 'assigned' | 'completed' | 'cancelled';

export interface JobApplicationResult {
  id: string;
  job_id: string;
  craftsman_id: string;
  proposal: string;
  budget?: number;
  status: 'pending' | 'accepted' | 'rejected';
  submitted_at: string;
  craftsman_name?: string;
  craftsman_avatar?: string;
  craftsman_specialty?: string;
  craftsman_rating?: number;
  craftsman?: {
    id: string;
    name: string;
    avatar?: string;
    specialty?: string;
    rating?: number;
    completed_jobs?: number;
  }
}

export interface JobApplicationsResponse {
  data: JobApplicationResult[];
}

export interface CraftsmanReview {
  id: string;
  reviewer_id: string;
  reviewed_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  is_public: boolean;
  reviewer?: {
    name: string;
    avatar?: string;
  };
}

export interface ReviewsResponse {
  status: number;
  data: CraftsmanReview[];
}

export interface ReviewResponse {
  success: boolean;
  data?: any;
  error?: {
    message: string;
  };
}
