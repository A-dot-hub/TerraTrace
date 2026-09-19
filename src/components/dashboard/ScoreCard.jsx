import React from 'react';
import { ShieldCheck, TrendingDown, TrendingUp, Sparkles } from 'lucide-react';

export function ScoreCard({ score, weeklyFootprint, weeklyChangePercent }) {
  const isImproved = weeklyChangePercent <= 0;
  
  // Rating level
  let tier = 'Sustainable High Performer';
  let tierColor = 'text-emerald-600 dark:text-emerald-400';
  let bgBadge = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';

  if (score < 60) {
    tier = 'High Carbon Footprint';
    tierColor = 'text-amber-600 dark:text-amber-400';
    bgBadge = 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
  } else if (score < 80) {
    tier = 'Moderate Environmental Impact';
    tierColor = 'text-blue-600 dark:text-blue-400';
    bgBadge = 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800';
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-7 shadow-xs">
      {/* Background subtle radial glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bgBadge} ${tierColor}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              {tier}
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              Updated Live
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Sustainability Intelligence Index
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-md">
            Calculated across your verified weekly activities compared against regional 1.5°C climate goals.
          </p>
        </div>

        {/* Score Ring / Digital Metric Display */}
        <div className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 rounded-2xl p-4 self-stretch sm:self-auto justify-center">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-display">
              {score}
              <span className="text-lg sm:text-xl font-normal text-neutral-400 dark:text-neutral-500">/100</span>
            </div>
            <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mt-0.5">
              Eco Score
            </div>
          </div>

          <div className="h-10 w-px bg-neutral-200 dark:bg-neutral-700 mx-1" />

          <div className="text-left">
            <div className="flex items-center gap-1 text-xs font-semibold">
              {isImproved ? (
                <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                  {Math.abs(weeklyChangePercent)}%
                </span>
              ) : (
                <span className="inline-flex items-center text-rose-600 dark:text-rose-400">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  +{weeklyChangePercent}%
                </span>
              )}
              <span className="text-neutral-400 font-normal">vs prev wk</span>
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              <strong className="text-neutral-900 dark:text-neutral-200">{weeklyFootprint}</strong> kg CO₂e this wk
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
