import {
  ArrowRightLeft,
  ShieldAlert,
  ShieldCheck,
  Info,
  Clock,
  ChevronRight,
  Database,
} from "lucide-react";

// 1. Updated interface to match your Mongoose Schema exactly
interface LogProps {
  log: {
    _id?: string;
    event: string;
    level: "INFO" | "WARNING" | "CRITICAL";
    sender: string;
    receiver: string;
    amount: string;
    reason: string | null;
    timestamp: string | Date;
    metadata?: any;
  };
}

const AuditLogItem = ({ log }: LogProps) => {
  const statusConfig = {
    CRITICAL: {
      color: "text-rose-400",
      accent: "bg-rose-500",
      bg: "bg-rose-500/5",
      border: "border-rose-500/20",
      icon: ShieldAlert,
      glow: "shadow-rose-500/10",
    },
    WARNING: {
      color: "text-amber-400",
      accent: "bg-amber-500",
      bg: "bg-amber-500/5",
      border: "border-amber-500/20",
      icon: ShieldAlert,
      glow: "shadow-amber-500/10",
    },
    INFO: {
      color: "text-emerald-400",
      accent: "bg-emerald-500",
      bg: "bg-emerald-500/5",
      border: "border-emerald-500/20",
      icon: ShieldCheck,
      glow: "shadow-emerald-500/10",
    },
  };

  const config = statusConfig[log.level] || statusConfig.INFO;
  const StatusIcon = config.icon;

  return (
    <div
      className={`
        group relative overflow-hidden
        p-6 rounded-4xl border transition-all duration-500
        hover:bg-slate-800/40 hover:border-white/10 shadow-2xl
        ${config.bg} ${config.border} ${config.glow}
      `}
    >
      <div
        className={`absolute top-0 left-0 w-1 h-full ${config.accent} opacity-40`}
      />

      {/* --- HEADER --- */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-xl bg-slate-900/80 ${config.color} border border-white/5 shadow-inner`}
          >
            <StatusIcon size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">
                Protocol Event
              </span>
              <div
                className={`w-1 h-1 rounded-full ${config.accent} animate-pulse`}
              />
            </div>
            <h4 className="text-sm font-black text-white tracking-tight uppercase font-mono">
              {/* FIX: Render the event name from the schema */}
              {log.event.replace(/_/g, " ")}
            </h4>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 rounded-lg border border-white/5 text-slate-400 font-mono text-[10px]">
            <Clock size={12} className="text-slate-600" />
            {new Date(log.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
          <span
            className={`text-[8px] font-black tracking-widest px-2.5 py-0.5 rounded-md border uppercase ${config.color} ${config.border} bg-white/5`}
          >
            {log.level}
          </span>
        </div>
      </div>

      {/* --- DATA RIBBON --- */}
      <div className="relative mb-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 bg-[#020617]/60 p-4 rounded-2xl border border-white/5 relative z-10 backdrop-blur-sm">
          <div className="space-y-1.5">
            <p className="text-[8px] text-slate-600 uppercase font-black tracking-widest">
              Origin
            </p>
            <p className="text-[11px] font-mono font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
              {log.sender ? `${log.sender.slice(0, 8)}...` : "SYSTEM"}
            </p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="p-1.5 bg-slate-800 rounded-lg text-slate-500 group-hover:text-white transition-colors">
              <ArrowRightLeft size={14} />
            </div>
          </div>

          <div className="space-y-1.5 text-right">
            <p className="text-[8px] text-slate-600 uppercase font-black tracking-widest">
              Destination
            </p>
            <p className="text-[11px] font-mono font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
              {log.receiver ? `${log.receiver.slice(0, 8)}...` : "SYSTEM"}
            </p>
          </div>
        </div>
      </div>

      {/* --- METADATA FOOTER --- */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-8">
          {/* amount from schema defaults to "0.00" so it should always exist */}
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-600 uppercase font-black tracking-widest">
              Value
            </span>
            <span className="text-xs font-black text-emerald-400 flex items-center gap-1 mt-0.5 font-mono">
              {log.amount}{" "}
              <span className="text-[10px] opacity-60 uppercase">ETH</span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[8px] text-slate-600 uppercase font-black tracking-widest">
              Sync
            </span>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-300 mt-1">
              <Database size={10} className="text-emerald-500" />
              BLOCK_SYNC
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] text-slate-400 hover:text-white transition-all font-black uppercase tracking-widest border border-white/5 group/btn">
            Detail
            <ChevronRight
              size={10}
              className="group-hover/btn:translate-x-0.5 transition-transform"
            />
          </button>
        </div>
      </div>

      {/* --- REASON FLAG (From Schema: reason) --- */}
      {log.reason && (
        <div className="mt-5 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 relative overflow-hidden group-hover:bg-rose-500/10 transition-colors">
          <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-rose-500/40 to-transparent" />
          <div className="flex items-center gap-3 mb-2">
            <div className="p-1.5 bg-rose-500/20 rounded-lg">
              <Info size={14} className="text-rose-400" />
            </div>
            <span className="text-[9px] font-black text-rose-400 uppercase tracking-[0.2em]">
              Intervention Trace
            </span>
          </div>
          <p className="text-[11px] text-rose-100/70 leading-relaxed font-medium italic">
            {log.reason}
          </p>
        </div>
      )}
    </div>
  );
};

export default AuditLogItem;
