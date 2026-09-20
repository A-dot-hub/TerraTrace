import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  FlaskConical,
  BarChart3,
  Target,
  UserCircle,
  Leaf,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  X,
} from "lucide-react";
import { TerraTraceIcon } from "../common/TerraTraceLogo";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Activities", path: "/activities", icon: Activity },
  {
    name: "Future Lab",
    path: "/future-lab",
    icon: FlaskConical,
    badge: "Simulator",
  },
  { name: "Insights", path: "/insights", icon: BarChart3 },
  { name: "Goals", path: "/goals", icon: Target },
  { name: "Profile", path: "/profile", icon: UserCircle },
];

export function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 flex flex-col bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-100 dark:border-neutral-900">
          <div
            onClick={() => {
              navigate("/dashboard");
              onClose && onClose();
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-950 dark:bg-neutral-900 border border-emerald-800/60 flex items-center justify-center shadow-sm shadow-emerald-950/40 group-hover:border-emerald-500 transition-colors">
              <TerraTraceIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-white font-display">
                  TerraTrace
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-semibold">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                Sustainability Intelligence
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-600">
            Platform
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 shadow-xs"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900/60"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? "text-emerald-400 dark:text-emerald-600"
                            : "text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-emerald-500 text-white dark:bg-emerald-600"
                            : "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-850"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Future Lab Callout in Sidebar */}
        <div className="p-4 m-3 rounded-xl bg-gradient-to-b from-neutral-50 to-neutral-100/60 dark:from-neutral-900 dark:to-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 text-left">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
              Future Lab Ready
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed mb-3">
            Simulate habit changes and forecast your 1-year carbon trajectory.
          </p>
          <button
            onClick={() => {
              navigate("/future-lab");
              onClose && onClose();
            }}
            className="w-full py-1.5 px-2.5 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-200/80 dark:border-emerald-800 rounded-lg flex items-center justify-between transition-colors"
          >
            <span>Open Simulator</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Footer Meta */}
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
          <span className="font-mono">IPCC 1.5°C Model</span>
          <span
            className="w-2 h-2 rounded-full bg-emerald-500"
            title="API Status Healthy"
          ></span>
        </div>
      </aside>
    </>
  );
}
