import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Don't show header on authentication screens
  if (location.pathname === '/login-screen' || location.pathname === '/registration-screen') {
    return null;
  }

  const navigationItems = [
    { label: 'Home', path: '/dashboard', icon: 'Home' },
    { label: 'Stories', path: '/story-library', icon: 'BookOpen' },
    { label: 'Results', path: '/results-and-celebration', icon: 'Trophy' },
    { label: 'Profile', path: '/user-profile', icon: 'User' }
  ];

  const isActivePath = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-warm-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-warm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
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
          <div className="hidden sm:block">
            <h1 className="font-display text-xl text-primary">StoryQuest</h1>
            <p className="font-caption text-xs text-muted-foreground -mt-1">Kids</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-button font-body font-medium text-sm transition-all duration-200 ${
                isActivePath(item.path)
                  ? 'bg-primary text-primary-foreground shadow-warm'
                  : 'text-foreground hover:bg-muted hover:text-primary'
              }`}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border shadow-warm animate-slide-in">
          <nav className="px-4 py-2 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-button font-body font-medium text-base transition-all duration-200 ${
                  isActivePath(item.path)
                    ? 'bg-primary text-primary-foreground shadow-warm'
                    : 'text-foreground hover:bg-muted hover:text-primary'
                }`}
              >
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;