import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { ScoreCard } from '../components/dashboard/ScoreCard';
import { MetricCard } from '../components/dashboard/MetricCard';
import { EmissionsDonutChart } from '../components/dashboard/EmissionsDonutChart';
import { WeeklyTrendChart } from '../components/dashboard/WeeklyTrendChart';
import { ImpactOpportunity } from '../components/dashboard/ImpactOpportunity';
import { RecentActivities } from '../components/dashboard/RecentActivities';
import { QuickTraceBar } from '../components/activities/QuickTraceBar';
import { ActivityFormModal } from '../components/activities/ActivityFormModal';
import { ProjectionChart } from '../components/simulator/ProjectionChart';
import {
  Flame,
  TrendingDown,
  TrendingUp,
  Plus,
  FlaskConical,
  Target,
  Sparkles,
  Zap,
  Car,
  Utensils,
  Trash2,
  Calendar,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const loadDashboard = async () => {
    try {
      const res = await api.getDashboardAnalytics();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleActivityLogged = async (text) => {
    const res = await api.quickTrace(text);
    await loadDashboard();
    return res;
  };

  const handleManualSave = async (activityData) => {
    const res = await api.addActivity(activityData);
    await loadDashboard();
    return res;
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-neutral-400">Loading sustainability telemetry...</p>
        </div>
      </div>
    );
  }

  const {
    sustainabilityScore,
    weeklyFootprint,
    weeklyChangePercent,
    categoryBreakdown,
    dailyTrend,
    biggestImpact,
    recommendation,
    projection,
    recentActivities,
  } = data;

  const isImproved = weeklyChangePercent <= 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white font-display">
              Sustainability Dashboard
            </h1>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold">
              Live
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Real-time carbon telemetry, habit diagnostics, and predictive modeling
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/future-lab')}
            className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FlaskConical className="w-3.5 h-3.5 text-emerald-500" />
            <span>Future Lab</span>
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Activity</span>
          </button>
        </div>
      </div>

      {/* Hero Score Card */}
      <ScoreCard
        score={sustainabilityScore}
        weeklyFootprint={weeklyFootprint}
        weeklyChangePercent={weeklyChangePercent}
      />

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Weekly Carbon Footprint"
          value={weeklyFootprint}
          unit="kg CO₂e"
          change={isImproved ? `${Math.abs(weeklyChangePercent)}% reduction` : `+${weeklyChangePercent}% increase`}
          changeType={isImproved ? 'positive' : 'negative'}
          description="vs prior 7 days"
          icon={Flame}
        />
        <MetricCard
          title="Daily Average Volume"
          value={(weeklyFootprint / 7).toFixed(1)}
          unit="kg / day"
          change="~5.8 kg target"
          changeType="neutral"
          description="IPCC aligned"
          icon={Calendar}
        />
        <MetricCard
          title="Primary Carbon Source"
          value={biggestImpact?.name || 'Transportation'}
          unit={`${biggestImpact?.percentage || 51}%`}
          change={`${biggestImpact?.value || 30.8} kg`}
          changeType="neutral"
          description="Dominant emission"
          icon={Car}
        />
        <MetricCard
          title="Potential Future Cut"
          value="19.9%"
          unit="via Lab"
          change="-72 kg / month"
          changeType="positive"
          description="Ready in Future Lab"
          icon={FlaskConical}
        />
      </div>

      {/* Quick Trace Bar */}
      <QuickTraceBar onActivityLogged={handleActivityLogged} />

      {/* Charts Grid: Donut + Weekly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmissionsDonutChart data={categoryBreakdown} />
        <WeeklyTrendChart data={dailyTrend} />
      </div>

      {/* Impact Opportunity & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ImpactOpportunity
          biggestImpact={biggestImpact}
          recommendation={recommendation}
          categories={categoryBreakdown}
        />
        <RecentActivities activities={recentActivities} />
      </div>

      {/* Future Projection Section */}
      <div className="pt-2">
        <ProjectionChart projections={projection} />
      </div>

      {/* Modal for manual activity entry */}
      <ActivityFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleManualSave}
      />
    </div>
  );
}
