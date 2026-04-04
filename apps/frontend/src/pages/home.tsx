import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Eye,
  Zap,
  Server,
  ShieldAlert,
  Activity,
} from "lucide-react";

/**
 * Sentinel Home - High Fidelity Entry Portal
 * Remodeled with advanced Tailwind 4 effects and system-aware aesthetics.
 */

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* --- ADVANCED BACKGROUND ARCHITECTURE --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Dynamic Glow Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-emerald-500/10 blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[140px]" />

        {/* Cyber Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Scanning Line Animation */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-emerald-500/5 to-transparent h-[20%] w-full animate-scan pointer-events-none" />
      </div>

      {/* --- CORE INTERFACE --- */}
      <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center animate-in fade-in zoom-in duration-1000">
        {/* Security Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-12 backdrop-blur-md shadow-2xl shadow-emerald-500/10">
          <ShieldAlert size={12} className="animate-pulse" />
          System Status: Operational
        </div>

        {/* Brand Identity */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse" />
            <div className="relative bg-linear-to-b from-emerald-400 to-emerald-600 p-6 rounded-[2.5rem] shadow-2xl group cursor-crosshair">
              <ShieldCheck
                size={64}
                className="text-[#020617] group-hover:rotate-12 transition-transform duration-500"
                strokeWidth={2.5}
              />
            </div>
          </div>

          <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-none mb-6 bg-linear-to-b from-white via-white to-slate-700 bg-clip-text text-transparent italic">
            SENTINEL
          </h1>

          <p className="text-slate-400 text-lg md:text-xl font-medium tracking-tight max-w-2xl mx-auto leading-relaxed italic opacity-80">
            Next-gen AML intelligence.{" "}
            <span className="text-white">Real-time velocity monitoring</span>{" "}
            and automated mitigation for high-throughput decentralized
            protocols.
          </p>
        </div>

        {/* Feature Grid - Enhanced styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-16">
          {[
            { icon: Eye, title: "Surveillance", desc: "Real-time Monitoring" },
            { icon: Lock, title: "Compliance", desc: "Automated Whitelisting" },
            { icon: Zap, title: "Throughput", desc: "Sub-second Latency" },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative bg-slate-900/20 border border-white/5 p-6 rounded-3xl backdrop-blur-sm hover:bg-slate-800/40 hover:border-emerald-500/20 transition-all duration-500"
            >
              <div className="flex items-center gap-4 mb-2">
                <item.icon
                  size={20}
                  className="text-emerald-500 group-hover:scale-110 transition-transform"
                />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-emerald-400">
                  {item.title}
                </span>
              </div>
              <p className="text-sm font-bold text-white tracking-tight">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="flex flex-col items-center gap-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="group relative flex items-center gap-4 bg-white hover:bg-emerald-400 text-[#020617] px-12 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(16,185,129,0.1)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10 flex items-center gap-3">
              Initialize Dashboard
              <ArrowRight
                className="group-hover:translate-x-2 transition-transform"
                size={20}
              />
            </span>
          </button>

          <div className="flex items-center gap-8 py-4 px-8 rounded-full bg-slate-900/50 border border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Server size={14} className="text-slate-500" />
              <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
                Node: Alpha-1
              </span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
                Latency: 14ms
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- FOOTER ELEMENTS --- */}
      <div className="absolute bottom-10 w-full flex justify-between px-16 items-center">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">
            Encrypted Connection
          </span>
          <span className="text-[9px] font-mono text-emerald-500/50 tracking-tighter">
            AES-256-GCM ACTIVE
          </span>
        </div>
        <div className="h-px flex-1 mx-12 bg-linear-to-r from-transparent via-white/5 to-transparent" />
        <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">
          Sentinel Protocol v1.0.4-LTS
        </span>
      </div>
    </div>
  );
};

export default Home;
