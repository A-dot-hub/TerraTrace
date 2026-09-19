import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { LifestyleSlider } from '../components/simulator/LifestyleSlider';
import { ComparisonBarChart } from '../components/simulator/ComparisonBarChart';
import { ProjectionChart } from '../components/simulator/ProjectionChart';
import { SavedScenarios } from '../components/simulator/SavedScenarios';
import {
  FlaskConical,
  Play,
  RotateCcw,
  Bookmark,
  TrendingDown,
  Sparkles,
  Car,
  Utensils,
  Zap,
  Trash2,
  Train,
  Check,
  Calendar,
  Layers,
} from 'lucide-react';

export function FutureLabPage() {
  // Current baseline habit values
  const [baseline] = useState({
    carKm: 180,
    metroKm: 25,
    chickenMeals: 4,
    electricityKwh: 42,
    foodWasteKg: 2.0,
  });

  // Simulated modified values
  const [simulated, setSimulated] = useState({
    carKm: 140,
    metroKm: 45,
    chickenMeals: 2,
    electricityKwh: 38,
    foodWasteKg: 1.2,
  });

  const [simulationResult, setSimulationResult] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [scenarioName, setScenarioName] = useState('');
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Run simulation calculation
  const runSimulation = async (values = simulated) => {
    setIsSimulating(true);
    try {
      const res = await api.simulateFuture(values);
      setSimulationResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const loadScenarios = async () => {
    try {
      const list = await api.getScenarios();
      setScenarios(list);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    runSimulation(simulated);
    loadScenarios();
  }, []);

  const handleReset = () => {
    setSimulated({ ...baseline });
    runSimulation(baseline);
  };

  const handleSaveScenario = async (e) => {
    e.preventDefault();
    if (!scenarioName.trim() || !simulationResult) return;

    await api.saveScenario({
      name: scenarioName.trim(),
      inputs: { ...simulated },
      currentFootprint: simulationResult.currentFootprint,
      simulatedFootprint: simulationResult.simulatedFootprint,
      reductionPercent: simulationResult.percentageReduction,
      annualSavingsKg: simulationResult.annualReduction,
    });

    setScenarioName('');
    setSaveModalOpen(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
    await loadScenarios();
  };

  const handleLoadSavedScenario = (scen) => {
    if (scen.inputs) {
      setSimulated(scen.inputs);
      runSimulation(scen.inputs);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDeleteScenario = async (id) => {
    await api.deleteScenario(id);
    await loadScenarios();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white font-display">
                TerraTrace Future Lab
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                What-if lifestyle scenario simulator • Forecast immediate, 6-month & 1-year carbon trajectories
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Baseline</span>
          </button>
          <button
            onClick={() => setSaveModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Save Scenario</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Scenario saved successfully to MongoDB collection!</span>
        </div>
      )}

      {/* Main Simulator Control Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Habit Sliders (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Lifestyle Variables
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Modify weekly habits to calculate potential savings
                </p>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-semibold">
                Weekly Base
              </span>
            </div>

            {/* Car Travel */}
            <LifestyleSlider
              label="Car Commute & Travel"
              icon={Car}
              currentValue={baseline.carKm}
              simulatedValue={simulated.carKm}
              onChange={(val) => setSimulated((prev) => ({ ...prev, carKm: val }))}
              unit="km/wk"
              min={0}
              max={300}
              step={5}
              emissionDiffText={`${((simulated.carKm - baseline.carKm) * 0.171).toFixed(1)} kg`}
            />

            {/* Metro Transit */}
            <LifestyleSlider
              label="Metro & Rail Rapid Transit"
              icon={Train}
              currentValue={baseline.metroKm}
              simulatedValue={simulated.metroKm}
              onChange={(val) => setSimulated((prev) => ({ ...prev, metroKm: val }))}
              unit="km/wk"
              min={0}
              max={150}
              step={5}
              emissionDiffText={`${((simulated.metroKm - baseline.metroKm) * 0.035).toFixed(1)} kg`}
            />

            {/* Chicken Meals */}
            <LifestyleSlider
              label="Chicken Meals"
              icon={Utensils}
              currentValue={baseline.chickenMeals}
              simulatedValue={simulated.chickenMeals}
              onChange={(val) => setSimulated((prev) => ({ ...prev, chickenMeals: val }))}
              unit="meals/wk"
              min={0}
              max={14}
              step={1}
              emissionDiffText={`${((simulated.chickenMeals - baseline.chickenMeals) * 1.4).toFixed(1)} kg`}
            />

            {/* Electricity */}
            <LifestyleSlider
              label="Grid Electricity"
              icon={Zap}
              currentValue={baseline.electricityKwh}
              simulatedValue={simulated.electricityKwh}
              onChange={(val) => setSimulated((prev) => ({ ...prev, electricityKwh: val }))}
              unit="kWh/wk"
              min={10}
              max={100}
              step={2}
              emissionDiffText={`${((simulated.electricityKwh - baseline.electricityKwh) * 0.385).toFixed(1)} kg`}
            />

            {/* Food Waste */}
            <LifestyleSlider
              label="Food Waste"
              icon={Trash2}
              currentValue={baseline.foodWasteKg}
              simulatedValue={simulated.foodWasteKg}
              onChange={(val) => setSimulated((prev) => ({ ...prev, foodWasteKg: val }))}
              unit="kg/wk"
              min={0}
              max={10}
              step={0.2}
              emissionDiffText={`${((simulated.foodWasteKg - baseline.foodWasteKg) * 2.5).toFixed(1)} kg`}
            />

            {/* SIMULATE FUTURE Button */}
            <div className="pt-2">
              <button
                onClick={() => runSimulation(simulated)}
                disabled={isSimulating}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-emerald-500/20 active:scale-[0.99]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Simulate Future</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Simulation Outcomes & Key Delta Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Key Simulation Delta Cards */}
          {simulationResult && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Current */}
              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  Current Footprint
                </span>
                <div className="mt-1.5 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 dark:text-white">
                    {simulationResult.currentFootprint}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">kg/wk</span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  Baseline weekly footprint
                </div>
              </div>

              {/* Simulated */}
              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-emerald-500/40 dark:border-emerald-500/40 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                  Simulated Future
                </span>
                <div className="mt-1.5 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                    {simulationResult.simulatedFootprint}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">kg/wk</span>
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium mt-1">
                  Target future lifestyle
                </div>
              </div>

              {/* Potential Reduction */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 tracking-wider flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Potential Reduction
                </span>
                <div className="mt-1.5 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-300">
                    {simulationResult.percentageReduction}%
                  </span>
                </div>
                <div className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 font-mono mt-1">
                  -{simulationResult.annualReduction} kg CO₂e / year
                </div>
              </div>
            </div>
          )}

          {/* Comparison Bar Chart */}
          {simulationResult && (
            <ComparisonBarChart data={simulationResult.comparisonCategories} />
          )}

          {/* Horizon Projection Chart (1 Month, 6 Months, 1 Year) */}
          {simulationResult && (
            <ProjectionChart projections={simulationResult.projections} />
          )}
        </div>
      </div>

      {/* Saved Scenarios Gallery */}
      <SavedScenarios
        scenarios={scenarios}
        onLoadScenario={handleLoadSavedScenario}
        onDeleteScenario={handleDeleteScenario}
      />

      {/* Save Scenario Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Save Future Lab Scenario
            </h3>
            <p className="text-xs text-neutral-400">
              Save this configuration to your account for future comparison and goal setting.
            </p>

            <form onSubmit={handleSaveScenario} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Scenario Name
                </label>
                <input
                  type="text"
                  required
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  placeholder="e.g. Transit First & Meatless Thursdays"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 text-xs font-mono text-neutral-600 dark:text-neutral-300 space-y-1">
                <div>Footprint: {simulationResult?.simulatedFootprint} kg/wk (-{simulationResult?.percentageReduction}%)</div>
                <div>Annual Savings: -{simulationResult?.annualReduction} kg CO₂e</div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Save Scenario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
