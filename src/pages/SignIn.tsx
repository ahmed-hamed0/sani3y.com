
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import SignInComponent from '@/components/auth/SignIn';
import { navigateAfterAuth } from '@/utils/auth';

const SignIn = () => {
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    // Redirect to the previously requested URL or home
    navigateAfterAuth(navigate);
  };
  
  return (
    <MainLayout>
      <div className="container-custom py-12">
        <div className="max-w-md mx-auto">
          <SignInComponent onSuccess={handleSuccess} />
        </div>
      </div>
    </MainLayout>
  );
};

export default SignIn;
