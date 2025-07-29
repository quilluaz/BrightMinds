import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressStats = ({ stats }) => {
  const statCards = [
    {
      id: 'reading',
      title: 'Reading Level',
      value: stats.readingLevel,
      progress: stats.readingProgress,
      icon: 'BookOpen',
      color: 'primary',
      description: 'Grade equivalent'
    },
    {
      id: 'streak',
      title: 'Learning Streak',
      value: `${stats.currentStreak} days`,
      progress: (stats.currentStreak / stats.longestStreak) * 100,
      icon: 'Flame',
      color: 'warning',
      description: `Best: ${stats.longestStreak} days`
    },
    {
      id: 'accuracy',
      title: 'Quiz Accuracy',
      value: `${stats.quizAccuracy}%`,
      progress: stats.quizAccuracy,
      icon: 'Target',
      color: 'success',
      description: 'Average score'
    },
    {
      id: 'time',
      title: 'Time Spent',
      value: `${stats.totalHours}h`,
      progress: (stats.totalHours / 100) * 100,
      icon: 'Clock',
      color: 'secondary',
      description: 'This month'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      primary: 'bg-primary/10 text-primary',
      warning: 'bg-warning/10 text-warning',
      success: 'bg-success/10 text-success',
      secondary: 'bg-secondary/10 text-secondary'
    };
    return colorMap[color] || colorMap.primary;
  };

  const getProgressColor = (color) => {
    const colorMap = {
      primary: 'from-primary to-primary/70',
      warning: 'from-warning to-warning/70',
      success: 'from-success to-success/70',
      secondary: 'from-secondary to-secondary/70'
    };
    return colorMap[color] || colorMap.primary;
  };

  return (
    <div className="mb-6">
      <h2 className="font-display text-xl text-foreground mb-4 flex items-center">
        <Icon name="TrendingUp" size={24} className="text-primary mr-2" />
        Learning Progress
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.id} className="bg-card rounded-container p-4 border border-border shadow-warm-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColorClasses(stat.color)}`}>
                <Icon name={stat.icon} size={20} />
              </div>
              <div className="text-right">
                <p className="font-display text-lg text-foreground">{stat.value}</p>
                <p className="font-caption text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-foreground">{stat.title}</span>
                <span className="font-caption text-xs text-muted-foreground">
                  {Math.round(stat.progress)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getProgressColor(stat.color)} rounded-full transition-all duration-700`}
                  style={{ width: `${Math.min(stat.progress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressStats;