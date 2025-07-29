import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const WelcomeSection = () => {
  return (
    <div className="text-center space-y-6 mb-8">
      {/* Animated Welcome Illustration */}
      <div className="relative">
        <div className="w-32 h-32 mx-auto mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full animate-bounce-gentle" />
          <Image
            src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop&crop=center"
            alt="Happy children reading together"
            className="w-full h-full object-cover rounded-full border-4 border-white shadow-warm"
          />
          
          {/* Floating Icons */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-bounce-gentle shadow-warm-sm">
            <Icon name="Star" size={16} className="text-white" />
          </div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-success rounded-full flex items-center justify-center animate-bounce-gentle shadow-warm-sm" style={{ animationDelay: '0.5s' }}>
            <Icon name="Heart" size={12} className="text-white" />
          </div>
        </div>
      </div>

      {/* Welcome Text */}
      <div className="space-y-3">
        <h1 className="font-display text-4xl text-foreground">
          Welcome Back!
        </h1>
        <p className="font-body text-lg text-muted-foreground max-w-sm mx-auto">
          Ready for your next magical story adventure? Let's continue your learning journey!
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="flex items-center justify-center space-x-6 pt-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="BookOpen" size={16} className="text-primary" />
          </div>
          <span className="font-caption text-sm text-muted-foreground">Stories</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
            <Icon name="Gamepad2" size={16} className="text-secondary" />
          </div>
          <span className="font-caption text-sm text-muted-foreground">Games</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
            <Icon name="Trophy" size={16} className="text-accent" />
          </div>
          <span className="font-caption text-sm text-muted-foreground">Rewards</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;