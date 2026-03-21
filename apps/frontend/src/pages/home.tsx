import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, Lock, Eye, Zap } from "lucide-react";

/**
 * Home Component
 * The high-fidelity landing page for the Sentinel AML Platform.
 * Features:
 * - Animated entry
 * - Feature highlights
 * - Direct navigation to the main dashboard
 */

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 w-full max-w-4xl px-6 text-center animate-in fade-in zoom-in duration-1000">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="bg-emerald-500 p-4 rounded-3xl shadow-2xl shadow-emerald-500/20 mb-6 group hover:scale-110 transition-transform duration-500">
            <ShieldCheck size={48} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 bg-linear-to-b from-white to-slate-500 bg-clip-text text-transparent">
            SENTINEL
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium tracking-wide max-w-2xl mx-auto leading-relaxed">
            The next generation of Anti-Money Laundering protocol. Real-time
            velocity monitoring and automated risk mitigation for the
            decentralized economy.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: Eye, text: "Real-time Monitoring" },
            { icon: Lock, text: "Automated Compliance" },
            { icon: Zap, text: "Sub-second Latency" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-center gap-3 bg-slate-900/40 border border-slate-800 p-4 rounded-2xl"
            >
              <item.icon size={18} className="text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="group relative flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-[#020617] px-10 py-5 rounded-full font-black text-lg tracking-tight transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20"
          >
            Enter Dashboard
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center gap-2 text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Security Protocol Active
          </div>
        </div>
      </div>

      {/* Global Status Footer */}
      <div className="absolute bottom-8 w-full flex justify-between px-12 items-center opacity-30">
        <span className="text-[10px] font-mono tracking-widest uppercase">
          Node: 127.0.0.1
        </span>
        <span className="text-[10px] font-mono tracking-widest uppercase">
          v1.0.0-PRO
        </span>
      </div>
    </div>
  );
};

export default Home;
