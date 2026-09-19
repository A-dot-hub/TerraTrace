import React from 'react';

export function MetricCard({ title, value, unit, change, changeType = 'positive', description, icon: Icon }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white font-display">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {unit}
          </span>
        )}
      </div>

      {(change || description) && (
        <div className="mt-2.5 flex items-center justify-between text-xs">
          {change && (
            <span
              className={`font-semibold ${
                changeType === 'positive'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : changeType === 'negative'
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-neutral-500'
              }`}
            >
              {change}
            </span>
          )}
          {description && (
            <span className="text-neutral-400 dark:text-neutral-500 truncate ml-auto">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
