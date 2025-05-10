// src/components/LineChart.jsx
import React from "react";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export default function LineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RechartsLineChart data={data}>
        <XAxis dataKey="time" hide />
        <YAxis hide />
        <Tooltip
          contentStyle={{ backgroundColor: "#2d2d2d", border: "none" }}
          itemStyle={{ color: "#fff" }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#f87171"
          strokeWidth={2}
          dot={false}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
