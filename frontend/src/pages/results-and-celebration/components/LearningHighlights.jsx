import React from 'react';
import Icon from '../../../components/AppIcon';

const LearningHighlights = ({ highlights }) => {
  const highlightIcons = {
    'vocabulary': 'BookOpen',
    'comprehension': 'Brain',
    'creativity': 'Lightbulb',
    'problem-solving': 'Puzzle',
    'critical-thinking': 'Search',
    'memory': 'Archive'
  };

  return (
    <div className="bg-card rounded-container p-6 shadow-warm mb-6">
      <h3 className="font-display text-xl text-foreground mb-4 flex items-center">
        <Icon name="Lightbulb" size={20} className="mr-2" />
        What You Learned Today
      </h3>
      
      <div className="space-y-4">
        {highlights.map((highlight, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 bg-surface rounded-button">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center flex-shrink-0">
              <Icon 
                name={highlightIcons[highlight.type] || 'Star'} 
                size={18} 
                className="text-white" 
              />
            </div>
            
            <div className="flex-1">
              <h4 className="font-body text-foreground font-medium mb-1">
                {highlight.title}
              </h4>
              <p className="font-caption text-sm text-muted-foreground">
                {highlight.description}
              </p>
              
              {highlight.examples && highlight.examples.length > 0 && (
                <div className="mt-2">
                  <p className="font-caption text-xs text-primary font-medium mb-1">
                    Examples:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {highlight.examples.map((example, exIndex) => (
                      <span 
                        key={exIndex}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-button text-xs font-caption"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Encouragement Message */}
      <div className="mt-6 p-4 bg-gradient-to-r from-success/10 to-secondary/10 rounded-button text-center">
        <Icon name="Trophy" size={24} className="text-success mx-auto mb-2" />
        <p className="font-body text-foreground font-medium">
          Amazing progress! You're becoming a better reader every day! 🌟
        </p>
      </div>
    </div>
  );
};

export default LearningHighlights;