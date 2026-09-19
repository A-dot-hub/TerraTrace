import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export function ComparisonBarChart({ data }) {
  const chartData = data && data.length > 0 ? data : [
    { category: 'Car Commute', current: 30.8, simulated: 20.5 },
    { category: 'Metro', current: 0.9, simulated: 2.1 },
    { category: 'Chicken Meals', current: 5.6, simulated: 2.8 },
    { category: 'Electricity', current: 16.2, simulated: 13.5 },
    { category: 'Food Waste', current: 5.0, simulated: 2.5 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs rounded-xl p-3 shadow-xl border border-neutral-800 dark:border-neutral-200">
          <div className="font-bold mb-1.5">{label}</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-neutral-400 dark:text-neutral-500">Current Footprint:</span>
              <span className="font-mono font-bold text-neutral-200 dark:text-neutral-800">{payload[0]?.value} kg</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-emerald-400 dark:text-emerald-600">Simulated Future:</span>
              <span className="font-mono font-bold text-emerald-400 dark:text-emerald-600">{payload[1]?.value} kg</span>
            </div>
            {payload[0]?.value && payload[1]?.value && (
              <div className="pt-1 border-t border-neutral-700 dark:border-neutral-200 text-[11px] text-neutral-300 dark:text-neutral-600">
                Reduction: {(payload[0].value - payload[1].value).toFixed(1)} kg (
                {Math.round(((payload[0].value - payload[1].value) / payload[0].value) * 100)}%)
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Current vs Simulated Lifestyle (Weekly kg CO₂e)
          </h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Categorical footprint comparison after habit modifications
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
            <XAxis
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888', fontSize: 11 }}
              unit="kg"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: 11, paddingBottom: 10 }}
            />
            <Bar dataKey="current" name="Current Baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="simulated" name="Simulated Future" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
