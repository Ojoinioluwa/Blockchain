import { useState, useMemo } from "react";
import {
  Search,
  Download,
  RefreshCcw,
  Filter,
  ChevronDown,
  Terminal,
  Database,
} from "lucide-react";
import AuditLogItem from "../components/AuditLogItem";
import { useAuditLogs } from "../hooks/useSentinel"; // Swapped to our new hook

const Audit = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("ALL");

  // 1. Integrated Hook: Passing filters directly to the backend
  // We use 'level' if it's not 'ALL', otherwise we pass undefined
  const {
    data: logResponse,
    isLoading,
    isFetching,
  } = useAuditLogs({
    event: searchTerm,
    level: filterLevel === "ALL" ? undefined : filterLevel,
  });

  console.log(logResponse);
  const stats = useMemo(() => {
    // Define logs safely inside the memo
    const logsArray = logResponse?.data || [];

    return {
      total: logResponse?.total || 0,
      critical: logsArray.filter(
        (l: { level: string }) => l.level === "CRITICAL",
      ).length,
      warning: logsArray.filter((l: { level: string }) => l.level === "WARNING")
        .length,
      info: logsArray.filter((l: { level: string }) => l.level === "INFO")
        .length,
      data: logsArray,
    };
  }, [logResponse]); // Only depend on the raw response from the hook

  return (
    <div className="space-y-6 animate-in fade-in duration-1000">
      {/* --- FORENSIC HEADER --- */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <Terminal size={20} className="text-emerald-400" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
                Audit Intelligence
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-lg leading-relaxed font-medium">
              Forensic record of all protocol interactions. Every event is
              synced between the{" "}
              <span className="text-blue-400 font-mono text-xs">
                Sentinel MongoDB
              </span>{" "}
              and the{" "}
              <span className="text-emerald-400 font-mono text-xs">
                On-Chain Registry
              </span>
              .
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${isFetching ? "bg-blue-500 animate-ping" : "bg-emerald-500 animate-pulse"}`}
              />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {isFetching ? "Syncing Feed..." : "Live Feed Active"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Database size={12} className="text-slate-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Node: v1.0.4-STABLE
              </span>
            </div>
          </div>
        </div>

        {/* Severity Heatmap Stats */}
        <div className="grid grid-cols-2 gap-4 sm:w-full xl:w-96">
          {[
            {
              label: "Total Events",
              value: stats.total,
              color: "blue",
              bg: "bg-blue-500/5",
              border: "border-blue-500/10",
            },
            {
              label: "Critical",
              value: stats.critical,
              color: "rose",
              bg: "bg-rose-500/5",
              border: "border-rose-500/10",
            },
            {
              label: "Warnings",
              value: stats.warning,
              color: "amber",
              bg: "bg-amber-500/5",
              border: "border-amber-500/10",
            },
            {
              label: "Info",
              value: stats.info,
              color: "emerald",
              bg: "bg-emerald-500/5",
              border: "border-emerald-500/10",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`${stat.bg} ${stat.border} border p-5 rounded-3xl flex flex-col justify-between transition-all hover:bg-white/2`}
            >
              <span
                className={`text-[9px] font-black uppercase tracking-[0.2em] text-${stat.color}-500`}
              >
                {stat.label}
              </span>
              <span className="text-3xl font-black text-white mt-2">
                {isLoading ? "---" : stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- COMMAND BAR --- */}
      <div className="flex flex-col lg:flex-row items-center gap-4 bg-[#020617] p-3 rounded-4xl border border-white/5 shadow-2xl">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by Event (e.g. TRANSFER_BLOCKED)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-500/30 transition-all font-mono"
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative group w-full lg:w-48">
            <Filter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={14}
            />
            <select
              title="filter"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-10 pr-10 text-[11px] font-black uppercase tracking-widest text-slate-400 outline-none appearance-none cursor-pointer focus:border-emerald-500/30"
            >
              <option value="ALL">All Severities</option>
              <option value="INFO">Information</option>
              <option value="WARNING">Warnings</option>
              <option value="CRITICAL">Critical</option>
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
              size={14}
            />
          </div>

          <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-emerald-400 text-[#020617] font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/5 shrink-0 group">
            <Download
              size={16}
              className="group-hover:-translate-y-0.5 transition-transform"
            />
            Export
          </button>
        </div>
      </div>

      {/* --- INTELLIGENCE GRID --- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {isLoading ? (
          // Skeleton Loading State
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 w-full bg-white/5 rounded-3xl animate-pulse border border-white/5"
            />
          ))
        ) : stats.data.length > 0 ? (
          stats.data.map((log: any, i: number) => (
            <div
              key={log._id || i}
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <AuditLogItem log={log} />
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 flex flex-col items-center justify-center bg-slate-900/10 rounded-[3rem] border border-dashed border-white/10">
            <RefreshCcw
              className="text-slate-700 animate-spin-slow mb-6"
              size={48}
            />
            <h3 className="text-xl font-bold text-slate-500 italic">
              No Matching Records
            </h3>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterLevel("ALL");
              }}
              className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 hover:text-emerald-300"
            >
              Reset Protocol Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Audit;
