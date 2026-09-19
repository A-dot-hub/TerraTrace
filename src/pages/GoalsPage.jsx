import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { GoalCard } from '../components/goals/GoalCard';
import { GoalModal } from '../components/goals/GoalModal';
import { Target, Plus, CheckCircle2, TrendingUp, Sparkles, Award } from 'lucide-react';

export function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchGoals = async () => {
    try {
      const list = await api.getGoals();
      setGoals(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (newGoal) => {
    await api.createGoal(newGoal);
    await fetchGoals();
  };

  const handleUpdateProgress = async (id, newCurrent) => {
    await api.updateGoal(id, { current: newCurrent });
    await fetchGoals();
  };

  const handleDeleteGoal = async (id) => {
    await api.deleteGoal(id);
    await fetchGoals();
  };

  const completedCount = goals.filter((g) => g.current >= g.target).length;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white font-display">
                Sustainability Goals & Milestones
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Commit to quantified reduction targets across transit, electricity, diet & circular waste
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Goal Target</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold">
              {completedCount} of {goals.length} Goals Achieved
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Consistent goal progression accounts for ~22% of total individual emission reductions
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-bold font-mono text-emerald-400">
            {goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0}%
          </span>
          <span className="text-xs text-neutral-400 ml-1.5">Completion Rate</span>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onUpdateProgress={handleUpdateProgress}
            onDeleteGoal={handleDeleteGoal}
          />
        ))}
      </div>

      {/* Modal */}
      <GoalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCreateGoal}
      />
    </div>
  );
}
