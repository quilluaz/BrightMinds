import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CompletionRatesChart({ data }) {
  if (!data) {
    return (
      <div className="bg-white border-2 border-bmBlack rounded-lg p-4 text-center">
        <p className="text-bmBlack font-lexend">No completion data available</p>
      </div>
    );
  }

  // Convert the completion rates object to array format
  const chartData = Object.values(data).map(story => ({
    storyTitle: story.storyTitle,
    completionRate: Math.round(story.completionRate * 100) / 100,
    completed: story.completed,
    total: story.total
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white border-2 border-bmBlack rounded-lg p-4 text-center">
        <p className="text-bmBlack font-lexend">No stories available</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-bmBlack rounded-lg p-4">
      <h3 className="text-bmBlack font-spartan font-bold text-lg mb-4 text-center">
        Story Completion Rates
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis 
            dataKey="storyTitle" 
            angle={-45}
            textAnchor="end"
            height={80}
            fontSize={12}
            stroke="#000"
          />
          <YAxis 
            stroke="#000"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '2px solid #000',
              borderRadius: '8px',
              color: '#000'
            }}
            formatter={(value, name) => [
              `${value}%`, 
              'Completion Rate'
            ]}
            labelFormatter={(label) => `Story: ${label}`}
          />
          <Bar 
            dataKey="completionRate" 
            fill="#8B5CF6" 
            stroke="#000"
            strokeWidth={2}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
