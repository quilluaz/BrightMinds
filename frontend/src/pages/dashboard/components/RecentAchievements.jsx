import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const RecentAchievements = ({ achievements }) => {
  const [selectedBadge, setSelectedBadge] = useState(null);

  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
    // Trigger confetti animation
    setTimeout(() => setSelectedBadge(null), 2000);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg text-foreground">Recent Achievements</h3>
        <div className="flex items-center space-x-1 text-muted-foreground">
          <Icon name="Sparkles" size={16} />
          <span className="font-caption text-xs">Tap badges for celebration!</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((achievement, index) => (
          <div
            key={index}
            onClick={() => handleBadgeClick(achievement)}
            className={`relative bg-card rounded-container p-4 shadow-warm-sm cursor-pointer transition-all duration-200 hover:shadow-warm hover:scale-105 ${
              selectedBadge?.id === achievement.id ? 'animate-scale-celebration' : ''
            }`}
          >
            {/* Badge Icon */}
            <div className={`w-12 h-12 bg-gradient-to-br from-${achievement.color} to-${achievement.color}/80 rounded-full flex items-center justify-center mx-auto mb-3 shadow-warm`}>
              <Icon name={achievement.icon} size={24} className="text-white" />
            </div>
            
            {/* Badge Info */}
            <div className="text-center">
              <h4 className="font-body font-medium text-foreground text-sm mb-1">
                {achievement.title}
              </h4>
              <p className="font-caption text-xs text-muted-foreground">
                {achievement.description}
              </p>
            </div>
            
            {/* New Badge Indicator */}
            {achievement.isNew && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center border-2 border-white">
                <Icon name="Sparkles" size={12} className="text-white" />
              </div>
            )}
            
            {/* Celebration Effect */}
            {selectedBadge?.id === achievement.id && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-container">
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={i}
                    className={`absolute w-2 h-2 bg-${achievement.color} rounded-full animate-bounce-gentle`}
                    style={{
                      left: `${20 + (i * 10)}%`,
                      top: `${20 + (i % 3) * 20}%`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAchievements;