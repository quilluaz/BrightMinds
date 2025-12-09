import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function TopPerformersChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border-2 border-bmBlack rounded-lg p-4 text-center h-full flex items-center justify-center">
        <p className="text-bmBlack font-lexend">No performance data available</p>
      </div>
    );
  }

  // Expecting data to be sorted by rank already
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border-2 border-bmBlack p-2 rounded shadow-lg">
          <p className="font-bold font-spartan">{label}</p>
          <p className="font-lexend text-sm text-bmBlack">
            Score: <span className="font-bold">{payload[0].value}%</span>
          </p>
          <p className="font-lexend text-sm text-bmBlack">
            Avg Time: <span className="font-bold">{payload[0].payload.formattedTime}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border-2 border-bmBlack rounded-lg p-4 shadow-[4px_4px_0_#000]">
      <h3 className="text-bmBlack font-spartan font-bold text-lg mb-4 text-center">
        Top 10 Performers
      </h3>
      <p className="text-xs text-center font-lexend text-gray-500 mb-2">
        Ranked by Average Score, then Fastest Average Time
      </p>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} stroke="#000" hide />
          <YAxis 
            dataKey="studentName" 
            type="category" 
            width={120} 
            tick={{fontSize: 12, fill: '#000'}} 
            stroke="#000"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="averageScore" fill="#fbbf24" stroke="#000" strokeWidth={2} radius={[0, 4, 4, 0]} barSize={20} name="Average Score" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
