import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function ScoreDistributionChart({ data }) {
  if (!data) {
    return (
      <div className="bg-white border-2 border-bmBlack rounded-lg p-4 text-center">
        <p className="text-bmBlack font-lexend">No score data available</p>
      </div>
    );
  }

  const chartData = [
    { name: 'Excellent (90%+)', value: data.excellent || 0, color: '#10B981' },
    { name: 'Good (70-89%)', value: data.good || 0, color: '#3B82F6' },
    { name: 'Average (50-69%)', value: data.average || 0, color: '#F59E0B' },
    { name: 'Poor (<50%)', value: data.poor || 0, color: '#EF4444' }
  ];

  const totalScores = chartData.reduce((sum, item) => sum + item.value, 0);

  if (totalScores === 0) {
    return (
      <div className="bg-white border-2 border-bmBlack rounded-lg p-4 text-center">
        <p className="text-bmBlack font-lexend">No scores recorded yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-bmBlack rounded-lg p-4">
      <h3 className="text-bmBlack font-spartan font-bold text-lg mb-4 text-center">
        Score Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            stroke="#000"
            strokeWidth={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '2px solid #000',
              borderRadius: '8px',
              color: '#000'
            }}
            formatter={(value, name) => [value, 'Attempts']}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '12px',
              color: '#000'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
