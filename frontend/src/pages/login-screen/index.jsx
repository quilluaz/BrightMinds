import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationWrapper from '../../components/ui/AuthenticationWrapper';
import WelcomeSection from './components/WelcomeSection';
import LoginForm from './components/LoginForm';
import AuthenticationLinks from './components/AuthenticationLinks';
import LoadingAnimation from './components/LoadingAnimation';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('storyquest_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData.username) {
          navigate('/dashboard');
        }
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem('storyquest_user');
      }
    }
  }, [navigate]);

  return (
    <>
      <AuthenticationWrapper showBackButton={false}>
        <div className="space-y-8">
          {/* Welcome Section */}
          <WelcomeSection />
          
          {/* Login Form */}
          <LoginForm />
          
          {/* Authentication Links */}
          <AuthenticationLinks />
        </div>
      </AuthenticationWrapper>

      {/* Loading Animation Overlay */}
      <LoadingAnimation isVisible={isLoading} />
    </>
  );
};

export default LoginScreen;