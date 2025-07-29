import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const ContextualProgressFlow = ({ 
  isActive = false, 
  currentStep = 1, 
  totalSteps = 5, 
  storyTitle = "Adventure Story",
  onNext,
  onPrevious,
  onExit,
  showExitConfirm = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showExitDialog, setShowExitDialog] = useState(false);
  
  // Only show on story-related screens when active
  if (!isActive || location.pathname === '/login-screen' || location.pathname === '/registration-screen') {
    return null;
  }

  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleExit = () => {
    if (showExitConfirm) {
      setShowExitDialog(true);
    } else {
      onExit?.();
      navigate('/dashboard');
    }
  };

  const confirmExit = () => {
    setShowExitDialog(false);
    onExit?.();
    navigate('/dashboard');
  };

  const cancelExit = () => {
    setShowExitDialog(false);
  };

  const handleNext = () => {
    onNext?.();
    if (currentStep >= totalSteps) {
      navigate('/results-and-celebration');
    }
  };

  const handlePrevious = () => {
    onPrevious?.();
  };

  return (
    <>
      {/* Progress Flow Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-warm-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Exit Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExit}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={18} />
            <span className="ml-2 hidden sm:inline">Exit</span>
          </Button>

          {/* Story Title & Progress */}
          <div className="flex-1 mx-4">
            <div className="text-center">
              <h2 className="font-display text-lg text-foreground truncate">
                {storyTitle}
              </h2>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <span className="font-caption text-xs text-muted-foreground">
                  {currentStep} of {totalSteps}
                </span>
                <div className="flex-1 max-w-32 bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step Counter */}
          <div className="flex items-center space-x-1">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-caption font-medium text-sm">
              {currentStep}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-warm p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep <= 1}
            className="flex items-center space-x-2"
          >
            <Icon name="ChevronLeft" size={16} />
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index + 1 <= currentStep
                    ? 'bg-primary'
                    : index + 1 === currentStep + 1
                    ? 'bg-accent' :'bg-muted'
                }`}
              />
            ))}
          </div>

          <Button
            variant="default"
            onClick={handleNext}
            className="flex items-center space-x-2"
          >
            <span>{currentStep >= totalSteps ? 'Finish' : 'Next'}</span>
            <Icon name={currentStep >= totalSteps ? 'Check' : 'ChevronRight'} size={16} />
          </Button>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitDialog && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4 animate-cross-fade">
          <div className="bg-background rounded-container p-6 max-w-sm w-full shadow-warm-lg animate-scale-celebration">
            <div className="text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="AlertTriangle" size={24} className="text-warning" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">
                Exit Story?
              </h3>
              <p className="font-body text-sm text-muted-foreground mb-6">
                Your progress will be saved, but you'll need to start this section again.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={cancelExit}
                  className="flex-1"
                >
                  Stay
                </Button>
                <Button
                  variant="default"
                  onClick={confirmExit}
                  className="flex-1"
                >
                  Exit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContextualProgressFlow;