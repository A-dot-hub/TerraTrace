import React from 'react';
import { Bookmark, Trash2, ArrowRight, Check } from 'lucide-react';

export function SavedScenarios({ scenarios = [], onLoadScenario, onDeleteScenario }) {
  if (scenarios.length === 0) {
    return (
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 text-center shadow-xs">
        <Bookmark className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-600 mb-2" />
        <h4 className="text-xs font-semibold text-neutral-900 dark:text-white">
          No Saved Future Lab Scenarios
        </h4>
        <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
          Simulate habit changes above and click "Save Scenario" to bookmark custom lifestyles.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Saved Future Scenarios
          </h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Stored lifestyle configurations & reduction targets
          </p>
        </div>
        <span className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-neutral-600 dark:text-neutral-400">
          {scenarios.length} Stored
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {scenarios.map((scen) => (
          <div
            key={scen.id}
            className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-600 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                  {scen.name}
                </h4>
                <button
                  onClick={() => onDeleteScenario(scen.id)}
                  className="p-1 text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors"
                  title="Delete scenario"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono my-2">
                <span className="text-neutral-400">Simulated:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {scen.simulatedFootprint} kg/wk
                </span>
                <span className="text-neutral-300">•</span>
                <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                  -{scen.reductionPercent}%
                </span>
              </div>

              {scen.inputs && (
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 space-y-0.5 py-1 border-t border-neutral-200/60 dark:border-neutral-700/60">
                  <div>Car: {scen.inputs.carKm} km/wk • Metro: {scen.inputs.metroKm} km/wk</div>
                  <div>Chicken: {scen.inputs.chickenMeals} meals • Elec: {scen.inputs.electricityKwh} kWh</div>
                </div>
              )}
            </div>

            <div className="pt-3 mt-2 flex items-center justify-between">
              <span className="text-[10px] text-neutral-400">
                Annual Save: ~{scen.annualSavingsKg || (scen.simulatedFootprint ? 500 : 0)} kg
              </span>
              <button
                onClick={() => onLoadScenario(scen)}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 transition-colors"
              >
                <span>Load in Lab</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
