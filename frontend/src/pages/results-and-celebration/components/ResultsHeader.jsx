import React from 'react';
import Icon from '../../../components/AppIcon';

const ResultsHeader = ({ storyTitle, completionTime, totalQuestions }) => {
  return (
    <div className="text-center mb-8">
      <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-warm animate-bounce-gentle">
        <Icon name="Trophy" size={40} className="text-white" />
      </div>
      
      <h1 className="font-display text-3xl text-foreground mb-2">
        Story Complete!
      </h1>
      
      <h2 className="font-display text-xl text-primary mb-4">
        {storyTitle}
      </h2>
      
      <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={16} />
          <span className="font-caption">{completionTime}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="HelpCircle" size={16} />
          <span className="font-caption">{totalQuestions} questions</span>
        </div>
      </div>
    </div>
  );
};

export default ResultsHeader;