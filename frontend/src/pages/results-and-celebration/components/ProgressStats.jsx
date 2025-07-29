import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressStats = ({ stats }) => {
  const statItems = [
    {
      label: 'Stories Completed',
      value: stats.storiesCompleted,
      icon: 'BookOpen',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Total Points',
      value: stats.totalPoints.toLocaleString(),
      icon: 'Star',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: 'Reading Streak',
      value: `${stats.readingStreak} days`,
      icon: 'Flame',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'Average Score',
      value: `${stats.averageScore}%`,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  ];

  return (
    <div className="bg-card rounded-container p-6 shadow-warm mb-6">
      <h3 className="font-display text-xl text-foreground mb-4 flex items-center">
        <Icon name="BarChart3" size={20} className="mr-2" />
        Your Progress
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item, index) => (
          <div key={index} className={`${item.bgColor} rounded-button p-4 text-center`}>
            <div className={`w-12 h-12 ${item.bgColor.replace('/10', '')} rounded-full flex items-center justify-center mx-auto mb-2`}>
              <Icon name={item.icon} size={20} className="text-white" />
            </div>
            <p className={`font-display text-2xl ${item.color} font-bold mb-1`}>
              {item.value}
            </p>
            <p className="font-caption text-xs text-muted-foreground">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressStats;