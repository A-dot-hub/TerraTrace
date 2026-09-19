import React from 'react';
import { ArrowUpRight, Lightbulb, Compass, Zap, Car, Utensils, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORY_ICONS = {
  Transportation: Car,
  Energy: Zap,
  Food: Utensils,
  Waste: Trash2,
};

export function ImpactOpportunity({ biggestImpact, recommendation, categories = [] }) {
  const navigate = useNavigate();
  const Icon = CATEGORY_ICONS[biggestImpact?.name] || Compass;

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Impact Analysis & Opportunity
              </h3>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Identified from your verified lifestyle logs
              </p>
            </div>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="space-y-2.5 mb-5">
          {categories.map((cat) => {
            const CatIcon = CATEGORY_ICONS[cat.name] || Compass;
            const isHighest = cat.name === biggestImpact?.name;
            return (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300">
                    <CatIcon className={`w-3.5 h-3.5 ${isHighest ? 'text-emerald-500' : 'text-neutral-400'}`} />
                    {cat.name}
                    {isHighest && (
                      <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.2 rounded">
                        Largest Source
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-neutral-900 dark:text-neutral-200 font-semibold">
                    {cat.percentage}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isHighest
                        ? 'bg-emerald-500 dark:bg-emerald-400'
                        : 'bg-neutral-300 dark:bg-neutral-700'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, cat.percentage))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Opportunity Card */}
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
          <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
            Your Biggest Opportunity
          </div>
          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
            <strong>{biggestImpact?.name}</strong> is currently your largest estimated source of emissions ({biggestImpact?.percentage}% of footprint).
          </p>

          {recommendation && (
            <div className="mt-3 pt-3 border-t border-neutral-200/60 dark:border-neutral-700/60">
              <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center justify-between">
                <span>{recommendation.title}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                  {recommendation.estimated_impact}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                {recommendation.description}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 mt-2">
        <button
          onClick={() => navigate('/future-lab')}
          className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <span>Simulate Reduction in Future Lab</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
