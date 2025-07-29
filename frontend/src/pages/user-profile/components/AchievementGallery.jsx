import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const AchievementGallery = ({ achievements }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All', icon: 'Grid3x3' },
    { id: 'reading', label: 'Reading', icon: 'BookOpen' },
    { id: 'quiz', label: 'Quizzes', icon: 'Brain' },
    { id: 'streak', label: 'Streaks', icon: 'Flame' },
    { id: 'special', label: 'Special', icon: 'Star' }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.category === selectedCategory);

  const handleAchievementClick = (achievement) => {
    if (achievement.isUnlocked) {
      // Trigger celebration animation
      console.log('Achievement clicked:', achievement.title);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-foreground flex items-center">
          <Icon name="Award" size={24} className="text-secondary mr-2" />
          Achievements
        </h2>
        <div className="flex items-center space-x-2">
          <Icon name="Trophy" size={16} className="text-accent" />
          <span className="font-caption text-sm text-muted-foreground">
            {achievements.filter(a => a.isUnlocked).length} / {achievements.length}
          </span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            iconName={category.icon}
            iconPosition="left"
            className="whitespace-nowrap"
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            onClick={() => handleAchievementClick(achievement)}
            className={`relative bg-card rounded-container p-4 border border-border transition-all duration-200 cursor-pointer ${
              achievement.isUnlocked
                ? 'shadow-warm hover:shadow-warm-lg hover:scale-105'
                : 'opacity-60 grayscale'
            }`}
          >
            {/* Achievement Badge */}
            <div className="relative mb-3">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                achievement.isUnlocked
                  ? 'bg-gradient-to-br from-accent to-primary shadow-warm'
                  : 'bg-muted'
              }`}>
                {achievement.icon ? (
                  <Icon 
                    name={achievement.icon} 
                    size={28} 
                    className={achievement.isUnlocked ? 'text-white' : 'text-muted-foreground'} 
                  />
                ) : (
                  <Image
                    src={achievement.badgeImage}
                    alt={achievement.title}
                    className="w-12 h-12 rounded-full"
                  />
                )}
              </div>
              
              {/* Lock Overlay */}
              {!achievement.isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-muted-foreground rounded-full flex items-center justify-center">
                    <Icon name="Lock" size={12} className="text-background" />
                  </div>
                </div>
              )}

              {/* New Badge */}
              {achievement.isNew && achievement.isUnlocked && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center animate-bounce-gentle">
                  <Icon name="Sparkles" size={12} className="text-white" />
                </div>
              )}
            </div>

            {/* Achievement Info */}
            <div className="text-center">
              <h3 className="font-display text-sm text-foreground mb-1 line-clamp-2">
                {achievement.title}
              </h3>
              <p className="font-caption text-xs text-muted-foreground line-clamp-2">
                {achievement.description}
              </p>
              
              {achievement.isUnlocked && achievement.earnedDate && (
                <p className="font-caption text-xs text-success mt-2">
                  Earned {new Date(achievement.earnedDate).toLocaleDateString()}
                </p>
              )}

              {!achievement.isUnlocked && achievement.requirement && (
                <p className="font-caption text-xs text-muted-foreground mt-2">
                  {achievement.requirement}
                </p>
              )}
            </div>

            {/* Progress Bar for Partial Achievements */}
            {!achievement.isUnlocked && achievement.progress !== undefined && (
              <div className="mt-3">
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                    style={{ width: `${achievement.progress}%` }}
                  />
                </div>
                <p className="font-caption text-xs text-muted-foreground text-center mt-1">
                  {achievement.progress}% complete
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Search" size={24} className="text-muted-foreground" />
          </div>
          <p className="font-body text-muted-foreground">
            No achievements found in this category
          </p>
        </div>
      )}
    </div>
  );
};

export default AchievementGallery;