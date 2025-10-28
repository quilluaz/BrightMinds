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

  return (
    <div className="bg-white border-2 border-bmBlack rounded-lg p-4">
      <h3 className="text-bmBlack font-spartan font-bold text-lg mb-4 text-center">
        Recent Activity (Last 7 Days)
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {data.map((activity, index) => (
          <div 
            key={index}
            className="bg-gray-50 border border-gray-300 rounded-lg p-3 hover:bg-gray-100 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-spartan font-bold text-bmBlack">
                  {activity.studentName}
                </p>
                <p className="font-lexend text-sm text-gray-600">
                  Completed: {activity.storyTitle}
                </p>
                <p className="font-lexend text-xs text-gray-500">
                  {formatDate(activity.date)}
                </p>
              </div>
              <div className="text-right">
                <span className={`font-spartan font-bold text-lg ${getScoreColor(activity.score)}`}>
                  {Math.round(activity.score)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
