import React from 'react';
import Icon from '../../../components/AppIcon';

const DailyGoals = ({ goals }) => {
  return (
    <div className="bg-card rounded-container p-6 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg text-foreground">Today's Goals</h3>
        <div className="flex items-center space-x-1 text-accent">
          <Icon name="Target" size={16} />
          <span className="font-caption text-xs font-medium">
            {goals.completed}/{goals.total} completed
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {goals.items.map((goal, index) => {
          const isCompleted = goal.current >= goal.target;
          const progress = Math.min((goal.current / goal.target) * 100, 100);
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-success' : 'bg-muted'
                  }`}>
                    <Icon 
                      name={isCompleted ? "Check" : goal.icon} 
                      size={16} 
                      className={isCompleted ? "text-white" : "text-muted-foreground"} 
                    />
                  </div>
                  <div>
                    <h4 className="font-body font-medium text-foreground text-sm">
                      {goal.title}
                    </h4>
                    <p className="font-caption text-xs text-muted-foreground">
                      {goal.description}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`font-caption text-sm font-medium ${
                    isCompleted ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    {goal.current}/{goal.target}
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCompleted ? 'bg-success' : 'bg-accent'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              {isCompleted && (
                <div className="flex items-center space-x-1 text-success">
                  <Icon name="Sparkles" size={12} />
                  <span className="font-caption text-xs font-medium">
                    Goal completed! +{goal.points} points
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Overall Progress */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="font-body font-medium text-foreground text-sm">
            Daily Progress
          </span>
          <span className="font-caption text-sm font-medium text-accent">
            {Math.round((goals.completed / goals.total) * 100)}%
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
            style={{ width: `${(goals.completed / goals.total) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default DailyGoals;