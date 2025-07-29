import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const CelebrationOverlay = ({ 
  isVisible = false, 
  achievement = {},
  onClose,
  onContinue,
  autoCloseDelay = null
}) => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('enter');

  const {
    title = "Great Job!",
    description = "You completed the story!",
    points = 100,
    badge = null,
    level = null,
    nextAction = "Continue Learning"
  } = achievement;

  useEffect(() => {
    if (isVisible) {
      setAnimationPhase('enter');
      setShowConfetti(true);
      
      // Auto-close if delay is specified
      if (autoCloseDelay) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
        return () => clearTimeout(timer);
      }
    } else {
      setShowConfetti(false);
      setAnimationPhase('exit');
    }
  }, [isVisible, autoCloseDelay]);

  const handleClose = () => {
    setAnimationPhase('exit');
    setTimeout(() => {
      onClose?.();
    }, 250);
  };

  const handleContinue = () => {
    setAnimationPhase('exit');
    setTimeout(() => {
      onContinue?.();
      navigate('/dashboard');
    }, 250);
  };

  const handleViewResults = () => {
    setAnimationPhase('exit');
    setTimeout(() => {
      navigate('/results-and-celebration');
    }, 250);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[70] flex items-center justify-center p-4 ${
      animationPhase === 'enter' ? 'animate-cross-fade' : 'animate-cross-fade'
    }`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-sm" />
      
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 animate-bounce-gentle ${
                i % 4 === 0 ? 'bg-primary' :
                i % 4 === 1 ? 'bg-secondary' :
                i % 4 === 2 ? 'bg-accent' : 'bg-success'
              } rounded-full`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Main Celebration Card */}
      <div className={`relative bg-background rounded-container shadow-warm-lg max-w-md w-full p-8 text-center ${
        animationPhase === 'enter' ? 'animate-scale-celebration' : ''
      }`}>
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <Icon name="X" size={18} />
        </Button>

        {/* Achievement Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-warm animate-bounce-gentle">
          <Icon name="Trophy" size={40} className="text-white" />
        </div>

        {/* Achievement Content */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-foreground">
            {title}
          </h2>
          
          <p className="font-body text-muted-foreground">
            {description}
          </p>

          {/* Points Display */}
          {points > 0 && (
            <div className="flex items-center justify-center space-x-2 bg-accent/10 rounded-button py-3 px-4">
              <Icon name="Star" size={20} className="text-accent" />
              <span className="font-caption font-medium text-accent">
                +{points} points earned!
              </span>
            </div>
          )}

          {/* Badge Display */}
          {badge && (
            <div className="flex items-center justify-center space-x-2 bg-success/10 rounded-button py-3 px-4">
              <Icon name="Award" size={20} className="text-success" />
              <span className="font-caption font-medium text-success">
                New badge: {badge}
              </span>
            </div>
          )}

          {/* Level Up Display */}
          {level && (
            <div className="flex items-center justify-center space-x-2 bg-secondary/10 rounded-button py-3 px-4">
              <Icon name="TrendingUp" size={20} className="text-secondary" />
              <span className="font-caption font-medium text-secondary">
                Level {level} reached!
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3 mt-8">
          <Button
            variant="default"
            onClick={handleContinue}
            className="w-full"
            iconName="ArrowRight"
            iconPosition="right"
          >
            {nextAction}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleViewResults}
            className="w-full"
            iconName="BarChart3"
            iconPosition="left"
          >
            View Detailed Results
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span className="font-caption text-xs">
              Story completed in record time!
            </span>
          </div>
        </div>
      </div>

      {/* Floating Achievement Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute animate-bounce-gentle"
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.2}s`
            }}
          >
            <Icon 
              name={['Star', 'Heart', 'Sparkles'][i % 3]} 
              size={16 + (i % 2) * 8} 
              className={`${
                i % 3 === 0 ? 'text-accent' :
                i % 3 === 1 ? 'text-primary' : 'text-secondary'
              } opacity-60`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CelebrationOverlay;