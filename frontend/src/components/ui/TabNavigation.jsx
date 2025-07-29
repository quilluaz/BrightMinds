import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const TabNavigation = () => {
  const location = useLocation();
  
  // Don't show tab navigation on authentication screens
  if (location.pathname === '/login-screen' || location.pathname === '/registration-screen') {
    return null;
  }

  const tabs = [
    { 
      label: 'Home', 
      path: '/dashboard', 
      icon: 'Home',
      badge: null
    },
    { 
      label: 'Stories', 
      path: '/story-library', 
      icon: 'BookOpen',
      badge: null
    },
    { 
      label: 'Profile', 
      path: '/user-profile', 
      icon: 'User',
      badge: null
    }
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Bottom Tab Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border shadow-warm md:hidden">
        <div className="flex items-center justify-around px-4 py-2">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-button min-w-0 flex-1 transition-all duration-200 ${
                isActivePath(tab.path)
                  ? 'text-primary' :'text-muted-foreground hover:text-primary'
              }`}
              aria-label={tab.label}
            >
              <div className="relative">
                <Icon 
                  name={tab.icon} 
                  size={24} 
                  className={`transition-transform duration-200 ${
                    isActivePath(tab.path) ? 'scale-110' : ''
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-caption font-medium px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
                {isActivePath(tab.path) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-scale-celebration" />
                )}
              </div>
              <span className={`font-caption text-xs font-medium truncate ${
                isActivePath(tab.path) ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {tab.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Desktop Top Tab Navigation */}
      <nav className="hidden md:block fixed top-16 left-0 right-0 z-40 bg-background border-b border-border shadow-warm-sm">
        <div className="flex items-center justify-center px-6 py-3">
          <div className="flex items-center space-x-2 bg-muted rounded-container p-1">
            {tabs.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center space-x-2 px-6 py-3 rounded-button font-body font-medium text-sm transition-all duration-200 relative ${
                  isActivePath(tab.path)
                    ? 'bg-background text-primary shadow-warm'
                    : 'text-muted-foreground hover:text-primary hover:bg-background/50'
                }`}
              >
                <Icon name={tab.icon} size={18} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="bg-accent text-accent-foreground text-xs font-caption font-medium px-2 py-0.5 rounded-full">
                    {tab.badge}
                  </span>
                )}
                {isActivePath(tab.path) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-primary rounded-full animate-scale-celebration" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default TabNavigation;