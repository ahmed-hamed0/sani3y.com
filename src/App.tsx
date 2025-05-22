
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/hooks/auth';
import { RequireAuth } from '@/hooks/auth/RequireAuth';
import React, { ReactNode } from 'react';

// Import pages
import Index from '@/pages/Index';
import Profile from '@/pages/Profile';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import ResetPassword from '@/pages/ResetPassword';
import NotFound from '@/pages/NotFound';
import Craftsmen from '@/pages/Craftsmen';
import CraftsmanDetails from '@/pages/CraftsmanDetails';
import Jobs from '@/pages/Jobs';
import JobDetails from '@/pages/JobDetails';
import PostJob from '@/pages/PostJob';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Subscription from '@/pages/Subscription';
import AllTestimonials from '@/pages/AllTestimonials';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/craftsmen" element={<Craftsmen />} />
          <Route path="/craftsman/:id" element={<CraftsmanDetails />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/testimonials" element={<AllTestimonials />} />
          
          {/* Protected routes */}
          <Route element={<RequireAuth>{null}</RequireAuth>}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/subscription" element={<Subscription />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
