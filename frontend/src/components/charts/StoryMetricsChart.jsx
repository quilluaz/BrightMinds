import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StoryMetricsChart({ data, title, dataKey, color, unit = "", yAxisDomain }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border-2 border-bmBlack rounded-lg p-4 text-center h-full flex items-center justify-center">
        <p className="text-bmBlack font-lexend">No data available for {title}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-bmBlack rounded-lg p-4 shadow-[4px_4px_0_#000]">
      <h3 className="text-bmBlack font-spartan font-bold text-lg mb-4 text-center">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis 
            dataKey="storyTitle" 
            angle={-45}
            textAnchor="end"
            height={80}
            fontSize={11}
            stroke="#000"
            interval={0}
          />
          <YAxis 
            stroke="#000"
            domain={yAxisDomain || ['auto', 'auto']}
            tickFormatter={(value) => `${value}${unit}`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '2px solid #000',
              borderRadius: '8px',
              color: '#000'
            }}
            formatter={(value) => [`${value}${unit}`, title]}
            labelFormatter={(label) => `Story: ${label}`}
          />
          <Bar 
            dataKey={dataKey} 
            fill={color} 
            stroke="#000"
            strokeWidth={2}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
