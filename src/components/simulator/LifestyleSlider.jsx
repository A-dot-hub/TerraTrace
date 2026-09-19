import React from 'react';

export function LifestyleSlider({
  label,
  icon: Icon,
  currentValue,
  simulatedValue,
  onChange,
  unit,
  min = 0,
  max = 200,
  step = 1,
  emissionDiffText,
}) {
  const diff = simulatedValue - currentValue;
  const isReduced = diff < 0;

  return (
    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="p-1.5 rounded-lg bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 shadow-2xs">
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="text-xs font-semibold text-neutral-900 dark:text-white">
            {label}
          </span>
        </div>

        <div className="text-xs flex items-center gap-2">
          <span className="text-neutral-400 dark:text-neutral-500">
            Current: <strong className="font-mono text-neutral-600 dark:text-neutral-300">{currentValue} {unit}</strong>
          </span>
          <span className="text-neutral-300 dark:text-neutral-700">|</span>
          <span className="font-mono font-bold text-neutral-900 dark:text-white bg-white dark:bg-neutral-700 px-2 py-0.5 rounded border border-neutral-200/60 dark:border-neutral-600 shadow-2xs">
            {simulatedValue} {unit}
          </span>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-1.5">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={simulatedValue}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
        <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
          <span>{min} {unit}</span>
          <span>{emissionDiffText}</span>
          <span>{max} {unit}</span>
        </div>
      </div>
    </div>
  );
}
