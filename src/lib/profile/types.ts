
// Define common types for profile functionality
export interface ProfileData {
  id: string;
  full_name: string;
  role: "client" | "craftsman";
  phone: string;
  governorate: string;
  city: string;
  // These fields are required for DB but can be null in TypeScript
  avatar_url: string | null;
  rating: number;
  created_at: string;
  updated_at: string;
}

// Interface for craftsman details
export interface CraftsmanDetailsData {
  id: string;
  specialty?: string;
  bio?: string;
  skills?: string[];
  completed_jobs?: number;
  experience_years?: number;
  is_available?: boolean;
  gallery?: string[];
}

export interface ProfileResponse {
  success: boolean;
  data?: ProfileData;
  error?: {
    message: string;
  };
}

export interface CraftsmanDetailsResponse {
  success: boolean;
  data?: CraftsmanDetailsData;
  error?: {
    message: string;
  };
}

export interface ImageUploadResponse {
  success: boolean;
  url?: string;
  error?: {
    message: string;
  };
}
