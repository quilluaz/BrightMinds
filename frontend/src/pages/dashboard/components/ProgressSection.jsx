import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressSection = ({ progress }) => {
  const progressItems = [
    {
      label: "Stories Completed",
      value: progress.storiesCompleted,
      total: progress.totalStories,
      icon: "BookOpen",
      color: "primary",
      bgColor: "primary/10"
    },
    {
      label: "Achievements Earned",
      value: progress.achievements,
      total: progress.totalAchievements,
      icon: "Award",
      color: "secondary",
      bgColor: "secondary/10"
    },
    {
      label: "Learning Streak",
      value: progress.streak,
      total: 30,
      icon: "Flame",
      color: "accent",
      bgColor: "accent/10"
    }
  ];

  return (
    <div className="mb-6">
      <h3 className="font-display text-lg text-foreground mb-4">Your Progress</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {progressItems.map((item, index) => {
          const percentage = (item.value / item.total) * 100;
          
          return (
            <div key={index} className={`bg-${item.bgColor} rounded-container p-4 shadow-warm-sm`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 bg-${item.color} rounded-full flex items-center justify-center`}>
                  <Icon name={item.icon} size={20} className="text-white" />
                </div>
                <span className={`font-caption text-sm font-medium text-${item.color}`}>
                  {item.value}/{item.total}
                </span>
              </div>
              
              <h4 className="font-body font-medium text-foreground text-sm mb-2">
                {item.label}
              </h4>
              
              <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full bg-${item.color} rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSection;