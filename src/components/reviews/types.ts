
export interface Review {
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

export interface ReviewsSummary {
  averageRating: number;
  reviewsCount: number;
}
