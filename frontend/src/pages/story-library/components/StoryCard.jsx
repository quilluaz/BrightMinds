import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const StoryCard = ({ story, onPreview }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (story.isLocked) {
      return;
    }
    onPreview(story);
  };

  const handleStartStory = (e) => {
    e.stopPropagation();
    if (!story.isLocked) {
      navigate('/dashboard'); // Would navigate to story gameplay in full implementation
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'text-success bg-success/10';
      case 'Intermediate':
        return 'text-warning bg-warning/10';
      case 'Advanced':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getSubjectIcon = (subject) => {
    switch (subject) {
      case 'Math':
        return 'Calculator';
      case 'Science':
        return 'Microscope';
      case 'Reading':
        return 'BookOpen';
      case 'History':
        return 'Clock';
      case 'Art':
        return 'Palette';
      default:
        return 'Book';
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-card rounded-container border border-border shadow-warm transition-all duration-200 cursor-pointer group ${
        story.isLocked
          ? 'opacity-60 hover:opacity-70' :'hover:shadow-warm-lg hover:-translate-y-1 animate-bounce-gentle'
      }`}
    >
      {/* Story Cover Image */}
      <div className="relative overflow-hidden rounded-t-container">
        <Image
          src={story.coverImage}
          alt={story.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Lock Overlay */}
        {story.isLocked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center shadow-warm">
              <Icon name="Lock" size={24} className="text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        {!story.isLocked && story.progress > 0 && (
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="font-caption text-xs font-medium text-primary">
              {story.progress}% Complete
            </span>
          </div>
        )}

        {/* Subject Icon */}
        <div className="absolute top-3 left-3 w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center">
          <Icon name={getSubjectIcon(story.subject)} size={16} className="text-primary" />
        </div>
      </div>

      {/* Story Content */}
      <div className="p-4 space-y-3">
        {/* Title and Difficulty */}
        <div className="space-y-2">
          <h3 className="font-display text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {story.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className={`font-caption text-xs font-medium px-2 py-1 rounded-button ${getDifficultyColor(story.difficulty)}`}>
              {story.difficulty}
            </span>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Icon name="Clock" size={14} />
              <span className="font-caption text-xs">{story.readingTime}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="font-body text-sm text-muted-foreground line-clamp-2">
          {story.description}
        </p>

        {/* Progress Bar */}
        {!story.isLocked && story.progress > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-caption text-xs text-muted-foreground">Progress</span>
              <span className="font-caption text-xs font-medium text-primary">{story.progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                style={{ width: `${story.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {story.isLocked ? (
            <div className="text-center py-2">
              <p className="font-caption text-xs text-muted-foreground mb-1">
                {story.unlockRequirement}
              </p>
              <Button variant="outline" disabled className="w-full">
                <Icon name="Lock" size={16} className="mr-2" />
                Locked
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              onClick={handleStartStory}
              className="w-full"
              iconName={story.progress > 0 ? "Play" : "BookOpen"}
              iconPosition="left"
            >
              {story.progress > 0 ? "Continue" : "Start Story"}
            </Button>
          )}
        </div>

        {/* Achievement Preview */}
        {!story.isLocked && story.potentialRewards && (
          <div className="flex items-center justify-center space-x-2 pt-2 border-t border-border">
            <Icon name="Star" size={14} className="text-accent" />
            <span className="font-caption text-xs text-muted-foreground">
              Earn {story.potentialRewards} points
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryCard;