
import { supabase } from '@/integrations/supabase/client';
import { CraftsmanDetailsData } from './types';

// Update craftsman details
export const updateCraftsmanDetails = async (userId: string, details: Partial<CraftsmanDetailsData>) => {
  try {
    const { error } = await supabase
      .from('craftsman_details')
      .update(details)
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in updateCraftsmanDetails:', error);
    return { 
      success: false, 
      error: { 
        message: error.message || 'فشل في تحديث معلومات الصنايعي' 
      } 
    };
  }
};
