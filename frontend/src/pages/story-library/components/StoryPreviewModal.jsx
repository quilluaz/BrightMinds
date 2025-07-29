import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const StoryPreviewModal = ({ story, isOpen, onClose, onStartStory }) => {
  if (!isOpen || !story) return null;

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

  const handleStartStory = () => {
    onStartStory(story);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4 animate-cross-fade">
      <div className="bg-background rounded-container shadow-warm-lg max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-celebration">
        {/* Header */}
        <div className="relative">
          <div className="h-48 overflow-hidden rounded-t-container">
            <Image
              src={story.coverImage}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm hover:bg-background"
          >
            <Icon name="X" size={18} />
          </Button>

          {/* Subject Icon */}
          <div className="absolute top-3 left-3 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Icon name={getSubjectIcon(story.subject)} size={20} className="text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title and Meta */}
          <div className="space-y-3">
            <h2 className="font-display text-2xl text-foreground">
              {story.title}
            </h2>
            
            <div className="flex items-center justify-between">
              <span className={`font-caption text-sm font-medium px-3 py-1 rounded-button ${getDifficultyColor(story.difficulty)}`}>
                {story.difficulty}
              </span>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={16} />
                  <span className="font-caption text-sm">{story.readingTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Users" size={16} />
                  <span className="font-caption text-sm">{story.ageRange}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-body text-lg font-semibold text-foreground">Story Description</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              {story.fullDescription}
            </p>
          </div>

          {/* Learning Objectives */}
          <div className="space-y-2">
            <h3 className="font-body text-lg font-semibold text-foreground">What You'll Learn</h3>
            <ul className="space-y-2">
              {story.learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span className="font-body text-sm text-muted-foreground">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Characters */}
          {story.characters && story.characters.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-body text-lg font-semibold text-foreground">Meet the Characters</h3>
              <div className="grid grid-cols-2 gap-3">
                {story.characters.map((character, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-muted rounded-button p-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-caption text-sm font-medium text-foreground">{character.name}</p>
                      <p className="font-caption text-xs text-muted-foreground">{character.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rewards Preview */}
          {story.potentialRewards && (
            <div className="bg-accent/10 rounded-button p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Trophy" size={20} className="text-accent" />
                <h3 className="font-body text-lg font-semibold text-foreground">Rewards</h3>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-muted-foreground">Complete this story to earn:</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={16} className="text-accent" />
                    <span className="font-caption text-sm font-medium text-accent">
                      {story.potentialRewards} points
                    </span>
                  </div>
                  {story.badge && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Award" size={16} className="text-success" />
                      <span className="font-caption text-sm font-medium text-success">
                        {story.badge}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Progress */}
          {story.progress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-body text-sm font-medium text-foreground">Your Progress</span>
                <span className="font-caption text-sm font-medium text-primary">{story.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                  style={{ width: `${story.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button
              variant="default"
              onClick={handleStartStory}
              disabled={story.isLocked}
              className="flex-1"
              iconName={story.progress > 0 ? "Play" : "BookOpen"}
              iconPosition="left"
            >
              {story.isLocked ? "Locked" : story.progress > 0 ? "Continue" : "Start Story"}
            </Button>
          </div>

          {/* Lock Message */}
          {story.isLocked && (
            <div className="text-center bg-muted rounded-button p-3">
              <Icon name="Lock" size={24} className="text-muted-foreground mx-auto mb-2" />
              <p className="font-caption text-sm text-muted-foreground">
                {story.unlockRequirement}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryPreviewModal;