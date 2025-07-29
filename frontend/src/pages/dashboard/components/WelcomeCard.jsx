import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const WelcomeCard = ({ user }) => {
  return (
    <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-container p-6 mb-6 shadow-warm">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-warm">
            <Image
              src={user.avatar}
              alt={`${user.name}'s avatar`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center border-2 border-white">
            <Icon name="Star" size={12} className="text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <h2 className="font-display text-xl text-foreground mb-1">
            Welcome back, {user.name}!
          </h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-accent/20 rounded-button px-2 py-1">
              <Icon name="Trophy" size={14} className="text-accent" />
              <span className="font-caption text-xs font-medium text-accent">
                Level {user.level}
              </span>
            </div>
            <div className="flex items-center space-x-1 bg-secondary/20 rounded-button px-2 py-1">
              <Icon name="Flame" size={14} className="text-secondary" />
              <span className="font-caption text-xs font-medium text-secondary">
                {user.streak} day streak
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;