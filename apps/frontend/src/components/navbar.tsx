import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  Send,
  History,
  ShieldCheck,
  Bell,
  Search,
  Command,
  ChevronDown,
} from "lucide-react";

/**
 * Sentinel Navbar - High-Fidelity Protocol Navigation
 * Features adaptive active states and integrated system utilities.
 */

const Navbar = () => {
  const linkClass =
    "group flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.12em] transition-all duration-300 border border-transparent";

  let isActive;

  const navItems = [
    {
      to: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      activeColor:
        "text-emerald-400 bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]",
    },
    {
      to: "/dashboard/onboarding",
      label: "Onboarding",
      icon: UserPlus,
      activeColor:
        "text-blue-400 bg-blue-500/5 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.05)]",
    },
    {
      to: "/dashboard/transfer",
      label: "Transfer",
      icon: Send,
      activeColor:
        "text-purple-400 bg-purple-500/5 border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.05)]",
    },
    {
      to: "/dashboard/audit",
      label: "Audit",
      icon: History,
      activeColor:
        "text-rose-400 bg-rose-500/5 border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.05)]",
    },
    {
      to: "/dashboard/blacklist",
      label: "Blacklist",
      icon: History,
      activeColor:
        "text-red-400 bg-red-500/5 border-red-500/20 shadow-[0_0_20px_rgba(244,63,94,0.05)]",
    },
    {
      to: "/dashboard/sanctioned",
      label: "Sanctioned",
      icon: History,
      activeColor:
        "text-green-400 bg-green-500/5 border-green-500/20 shadow-[0_0_20px_rgba(244,63,94,0.05)]",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#020617]/70 backdrop-blur-2xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
      {/* --- BRAND IDENTITY --- */}
      <div className="flex items-center gap-4 pr-10 border-r border-white/5">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 animate-pulse" />
          <div className="relative bg-emerald-500 p-2 rounded-xl shadow-2xl shadow-emerald-500/20">
            <ShieldCheck className="text-[#020617]" size={20} strokeWidth={3} />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-black text-xl tracking-[-0.05em] text-white leading-none">
            SENTINEL
          </span>
          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.3em] mt-1">
            Core Protocol
          </span>
        </div>
      </div>

      {/* --- CENTRAL NAVIGATION --- */}
      <div className="flex flex-1 items-center justify-center gap-3 px-10">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? item.activeColor
                  : "text-slate-500 hover:text-slate-200 hover:bg-white/5 hover:border-white/10"
              }`
            }
          >
            <item.icon
              size={14}
              strokeWidth={isActive ? 3 : 2.5}
              className="group-hover:scale-110 transition-transform"
            />
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* --- SYSTEM UTILITIES --- */}
      <div className="flex items-center gap-6 pl-10 border-l border-white/5">
        {/* Global Forensic Search */}
        <div className="relative group hidden xl:block">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            <Search
              className="text-slate-600 group-focus-within:text-emerald-400 transition-colors"
              size={14}
            />
          </div>
          <input
            placeholder="Search Intelligence..."
            className="bg-slate-900/40 border border-white/5 rounded-2xl py-2.5 pl-12 pr-12 text-[11px] font-medium w-48 focus:w-72 transition-all duration-500 outline-none focus:border-emerald-500/30 focus:bg-slate-900/80 text-slate-200 placeholder:text-slate-600"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[9px] font-black text-slate-500 flex items-center gap-1">
            <Command size={8} /> K
          </div>
        </div>

        {/* Notifications */}
        <button
          title="Bell"
          className="relative p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
        >
          <Bell
            size={20}
            className="text-slate-500 group-hover:text-white transition-colors"
          />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-600 rounded-full border-2 border-[#020617] animate-pulse" />
        </button>

        {/* User Session Profile */}
        <div className="flex items-center gap-3 bg-slate-900/60 p-1.5 pr-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative w-8 h-8 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-xs text-white shadow-inner">
              AD
            </div>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-black text-white tracking-tight leading-none flex items-center gap-1">
              Admin_01
              <ChevronDown size={10} className="text-slate-500" />
            </span>
            <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-1">
              Superuser
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
