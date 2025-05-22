
import { NavigateFunction } from 'react-router-dom';

// Store the requested URL that required authentication
export const saveRequestedUrl = (url: string) => {
  if (url && url !== '/sign-in' && url !== '/sign-up') {
    sessionStorage.setItem('requestedUrl', url);
    console.log('Saved requested URL:', url);
  }
};

// Get and clear the requested URL
export const getAndClearRequestedUrl = (): string => {
  const url = sessionStorage.getItem('requestedUrl');
  sessionStorage.removeItem('requestedUrl');
  console.log('Retrieved requested URL:', url);
  return url || '/';
};

// Navigate to the requested URL or fallback to home
export const navigateAfterAuth = (navigate: NavigateFunction) => {
  const requestedUrl = getAndClearRequestedUrl();
  console.log('Navigating after auth to:', requestedUrl);
  navigate(requestedUrl);
};
