import React, { useState } from 'react';
import { X, Plus, Calculator, Car, Utensils, Zap, Trash2, CheckCircle2 } from 'lucide-react';
import { EMISSION_FACTORS, calculateEmission } from '../../utils/carbonCalculator';

const CATEGORIES = [
  { id: 'Transportation', label: 'Transportation', icon: Car },
  { id: 'Food', label: 'Food', icon: Utensils },
  { id: 'Energy', label: 'Energy', icon: Zap },
  { id: 'Waste', label: 'Waste', icon: Trash2 },
];

export function ActivityFormModal({ isOpen, onClose, onSave }) {
  const [category, setCategory] = useState('Transportation');
  const [activityType, setActivityType] = useState('car');
  const [quantity, setQuantity] = useState(25);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Filter types by selected category
  const availableTypes = Object.entries(EMISSION_FACTORS).filter(
    ([_, item]) => item.category === category
  );

  const currentFactor = EMISSION_FACTORS[activityType] || availableTypes[0]?.[1] || { unit: 'unit', factor: 0.1 };
  const currentUnit = currentFactor.unit;
  const computedEmission = calculateEmission(activityType, quantity);

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    const firstType = Object.entries(EMISSION_FACTORS).find(([_, item]) => item.category === newCat);
    if (firstType) {
      setActivityType(firstType[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        category,
        activity_type: activityType,
        quantity: Number(quantity),
        unit: currentUnit,
        emission: computedEmission,
        timestamp: new Date(`${date}T12:00:00Z`).toISOString(),
        notes: notes.trim() || `${currentFactor.label} (${quantity} ${currentUnit})`,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                Log New Activity
              </h2>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Calculated deterministically using DEFRA standard factors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category Tabs */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`p-2 rounded-xl text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                        : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activity Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Specific Activity Type
            </label>
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              {availableTypes.map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label} ({item.factor > 0 ? `${item.factor} kg/${item.unit}` : 'Zero/Negative offset'})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Quantity ({currentUnit})
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm font-mono text-neutral-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Date of Activity
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
              Description / Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Afternoon meeting commute or dinner with friends"
              className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Real-time Calculation Result Preview */}
          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Formula: {quantity} {currentUnit} × {currentFactor.factor}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold font-mono text-neutral-900 dark:text-white">
                {computedEmission < 0 ? '' : '+'}{computedEmission} kg
              </span>
              <span className="text-[10px] text-neutral-400 ml-1">CO₂e</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
