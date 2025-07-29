import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="font-caption text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="font-caption text-sm text-primary font-medium">
          {Math.round(progressPercentage)}% Complete
        </span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-3">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-caption font-medium transition-all duration-300 ${
              index + 1 < currentStep
                ? 'bg-success text-success-foreground'
                : index + 1 === currentStep
                ? 'bg-primary text-primary-foreground animate-bounce-gentle'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {index + 1 < currentStep ? (
              <Icon name="Check" size={16} />
            ) : (
              index + 1
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;