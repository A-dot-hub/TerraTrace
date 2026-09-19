import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const CATEGORY_COLORS = {
  Transportation: '#10b981', // emerald
  Energy: '#3b82f6',         // blue
  Food: '#f59e0b',           // amber
  Waste: '#8b5cf6',          // purple
};

const DEFAULT_DATA = [
  { name: 'Transportation', value: 30.8, percentage: 53 },
  { name: 'Energy', value: 16.2, percentage: 28 },
  { name: 'Food', value: 7.0, percentage: 12 },
  { name: 'Waste', value: 4.2, percentage: 7 },
];

export function EmissionsDonutChart({ data = DEFAULT_DATA }) {
  const chartData = data && data.length > 0 ? data : DEFAULT_DATA;
  const totalKg = chartData.reduce((acc, item) => acc + (item.value || 0), 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs rounded-lg px-3 py-2 shadow-lg border border-neutral-800 dark:border-neutral-200">
          <div className="font-semibold">{p.name}</div>
          <div className="text-neutral-300 dark:text-neutral-600 font-mono mt-0.5">
            {p.value} kg CO₂e ({p.percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Emission by Category
          </h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Current 7-day volume breakdown
          </p>
        </div>
        <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
          {totalKg.toFixed(1)} kg CO₂e
        </span>
      </div>

      <div className="h-52 w-full relative flex items-center justify-center my-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={58}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              stroke="transparent"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CATEGORY_COLORS[entry.name] || '#6b7280'}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label inside donut */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
            Total
          </span>
          <span className="text-lg font-bold text-neutral-900 dark:text-white leading-tight font-display">
            {totalKg.toFixed(0)}
          </span>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
            kg CO₂e
          </span>
        </div>
      </div>

      {/* Modern Legend */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[item.name] || '#6b7280' }}
              />
              <span className="text-neutral-600 dark:text-neutral-400 truncate">
                {item.name}
              </span>
            </div>
            <span className="font-mono text-neutral-900 dark:text-neutral-200 font-medium ml-1">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
