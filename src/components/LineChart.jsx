// src/components/LineChart.jsx
import React from "react";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// New function to format X-axis labels
const formatXAxisLabel = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  // For 1D view, show time without AM/PM
  if (diffDays === 0) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: false 
    });
  }
  
  // For 7D view, show weekday
  if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short'
    });
  }
  
  // For all other views, show month/day
  return date.toLocaleDateString('en-US', { 
    month: 'numeric',
    day: 'numeric'
  });
};

export default function LineChart({ data }) {
  console.log('LineChart received data:', data);

  // Ensure all values are numbers and sort by timestamp
  const processedData = data
    .map(item => ({
      ...item,
      value: typeof item.value === 'string' ? parseFloat(item.value) : item.value,
      time: new Date(item.time)
    }))
    .sort((a, b) => a.time - b.time);

  const maxValue = Math.max(...processedData.map(d => d.value || 0));
  const padding = maxValue * 0.1; // Add 10% padding to the top

  // Determine the time range based on the data
  const timeRange = processedData.length > 0 ? 
    Math.floor((processedData[processedData.length - 1].time - processedData[0].time) / (1000 * 60 * 60 * 24)) : 
    0;

  console.log('Processed data:', processedData);
  console.log('Max value:', maxValue);
  console.log('Time range in days:', timeRange);

  // Calculate appropriate number of ticks based on time range
  let numTicks;
  if (timeRange <= 1) {
    numTicks = 6; // For 1D view, show more points
  } else if (timeRange <= 7) {
    numTicks = 7; // For 7D view, show one per day
  } else {
    numTicks = 5; // For longer views, show fewer points
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart 
        data={processedData} 
        margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f87171" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#f87171" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis 
          dataKey="time" 
          tickFormatter={formatXAxisLabel}
          tick={{ fill: '#888' }}
          stroke="#444"
          interval={Math.floor(processedData.length / numTicks)}
          minTickGap={30}
          height={60}
          tickMargin={10}
        />
        <YAxis 
          domain={[0, maxValue + padding]}
          tickFormatter={formatCurrency}
          tick={{ fill: '#888' }}
          stroke="#444"
          orientation="left"
          width={60}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: "#2d2d2d", 
            border: "none",
            borderRadius: "8px",
            padding: "12px"
          }}
          itemStyle={{ color: "#fff" }}
          formatter={(value) => [formatCurrency(value), "Value"]}
          labelFormatter={formatDate}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#f87171"
          strokeWidth={2}
          dot={{ fill: "#f87171", strokeWidth: 2 }}
          activeDot={{ r: 6, fill: "#f87171" }}
          isAnimationActive={true}
          animationDuration={1000}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
