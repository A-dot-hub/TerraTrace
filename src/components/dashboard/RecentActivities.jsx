import React from 'react';
import { ArrowRight, Car, Utensils, Zap, Trash2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORY_ICONS = {
  Transportation: Car,
  Energy: Zap,
  Food: Utensils,
  Waste: Trash2,
};

export function RecentActivities({ activities = [] }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Recent Activities
          </h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Latest carbon logs processed by engine
          </p>
        </div>
        <button
          onClick={() => navigate('/activities')}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="py-8 text-center text-xs text-neutral-400">
          No recent activities recorded yet.
        </div>
      ) : (
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {activities.slice(0, 5).map((act) => {
            const Icon = CATEGORY_ICONS[act.category] || Car;
            const dateStr = act.timestamp
              ? new Date(act.timestamp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Today';

            return (
              <div
                key={act.id}
                className="py-3 flex items-center justify-between gap-3 group hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 px-2 -mx-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                      {act.notes || `${act.quantity} ${act.unit} • ${act.activity_type}`}
                    </div>
                    <div className="text-[11px] text-neutral-400 dark:text-neutral-500 flex items-center gap-2 mt-0.5">
                      <span className="capitalize">{act.category}</span>
                      <span>•</span>
                      <span>{dateStr}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className={`text-xs font-mono font-semibold ${
                    act.emission < 0 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-neutral-900 dark:text-neutral-200'
                  }`}>
                    {act.emission < 0 ? '' : '+'}{act.emission} kg
                  </div>
                  <div className="text-[10px] text-neutral-400 dark:text-neutral-500">
                    CO₂e
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
