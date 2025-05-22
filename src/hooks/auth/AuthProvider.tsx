import { useState, useEffect } from 'react';
import { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getUserProfile, createUserProfile } from '@/lib/profile';
import { UserRole } from '@/types';
import { AuthContext } from './AuthContext';

type UserData = SupabaseUser & {
  role?: UserRole | null;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  
  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      console.log("Refreshing profile for user:", user.id);
      const { success, data, error } = await getUserProfile(user.id);
      
      if (success && data) {
        console.log("Refreshed profile successfully:", data);
        const userRole = data.role as UserRole;
        setRole(userRole);
        setUser(prevUser => {
          if (prevUser) {
            return { ...prevUser, role: userRole };
          }
          return prevUser;
        });
      } else {
        console.error("Error refreshing profile:", error);
      }
    } catch (err) {
      console.error("Exception refreshing profile:", err);
    }
  };
  
  const loadUserProfile = async (userData: UserData) => {
    try {
      setProfileLoading(true);
      console.log('Loading profile for user:', userData.id);
      
      let { success, data: profileData, error: profileError } = await getUserProfile(userData.id);
      
      if (!success || !profileData) {
        console.log('No profile found, creating a new one for user:', userData.id);
        
        try {
          const { data: userMetadata } = await supabase.auth.getUser();
          const metadata = userMetadata?.user?.user_metadata || {};
          
          const { success: createSuccess, data: newProfile } = await createUserProfile({
            id: userData.id,
            full_name: metadata.full_name || userData.email?.split('@')[0] || 'مستخدم جديد',
            role: 'client' as UserRole,
            phone: metadata.phone || '+201000000000',
            governorate: metadata.governorate || 'القاهرة',
            city: metadata.city || 'القاهرة',
            avatar_url: null,
            rating: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          
          if (createSuccess && newProfile) {
            console.log('New profile created successfully:', newProfile);
            profileData = newProfile;
            success = true;
            profileError = null;
          } else {
            console.error('Failed to create profile');
          }
        } catch (createError) {
          console.error('Error creating profile:', createError);
        }
      }
      
      if (success && profileData) {
        console.log('Profile loaded/created:', profileData);
        const userRole = profileData.role as UserRole;
        setRole(userRole);
        // Create a new object instead of modifying the original
        setUser({ ...userData, role: userRole });
      } else {
        console.error('Failed to load or create profile:', profileError);
        setUser({ ...userData });
      }
    } catch (error) {
      console.error('Error in loadUserProfile function:', error);
      setUser({ ...userData });
    } finally {
      setProfileLoading(false);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    let mounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;
    
    const initAuth = async () => {
      try {
        console.log('Initializing authentication...');
        
        const shouldPersistSession = localStorage.getItem('rememberMe') === 'true';
        console.log('Should persist session:', shouldPersistSession);
        
        // First set up the auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            if (!mounted) return;
            
            console.log('Auth state changed:', event, currentSession?.user?.email);
            
            if (currentSession?.user) {
              setSession(currentSession);
              // Create a new user object with role set to null initially
              const userData = { ...currentSession.user, role: null } as UserData;
              setUser(userData);
              
              // We are using setTimeout to avoid potential deadlocks
              setTimeout(async () => {
                if (!mounted) return;
                try {
                  await loadUserProfile(userData);
                } catch (error) {
                  console.error("Error loading profile in event listener:", error);
                  setLoading(false);
                }
              }, 0);
            } else {
              if (mounted) {
                setUser(null);
                setSession(null);
                setRole(null);
                setLoading(false);
              }
            }
          }
        );
        
        authSubscription = subscription;
        
        // Then check for an existing session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession?.user && mounted) {
          console.log('Session found, user:', initialSession.user.email);
          setSession(initialSession);
          // Create a new user object with role set to null initially
          const userData = { ...initialSession.user, role: null } as UserData;
          setUser(userData);
          
          // Load the user profile
          await loadUserProfile(userData);
        } else {
          console.log('No active session found');
          if (mounted) {
            setUser(null);
            setSession(null);
            setRole(null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) setLoading(false);
      }
    };
    
    initAuth();
    
    return () => {
      mounted = false;
      if (authSubscription) {
        console.log('Cleaning up auth subscription');
        authSubscription.unsubscribe();
      }
    };
  }, []);

  const isClient = role === 'client';
  const isCraftsman = role === 'craftsman';

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading: loading || profileLoading, 
      role, 
      isClient, 
      isCraftsman, 
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
