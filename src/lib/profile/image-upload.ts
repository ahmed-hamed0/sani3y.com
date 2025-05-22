
import { supabase } from '@/integrations/supabase/client';
import { ImageUploadResponse } from './types';

// Helper function to ensure bucket exists
async function ensureBucketExists(bucketName: string): Promise<boolean> {
  try {
    const { data: buckets } = await supabase
      .storage
      .listBuckets();
      
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create bucket if it doesn't exist
      await supabase
        .storage
        .createBucket(bucketName, {
          public: true
        });
    }
    
    return true;
  } catch (error) {
    console.error(`Error ensuring bucket ${bucketName} exists:`, error);
    return false;
  }
}

// Upload avatar image
export const uploadAvatar = async (userId: string, file: File): Promise<ImageUploadResponse> => {
  try {
    // Ensure avatars bucket exists
    const bucketReady = await ensureBucketExists('avatars');
    if (!bucketReady) {
      throw new Error('Failed to create or access avatars storage bucket');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the file
    const { error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL
    const { data } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(filePath);

    const url = data.publicUrl;

    // Update the user's avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: url })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    return { success: true, url };
  } catch (error: any) {
    console.error('Error in uploadAvatar:', error);
    return { 
      success: false, 
      error: { 
        message: error.message || 'فشل في تحميل الصورة الشخصية' 
      } 
    };
  }
};

// Upload gallery image
export const uploadGalleryImage = async (userId: string, file: File): Promise<ImageUploadResponse> => {
  try {
    // Ensure gallery bucket exists
    const bucketReady = await ensureBucketExists('gallery');
    if (!bucketReady) {
      throw new Error('Failed to create or access gallery storage bucket');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the file
    const { error: uploadError } = await supabase
      .storage
      .from('gallery')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL
    const { data } = supabase
      .storage
      .from('gallery')
      .getPublicUrl(filePath);

    const url = data.publicUrl;

    // Update user's gallery in craftsman_details
    const { data: currentData, error: fetchError } = await supabase
      .from('craftsman_details')
      .select('gallery')
      .eq('id', userId)
      .single();
      
    if (fetchError) {
      throw fetchError;
    }
    
    // Append new URL to the existing gallery array
    const currentGallery = currentData.gallery || [];
    const updatedGallery = [...currentGallery, url];

    const { error: updateError } = await supabase
      .from('craftsman_details')
      .update({
        gallery: updatedGallery
      })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    return { success: true, url };
  } catch (error: any) {
    console.error('Error in uploadGalleryImage:', error);
    return { 
      success: false, 
      error: { 
        message: error.message || 'فشل في تحميل الصورة'
      } 
    };
  }
};

// Remove gallery image
export const removeGalleryImage = async (userId: string, imageUrl: string): Promise<ImageUploadResponse> => {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const bucketName = 'gallery';
    const fileName = `${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1]}`;
    
    // Remove from storage
    const { error: removeError } = await supabase
      .storage
      .from(bucketName)
      .remove([fileName]);
    
    if (removeError) {
      console.error('Error removing file from storage:', removeError);
      // Continue anyway as we still want to remove from the database
    }
    
    // Get current gallery
    const { data: currentData, error: fetchError } = await supabase
      .from('craftsman_details')
      .select('gallery')
      .eq('id', userId)
      .single();
      
    if (fetchError) {
      throw fetchError;
    }
    
    // Filter out the removed image URL
    const currentGallery = currentData.gallery || [];
    const updatedGallery = currentGallery.filter(url => url !== imageUrl);
    
    // Update gallery in user profile
    const { error: updateError } = await supabase
      .from('craftsman_details')
      .update({
        gallery: updatedGallery
      })
      .eq('id', userId);
      
    if (updateError) {
      throw updateError;
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error in removeGalleryImage:', error);
    return { 
      success: false, 
      error: { 
        message: error.message || 'فشل في حذف الصورة'
      } 
    };
  }
};
