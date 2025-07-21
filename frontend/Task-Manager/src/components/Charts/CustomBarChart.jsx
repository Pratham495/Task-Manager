import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from "recharts";

const CustomBarChart = ({ data }) => {
  console.log(data)
  const getGradientId = (status) => {
    console.log(status)
    switch (status) {
      case "Low": return "lowGradient";
      case "Medium": return "mediumGradient";
      case "High": return "highGradient";
      default: return "defaultGradient";
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white shadow rounded-md p-3 border border-gray-200">
          <p className="text-xs text-purple-800 font-semibold mb-1">
            {item.priority}
          </p>
          <p className="text-sm text-gray-600">
            Count: <span className="font-medium text-gray-900">{item.count}</span>
          </p>
        </div>
      );
    }
    return null;
  };
  console.log(data)
  return (
    <div className="bg-white rounded-lg shadow p-5 mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00BC7D" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#00BC7D" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="mediumGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FE9900" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#FE9900" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF1F57" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#FF1F57" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="defaultGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#8884d8" stopOpacity={0.2}/>
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="priority"
            tick={{ fontSize: 12, fill: "#555" }}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#555" }}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />

          <Bar
            dataKey="count"
            radius={[8, 8, 0, 0]}
            isAnimationActive={true}
            animationDuration={1500}
          >
           <LabelList dataKey="count" position="insideTop" fill="#555" fontSize={12} />
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#${getGradientId(entry.status)})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
