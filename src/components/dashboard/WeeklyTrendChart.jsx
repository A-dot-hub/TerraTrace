import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function WeeklyTrendChart({ data }) {
  const trendData = data && data.length > 0 ? data : [
    { day: 'Mon', emission: 8.4 },
    { day: 'Tue', emission: 7.9 },
    { day: 'Wed', emission: 9.1 },
    { day: 'Thu', emission: 6.8 },
    { day: 'Fri', emission: 8.7 },
    { day: 'Sat', emission: 9.6 },
    { day: 'Sun', emission: 7.5 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs rounded-lg px-3 py-2 shadow-lg border border-neutral-800 dark:border-neutral-200">
          <div className="font-semibold text-neutral-300 dark:text-neutral-600">{label}</div>
          <div className="text-sm font-bold font-mono text-emerald-400 dark:text-emerald-600 mt-0.5">
            {payload[0].value} kg CO₂e
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Daily Emission Velocity
          </h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Real-time carbon telemetry for the last 7 days
          </p>
        </div>
        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800">
          7-Day Trace
        </span>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="emeraldFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
            <XAxis
              dataKey="day"
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
            <Area
              type="monotone"
              dataKey="emission"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#emeraldFade)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500 pt-3 border-t border-neutral-100 dark:border-neutral-800">
        <span>Target Baseline: ~7.1 kg / day</span>
        <span className="font-mono">Daily Avg: {(trendData.reduce((a, b) => a + b.emission, 0) / trendData.length).toFixed(1)} kg</span>
      </div>
    </div>
  );
}
