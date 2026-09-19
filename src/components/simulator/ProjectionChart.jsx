import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export function ProjectionChart({ projections }) {
  const chartData = projections && projections.length > 0 ? projections : [
    { horizon: 'Current', currentKg: 58.5, simulatedKg: 58.5, savedKg: 0 },
    { horizon: '1 Month', currentKg: 251.5, simulatedKg: 178.6, savedKg: 72.9 },
    { horizon: '6 Months', currentKg: 1521.0, simulatedKg: 1071.6, savedKg: 449.4 },
    { horizon: '1 Year', currentKg: 3042.0, simulatedKg: 2143.2, savedKg: 898.8 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const cur = payload[0]?.value;
      const sim = payload[1]?.value;
      const diff = cur - sim;
      return (
        <div className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs rounded-xl p-3 shadow-xl border border-neutral-800 dark:border-neutral-200">
          <div className="font-bold mb-1">{label} Cumulative Outlook</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4 text-neutral-300 dark:text-neutral-600">
              <span>Business-as-Usual:</span>
              <span className="font-mono font-bold text-neutral-100 dark:text-neutral-900">{cur} kg CO₂e</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-emerald-400 dark:text-emerald-600">
              <span>With Future Lab Habits:</span>
              <span className="font-mono font-bold text-emerald-400 dark:text-emerald-600">{sim} kg CO₂e</span>
            </div>
            <div className="pt-1 border-t border-neutral-700 dark:border-neutral-200 font-semibold text-emerald-400 dark:text-emerald-600">
              Saved: -{diff.toFixed(1)} kg CO₂e
            </div>
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
            Long-Term Carbon Horizon Projection
          </h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Cumulative greenhouse gas emissions avoided over 1 Month, 6 Months & 1 Year
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150, 150, 150, 0.15)" />
            <XAxis
              dataKey="horizon"
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
              iconType="plainline"
              wrapperStyle={{ fontSize: 11, paddingBottom: 10 }}
            />
            <Line
              type="monotone"
              dataKey="currentKg"
              name="Current Path"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 4, fill: '#94a3b8' }}
            />
            <Line
              type="monotone"
              dataKey="simulatedKg"
              name="Simulated Future"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 5, fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Projection Metric Cards */}
      <div className="grid grid-cols-3 gap-3 pt-4 mt-2 border-t border-neutral-100 dark:border-neutral-800">
        {chartData.filter(d => d.horizon !== 'Current').map((p) => (
          <div key={p.horizon} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 text-center">
            <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
              {p.horizon}
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
              -{p.savedKg} kg
            </div>
            <div className="text-[10px] text-neutral-500">
              CO₂e avoided
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
