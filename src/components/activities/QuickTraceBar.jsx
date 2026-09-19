import React, { useState } from 'react';
import { Sparkles, ArrowRight, CornerDownLeft, Loader2, Check } from 'lucide-react';
import { parseQuickTrace } from '../../utils/carbonCalculator';

export function QuickTraceBar({ onActivityLogged }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const samplePrompts = [
    'I drove my car for 18 km today.',
    'I travelled 20 km by metro.',
    'I ate two chicken meals.',
    'Used 6 kWh electricity for cooling.',
    'Recycled 3 kg of cardboard packaging.',
  ];

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    if (val.length > 5) {
      const parsed = parseQuickTrace(val);
      setPreview(parsed);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      const result = await onActivityLogged(input.trim());
      setSuccessMsg(`Logged ${result.quantity} ${result.unit} of ${result.activity_type} (${result.emission} kg CO₂e)`);
      setInput('');
      setPreview(null);
      setTimeout(() => setSuccessMsg(''), 4500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Quick Trace (Natural Language Logger)
            </h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Type naturally — automatic keyword parsing extracts unit, quantity & calculates CO₂e instantly
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative mt-2">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="e.g., 'I drove my car for 18 km today' or 'I ate two chicken meals'..."
            className="w-full pl-4 pr-24 sm:pr-32 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 transition-all"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>Trace</span>
                  <CornerDownLeft className="w-3 h-3 text-neutral-400" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Regex Parser Preview Pill */}
        {preview && (
          <div className="mt-2.5 p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/60 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{preview.label}:</span>
              <span>{preview.quantity} {preview.unit}</span>
              <span className="text-neutral-400">•</span>
              <span className="font-mono font-bold">+{preview.emission} kg CO₂e</span>
            </div>
            <span className="text-[10px] uppercase font-mono tracking-wider opacity-70">
              Regex Match
            </span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mt-2.5 p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 text-xs font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}
      </form>

      {/* Suggested Quick Traces */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] text-neutral-400 dark:text-neutral-500 whitespace-nowrap">
          Quick test:
        </span>
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setInput(p);
              setPreview(parseQuickTrace(p));
            }}
            className="whitespace-nowrap px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-[11px] transition-colors"
          >
            "{p}"
          </button>
        ))}
      </div>
    </div>
  );
}
