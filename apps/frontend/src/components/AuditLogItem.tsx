import {
  ArrowRightLeft,
  ShieldAlert,
  ShieldCheck,
  Info,
  Clock,
  ExternalLink,
} from "lucide-react";

interface Log {
  event: string;
  level: "INFO" | "WARNING" | "CRITICAL";
  sender?: string;
  receiver?: string;
  amount?: string;
  reason?: string;
  timestamp: string;
}

const AuditLogItem = (log: Log) => {
  // Configuration for status-based styling
  const statusConfig = {
    CRITICAL: {
      color: "text-rose-400",
      bg: "bg-rose-500/5",
      border: "border-rose-500/20",
      icon: ShieldAlert,
      glow: "shadow-rose-500/10",
    },
    WARNING: {
      color: "text-amber-400",
      bg: "bg-amber-500/5",
      border: "border-amber-500/20",
      icon: ShieldAlert, // Fallback to ShieldAlert for high visibility warnings
      glow: "shadow-amber-500/10",
    },
    INFO: {
      color: "text-emerald-400",
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
      p-5 rounded-2xl border transition-all duration-300
      hover:bg-slate-800/40 hover:scale-[1.01] shadow-lg
      ${config.bg} ${config.border} ${config.glow}
    `}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl bg-slate-900/50 ${config.color} border border-current/10`}
          >
            <StatusIcon size={18} />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-0.5">
              System Event
            </h4>
            <span className="text-sm font-bold text-white tracking-tight">
              {log.event.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10px]">
            <Clock size={12} />
            {new Date(log.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
          <span
            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${config.color} ${config.border}`}
          >
            {log.level}
          </span>
        </div>
      </div>

      {/* Transaction Flow */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 bg-slate-950/40 p-3 rounded-xl border border-white/5 mb-3">
        <div className="space-y-1">
          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">
            Sender
          </p>
          <p
            className="text-[11px] font-mono text-slate-300 truncate"
            title={log.sender}
          >
            {log.sender
              ? `${log.sender.slice(0, 6)}...${log.sender.slice(-4)}`
              : "SYSTEM_INTERNAL"}
          </p>
        </div>

        <div className="text-slate-600">
          <ArrowRightLeft size={14} />
        </div>

        <div className="space-y-1 text-right">
          <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">
            Receiver
          </p>
          <p
            className="text-[11px] font-mono text-slate-300 truncate"
            title={log.receiver}
          >
            {log.receiver
              ? `${log.receiver.slice(0, 6)}...${log.receiver.slice(-4)}`
              : "VOID"}
          </p>
        </div>
      </div>

      {/* Details Footer with more technical metadata */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
        <div className="flex items-center gap-6">
          {log.amount && (
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase font-bold">
                Value
              </span>
              <span className="text-xs font-bold text-emerald-400">
                {log.amount} ETH
              </span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 uppercase font-bold">
              Status
            </span>
            <div className="flex items-center gap-1 text-[10px] text-slate-300">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Verified
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-white transition-colors font-bold uppercase tracking-wider">
            Details
          </button>
          <button className="flex items-center gap-1.5 text-[10px] text-blue-400 hover:text-blue-300 transition-colors font-bold uppercase tracking-wider">
            Explorer <ExternalLink size={10} />
          </button>
        </div>
      </div>

      {/* Flag/Reason Notification */}
      {log.reason && (
        <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 relative group-hover:bg-rose-500/20 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <Info size={12} className="text-rose-400" />
            <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">
              Protocol Flag
            </span>
          </div>
          <p className="text-[11px] text-rose-200/80 leading-relaxed italic">
            {log.reason}
          </p>
        </div>
      )}
    </div>
  );
};

export default AuditLogItem;
