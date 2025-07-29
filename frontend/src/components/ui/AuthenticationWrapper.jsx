import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const AuthenticationWrapper = ({ children, showBackButton = false, backPath = '/' }) => {
  const location = useLocation();
  
  // Only show on authentication screens
  if (location.pathname !== '/login-screen' && location.pathname !== '/registration-screen') {
    return children;
  }

  const isLoginScreen = location.pathname === '/login-screen';
  const isRegistrationScreen = location.pathname === '/registration-screen';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-muted">
      {/* Simplified Header */}
      <header className="relative z-10 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-4 max-w-md mx-auto">
          {/* Back Button */}
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <Link to={backPath}>
                <Icon name="ArrowLeft" size={18} />
                <span className="ml-2">Back</span>
              </Link>
            </Button>
          )}

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity mx-auto">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-warm">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
                <path
                  d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                  fill="currentColor"
                />
                <path
                  d="M19 15L19.5 17.5L22 18L19.5 18.5L19 21L18.5 18.5L16 18L18.5 17.5L19 15Z"
                  fill="currentColor"
                />
                <path
                  d="M5 6L5.5 8.5L8 9L5.5 9.5L5 12L4.5 9.5L2 9L4.5 8.5L5 6Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-2xl text-primary">StoryQuest</h1>
              <p className="font-caption text-sm text-muted-foreground -mt-1">Kids</p>
            </div>
          </Link>

          {/* Spacer for centering */}
          {showBackButton && <div className="w-16" />}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-md">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            {isLoginScreen && (
              <>
                <h2 className="font-display text-3xl text-foreground mb-2">
                  Welcome Back!
                </h2>
                <p className="font-body text-muted-foreground">
                  Ready for your next adventure?
                </p>
              </>
            )}
            {isRegistrationScreen && (
              <>
                <h2 className="font-display text-3xl text-foreground mb-2">
                  Join the Quest!
                </h2>
                <p className="font-body text-muted-foreground">
                  Create your account to start exploring amazing stories
                </p>
              </>
            )}
          </div>

          {/* Form Content */}
          <div className="bg-card rounded-container shadow-warm-lg p-6 border border-border/50">
            {children}
          </div>

          {/* Footer Links */}
          <div className="text-center mt-6 space-y-2">
            {isLoginScreen && (
              <p className="font-body text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link 
                  to="/registration-screen" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            )}
            {isRegistrationScreen && (
              <p className="font-body text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  to="/login-screen" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent/10 rounded-full blur-xl" />
        <div className="absolute top-40 right-16 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
        <div className="absolute bottom-32 left-20 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-success/10 rounded-full blur-lg" />
      </div>
    </div>
  );
};

export default AuthenticationWrapper;