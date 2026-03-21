import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  Send,
  History,
  ShieldCheck,
  Bell,
  Search,
} from "lucide-react";

/**
 * Premium Navbar for Sentinel AML Platform
 * Uses React Router NavLink for active state management
 */

const Navbar = () => {
  const linkClass =
    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 border border-transparent";

  const navItems = [
    {
      to: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      activeColor:
        "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-lg shadow-emerald-500/5",
    },
    {
      to: "/dashboard/onboarding",
      label: "Onboarding",
      icon: UserPlus,
      activeColor:
        "text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-lg shadow-blue-500/5",
    },
    {
      to: "/dashboard/transfer",
      label: "Transfer",
      icon: Send,
      activeColor:
        "text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-lg shadow-purple-500/5",
    },
    {
      to: "/dashboard/audit",
      label: "Audit",
      icon: History,
      activeColor:
        "text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-lg shadow-rose-500/5",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/60 px-8 py-4 flex items-center justify-between">
      {/* Brand Identity */}
      <div className="flex items-center gap-3 pr-8 border-r border-slate-800/60">
        <div className="bg-emerald-500 p-1.5 rounded-lg shadow-lg shadow-emerald-500/20">
          <ShieldCheck className="text-white" size={20} />
        </div>
        <span className="font-black text-lg tracking-tighter text-white">
          SENTINEL
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-1 items-center gap-2 px-8">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) =>
              `${linkClass} ${
                isActive
                  ? item.activeColor
                  : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/40"
              }`
            }
          >
            <item.icon size={16} strokeWidth={2.5} />
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Action Utilities */}
      <div className="flex items-center gap-5 pl-8 border-l border-slate-800/60">
        <div className="relative group hidden lg:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={14}
          />
          <input
            placeholder="Search hash..."
            className="bg-slate-900/50 border border-slate-800 rounded-full py-1.5 pl-9 pr-4 text-xs w-48 focus:w-64 transition-all outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
          />
        </div>

        <button className="relative text-slate-400 hover:text-white transition-colors">
          <Bell size={18} />
          bell
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#020617]" />
        </button>

        <div className="flex items-center gap-3 bg-slate-900/50 p-1 pr-3 rounded-full border border-slate-800">
          <div className="w-7 h-7 rounded-full bg-linear-to-tr from-blue-600 to-emerald-500 flex items-center justify-center font-bold text-[10px] text-white">
            AD
          </div>
          <span className="text-xs font-bold text-slate-300">Admin_01</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
