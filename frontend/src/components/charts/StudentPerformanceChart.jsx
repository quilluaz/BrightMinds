import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentPerformanceChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border-2 border-bmBlack rounded-lg p-4 text-center">
        <p className="text-bmBlack font-lexend">No student performance data available</p>
      </div>
    );
  }

  // Limit to top 10 students for better readability
  const displayData = data.slice(0, 10);

  return (
    <div className="bg-white border-2 border-bmBlack rounded-lg p-4">
      <h3 className="text-bmBlack font-spartan font-bold text-lg mb-4 text-center">
        Student Performance (Top 10)
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis 
            dataKey="studentName" 
            angle={-45}
            textAnchor="end"
            height={100}
            fontSize={10}
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
              name === 'averageScore' ? 'Average Score' : 'Best Score'
            ]}
            labelFormatter={(label) => `Student: ${label}`}
          />
          <Bar 
            dataKey="averageScore" 
            fill="#3B82F6" 
            stroke="#000"
            strokeWidth={2}
            radius={[4, 4, 0, 0]}
            name="Average Score"
          />
          <Bar 
            dataKey="bestScore" 
            fill="#10B981" 
            stroke="#000"
            strokeWidth={2}
            radius={[4, 4, 0, 0]}
            name="Best Score"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
