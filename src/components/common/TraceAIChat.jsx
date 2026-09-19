import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, HelpCircle, Loader2 } from 'lucide-react';
import { api } from '../../api/client';

const SAMPLE_QUESTIONS = [
  'Why is my footprint high?',
  'What is my biggest impact source?',
  'How can I reduce my footprint by 20%?',
  'What happens if I reduce my car travel?',
  'Which activity should I change first?',
];

export function TraceAIChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hello! I am **Trace AI**, your sustainability intelligence assistant. I analyze your actual carbon telemetry to answer questions about your emission drivers, reduction opportunities, and lifestyle habit tradeoffs. How can I help you today?",
      source: 'TerraTrace Telemetry Core',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (questionText) => {
    const q = questionText || input;
    if (!q.trim() || loading) return;

    const userMsg = { role: 'user', text: q.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.askTraceAI(q.trim());
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: response.answer,
          source: response.source,
          topic: response.topic,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "I encountered an error analyzing your activities. Please try rephrasing your question.",
          source: 'Error Handler',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Trace AI
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200/60 dark:border-emerald-800">
                Grounded in Telemetry
              </span>
            </div>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Personalized ecological intelligence engine
            </p>
          </div>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                T
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium'
                  : 'bg-neutral-50 dark:bg-neutral-800/70 text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-neutral-700/60'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
              {m.source && (
                <div className="mt-2 pt-1.5 border-t border-neutral-200/60 dark:border-neutral-700/60 text-[10px] text-neutral-400 flex items-center justify-between">
                  <span>Grounded Source:</span>
                  <span className="font-mono">{m.source}</span>
                </div>
              )}
            </div>
            {m.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                U
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-neutral-400 pl-8">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
            <span>Analyzing activity history & impact factors...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      <div className="pt-2 pb-2 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        {SAMPLE_QUESTIONS.map((sq, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(sq)}
            className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 whitespace-nowrap transition-colors"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative pt-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Trace AI about your carbon footprint, recommendations, or reductions..."
          className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="absolute right-2 top-3.5 p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
