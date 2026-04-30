import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  Send,
  ShieldCheck,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  ClipboardCheck, 
  UserX, 
  GlobeLock
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass =
    "group flex items-center gap-2.5 px-5 py-2.5 lg:py-1.5 xl:py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.12em] transition-all duration-300 border border-transparent";

  const navItems = [
    {
      to: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      activeColor: "text-emerald-400 bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]",
    },
    {
      to: "/dashboard/onboarding",
      label: "Onboarding",
      icon: UserPlus,
      activeColor: "text-blue-400 bg-blue-500/5 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.05)]",
    },
    {
      to: "/dashboard/transfer",
      label: "Transfer",
      icon: Send,
      activeColor: "text-purple-400 bg-purple-500/5 border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.05)]",
    },
    {
      to: "/dashboard/audit",
      label: "Audit",
      icon: ClipboardCheck, // Replaced History
      activeColor: "text-rose-400 bg-rose-500/5 border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.05)]",
    },
    {
      to: "/dashboard/blacklist",
      label: "Blacklist",
      icon: UserX, // Replaced History
      activeColor: "text-red-400 bg-red-500/5 border-red-500/20 shadow-[0_0_20px_rgba(244,63,94,0.05)]",
    },
    {
      to: "/dashboard/sanctioned",
      label: "Sanctioned",
      icon: GlobeLock, // Replaced History
      activeColor: "text-green-400 bg-green-500/5 border-green-500/20 shadow-[0_0_20px_rgba(244,63,94,0.05)]",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-2xl border-b border-white/5 px-4 md:px-8 py-3 flex items-center justify-between">
      
      {/* --- BRAND IDENTITY --- */}
      <div className="flex items-center gap-3 md:gap-4 md:pr-10 md:border-r border-white/5">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 animate-pulse" />
          <div className="relative bg-emerald-500 p-2 rounded-xl">
            <ShieldCheck className="text-[#020617]" size={18} strokeWidth={3} />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-black text-lg md:text-xl tracking-[-0.05em] text-white leading-none">SENTINEL</span>
          <span className="text-[7px] md:text-[8px] font-black text-emerald-500 uppercase tracking-[0.3em] mt-1">Core Protocol</span>
        </div>
      </div>

      {/* --- CENTRAL NAVIGATION (Desktop) --- */}
      <div className="hidden lg:flex flex-1 items-center justify-center gap-1 xl:gap-3 px-4 xl:px-10">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? item.activeColor : "text-slate-500 hover:text-slate-200 hover:bg-white/5"}`
            }
          >
            <item.icon size={14} strokeWidth={2.5} />
            <span className="hidden xl:inline">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* --- SYSTEM UTILITIES --- */}
      <div className="flex items-center gap-3 md:gap-6 md:pl-10 md:border-l border-white/5">
        {/* Search - Hidden on Small screens */}
        <div className="relative group hidden xl:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400" size={14} />
          <input
            placeholder="Search Intelligence..."
            className="bg-slate-900/40 border border-white/5 rounded-2xl py-2 pl-12 pr-12 text-[11px] w-48 focus:w-64 transition-all outline-none focus:border-emerald-500/30 text-slate-200"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-600 rounded-full border border-[#020617] animate-pulse" />
        </button>

        {/* User Profile - Label hidden on mobile */}
        <div className="flex items-center gap-3 bg-slate-900/60 p-1 md:pr-4 rounded-2xl border border-white/5 cursor-pointer">
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-xs text-white">
            AD
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-[10px] font-black text-white flex items-center gap-1">Admin_01 <ChevronDown size={10} /></span>
            <span className="text-[8px] font-bold text-emerald-500 uppercase">Superuser</span>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- MOBILE DROPDOWN MENU --- */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#020617] border-b border-white/10 p-4 flex flex-col gap-2 lg:hidden animate-in slide-in-from-top-5 duration-300">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${linkClass} justify-start ${isActive ? item.activeColor : "text-slate-500"}`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;