import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";

/**
 * DashboardLayout - Structural Remodel
 * Fixed the width constraints and polished the ambient background layers.
 */
const DashboardLayout = () => {
  return (
    // Ensure the container spans the full viewport height and width
    <div className="min-h-screen w-full bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* --- BACKGROUND AMBIENT LAYER --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top Left Glow */}
        <div
          className="absolute -top-[10%] -left-[5%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        {/* Bottom Right Glow */}
        <div
          className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] animate-pulse"
          style={{ animationDuration: "12s" }}
        />
        {/* Subtle Center Grid (Optional for 'Security' look) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* --- NAVIGATION --- */}
      <Navbar />

      {/* --- MAIN CONTENT AREA --- */}
      {/* FIXED: Changed max-w-400 to max-w-screen-2xl 
          Added w-full to ensure it expands.
      */}
      <main className="relative z-10 p-6 md:p-8 lg:p-10 w-full  mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700 pb-24">
        <Outlet />
      </main>

      {/* --- GLOBAL STATUS BAR --- */}
      <footer className="fixed bottom-0 w-full px-8 py-3 border-t border-white/5 bg-[#020617]/80 backdrop-blur-xl flex flex-col md:flex-row justify-between items-center z-50 gap-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
            <span className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">
              Node Status: Online
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-slate-600 font-mono text-[9px] border-l border-white/10 pl-6">
            <span className="text-emerald-500/50">ID:</span>
            SENTINEL-UX-REMODEL-2026
          </div>
        </div>

        <div className="text-slate-500 font-bold text-[9px] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
          © 2026 Sentinel Compliance Protocol // v1.0.4-STABLE
        </div>
      </footer>

      {/* Scrollbar Customization */}
      <style>{`
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #10b981; }
        
        /* Ensure smooth scrolling for the whole app */
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
