import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MostPlayedGamesChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border-2 border-bmBlack rounded-lg p-4 text-center">
        <p className="text-bmBlack font-lexend">No game data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-bmBlack rounded-lg p-4">
      <h3 className="text-bmBlack font-spartan font-bold text-lg mb-4 text-center">
        Most Played Games
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis 
            dataKey="storyTitle" 
            angle={-45}
            textAnchor="end"
            height={80}
            fontSize={12}
            stroke="#000"
          />
          <YAxis stroke="#000" />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '2px solid #000',
              borderRadius: '8px',
              color: '#000'
            }}
            formatter={(value, name) => [value, 'Plays']}
            labelFormatter={(label) => `Game: ${label}`}
          />
          <Bar 
            dataKey="playCount" 
            fill="#FFD700" 
            stroke="#000"
            strokeWidth={2}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
