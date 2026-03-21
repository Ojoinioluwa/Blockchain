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

const StatCard = ({
  label,
  value,
  icon: Icon = Activity,
  trend,
  description,
  color = "emerald",
}: Props) => {
  const colorMap = {
    emerald:
      "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-rose-500/5",
    purple:
      "text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-purple-500/5",
  };

  const selectedColor = colorMap[color];

  return (
    <div className="relative group overflow-hidden bg-slate-800/40 border border-slate-700/50 p-6 rounded-4xl hover:bg-slate-800/60 transition-all duration-300 shadow-xl">
      {/* Decorative background glow */}
      <div
        className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-[50px] opacity-20 transition-opacity group-hover:opacity-40 ${selectedColor.split(" ")[0].replace("text", "bg")}`}
      />

      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl border ${selectedColor}`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>

        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-tight ${
              trend >= 0
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}
          >
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div className="space-y-1 relative z-10">
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.15em]">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold text-white tracking-tight">
            {value}
          </h3>
          {description && (
            <span className="text-[10px] text-slate-500 font-medium lowercase italic">
              / {description}
            </span>
          )}
        </div>
      </div>

      {/* Interactive bottom bar */}
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
          Real-time Data
        </span>
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-1 h-3 rounded-full animate-pulse ${selectedColor.split(" ")[0].replace("text", "bg")}`}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
