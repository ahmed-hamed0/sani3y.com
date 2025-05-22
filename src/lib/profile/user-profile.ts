
import { supabase } from '@/integrations/supabase/client';
import { ProfileData, ProfileResponse } from './types';

// Get user profile
export async function getUserProfile(userId: string): Promise<ProfileResponse> {
  try {
    console.log("Fetching profile for user ID:", userId);
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }

    if (!profileData) {
      console.log("No profile found for user ID:", userId);
      return {
        success: false,
        error: {
          message: 'لم يتم العثور على الملف الشخصي',
        },
      };
    }

    console.log("Profile data retrieved:", profileData);
    return {
      success: true,
      data: profileData as ProfileData,
    };
  } catch (error: any) {
    console.error("Exception in getUserProfile:", error);
    return {
      success: false,
      error: {
        message: error.message || 'حدث خطأ أثناء جلب بيانات الملف الشخصي',
      },
    };
  }
}

// Create user profile
export async function createUserProfile(profileData: ProfileData): Promise<ProfileResponse> {
  try {
    // تحقق من وجود الملف الشخصي قبل الإنشاء
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', profileData.id)
      .single();

    if (existingProfile) {
      // إذا كان الملف الشخصي موجودًا بالفعل، قم بتحديثه بدلاً من إنشائه
      return updateUserProfile(profileData.id, profileData);
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: profileData.id,
        full_name: profileData.full_name,
        role: profileData.role,
        phone: profileData.phone,
        governorate: profileData.governorate,
        city: profileData.city,
        avatar_url: profileData.avatar_url,
        rating: profileData.rating || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error("Error creating profile:", profileError);
      throw profileError;
    }

    // Return the newly created profile
    return {
      success: true,
      data: profileData,
    };
  } catch (error: any) {
    console.error('Error creating profile:', error);
    return {
      success: false,
      error: {
        message: error.message || 'حدث خطأ أثناء إنشاء الملف الشخصي',
      },
    };
  }
}

// Update user profile
export const updateUserProfile = async (userId: string, profileData: Partial<Omit<ProfileData, 'role'>> & { role?: "client" | "craftsman" }) => {
  try {
    // إضافة حقل updated_at لتحديث وقت التعديل
    const dataToUpdate = {
      ...profileData,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .update(dataToUpdate)
      .eq('id', userId);

    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }

    return { 
      success: true, 
      data: { id: userId, ...profileData }
    };
  } catch (error: any) {
    console.error('Error in updateUserProfile:', error);
    return { 
      success: false, 
      error: { 
        message: error.message || 'فشل في تحديث الملف الشخصي' 
      } 
    };
  }
};

// تحقق من وجود الملف الشخصي وإنشاءه إذا لم يكن موجودًا
export const ensureProfileExists = async (user: any): Promise<ProfileResponse> => {
  try {
    if (!user || !user.id) {
      return {
        success: false,
        error: { message: 'المستخدم غير موجود' }
      };
    }

    // تحقق من وجود الملف الشخصي
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // خطأ غير متوقع
      console.error("Error fetching profile:", fetchError);
      return {
        success: false,
        error: { message: fetchError.message }
      };
    }

    if (existingProfile) {
      // الملف الشخصي موجود بالفعل
      return {
        success: true,
        data: existingProfile as ProfileData
      };
    }

    // إنشاء ملف شخصي جديد
    const userData = user.user_metadata || {};
    const newProfileData: ProfileData = {
      id: user.id,
      full_name: userData.full_name || user.email?.split('@')[0] || 'مستخدم جديد',
      role: userData.role || 'client',
      phone: userData.phone || '',
      governorate: userData.governorate || '',
      city: userData.city || '',
      avatar_url: userData.avatar_url || null,
      rating: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const result = await createUserProfile(newProfileData);
    return result;
  } catch (error: any) {
    console.error('Error in ensureProfileExists:', error);
    return {
      success: false,
      error: { message: error.message || 'حدث خطأ أثناء التحقق من الملف الشخصي' }
    };
  }
};
