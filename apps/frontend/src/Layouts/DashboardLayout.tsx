import { Outlet } from "react-router-dom";
import {
  ShieldCheck,
  Bell,
  Search,
  LayoutDashboard,
  UserPlus,
  Send,
  History,
} from "lucide-react";
import { NavLink } from "react-router-dom";

/**
 * Inline Navbar Component
 * Integrated directly to ensure build stability within the preview environment.
 */
const Navbar = () => {
  const linkClass =
    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 border border-transparent";
  const navItems = [
    {
      to: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      activeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      to: "/dashboard/onboarding",
      label: "Onboarding",
      icon: UserPlus,
      activeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      to: "/dashboard/transfer",
      label: "Transfer",
      icon: Send,
      activeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      to: "/dashboard/audit",
      label: "Audit",
      icon: History,
      activeColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/60 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 pr-8 border-r border-slate-800/60">
        <div className="bg-emerald-500 p-1.5 rounded-lg shadow-lg shadow-emerald-500/20">
          <ShieldCheck className="text-white" size={20} />
        </div>
        <span className="font-black text-lg tracking-tighter text-white">
          SENTINEL
        </span>
      </div>

      <div className="flex flex-1 items-center gap-2 px-8">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? item.activeColor : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/40"}`
            }
          >
            <item.icon size={16} strokeWidth={2.5} />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-5 pl-8 border-l border-slate-800/60">
        <div className="relative group hidden lg:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={14}
          />
          <input
            placeholder="Search hash..."
            className="bg-slate-900/50 border border-slate-800 rounded-full py-1.5 pl-9 pr-4 text-xs w-48 outline-none focus:border-emerald-500/50"
          />
        </div>
        <button
          title="Bell"
          className="relative text-slate-400 hover:text-white"
        >
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#020617]" />
        </button>
      </div>
    </nav>
  );
};

/**
 * DashboardLayout
 * Provides the structural wrapper for all Sentinel AML protected routes.
 */
const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500/30">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 p-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
        <Outlet />
      </main>

      {/* Global Footer / System Status Bar */}
      <footer className="fixed bottom-0 w-full px-8 py-2 border-t border-white/5 bg-[#020617]/50 backdrop-blur-md flex justify-between items-center z-50 text-[10px]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-500 uppercase tracking-widest">
              Gateway: Online
            </span>
          </div>
          <span className="text-slate-700 font-mono italic">
            SECURE_CHANNEL_ACTIVE
          </span>
        </div>
        <div className="text-slate-600 font-medium">
          © 2025 Sentinel Compliance Protocol. Node: v1.0.0-PRO
        </div>
      </footer>

      {/* Scrollbar Styling */}
      <style>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
