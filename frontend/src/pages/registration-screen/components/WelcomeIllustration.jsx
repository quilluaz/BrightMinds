import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const WelcomeIllustration = () => {
  return (
    <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:w-1/2 lg:px-8">
      {/* Main Illustration */}
      <div className="relative mb-8">
        <div className="w-80 h-80 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-full flex items-center justify-center overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop&crop=faces"
            alt="Happy children reading together"
            className="w-72 h-72 object-cover rounded-full"
          />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent rounded-full flex items-center justify-center animate-bounce-gentle">
          <Icon name="BookOpen" size={24} className="text-accent-foreground" />
        </div>
        
        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-secondary rounded-full flex items-center justify-center animate-bounce-gentle" style={{ animationDelay: '0.5s' }}>
          <Icon name="Star" size={20} className="text-white" />
        </div>
        
        <div className="absolute top-8 -left-8 w-10 h-10 bg-primary rounded-full flex items-center justify-center animate-bounce-gentle" style={{ animationDelay: '1s' }}>
          <Icon name="Heart" size={16} className="text-white" />
        </div>
      </div>

      {/* Welcome Text */}
      <div className="text-center space-y-4 max-w-md">
        <h3 className="font-display text-2xl text-foreground">
          Join Our Learning Adventure!
        </h3>
        
        <p className="font-body text-muted-foreground leading-relaxed">
          Create an account to unlock a world of interactive stories, educational games, 
          and personalized learning experiences designed just for your child.
        </p>
        
        {/* Feature Highlights */}
        <div className="grid grid-cols-1 gap-4 mt-8">
          <div className="flex items-center space-x-3 bg-success/10 rounded-button p-4">
            <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-white" />
            </div>
            <div className="text-left">
              <h4 className="font-body font-medium text-foreground text-sm">Safe & Secure</h4>
              <p className="font-body text-xs text-muted-foreground">Child-safe environment with parental controls</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-primary/10 rounded-button p-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Zap" size={20} className="text-white" />
            </div>
            <div className="text-left">
              <h4 className="font-body font-medium text-foreground text-sm">Interactive Learning</h4>
              <p className="font-body text-xs text-muted-foreground">Engaging stories with games and activities</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-secondary/10 rounded-button p-4">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <Icon name="TrendingUp" size={20} className="text-white" />
            </div>
            <div className="text-left">
              <h4 className="font-body font-medium text-foreground text-sm">Track Progress</h4>
              <p className="font-body text-xs text-muted-foreground">Monitor learning achievements and milestones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeIllustration;