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
  Mail,
} from "lucide-react";
// 1. Import the Sentinel hooks
import { useRegisterUser, useSanctions } from "../hooks/useSentinel";

const Onboarding = () => {
  const [form, setForm] = useState({
    userAddress: "",
    fullName: "",
    email: "",
    idNumber: "",
    country: "",
  });

  const [status, setStatus] = useState<
    "idle" | "success" | "pending" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [txHash, setTxHash] = useState("");

  // 2. Initialize the Onboarding Mutation
  const onboardMutation = useRegisterUser();

  // 3. Fetch real-time Sanctions for the dropdown
  const { data: sanctionsData } = useSanctions();
  const sanctionedCountries = sanctionsData?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // 4. Execute mutation
    onboardMutation.mutate(form, {
      onSuccess: (data) => {
        // Handle the logic based on your AML Controller responses
        if (data.status === "SUCCESS") {
          setStatus("success");
          setTxHash(data.txHash);
          setMessage(
            "Entity successfully whitelisted on-chain and registered in Sentinel DB.",
          );
        } else if (data.riskScore >= 70) {
          setStatus("pending");
          setMessage(
            `High Risk Detected (${data.riskScore}). Reasons: ${data.reasons?.join(", ")}`,
          );
        }
      },
      onError: (error: any) => {
        setStatus("error");
        // Pull the error message from the backend (e.g., "Address is Blacklisted")
        setMessage(
          error.response?.data?.message ||
            "Onboarding rejected by security protocol.",
        );
      },
    });
  };

  // Success State View
  if (status === "success") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 text-center px-6">
        <div className="bg-emerald-500/10 p-6 rounded-full mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <CheckCircle2 size={64} className="text-emerald-400" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">
          Access Granted
        </h2>
        <p className="text-slate-400 max-w-md mb-6">{message}</p>

        {txHash && (
          <div className="mb-8 p-4 bg-slate-950 border border-white/5 rounded-2xl w-full max-w-sm shadow-inner">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">
              On-Chain Evidence
            </p>
            <code className="text-blue-400 text-[10px] font-mono break-all leading-tight">
              {txHash}
            </code>
          </div>
        )}

        <button
          onClick={() => {
            setStatus("idle");
            setForm({
              userAddress: "",
              fullName: "",
              email: "",
              idNumber: "",
              country: "",
            });
          }}
          className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/10"
        >
          Initialize New Session
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full py-12 px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-10 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
          <ShieldCheck size={12} />
          Compliance Node Active
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight mb-3 uppercase">
          Entity Onboarding
        </h1>
        <p className="text-slate-400 leading-relaxed text-sm">
          Run a real-time forensic check against the global AML database and
          execute the smart-contract whitelist transaction.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
            Wallet Identity
          </label>
          <div className="relative">
            <Wallet
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="text"
              placeholder="0x..."
              className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-blue-500/50 focus:bg-slate-900/60 transition-all font-mono"
              value={form.userAddress}
              onChange={(e) =>
                setForm({ ...form, userAddress: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Legal Full Name
            </label>
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                title="fullname"
                type="text"
                className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Email Interface
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                title="email"
                type="email"
                className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
            Jurisdiction / Origin
          </label>
          <div className="relative">
            <Globe
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <select
              title="country"
              className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-10 text-sm text-white outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              required
            >
              <option value="" className="bg-slate-950">
                Select Country
              </option>
              {/* 5. Dynamically Render Sanctioned Countries from your DB */}
              <optgroup
                label="Restricted Jurisdictions"
                className="bg-slate-950 text-rose-500"
              >
                {sanctionedCountries.map((s: any) => (
                  <option key={s._id} value={s.country}>
                    {s.country} ({s.restriction})
                  </option>
                ))}
              </optgroup>
              <optgroup
                label="Standard Jurisdictions"
                className="bg-slate-950 text-slate-400"
              >
                <option value="USA">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="Nigeria">Nigeria</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* 6. Integrated Error Handling */}
        {onboardMutation.isError && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-rose-400 animate-in slide-in-from-top-2">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-black uppercase text-[10px] mb-1 tracking-widest">
                Protocol Blocked
              </p>
              <p className="text-xs">{message}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={onboardMutation.isPending}
          className="w-full group relative flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.01] active:scale-[0.98] shadow-xl shadow-blue-600/20"
        >
          {onboardMutation.isPending ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Verifying Forensic
              Hash...
            </>
          ) : (
            <>
              <UserPlus size={18} /> Initialize Whitelist
            </>
          )}
        </button>

        <p className="text-center text-[9px] text-slate-600 uppercase font-bold tracking-tight">
          Audit-logs will be generated for all successful and rejected attempts.
        </p>
      </form>
    </div>
  );
};

export default Onboarding;
