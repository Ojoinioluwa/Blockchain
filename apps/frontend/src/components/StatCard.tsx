import {
  TrendingUp,
  TrendingDown,
  Activity,
  type LucideIcon,
} from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: number;
  description?: string;
  color?: "emerald" | "blue" | "rose" | "purple";
}

/**
 * StatCard Component
 * Remodeled for high-fidelity data visualization with glassmorphism and
 * synchronized pulse animations.
 */
const StatCard = ({
  label,
  value,
  icon: Icon = Activity,
  trend,
  description,
  color = "emerald",
}: Props) => {
  // Mapping system for semantic colors and effects
  const colorConfigs = {
    emerald: {
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      glow: "bg-emerald-500",
      shadow: "shadow-emerald-500/10",
    },
    blue: {
      text: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      glow: "bg-blue-600",
      shadow: "shadow-blue-500/10",
    },
    rose: {
      text: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      glow: "bg-rose-500",
      shadow: "shadow-rose-500/10",
    },
    purple: {
      text: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      glow: "bg-purple-500",
      shadow: "shadow-purple-500/10",
    },
  };

  const theme = colorConfigs[color];

  return (
    <div className="relative group overflow-hidden bg-slate-900/40 border border-white/5 p-6 rounded-4xl hover:bg-slate-800/60 transition-all duration-500 backdrop-blur-xl shadow-2xl">
      {/* Dynamic Background Radial Glow */}
      <div
        className={`absolute -right-4 -top-4 w-32 h-32 rounded-full blur-[60px] opacity-10 transition-opacity duration-700 group-hover:opacity-30 ${theme.glow}`}
      />

      {/* Top Row: Icon & Trend Metric */}
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div
          className={`p-3.5 rounded-2xl border ${theme.bg} ${theme.border} ${theme.text} ${theme.shadow} transition-transform group-hover:scale-110 duration-500`}
        >
          <Icon size={20} strokeWidth={2.5} />
        </div>

        {trend !== undefined && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black tracking-tighter backdrop-blur-md border ${
              trend >= 0
                ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                : "bg-rose-500/5 text-rose-400 border-rose-500/20"
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp size={12} strokeWidth={3} />
            ) : (
              <TrendingDown size={12} strokeWidth={3} />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      {/* Primary Data Display */}
      <div className="space-y-1 relative z-10">
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.25em]">
          {label}
        </p>
        <div className="flex flex-col">
          <h3 className="text-3xl font-black text-white tracking-tighter leading-none">
            {value}
          </h3>
          {description && (
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-2">
              {description}
            </span>
          )}
        </div>
      </div>

      {/* Technical Metadata Footer */}
      <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity duration-500">
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full ${theme.glow} animate-pulse`}
          />
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
            System Verified
          </span>
        </div>

        {/* Animated Data-Sync Visualizer */}
        <div className="flex items-end gap-1 h-3">
          {[0.4, 0.7, 0.2, 0.9].map((delay, i) => (
            <div
              key={i}
              className={`w-1 rounded-full ${theme.glow} opacity-40`}
              style={{
                height: `${Math.random() * 100}%`,
                animation: `pulse 1.5s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { height: 30%; opacity: 0.3; }
          50% { height: 100%; opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default StatCard;
