
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { saveRequestedUrl } from '@/utils/auth';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Save the current path so we can redirect back after login
      saveRequestedUrl(location.pathname);
      navigate('/sign-in', { replace: true });
    }
  }, [navigate, user, loading, location]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">جاري التحميل...</div>;
  }

  return user ? <>{children}</> : null;
}

export function RequireClient({ children }: { children: React.ReactNode }) {
  const { user, loading, isClient } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Save the current path so we can redirect back after login
        saveRequestedUrl(location.pathname);
        navigate('/sign-in', { replace: true });
      } else if (!isClient) {
        navigate('/', { replace: true });
      }
    }
  }, [navigate, user, loading, isClient, location]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">جاري التحميل...</div>;
  }

  return (user && isClient) ? <>{children}</> : null;
}

export function RequireCraftsman({ children }: { children: React.ReactNode }) {
  const { user, loading, isCraftsman } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Save the current path so we can redirect back after login
        saveRequestedUrl(location.pathname);
        navigate('/sign-in', { replace: true });
      } else if (!isCraftsman) {
        navigate('/', { replace: true });
      }
    }
  }, [navigate, user, loading, isCraftsman, location]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">جاري التحميل...</div>;
  }

  return (user && isCraftsman) ? <>{children}</> : null;
}
