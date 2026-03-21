import React, { useMemo, useState } from "react";
import {
  TrendingUp,
  ShieldAlert,
  Activity,
  Zap,
  BarChart3,
  ShieldCheck,
  Send,
  Wallet,
  ArrowRight,
  Loader2,
} from "lucide-react";
import StatCard from "../components/StatCard";
import { useLogs } from "../hooks/useLogs";
import { transferFunds } from "../services/amlService";

/**
 * Overview Component
 * The central intelligence hub for the Sentinel AML Platform.
 * Displays real-time protocol health, transaction volume, and security alerts.
 * Now includes an integrated, high-fidelity Transfer Portal for compliant fund movement.
 */

const Overview = () => {
  const logs = useLogs();
  const [form, setForm] = useState({ from: "", to: "", amount: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txStatus, setTxStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const { totalVolume, alerts, healthScore } = useMemo(() => {
    const volume = logs
      .filter((l: any) => l.event === "TRANSACTION_SETTLED")
      .reduce(
        (acc: number, curr: any) => acc + parseFloat(curr.amount || "0"),
        0,
      );

    const alertCount = logs.filter(
      (l: any) => l.level === "CRITICAL" || l.level === "WARNING",
    ).length;

    const score = Math.max(0, 100 - alertCount * 15);
    return { totalVolume: volume, alerts: alertCount, healthScore: score };
  }, [logs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTxStatus("idle");
    try {
      await transferFunds(form);
      setTxStatus("success");
      setForm({ from: "", to: "", amount: "" });
    } catch (err) {
      setTxStatus("error");
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Intelligence Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            System Overview
          </h2>
          <p className="text-slate-500 text-sm">
            Global protocol activity and risk assessment metrics.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/50 px-4 py-2 rounded-2xl border border-white/5">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              Protocol Health
            </span>
            <span
              className={`text-sm font-bold ${healthScore > 80 ? "text-emerald-400" : "text-amber-400"}`}
            >
              {healthScore}% Secure
            </span>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-slate-800 flex items-center justify-center relative">
            <div
              className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin-slow"
              style={{ animationDuration: "3s" }}
            />
            <ShieldCheck size={18} className="text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Daily Volume"
          value={`${totalVolume.toFixed(4)} ETH`}
          icon={TrendingUp}
          trend={12.5}
          color="blue"
          description={""}
        />
        <StatCard
          label="Security Alerts"
          value={alerts}
          icon={ShieldAlert}
          color="rose"
          trend={0.7}
          description={""}
        />
        <StatCard
          label="Throughput"
          value="1.2k tx/s"
          icon={Zap}
          color="emerald"
          trend={0.7}
          description={""}
        />
        <StatCard
          label="Audited Nodes"
          value="142"
          icon={Activity}
          color="purple"
          trend={0.7}
          description={""}
        />
      </div>

      {/* Main Interface: Transfer & Volume Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Transfer Portal Section */}
        <div className="lg:col-span-5 bg-[#1e293b] p-8 rounded-[2.5rem] border border-slate-700/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Send size={120} />
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-emerald-500/20 rounded-xl">
              <Send size={20} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-white font-bold leading-none">
                Transfer Portal
              </h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                Cross-Border Compliance
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Origin Address
              </label>
              <div className="relative">
                <Wallet
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="0x... (Sender)"
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-700"
                  value={form.from}
                  onChange={(e) => setForm({ ...form, from: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Destination Address
              </label>
              <div className="relative">
                <ArrowRight
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="0x... (Recipient)"
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-700"
                  value={form.to}
                  onChange={(e) => setForm({ ...form, to: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Asset Value (ETH)
              </label>
              <input
                type="number"
                step="0.0001"
                placeholder="0.0000"
                className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl py-4 px-5 text-sm font-mono text-emerald-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-700"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>

            {txStatus === "success" && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs flex items-center gap-3">
                <ShieldCheck size={16} />
                Protocol cleared: Transfer initiated on-chain.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full group relative flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-emerald-900/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Auditing Transaction...
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  Execute Validated Send
                </>
              )}
            </button>
          </form>
        </div>

        {/* Volume Velocity Graph (Selected Code Context) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-[#020617]/60 border border-slate-800 p-8 rounded-[2.5rem] min-h-75 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-bold text-white flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-400" />
                Volume Velocity
              </h4>
              <div className="flex gap-2">
                {["1H", "6H", "24H", "7D"].map((t) => (
                  <button
                    key={t}
                    className={`text-[10px] font-black px-3 py-1 rounded-lg border border-slate-800 ${t === "24H" ? "bg-blue-500 text-white border-blue-500" : "text-slate-500"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex items-end gap-2 px-2">
              {[40, 70, 45, 90, 65, 80, 55, 75, 60, 85, 95, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-linear-to-t from-blue-600/20 to-blue-400/40 rounded-t-sm transition-all duration-1000 hover:to-blue-400"
                  style={{ height: `${h}%`, animationDelay: `${i * 0.05}s` }}
                />
              ))}
            </div>
          </div>

          <div className="bg-slate-900/20 border border-dashed border-slate-800 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4 text-slate-500">
              <Activity size={32} />
            </div>
            <h4 className="text-white font-bold mb-2">Live Node Feed</h4>
            <p className="text-slate-500 text-xs leading-relaxed mb-6">
              Real-time validation of cross-border liquidity pools and
              sanctioned address filters.
            </p>
            <button className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors">
              View Intelligence Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
