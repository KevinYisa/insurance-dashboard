import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AccuracyLineChart = ({ data }) => {
  if (!data || !data.actual || data.actual.length === 0) {
    return <div className="text-gray-400 text-center py-20">Loading accuracy data...</div>;
  }

  // Take a sample to avoid overwhelming the chart (max 200 points for clarity)
  const sampleSize = Math.min(data.actual.length, 200);
  const step = Math.floor(data.actual.length / sampleSize);
  
  const chartData = [];
  for (let i = 0; i < data.actual.length && chartData.length < sampleSize; i += step) {
    chartData.push({
      index: i + 1,
      actual: Math.round(data.actual[i] * 100) / 100,
      predicted: Math.round(data.predicted[i] * 100) / 100,
    });
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
        <XAxis 
          dataKey="index" 
          label={{ value: 'Test Sample Index', position: 'insideBottomRight', fill: '#fff', offset: -10 }} 
          tick={{ fill: '#ccc' }}
        />
        <YAxis 
          label={{ value: 'Expenses (USD)', angle: -90, position: 'insideLeft', fill: '#fff' }} 
          tick={{ fill: '#ccc' }}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#0a1628', border: '1px solid #333', borderRadius: '8px' }}
          labelStyle={{ color: '#fff' }}
        />
        <Legend verticalAlign="top" height={36} iconType="circle" />
        <Line 
          type="monotone" 
          dataKey="actual" 
          stroke="#60A5FA" 
          strokeWidth={2} 
          dot={false}
          activeDot={{ r: 6, fill: '#60A5FA' }}
          name="Actual Expenses"
        />
        <Line 
          type="monotone" 
          dataKey="predicted" 
          stroke="#34D399" 
          strokeWidth={2} 
          dot={false}
          activeDot={{ r: 6, fill: '#34D399' }}
          name="Predicted Expenses"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AccuracyLineChart;