import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { QuickTraceBar } from '../components/activities/QuickTraceBar';
import { ActivityList } from '../components/activities/ActivityList';
import { ActivityFormModal } from '../components/activities/ActivityFormModal';
import { Plus, Car, Utensils, Zap, Trash2, RefreshCw, Layers } from 'lucide-react';

export function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchActivities = async () => {
    try {
      const list = await api.getActivities();
      setActivities(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleQuickTraceLogged = async (text) => {
    const res = await api.quickTrace(text);
    await fetchActivities();
    return res;
  };

  const handleSaveActivity = async (data) => {
    const res = await api.addActivity(data);
    await fetchActivities();
    return res;
  };

  const handleDeleteActivity = async (id) => {
    await api.deleteActivity(id);
    await fetchActivities();
  };

  // Category totals
  const totalTransport = activities
    .filter((a) => a.category === 'Transportation')
    .reduce((sum, a) => sum + (a.emission || 0), 0)
    .toFixed(1);

  const totalFood = activities
    .filter((a) => a.category === 'Food')
    .reduce((sum, a) => sum + (a.emission || 0), 0)
    .toFixed(1);

  const totalEnergy = activities
    .filter((a) => a.category === 'Energy')
    .reduce((sum, a) => sum + (a.emission || 0), 0)
    .toFixed(1);

  const totalWaste = activities
    .filter((a) => a.category === 'Waste')
    .reduce((sum, a) => sum + (a.emission || 0), 0)
    .toFixed(1);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white font-display">
            Activity & Footprint Telemetry
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Log transit, dietary choices, household energy, and recycling with deterministic calculation
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Activity</span>
        </button>
      </div>

      {/* Category Metric Overview Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-neutral-400 uppercase font-semibold">Transit</div>
            <div className="text-sm font-bold font-mono text-neutral-900 dark:text-white">{totalTransport} kg</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-neutral-400 uppercase font-semibold">Energy</div>
            <div className="text-sm font-bold font-mono text-neutral-900 dark:text-white">{totalEnergy} kg</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-neutral-400 uppercase font-semibold">Food</div>
            <div className="text-sm font-bold font-mono text-neutral-900 dark:text-white">{totalFood} kg</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Trash2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-neutral-400 uppercase font-semibold">Waste</div>
            <div className="text-sm font-bold font-mono text-neutral-900 dark:text-white">{totalWaste} kg</div>
          </div>
        </div>
      </div>

      {/* Quick Trace Natural Language Logging */}
      <QuickTraceBar onActivityLogged={handleQuickTraceLogged} />

      {/* Activity List */}
      <ActivityList
        activities={activities}
        onDeleteActivity={handleDeleteActivity}
      />

      {/* Manual Entry Modal */}
      <ActivityFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveActivity}
      />
    </div>
  );
}
