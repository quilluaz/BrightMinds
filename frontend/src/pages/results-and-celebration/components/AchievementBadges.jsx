import React from 'react';
import Icon from '../../../components/AppIcon';

const AchievementBadges = ({ achievements, newBadges }) => {
  const badgeIcons = {
    'First Story': 'BookOpen',
    'Perfect Score': 'Star',
    'Speed Reader': 'Zap',
    'Persistent Learner': 'Target',
    'Story Explorer': 'Compass',
    'Reading Champion': 'Crown'
  };

  return (
    <div className="bg-card rounded-container p-6 shadow-warm mb-6">
      <h3 className="font-display text-xl text-foreground mb-4 flex items-center">
        <Icon name="Award" size={20} className="mr-2" />
        Achievements
      </h3>
      
      {newBadges.length > 0 && (
        <div className="mb-6">
          <h4 className="font-body text-lg text-primary font-medium mb-3 flex items-center">
            <Icon name="Sparkles" size={18} className="mr-2" />
            New Badges Earned!
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {newBadges.map((badge, index) => (
              <div key={index} className="text-center animate-scale-celebration">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-warning rounded-full flex items-center justify-center mx-auto mb-2 shadow-warm">
                  <Icon name={badgeIcons[badge] || 'Award'} size={24} className="text-white" />
                </div>
                <p className="font-caption text-sm text-foreground font-medium">
                  {badge}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h4 className="font-body text-base text-muted-foreground font-medium mb-3">
          All Your Badges
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-1 ${
                achievement.earned 
                  ? 'bg-gradient-to-br from-primary to-secondary shadow-warm' 
                  : 'bg-muted'
              }`}>
                <Icon 
                  name={badgeIcons[achievement.name] || 'Award'} 
                  size={18} 
                  className={achievement.earned ? 'text-white' : 'text-muted-foreground'} 
                />
              </div>
              <p className={`font-caption text-xs ${
                achievement.earned ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {achievement.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementBadges;