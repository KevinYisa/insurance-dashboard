import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

const ScatterPlot = ({ data }) => {
  if (!data || !data.actual || data.actual.length === 0) return <div>No accuracy data available.</div>;

  const chartData = data.actual.map((val, idx) => ({
    actual: val,
    predicted: data.predicted[idx],
  }));

  return (
    <ScatterChart width={500} height={400} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
      <CartesianGrid />
      <XAxis type="number" dataKey="actual" name="Actual Expenses" unit="$" />
      <YAxis type="number" dataKey="predicted" name="Predicted Expenses" unit="$" />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
      <Legend />
      <ReferenceLine slope={1} stroke="red" strokeDasharray="3 3" label={{ position: 'top', value: 'y=x' }} />
      <Scatter name="Actual vs Predicted" data={chartData} fill="#8884d8" />
    </ScatterChart>
  );
};

export default ScatterPlot;