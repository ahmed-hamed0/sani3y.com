
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile } from '@/lib/profile/user-profile';
import { ProfileLoading } from '@/components/profile/ProfileLoading';
import { ProfileError } from '@/components/profile/ProfileError';
import { ProfileNotFound } from '@/components/profile/ProfileNotFound';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { toast } from 'sonner';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';

const Profile = () => {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { isUploading, handleAvatarUpload } = useAvatarUpload(
    user?.id, 
    (url) => setProfile((prev: any) => ({ ...prev, avatar_url: url }))
  );

  const refreshProfileData = async () => {
    if (!user) return;
    
    setIsRefreshing(true);
    try {
      await refreshProfile();
      
      setIsLoading(true);
      setError(null);
      const { success, data, error: profileError } = await getUserProfile(user.id);
      
      if (success && data) {
        setProfile(data);
        toast("تم تحديث الملف الشخصي بنجاح");
      } else if (profileError) {
        setError(profileError.message || "لم يتم العثور على الملف الشخصي");
        toast("خطأ في التحديث: " + (profileError.message || "لم يتم العثور على الملف الشخصي"), {
          style: { backgroundColor: 'rgb(220, 38, 38)', color: 'white' }
        });
      }
    } catch (error: any) {
      console.error("Error refreshing profile:", error);
      setError("حدث خطأ غير متوقع أثناء تحديث الملف الشخصي");
      toast("خطأ في النظام: حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى", {
        style: { backgroundColor: 'rgb(220, 38, 38)', color: 'white' }
      });
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        console.log("Fetching profile for user:", user.id);
        setError(null);
        
        // Add a small delay to ensure auth state is stable
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { success, data, error: profileError } = await getUserProfile(user.id);
        
        if (success && data) {
          console.log("Profile loaded successfully:", data);
          setProfile(data);
        } else if (profileError) {
          console.error("Error loading profile:", profileError);
          setError(profileError.message || "لم يتم العثور على الملف الشخصي");
          
          toast("خطأ في تحميل الملف الشخصي: " + (profileError.message || "لم يتم العثور على الملف الشخصي"), {
            style: { backgroundColor: 'rgb(220, 38, 38)', color: 'white' }
          });
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        setError("حدث خطأ غير متوقع أثناء تحميل الملف الشخصي");
        toast("خطأ في النظام: حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى", {
          style: { backgroundColor: 'rgb(220, 38, 38)', color: 'white' }
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.id) {
      fetchProfile();
    } else {
      setIsLoading(false);
      setError("يرجى تسجيل الدخول لعرض الملف الشخصي");
    }
  }, [user]);

  if (isLoading) {
    return (
      <MainLayout>
        <ProfileLoading />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <ProfileError 
          error={error} 
          isRefreshing={isRefreshing} 
          onRetry={refreshProfileData} 
        />
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <ProfileNotFound 
          isRefreshing={isRefreshing} 
          onRetry={refreshProfileData} 
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">الملف الشخصي</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ProfileHeader 
              profile={profile} 
              isUploading={isUploading} 
              onAvatarUpload={handleAvatarUpload} 
            />
          </div>

          <div className="lg:col-span-3">
            <ProfileTabs 
              profile={profile}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
