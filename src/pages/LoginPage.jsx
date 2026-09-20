import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Lock, Mail, Sparkles, Loader2 } from "lucide-react";
import { TerraTraceIcon } from "../components/common/TerraTraceLogo";

export function LoginPage() {
  const [email, setEmail] = useState("alex.morgan@terratrace.earth");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, exploreDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials or authentication error");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = async () => {
    await exploreDemo();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-900 text-white selection:bg-emerald-500 selection:text-neutral-900">
      <div className="w-full max-w-md rounded-2xl bg-neutral-950 border border-neutral-800 p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div
            onClick={() => navigate("/")}
            className="w-12 h-12 rounded-xl bg-neutral-900 border border-emerald-800/60 flex items-center justify-center mx-auto cursor-pointer shadow-md shadow-emerald-950/50 hover:border-emerald-500 transition-colors"
          >
            <TerraTraceIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-white">
            Welcome to TerraTrace
          </h1>
          <p className="text-xs text-neutral-400">
            Sign in to access your sustainability intelligence workspace
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access */}
        <div className="pt-2 border-t border-neutral-900 text-center space-y-3">
          <button
            type="button"
            onClick={handleDemoMode}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant Demo Access (Explore Demo)</span>
          </button>

          <p className="text-xs text-neutral-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-emerald-400 hover:underline font-semibold"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
