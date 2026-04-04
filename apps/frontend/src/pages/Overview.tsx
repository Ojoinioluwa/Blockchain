import { useMemo } from "react";
import {
  TrendingUp,
  ShieldAlert,
  Activity,
  Zap,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import StatCard from "../components/StatCard";
import { useAuditLogs, useBlacklist, useSanctions } from "../hooks/useSentinel";

// Topology URL for the world map
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const Overview = () => {
  const { data: logData, isLoading: logsLoading } = useAuditLogs();
  const { data: blacklistData } = useBlacklist();
  const { data: sanctionsData } = useSanctions();

  const logs = logData?.data || [];
  const blacklistCount = blacklistData?.total || 0;
  const sanctionsCount = sanctionsData?.total || 0;

  // 2. Logic to map colors AND markers to countries based on Sanctions DB
  const sanctionedIntel = useMemo(() => {
    const map: Record<string, string> = {};
    const markers: any[] = [];

    sanctionsData?.data?.forEach(
      (s: {
        country: string;
        riskLevel: string;
        coordinates: [number, number];
      }) => {
        // Normalize to uppercase for map fill matching
        const countryUpper = s.country.toUpperCase();
        map[countryUpper] = s.riskLevel;

        // Add coordinates (if available in your data) for map markers
        if (s.coordinates) {
          markers.push({
            name: s.country,
            coordinates: s.coordinates, // Expecting [longitude, latitude]
            risk: s.riskLevel,
          });
        }
      },
    );
    return { fills: map, markers };
  }, [sanctionsData]);

  const { totalVolume, alerts } = useMemo(() => {
    const volume = logs
      .filter((l: { event: string }) => l.event === "TRANSACTION_SETTLED")
      .reduce(
        (acc: number, curr: any) => acc + parseFloat(curr.amount || "0"),
        0,
      );

    const criticalCount = logs.filter(
      (l: { level: string }) => l.level === "CRITICAL",
    ).length;
    const warningCount = logs.filter(
      (l: { level: string }) => l.level === "WARNING",
    ).length;

    const baseHealth = 100;
    const penalty =
      criticalCount * 15 + warningCount * 5 + blacklistCount * 0.5;
    const score = Math.max(5, baseHealth - penalty);

    return {
      totalVolume: volume,
      alerts: criticalCount + warningCount,
      healthScore: Math.round(score),
      dailyTrend: logs.length > 0 ? 12.5 : 0,
    };
  }, [logs, blacklistCount]);

  {
    /* 1. Add this inside your useMemo where you calculate totalVolume and alerts */
  }
  const alertChartData = useMemo(() => {
    // We want to create 8 "buckets" to show a trend over the last logs
    const buckets = 8;
    const logsPerBucket = Math.max(1, Math.ceil(logs.length / buckets));

    return Array.from({ length: buckets }).map((_, i) => {
      const start = i * logsPerBucket;
      const end = start + logsPerBucket;
      const bucketLogs = logs.slice(start, end);

      const counts = {
        critical: bucketLogs.filter(
          (l: { level: string }) => l.level === "CRITICAL",
        ).length,
        warning: bucketLogs.filter(
          (l: { level: string }) => l.level === "WARNING",
        ).length,
        info: bucketLogs.filter((l: { level: string }) => l.level === "INFO")
          .length,
      };

      const total = counts.critical + counts.warning + counts.info || 1; // avoid div by zero

      // Convert to percentages for the stacked bar height
      return {
        c: (counts.critical / total) * 100,
        w: (counts.warning / total) * 100,
        i: (counts.info / total) * 100,
        raw: counts, // keeping raw counts for tooltips if needed
      };
    });
  }, [logs]);

  if (logsLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 bg-[#020617]">
        <div className="relative">
          <Loader2
            className="animate-spin text-cyan-500"
            size={60}
            strokeWidth={1.5}
          />
          <div className="absolute inset-0 rounded-full blur-xl bg-cyan-600/30"></div>
        </div>
        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] ml-1">
          Syncing Neural Grid...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 p-2">
      {/* <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-2xl shadow-2xl relative overflow-hidden group"> */}
      <div className="absolute inset-0 bg-linear-to-br from-cyan-950/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>
      {/* <div className="relative z-10 space-y-2">
          <h2 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4 uppercase">
            Protocol Overview
            <span
              className={`h-3 w-3 rounded-full animate-pulse shadow-lg ${healthScore > 70 ? "bg-emerald-500 shadow-emerald-500/50" : "bg-rose-500 shadow-rose-500/50"}`}
            />
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Node:{" "}
            <span className="text-cyan-400 font-bold tracking-tight">
              Sentinel//Mainnet-01
            </span>
          </p>
        </div> */}
      {/* <div className="flex items-center gap-6 relative z-10">
          <div className="hidden lg:flex items-center gap-5 px-6 py-4 bg-slate-950/80 rounded-2xl border border-white/5 shadow-inner">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                Audit Stream
              </p>
              <p className="text-sm font-bold text-white font-mono">
                {logs.length.toLocaleString()}{" "}
                <span className="text-xs text-slate-500">ev</span>
              </p>
            </div>
            <Cpu size={22} className="text-cyan-400" />
          </div>
          <div
            className={`flex items-center gap-5 px-7 py-4 rounded-2xl border backdrop-blur-xl ${healthScore > 80 ? "bg-emerald-950/20 border-emerald-500/30" : "bg-rose-950/20 border-rose-500/30"}`}
          >
            <span
              className={`text-3xl font-black ${healthScore > 80 ? "text-emerald-400" : "text-rose-400"}`}
            >
              {healthScore}
              <span className="text-xl">%</span>
            </span>
            <ShieldCheck
              size={28}
              className={
                healthScore > 80 ? "text-emerald-500" : "text-rose-500"
              }
            />
          </div>
        </div> */}
      {/* </div> */}

      {/* --- ANALYTICS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Settled Volume"
          value={`${totalVolume.toFixed(2)} ETH`}
          icon={TrendingUp}
          color="blue"
          description="Total compliant transfers"
        />
        <StatCard
          label="Risk Factors"
          value={alerts}
          icon={ShieldAlert}
          color="rose"
          description="Flags detected by engine"
        />
        <StatCard
          label="Blacklisted Addresses"
          value={blacklistCount}
          icon={Zap}
          color="emerald"
          description="Total denied entities"
        />
        <StatCard
          label="Sanctioned States"
          value={sanctionsCount}
          icon={Activity}
          color="purple"
          description="Restricted jurisdictions"
        />
      </div>

      {/* --- VISUAL INTELLIGENCE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- SECURITY THREAT DENSITY (Enhanced depth) --- */}
        {/* --- 2. UPDATED UI COMPONENT --- */}
        <div className="lg:col-span-8 bg-[#020617] border border-white/5 p-10 rounded-[3rem] shadow-3xl relative overflow-hidden group hover:border-cyan-900/50 transition-colors">
          <div className="absolute inset-0 bg-linear-to-t from-cyan-950/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-14 relative z-10">
            <div>
              <h4 className="font-bold text-white text-xl flex items-center gap-3 uppercase tracking-tighter">
                <div className="p-2.5 bg-rose-500/10 rounded-xl border border-rose-500/20">
                  <ShieldAlert size={20} className="text-rose-400" />
                </div>
                Threat Propagation Density
              </h4>
              <p className="text-[11px] text-slate-500 uppercase tracking-[0.2em] mt-1.5 font-black">
                Dynamic Alert level distribution
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between gap-3 h-64 px-4 relative z-10">
            {alertChartData.map((data, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col justify-end gap-1 group/bar relative h-full"
              >
                {/* Critical Layer (Red) */}
                <div
                  className="w-full bg-linear-to-b from-rose-400 to-rose-600 rounded-t-sm transition-all duration-500 group-hover/bar:brightness-110 shadow-lg"
                  style={{ height: `${data.c}%` }}
                />
                {/* Warning Layer (Amber) */}
                <div
                  className="w-full bg-linear-to-b from-amber-400/80 to-amber-600/80 transition-all duration-500 group-hover/bar:brightness-110 shadow-lg"
                  style={{ height: `${data.w}%` }}
                />
                {/* Informational Layer (Blue) */}
                <div
                  className="w-full bg-linear-to-b from-blue-400/40 to-blue-600/40 rounded-b-xl transition-all duration-500 group-hover/bar:brightness-110 shadow-lg"
                  style={{ height: `${data.i}%` }}
                />

                {/* Hover label showing total in bucket */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-[8px] px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity text-white border border-white/10 whitespace-nowrap z-20">
                  BATCH {idx + 1}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-8 border-t border-white/5 pt-8 relative z-10">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-md shadow-rose-500/40" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Critical
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-md shadow-amber-400/40" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Warning
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500/60 shadow-md shadow-blue-500/40" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Informational
              </span>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC WORLD MAP (Added markers & Pulse) --- */}
        <div className="lg:col-span-4 bg-[#020617] border border-white/5 p-10 rounded-[3rem] shadow-3xl relative overflow-hidden group hover:border-emerald-900/50 transition-colors">
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
              <h4 className="text-white text-xl font-black uppercase tracking-tight">
                Geopolitical Surface
              </h4>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1.5">
                Neural Sanction Sync
              </p>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-950 rounded-xl border border-white/5 shadow-inner">
              <AlertTriangle size={16} className="text-rose-500" />
              <span className="text-[10px] text-rose-400 uppercase font-black">
                {sanctionsCount} Active blocks
              </span>
            </div>
          </div>

          <div className="w-full h-80 relative z-0">
            <ComposableMap
              projectionConfig={{ scale: 170, rotate: [-10, 0, 0] }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryName = geo.properties.name.toUpperCase();
                    const risk = sanctionedIntel.fills[countryName];
                    let fillColor = "#141b2e"; // Default darker, high-tech slate
                    if (risk === "CRITICAL" || risk === "HIGH")
                      fillColor = "#881337"; // rose-900 (Deep Red)
                    else if (risk === "WARNING" || risk === "MEDIUM")
                      fillColor = "#78350f"; // amber-900 (Deep Orange)
                    else fillColor = "#064e3b"; // emerald-950 (Deep Green)

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: {
                            fill: fillColor,
                            outline: "none",
                            stroke: "#020617",
                            strokeWidth: 0.7,
                          },
                          hover: {
                            fill: "#1d4ed8",
                            outline: "none",
                            cursor: "pointer",
                          }, // Blue
                        }}
                      />
                    );
                  })
                }
              </Geographies>

              {/* --- PULSING MARKERS --- */}
              {sanctionedIntel.markers.map(({ name, coordinates, risk }) => (
                <Marker key={name} coordinates={coordinates}>
                  {/* The Inner static dot */}
                  <circle
                    r={2.5}
                    fill={risk === "CRITICAL" ? "#f43f5e" : "#f59e0b"}
                  />
                  {/* The outer pulsing ring */}
                  <circle
                    r={2.5}
                    fill={risk === "CRITICAL" ? "#f43f5e" : "#f59e0b"}
                    className="animate-ping opacity-60"
                  />
                </Marker>
              ))}
            </ComposableMap>

            {/* Map Legend */}
            <div className="absolute -bottom-2 -left-2 p-4 bg-slate-950/80 backdrop-blur-sm rounded-xl border border-white/5 flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-rose-500 rounded-full" />{" "}
                <span className="text-[9px] text-slate-400 uppercase font-bold">
                  Total Block
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />{" "}
                <span className="text-[9px] text-slate-400 uppercase font-bold">
                  Compliant
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Slowly spinning border style for the integrity card
const integrityPulseStyle = `
@keyframes integrity-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: integrity-spin 8s linear infinite;
}
`;

const SentinelOverview = () => {
  return (
    <>
      <style>{integrityPulseStyle}</style>
      <Overview />
    </>
  );
};

export default SentinelOverview;
