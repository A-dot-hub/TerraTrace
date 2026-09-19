import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { TraceAIChat } from '../components/common/TraceAIChat';
import {
  Globe,
  ExternalLink,
  BookOpen,
  Compass,
  Sparkles,
  TrendingDown,
  RefreshCw,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react';

export function InsightsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await api.getNews();
      setNews(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white font-display">
                Sustainability Intelligence & Insights
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Verified climate science, automated environmental feeds & interactive AI diagnostics
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchNews}
          className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Intelligence Feed</span>
        </button>
      </div>

      {/* Grid: Trace AI on Left/Top + Environmental Intelligence Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trace AI Copilot (5 cols) */}
        <div className="lg:col-span-5">
          <TraceAIChat />
        </div>

        {/* Environmental Intelligence Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Environmental Intelligence (Scraped Live)
                </h3>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-semibold">
                Python BS4 Engine
              </span>
            </div>

            <div className="space-y-4">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800">
                      {item.category || 'Environmental Data'}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.published_date}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white mt-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1.5 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between text-xs">
                    <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                      <span>Source:</span>
                      <strong className="text-neutral-700 dark:text-neutral-300">{item.source}</strong>
                    </div>
                    {item.source_url && (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <span>View Report</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
