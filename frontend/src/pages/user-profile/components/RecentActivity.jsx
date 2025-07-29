import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    const iconMap = {
      story_completed: 'BookCheck',
      quiz_passed: 'CheckCircle',
      badge_earned: 'Award',
      level_up: 'TrendingUp',
      streak_milestone: 'Flame',
      perfect_score: 'Star'
    };
    return iconMap[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colorMap = {
      story_completed: 'text-success',
      quiz_passed: 'text-primary',
      badge_earned: 'text-accent',
      level_up: 'text-secondary',
      streak_milestone: 'text-warning',
      perfect_score: 'text-accent'
    };
    return colorMap[type] || 'text-muted-foreground';
  };

  const getActivityBgColor = (type) => {
    const colorMap = {
      story_completed: 'bg-success/10',
      quiz_passed: 'bg-primary/10',
      badge_earned: 'bg-accent/10',
      level_up: 'bg-secondary/10',
      streak_milestone: 'bg-warning/10',
      perfect_score: 'bg-accent/10'
    };
    return colorMap[type] || 'bg-muted';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInHours = Math.floor((now - activityTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return activityTime.toLocaleDateString();
  };

  return (
    <div className="mb-6">
      <h2 className="font-display text-xl text-foreground mb-4 flex items-center">
        <Icon name="Activity" size={24} className="text-primary mr-2" />
        Recent Activity
      </h2>

      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-card rounded-container p-4 border border-border shadow-warm-sm">
            <div className="flex items-start space-x-4">
              {/* Activity Icon */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityBgColor(activity.type)}`}>
                <Icon 
                  name={getActivityIcon(activity.type)} 
                  size={20} 
                  className={getActivityColor(activity.type)} 
                />
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-body font-medium text-foreground mb-1">
                      {activity.title}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground mb-2">
                      {activity.description}
                    </p>
                    
                    {/* Activity Details */}
                    {activity.details && (
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        {activity.details.score && (
                          <div className="flex items-center space-x-1">
                            <Icon name="Target" size={12} />
                            <span>Score: {activity.details.score}%</span>
                          </div>
                        )}
                        {activity.details.points && (
                          <div className="flex items-center space-x-1">
                            <Icon name="Star" size={12} />
                            <span>+{activity.details.points} XP</span>
                          </div>
                        )}
                        {activity.details.duration && (
                          <div className="flex items-center space-x-1">
                            <Icon name="Clock" size={12} />
                            <span>{activity.details.duration}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Story Thumbnail */}
                  {activity.thumbnail && (
                    <div className="w-12 h-12 rounded-button overflow-hidden ml-3 flex-shrink-0">
                      <Image
                        src={activity.thumbnail}
                        alt={activity.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                  <span className="font-caption text-xs text-muted-foreground">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                  
                  {/* Achievement Badge */}
                  {activity.achievement && (
                    <div className="flex items-center space-x-1 bg-accent/10 px-2 py-1 rounded-button">
                      <Icon name="Award" size={12} className="text-accent" />
                      <span className="font-caption text-xs text-accent">
                        {activity.achievement}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Calendar" size={24} className="text-muted-foreground" />
          </div>
          <p className="font-body text-muted-foreground">
            No recent activity to show
          </p>
          <p className="font-caption text-sm text-muted-foreground mt-1">
            Complete some stories to see your progress here!
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;