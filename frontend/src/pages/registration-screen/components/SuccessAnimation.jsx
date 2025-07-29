import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SuccessAnimation = ({ isVisible, childName }) => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      
      const countdownTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            navigate('/dashboard');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownTimer);
    }
  }, [isVisible, navigate]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-sm flex items-center justify-center p-4 animate-cross-fade">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 animate-bounce-gentle ${
                i % 5 === 0 ? 'bg-primary' :
                i % 5 === 1 ? 'bg-secondary' :
                i % 5 === 2 ? 'bg-accent' :
                i % 5 === 3 ? 'bg-success' : 'bg-warning'
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

      {/* Success Card */}
      <div className="bg-background rounded-container shadow-warm-lg max-w-md w-full p-8 text-center animate-scale-celebration">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-success to-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-warm animate-bounce-gentle">
          <Icon name="Check" size={40} className="text-white" />
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-foreground">
            Welcome to StoryQuest!
          </h2>
          
          <p className="font-body text-muted-foreground">
            {childName}'s account has been created successfully! 🎉
          </p>

          <div className="bg-primary/10 rounded-button py-4 px-6">
            <p className="font-body text-sm text-primary font-medium">
              Get ready for amazing adventures and learning fun!
            </p>
          </div>
        </div>

        {/* Countdown */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Icon name="Clock" size={20} className="text-muted-foreground" />
            <span className="font-caption text-muted-foreground">
              Redirecting in {countdown} seconds...
            </span>
          </div>
          
          <Button
            variant="default"
            onClick={() => navigate('/dashboard')}
            className="w-full"
            iconName="ArrowRight"
            iconPosition="right"
          >
            Start Exploring Now
          </Button>
        </div>

        {/* Floating Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="absolute animate-bounce-gentle"
              style={{
                left: `${20 + (i * 12)}%`,
                top: `${25 + (i % 3) * 15}%`,
                animationDelay: `${i * 0.3}s`
              }}
            >
              <Icon 
                name="Star" 
                size={16 + (i % 2) * 6} 
                className="text-accent opacity-70"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessAnimation;