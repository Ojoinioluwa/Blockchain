import { useState, useMemo } from "react";
import { Search, Download, RefreshCcw, Calendar } from "lucide-react";
import AuditLogItem from "../components/AuditLogItem";
import { useLogs } from "../hooks/useLogs";

const Audit = () => {
  const logs = useLogs();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("ALL");

  // Statistics for the header
  const stats = useMemo(
    () => ({
      total: logs.length,
      critical: logs.filter((l) => l.level === "CRITICAL").length,
      warning: logs.filter((l) => l.level === "WARNING").length,
    }),
    [logs],
  );

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.sender?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === "ALL" || log.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Page Header & Stats Summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-slate-800/20 p-8 rounded-[2.5rem] border border-slate-700/50 backdrop-blur-sm">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            System Audit Log
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono animate-pulse">
              Live
            </span>
          </h2>
          <p className="text-slate-500 text-sm max-w-md leading-relaxed">
            Comprehensive immutable record of all protocol interactions, risk
            assessments, and administrative actions.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="px-6 py-3 bg-slate-900/50 rounded-2xl border border-white/5 text-center">
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">
              Total Events
            </p>
            <p className="text-xl font-bold text-white leading-none">
              {stats.total}
            </p>
          </div>
          <div className="px-6 py-3 bg-rose-500/5 rounded-2xl border border-rose-500/10 text-center">
            <p className="text-[9px] text-rose-500 uppercase font-black tracking-widest mb-1">
              Critical
            </p>
            <p className="text-xl font-bold text-rose-400 leading-none">
              {stats.critical}
            </p>
          </div>
          <div className="px-6 py-3 bg-amber-500/5 rounded-2xl border border-amber-500/10 text-center">
            <p className="text-[9px] text-amber-500 uppercase font-black tracking-widest mb-1">
              Warnings
            </p>
            <p className="text-xl font-bold text-amber-400 leading-none">
              {stats.warning}
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#020617]/40 p-2 rounded-3xl border border-slate-800/60">
        <div className="flex items-center gap-2 flex-1 min-w-75">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by Event, Address, or Reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:border-emerald-500/40 transition-all text-slate-200 placeholder:text-slate-600"
            />
          </div>
          <button className="p-3 bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-colors">
            <Calendar size={18} />
            calender
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterLevel}
            title="filter"
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-slate-900/40 border border-slate-800 rounded-2xl py-3 px-4 text-sm text-slate-400 outline-none focus:border-emerald-500/40 appearance-none min-w-35"
          >
            <option value="ALL">All Severities</option>
            <option value="INFO">Information</option>
            <option value="WARNING">Warnings</option>
            <option value="CRITICAL">Critical</option>
          </select>

          <div className="h-8 w-px bg-slate-800 mx-2 hidden sm:block" />

          <button className="flex items-center gap-2 px-5 py-3 bg-emerald-500 text-white font-bold text-xs rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10">
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log, i) => (
            <div
              key={i}
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <AuditLogItem log={log} />
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-slate-900/20 rounded-[2.5rem] border border-dashed border-slate-800">
            <RefreshCcw
              className="mx-auto text-slate-700 mb-4 animate-spin-slow"
              size={40}
            />
            <h3 className="text-slate-400 font-bold">No Records Found</h3>
            <p className="text-slate-600 text-sm">
              Adjust your filters or search terms to see more events.
            </p>
          </div>
        )}
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Audit;
