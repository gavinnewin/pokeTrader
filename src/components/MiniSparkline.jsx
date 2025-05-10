// src/components/MiniSparkline.jsx
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

export default function MiniSparkline({ data }) {
  return (
    <ResponsiveContainer width={100} height={40}>
      <LineChart
        data={data}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <Line
          type="monotone"
          dataKey="value"
          dot={false}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
