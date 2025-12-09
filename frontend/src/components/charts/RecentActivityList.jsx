import React from 'react';

export default function RecentActivityList({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border-2 border-bmBlack rounded-lg p-4 text-center">
        <p className="text-bmBlack font-lexend">No recent activity</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Cap at 20 activities
  const activities = data.slice(0, 20);

  return (
    <div className="bg-white border-2 border-bmBlack rounded-lg p-6 shadow-[4px_4px_0_#000]">
      <h3 className="text-bmBlack font-spartan font-bold text-xl mb-6 text-center">
        Recent Class Activity
      </h3>
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {activities.map((activity, index) => (
          <div 
            key={index} 
            className="bg-white border-2 border-bmBlack rounded-lg p-4 shadow-[2px_2px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000] transition-all"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-spartan font-bold text-bmBlack text-lg">
                {activity.studentName}
              </span>
              <span className={`font-spartan font-bold text-lg ${getScoreColor(activity.score)}`}>
                {Math.round(activity.score)}%
              </span>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="font-lexend text-sm text-bmBlack">
                  {activity.storyTitle}
                </p>
                <p className="font-lexend text-xs text-gray-500 mt-1">
                  {formatDate(activity.date)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
