import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  UserCircle,
  ShieldCheck,
  Database,
  Download,
  RefreshCw,
  LogOut,
  Layers,
  Sparkles,
  Server,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
  const { user, logout, exploreDemo } = useAuth();
  const navigate = useNavigate();
  const [emissionFactors, setEmissionFactors] = useState({});
  const [resetNotice, setResetNotice] = useState(false);

  useEffect(() => {
    async function loadFactors() {
      const factors = await api.getEmissionFactors();
      setEmissionFactors(factors);
    }
    loadFactors();
  }, []);

  const handleExportData = async () => {
    const activities = await api.getActivities();
    const goals = await api.getGoals();
    const scenarios = await api.getScenarios();
    const exportBundle = {
      exportedAt: new Date().toISOString(),
      user,
      activities,
      goals,
      scenarios,
    };
    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terratrace-telemetry-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleResetData = async () => {
    await exploreDemo();
    setResetNotice(true);
    setTimeout(() => {
      setResetNotice(false);
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white font-display">
          User Profile & System Intelligence
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Account telemetry credentials, MongoDB Atlas collection status & DEFRA emission factors
        </p>
      </div>

      {resetNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold">
          4 Weeks of realistic demo telemetry reseeded successfully!
        </div>
      )}

      {/* Account Card */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center text-xl font-bold font-display">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  {user?.name || 'Explorer'}
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800 font-semibold">
                  Verified Workspace
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {user?.email || 'alex.morgan@terratrace.earth'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportData}
              className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Telemetry JSON</span>
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tech Stack & Architecture Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-1">
            <Server className="w-3.5 h-3.5 text-emerald-500" />
            Backend API Runtime
          </div>
          <div className="text-sm font-bold text-neutral-900 dark:text-white font-mono">
            FastAPI + Uvicorn
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Deterministic carbon calculations & JWT authentication
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-1">
            <Database className="w-3.5 h-3.5 text-blue-500" />
            Database Engine
          </div>
          <div className="text-sm font-bold text-neutral-900 dark:text-white font-mono">
            MongoDB Atlas (terratrace)
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Collections: activities, scenarios, goals, news
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
            Modeling Benchmark
          </div>
          <div className="text-sm font-bold text-neutral-900 dark:text-white font-mono">
            DEFRA / IPCC 2026
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Standard GHG Protocol scopes 1, 2 and 3
          </p>
        </div>
      </div>

      {/* Configurable Emission Factors Table */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-4">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Configurable Emission Factors (MongoDB)
            </h3>
            <p className="text-xs text-neutral-400">
              Deterministic coefficients applied by the calculation engine (kg CO₂e per unit)
            </p>
          </div>
          <button
            onClick={handleResetData}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Demo Telemetry</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-semibold">
                <th className="pb-2.5 pl-2">Activity Type</th>
                <th className="pb-2.5">Category</th>
                <th className="pb-2.5">Standard Unit</th>
                <th className="pb-2.5 text-right pr-2">Factor (kg CO₂e / unit)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono">
              {Object.entries(emissionFactors).map(([key, item]) => (
                <tr key={key} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-2.5 pl-2 font-sans font-medium text-neutral-900 dark:text-white">
                    {item.label || key}
                  </td>
                  <td className="py-2.5 font-sans text-neutral-500 capitalize">
                    {item.category}
                  </td>
                  <td className="py-2.5 text-neutral-600 dark:text-neutral-400">
                    {item.unit}
                  </td>
                  <td className="py-2.5 text-right pr-2 font-bold text-neutral-900 dark:text-neutral-200">
                    {item.factor > 0 ? `+${item.factor}` : item.factor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
