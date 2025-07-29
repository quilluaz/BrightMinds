import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-card rounded-container border border-border shadow-warm animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-muted rounded-t-container" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title and Difficulty */}
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded-button w-3/4" />
          <div className="flex items-center justify-between">
            <div className="h-4 bg-muted rounded-button w-20" />
            <div className="h-4 bg-muted rounded-button w-16" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <div className="h-3 bg-muted rounded-button w-full" />
          <div className="h-3 bg-muted rounded-button w-2/3" />
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="h-3 bg-muted rounded-button w-16" />
            <div className="h-3 bg-muted rounded-button w-8" />
          </div>
          <div className="h-2 bg-muted rounded-full w-full" />
        </div>

        {/* Button */}
        <div className="pt-2">
          <div className="h-10 bg-muted rounded-button w-full" />
        </div>

        {/* Achievement */}
        <div className="flex items-center justify-center space-x-2 pt-2 border-t border-border">
          <div className="h-3 bg-muted rounded-button w-24" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;