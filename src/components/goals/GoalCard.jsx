import React from 'react';
import { Target, CheckCircle2, Trash2, Plus, ArrowUpRight } from 'lucide-react';

export function GoalCard({ goal, onUpdateProgress, onDeleteGoal }) {
  const percent = Math.min(100, Math.round((goal.current / (goal.target || 1)) * 100));
  const isCompleted = percent >= 100;

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 shadow-xs flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${
              isCompleted
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
            }`}>
              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Target className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 tracking-wider">
                {goal.category || 'General Target'}
              </span>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white leading-tight mt-0.5">
                {goal.title}
              </h4>
            </div>
          </div>

          <button
            onClick={() => onDeleteGoal(goal.id)}
            className="p-1 text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            title="Delete goal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Target and progress numbers */}
        <div className="mt-4 flex items-baseline justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-base text-neutral-900 dark:text-white">
              {goal.current}
            </span>
            <span className="text-neutral-400">/ {goal.target} {goal.unit}</span>
          </div>
          <span className={`font-mono font-bold ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-600 dark:text-neutral-400'}`}>
            {percent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted ? 'bg-emerald-500' : 'bg-emerald-600'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>

        {goal.endDate && (
          <div className="mt-2 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Target date:</span>
            <span className="font-mono text-neutral-600 dark:text-neutral-400">{goal.endDate}</span>
          </div>
        )}
      </div>

      {/* Quick Increment buttons */}
      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
        <span className="text-[11px] text-neutral-400">Log step:</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onUpdateProgress(goal.id, Math.min(goal.target, goal.current + 1))}
            className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>+1</span>
          </button>
          <button
            onClick={() => onUpdateProgress(goal.id, Math.min(goal.target, goal.current + 5))}
            className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium transition-colors"
          >
            +5
          </button>
        </div>
      </div>
    </div>
  );
}
