import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProfileHeader = ({ user }) => {
  return (
    <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-container p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-primary shadow-warm">
            <Image
              src={user.avatar}
              alt={`${user.name}'s avatar`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent rounded-full flex items-center justify-center border-4 border-background shadow-warm">
            <span className="font-display text-lg text-accent-foreground">
              {user.level}
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="font-display text-2xl sm:text-3xl text-foreground mb-2">
            {user.name}
          </h1>
          <p className="font-body text-muted-foreground mb-3">
            {user.title}
          </p>
          
          {/* Level Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <Icon name="Star" size={16} className="text-accent" />
              <span className="font-caption text-sm text-muted-foreground">
                Level {user.level} • {user.experiencePoints} XP
              </span>
            </div>
            <div className="w-full max-w-xs bg-muted rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
                style={{ width: `${user.levelProgress}%` }}
              />
            </div>
            <p className="font-caption text-xs text-muted-foreground">
              {user.pointsToNextLevel} XP to Level {user.level + 1}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex space-x-4 sm:flex-col sm:space-x-0 sm:space-y-2">
          <div className="text-center">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mb-1">
              <Icon name="BookOpen" size={20} className="text-success" />
            </div>
            <p className="font-display text-lg text-foreground">{user.storiesCompleted}</p>
            <p className="font-caption text-xs text-muted-foreground">Stories</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-1">
              <Icon name="Award" size={20} className="text-secondary" />
            </div>
            <p className="font-display text-lg text-foreground">{user.badgesEarned}</p>
            <p className="font-caption text-xs text-muted-foreground">Badges</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;