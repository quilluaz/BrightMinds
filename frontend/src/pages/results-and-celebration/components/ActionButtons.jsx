import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ActionButtons = ({ onTryAgain, nextStoryAvailable = true }) => {
  const navigate = useNavigate();

  const handleNextStory = () => {
    navigate('/story-library');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleShareResults = () => {
    // Mock sharing functionality
    alert('Great job! Your results have been shared with your family! 🎉');
  };

  return (
    <div className="space-y-4">
      {/* Primary Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {nextStoryAvailable && (
          <Button
            variant="default"
            onClick={handleNextStory}
            className="w-full py-4 text-lg font-medium"
            iconName="ArrowRight"
            iconPosition="right"
          >
            Next Story
          </Button>
        )}
        
        <Button
          variant="outline"
          onClick={onTryAgain}
          className="w-full py-4 text-lg font-medium"
          iconName="RotateCcw"
          iconPosition="left"
        >
          Try Again
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="secondary"
          onClick={handleShareResults}
          className="w-full"
          iconName="Share2"
          iconPosition="left"
        >
          Share Results
        </Button>
        
        <Button
          variant="ghost"
          onClick={handleBackToDashboard}
          className="w-full"
          iconName="Home"
          iconPosition="left"
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Motivational Message */}
      <div className="text-center mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-container">
        <Icon name="Heart" size={20} className="text-primary mx-auto mb-2" />
        <p className="font-body text-foreground font-medium">
          Keep reading and learning! Every story makes you smarter! 📚✨
        </p>
      </div>
    </div>
  );
};

export default ActionButtons;