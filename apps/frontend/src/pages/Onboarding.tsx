import React, { useState } from "react";
import {
  UserPlus,
  Globe,
  Wallet,
  User,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { registerUser } from "../services/amlService";

/**
 * Onboarding Component
 * High-fidelity KYC registration interface for the Sentinel AML Platform.
 * * Features:
 * - Real-time validation styling
 * - Integrated loading states for blockchain interaction
 * - Premium dark-mode aesthetics
 */

// Mock service call - replace with your actual service import

const Onboarding = () => {
  const [form, setForm] = useState({
    address: "",
    name: "",
    country: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      await registerUser(form);
      setStatus("success");
      setMessage("User successfully whitelisted on-chain.");
    } catch (err) {
      setStatus("error");
      console.log(err);
      setMessage("Registration failed. Please verify credentials.");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
        <div className="bg-emerald-500/10 p-6 rounded-full mb-6">
          <CheckCircle2 size={64} className="text-emerald-400" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">
          Onboarding Complete
        </h2>
        <p className="text-slate-400 mb-8">{message}</p>
        <button
          onClick={() => setStatus("idle")}
          className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
        >
          Register Another User
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-10 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
          <ShieldCheck size={12} />
          Compliance Layer
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight mb-3">
          KYC Onboarding
        </h1>
        <p className="text-slate-400 leading-relaxed">
          Initialize a new entity within the Sentinel protocol. This process
          verifies credentials against global sanction lists and updates the
          on-chain whitelist.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Wallet Address Input */}
        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
            Wallet Address
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
              <Wallet size={18} />
            </div>
            <input
              type="text"
              placeholder="0x..."
              className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-600"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Legal Name Input */}
        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
            Legal Entity Name
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
              <User size={18} />
            </div>
            <input
              type="text"
              placeholder="Full Legal Name"
              className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-600"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Jurisdiction Select */}
        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
            Jurisdiction
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
              <Globe size={18} />
            </div>
            <select
              title="form"
              className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              required
            >
              <option value="" disabled className="bg-slate-900">
                Select Country
              </option>
              <option value="USA" className="bg-slate-900">
                United States
              </option>
              <option value="UK" className="bg-slate-900">
                United Kingdom
              </option>
              <option value="EU" className="bg-slate-900">
                European Union
              </option>
              <option value="Nigeria" className="bg-slate-900">
                Nigeria
              </option>
              <option value="OTHER" className="bg-slate-900">
                Other (High Risk)
              </option>
            </select>
          </div>
        </div>

        {/* Feedback Messages */}
        {status === "error" && (
          <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
            <AlertCircle size={18} />
            {message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full group relative flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-600/10 overflow-hidden"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Verifying Sanctions...
            </>
          ) : (
            <>
              <UserPlus size={18} />
              Initialize Onboarding
            </>
          )}
        </button>

        <p className="text-center text-[10px] text-slate-600 uppercase tracking-tighter">
          By submitting, you trigger a real-time audit event logged to the
          Sentinel immutable ledger.
        </p>
      </form>
    </div>
  );
};

export default Onboarding;
