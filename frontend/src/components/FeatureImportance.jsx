import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FeatureImportance = ({ data }) => {
  if (!data || !data.importances) return <div className="text-gray-400 text-center py-10">No feature importance data.</div>;

  const featureLabels = [
    'Age', 'BMI', 'Children', 'Obesity Age Score', 'Dependency Load',
    'Lifestyle Penalty', 'Gender (Male)', 'Region SW', 'Region SE', 'Region NW', 'Discount'
  ];

  const chartData = data.importances.map((val, idx) => ({
    name: featureLabels[idx] || `Feature ${idx}`,
    importance: val,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart layout="vertical" data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 80 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
        <XAxis type="number" tick={{ fill: '#ccc' }} />
        <YAxis type="category" dataKey="name" tick={{ fill: '#ccc' }} width={100} />
        <Tooltip contentStyle={{ backgroundColor: '#0a1628', border: '1px solid #333', borderRadius: '8px' }} />
        <Legend verticalAlign="top" height={36} />
        <Bar dataKey="importance" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FeatureImportance;