import React from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContinueStoryCard = ({ currentStory }) => {
  const navigate = useNavigate();

  const handleContinueStory = () => {
    navigate('/story-library');
  };

  return (
    <div className="bg-gradient-to-r from-primary to-secondary rounded-container p-6 mb-6 shadow-warm text-white">
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-container overflow-hidden shadow-warm flex-shrink-0">
          <Image
            src={currentStory.image}
            alt={currentStory.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
            <Icon name="BookOpen" size={16} className="text-white/80" />
            <span className="font-caption text-xs font-medium text-white/80 uppercase tracking-wide">
              Continue Reading
            </span>
          </div>
          
          <h3 className="font-display text-xl md:text-2xl mb-2">
            {currentStory.title}
          </h3>
          
          <p className="font-body text-white/90 text-sm mb-4 line-clamp-2">
            {currentStory.description}
          </p>
          
          <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} className="text-white/80" />
              <span className="font-caption text-xs text-white/80">
                {currentStory.readingTime} min
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Target" size={14} className="text-white/80" />
              <span className="font-caption text-xs text-white/80">
                {currentStory.progress}% complete
              </span>
            </div>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2 mb-4">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${currentStory.progress}%` }}
            />
          </div>
          
          <Button
            variant="secondary"
            onClick={handleContinueStory}
            className="bg-white text-primary hover:bg-white/90"
            iconName="Play"
            iconPosition="left"
          >
            Continue Adventure
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContinueStoryCard;