import React, { useState } from 'react';
import { Search, Filter, Trash2, Car, Utensils, Zap, Trash, Clock, Tag } from 'lucide-react';

const CATEGORY_ICONS = {
  Transportation: Car,
  Energy: Zap,
  Food: Utensils,
  Waste: Trash,
};

export function ActivityList({ activities, onDeleteActivity }) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = activities.filter((act) => {
    const matchesCat = filterCategory === 'All' || act.category === filterCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      (act.notes && act.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      act.activity_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalFilteredEmission = filtered
    .reduce((sum, a) => sum + (a.emission || 0), 0)
    .toFixed(1);

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Activity History & Telemetry
          </h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            {filtered.length} activities logged • <strong className="text-neutral-700 dark:text-neutral-300">{totalFilteredEmission} kg CO₂e</strong> net volume
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {['All', 'Transportation', 'Food', 'Energy', 'Waste'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by description, note, or activity type..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-xs text-neutral-400">
          No matching activities found for this filter.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-semibold">
                <th className="pb-3 pl-2">Activity</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Quantity</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right">Est. CO₂e</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {filtered.map((act) => {
                const Icon = CATEGORY_ICONS[act.category] || Car;
                const dateStr = act.timestamp
                  ? new Date(act.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'N/A';

                return (
                  <tr key={act.id} className="group hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 pl-2 font-medium text-neutral-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate max-w-[200px] sm:max-w-xs">
                          {act.notes || act.activity_type}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-neutral-500 dark:text-neutral-400 capitalize">
                      {act.category}
                    </td>
                    <td className="py-3 font-mono text-neutral-600 dark:text-neutral-300">
                      {act.quantity} {act.unit}
                    </td>
                    <td className="py-3 text-neutral-400 dark:text-neutral-500 whitespace-nowrap">
                      {dateStr}
                    </td>
                    <td className="py-3 text-right font-mono font-bold">
                      <span className={act.emission < 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-900 dark:text-white'}>
                        {act.emission < 0 ? '' : '+'}{act.emission} kg
                      </span>
                    </td>
                    <td className="py-3 text-right pr-2">
                      <button
                        onClick={() => onDeleteActivity(act.id)}
                        className="p-1 text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-md transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
