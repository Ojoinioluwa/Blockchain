import { useMemo } from "react";
import {
  TrendingUp,
  ShieldAlert,
  Activity,
  Zap,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import StatCard from "../components/StatCard";
import { useLogs } from "../hooks/useLogs";

const Overview = () => {
  const logs = useLogs();

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

    // Derived health score logic
    const score = Math.max(0, 100 - alertCount * 15);

    return { totalVolume: volume, alerts: alertCount, healthScore: score };
  }, [logs]);

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
          description={""}
          trend={0.7}
        />
        <StatCard
          label="Throughput"
          value="1.2k tx/s"
          icon={Zap}
          color="emerald"
          description={""}
          trend={0.7}
        />
        <StatCard
          label="Audited Nodes"
          value="142"
          icon={Activity}
          color="purple"
          description={""}
          trend={0.7}
        />
      </div>

      {/* Sub-Visualizations Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#020617]/60 border border-slate-800 p-8 rounded-[2.5rem] min-h-75 flex flex-col justify-between">
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

          {/* Visual Placeholder for Graph */}
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
            Real-time validation of cross-border liquidity pools and sanctioned
            address filters.
          </p>
          <button className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors">
            View Intelligence Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
