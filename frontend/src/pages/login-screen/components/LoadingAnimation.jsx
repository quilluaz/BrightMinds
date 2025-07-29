import React from 'react';
import Icon from '../../../components/AppIcon';

const LoadingAnimation = ({ isVisible = false }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Animated Character */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto animate-bounce-gentle shadow-warm">
            <Icon name="BookOpen" size={32} className="text-white" />
          </div>
          
          {/* Floating Elements */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center animate-bounce-gentle shadow-warm-sm">
            <Icon name="Star" size={12} className="text-white" />
          </div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-success rounded-full flex items-center justify-center animate-bounce-gentle shadow-warm-sm" style={{ animationDelay: '0.3s' }}>
            <Icon name="Sparkles" size={12} className="text-white" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h3 className="font-display text-xl text-foreground">
            Getting Ready...
          </h3>
          <p className="font-body text-muted-foreground">
            Preparing your magical adventure!
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center space-x-2">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-bounce-gentle"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;