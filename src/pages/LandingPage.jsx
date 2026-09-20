import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TerraTraceIcon } from "../components/common/TerraTraceLogo";
import {
  Sparkles,
  ArrowRight,
  FlaskConical,
  Activity,
  ShieldCheck,
  Compass,
  Cpu,
  BarChart3,
  Layers,
  Leaf,
  Check,
} from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();
  const { exploreDemo, isAuthenticated } = useAuth();

  const handleExploreDemo = async () => {
    await exploreDemo();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white selection:bg-emerald-500 selection:text-neutral-900 overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Navigation */}
      <header className="relative z-20 border-b border-neutral-800/80 backdrop-blur-md px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-950 border border-emerald-800/60 flex items-center justify-center shadow-sm shadow-emerald-950/40">
            <TerraTraceIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white font-display">
              TerraTrace
            </span>
            <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              Climate Intelligence
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 rounded-xl bg-white text-neutral-900 text-xs font-semibold hover:bg-neutral-100 transition-colors flex items-center gap-1.5"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-xs font-medium text-neutral-400 hover:text-white px-3 py-2 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={handleExploreDemo}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Explore Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-800/90 border border-neutral-700/80 text-xs text-neutral-300 mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-emerald-400">
            TerraTrace v1.0
          </span>
          <span className="text-neutral-500">•</span>
          <span>Next-Gen Sustainability Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-display max-w-4xl mx-auto leading-[1.08]">
          Trace every choice. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
            Understand every impact.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          TerraTrace is a modern sustainability intelligence platform that
          tracks your everyday activities, computes deterministic carbon
          footprints, identifies your biggest emissions drivers, and lets you
          simulate lifestyle changes in the{" "}
          <strong>TerraTrace Future Lab</strong>.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleExploreDemo}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm transition-all shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <span>Explore Demo (Instant Data)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-white font-semibold text-sm border border-neutral-700/80 transition-all flex items-center justify-center gap-2"
          >
            <span>Get Started Free</span>
          </button>
        </div>

        {/* Core Differentiation Banner: The Future Lab */}
        <div className="mt-16 p-6 rounded-2xl bg-neutral-800/40 border border-neutral-700/60 backdrop-blur-md max-w-3xl mx-auto text-left flex flex-col sm:flex-row items-center gap-6">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <FlaskConical className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                The TerraTrace Future Lab
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Core Innovation
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Move beyond passive counting. Adjust interactive lifestyle
              variables—from vehicle kilometers and poultry intake to grid
              power—and immediately forecast cumulative 1-Month, 6-Month, and
              1-Year carbon reduction trajectories.
            </p>
          </div>
          <button
            onClick={handleExploreDemo}
            className="shrink-0 px-3.5 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-xs font-semibold text-white transition-colors"
          >
            Try Lab
          </button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-neutral-800/80">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            Engineered for Precision
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 font-display">
            Built as a Climate SaaS Dashboard, not generic green fluff
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-800/30 border border-neutral-800 hover:border-neutral-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-emerald-400 mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Deterministic Emission Engine
            </h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              No hallucinatory AI calculations. Powered by standardized DEFRA &
              IPCC conversion coefficients across transit, electricity, diet,
              and waste.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-800/30 border border-neutral-800 hover:border-neutral-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-blue-400 mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Natural Language Quick Trace
            </h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Type naturally: "I drove my car for 18 km today". Automated regex
              extraction identifies mode, quantity, and unit with zero friction.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-800/30 border border-neutral-800 hover:border-neutral-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-amber-400 mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Trace AI Telemetry Assistant
            </h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Grounded conversational assistant that inspects your real weekly
              activity telemetry to answer: "Why is my footprint high?" and
              "What is my biggest opportunity?".
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-neutral-800 text-center text-xs text-neutral-500">
        <p>
          TerraTrace — Sustainability Intelligence Platform • DEFRA / IPCC
          Deterministic Modeling
        </p>
      </footer>
    </div>
  );
}
