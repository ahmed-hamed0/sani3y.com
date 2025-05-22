
import { useState } from 'react';
import { uploadAvatar } from '@/lib/profile/image-upload';
import { toast } from 'sonner';

export const useAvatarUpload = (userId: string | undefined, onSuccess: (url: string) => void) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !userId) {
      // توضيح سبب الفشل في تحميل الصورة
      if (!userId) {
        toast("يرجى تسجيل الدخول لتحميل صورة", {
          style: { backgroundColor: 'rgb(220, 38, 38)', color: 'white' }
        });
      } else if (!files || files.length === 0) {
        toast("لم يتم اختيار أي صورة", {
          style: { backgroundColor: 'rgb(220, 38, 38)', color: 'white' }
        });
      }
      return;
    }

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast("حجم الملف كبير جداً (الحد الأقصى 5 ميجابايت)", {
        style: { backgroundColor: 'rgb(220, 38, 38)', color: 'white' }
      });
      return;
    }

    setIsUploading(true);
    try {
      console.log("Starting avatar upload for user:", userId);
      const { success, url, error } = await uploadAvatar(userId, file);
      
      if (success && url) {
        console.log("Avatar upload successful:", url);
        onSuccess(url);
        toast("تم تحديث الصورة الشخصية بنجاح");
      } else if (error) {
        console.error("Avatar upload error:", error);
        toast("خطأ في تحميل الصورة: " + error.message, {
          style: { backgroundColor: 'rgb(220, 38, 38)', color: 'white' }
        });
      }
    } catch (error: any) {
      console.error("Exception during avatar upload:", error);
      toast("خطأ في تحميل الصورة: حدث خطأ غير متوقع أثناء تحميل الصورة", {
        style: { backgroundColor: 'rgb(220, 38, 38)', color: 'white' }
      });
    } finally {
      setIsUploading(false);
      // Reset the file input to allow selecting the same file again
      event.target.value = '';
    }
  };

  return { isUploading, handleAvatarUpload };
};
