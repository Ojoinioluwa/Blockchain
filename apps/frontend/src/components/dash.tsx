import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Activity,
  UserPlus,
  Send,
  Search,
  ClipboardList,
  Globe,
  Database,
  Lock,
  History,
  Info,
} from "lucide-react";
import { getAuditLogs } from "../services/amlService";

// Configuration
const API_BASE = "http://localhost:3001/api/aml";

interface AuditLog {
  timestamp: string;
  event: string;
  level: "INFO" | "WARNING" | "CRITICAL";
  sender?: string;
  receiver?: string;
  amount?: string;
  reason?: string;
  txHash?: string;
}

const App: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "onboarding" | "transfer" | "audit"
  >("overview");

  // Form States
  const [regData, setRegData] = useState({
    address: "",
    name: "",
    country: "",
  });
  const [transferData, setTransferData] = useState({
    from: "",
    to: "",
    amount: "",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error" | "warning";
    text: string;
  } | null>(null);

  // auditLogs
  const fetchLogs = getAuditLogs();

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAddress: regData.address,
          fullName: regData.name,
          country: regData.country,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "success",
          text: `Whitelisted: ${data.txHash.substring(0, 10)}...`,
        });
        setRegData({ address: "", name: "", country: "" });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Registration failed",
        });
      }
    } catch (err) {
      console.log(err);
      setMessage({ type: "error", text: "Server unreachable" });
    }
    setLoading(false);
    fetchLogs();
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAddress: transferData.from,
          toAddress: transferData.to,
          amountInEth: transferData.amount,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.amlAlert !== "None") {
          setMessage({
            type: "warning",
            text: `SECURITY ALERT: ${data.amlAlert}`,
          });
        } else {
          setMessage({
            type: "success",
            text: "Transfer successfully processed and validated.",
          });
        }
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (err) {
      console.log(err);
      setMessage({ type: "error", text: "Blockchain execution failed" });
    }
    setLoading(false);
    fetchLogs();
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="bg-[#1e293b] border-b border-slate-700/50 px-6 py-4 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-1.5 rounded-lg shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white block leading-none">
                SENTINEL AML
              </span>
              <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">
                RegTech Protocol v1.0
              </span>
            </div>
          </div>
          <div className="flex bg-[#0f172a] p-1 rounded-xl border border-slate-700/50">
            {[
              { id: "overview", icon: Globe, label: "Global View" },
              { id: "onboarding", icon: UserPlus, label: "KYC Onboarding" },
              { id: "transfer", icon: Send, label: "Transfer Portal" },
              { id: "audit", icon: History, label: "Audit Trail" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-[#1e293b] text-emerald-400 shadow-sm border border-slate-700"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-screen-2xl mx-auto p-8">
        {/* Status Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Network Status",
              value: "Sepolia Active",
              icon: Globe,
              color: "text-emerald-400",
            },
            {
              label: "Security Level",
              value: "High (L3)",
              icon: Lock,
              color: "text-blue-400",
            },
            {
              label: "Daily Volume",
              value: `${logs
                .filter((l) => l.event === "TRANSACTION_SETTLED")
                .reduce((acc, curr) => acc + parseFloat(curr.amount || "0"), 0)
                .toFixed(4)} ETH`,
              icon: Database,
              color: "text-purple-400",
            },
            {
              label: "Active Alerts",
              value: logs.filter(
                (l) => l.level === "CRITICAL" || l.level === "WARNING",
              ).length,
              icon: AlertTriangle,
              color: "text-rose-400",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#1e293b] border border-slate-700/50 p-4 rounded-2xl flex items-center justify-between shadow-sm"
            >
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-white">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color} opacity-20`} />
            </div>
          ))}
        </div>

        {/* Alerts Section */}
        {message && (
          <div
            className={`mb-8 p-4 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-500 border-l-4 ${
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500"
                : message.type === "warning"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500"
                  : "bg-rose-500/10 text-rose-400 border-rose-500"
            }`}
          >
            <div className="bg-current p-1.5 rounded-full bg-opacity-20">
              {message.type === "success" ? (
                <ShieldCheck size={18} />
              ) : (
                <AlertTriangle size={18} />
              )}
            </div>
            <p className="text-sm font-medium">{message.text}</p>
            <button
              onClick={() => setMessage(null)}
              className="ml-auto text-[10px] uppercase font-bold tracking-widest hover:opacity-70"
            >
              Close
            </button>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Action Panel */}
          <div className="lg:col-span-4 space-y-6">
            {(activeTab === "onboarding" || activeTab === "overview") && (
              <section className="bg-[#1e293b] p-6 rounded-3xl border border-slate-700/50 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <UserPlus size={100} />
                </div>
                <h2 className="text-white font-bold flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  KYC ONBOARDING
                </h2>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      placeholder="0x..."
                      className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-white placeholder:text-slate-600"
                      value={regData.address}
                      onChange={(e) =>
                        setRegData({ ...regData, address: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">
                        Legal Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-sm focus:border-blue-500 outline-none text-white placeholder:text-slate-600"
                        value={regData.name}
                        onChange={(e) =>
                          setRegData({ ...regData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">
                        Jurisdiction
                      </label>
                      <select
                        title="country"
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-sm focus:border-blue-500 outline-none text-white cursor-pointer"
                        value={regData.country}
                        onChange={(e) =>
                          setRegData({ ...regData, country: e.target.value })
                        }
                        required
                      >
                        <option value="" disabled>
                          Select...
                        </option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="UK">United Kingdom</option>
                        <option value="USA">USA</option>
                        <option value="North Korea">
                          North Korea (Block Test)
                        </option>
                      </select>
                    </div>
                  </div>
                  <button
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Activity className="animate-spin w-4 h-4" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}
                    {loading ? "PROCESSING..." : "REGISTER USER"}
                  </button>
                </form>
              </section>
            )}

            {(activeTab === "transfer" || activeTab === "overview") && (
              <section className="bg-[#1e293b] p-6 rounded-3xl border border-slate-700/50 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Send size={100} />
                </div>
                <h2 className="text-white font-bold flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  TRANSFER PORTAL
                </h2>
                <form onSubmit={handleTransfer} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">
                      Sender ID
                    </label>
                    <input
                      type="text"
                      placeholder="0x..."
                      className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none text-white placeholder:text-slate-600"
                      value={transferData.from}
                      onChange={(e) =>
                        setTransferData({
                          ...transferData,
                          from: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">
                      Destination
                    </label>
                    <input
                      type="text"
                      placeholder="Recipient Address"
                      className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none text-white placeholder:text-slate-600"
                      value={transferData.to}
                      onChange={(e) =>
                        setTransferData({ ...transferData, to: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">
                      Value (ETH)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="0.00"
                      className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none text-white placeholder:text-slate-600"
                      value={transferData.amount}
                      onChange={(e) =>
                        setTransferData({
                          ...transferData,
                          amount: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <button
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Activity className="animate-spin w-4 h-4" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    {loading ? "VALIDATING..." : "EXECUTE COMPLIANT TRANSFER"}
                  </button>
                </form>
              </section>
            )}
          </div>

          {/* Audit Monitor */}
          <div className="lg:col-span-8">
            <section className="bg-[#1e293b] rounded-3xl border border-slate-700/50 shadow-xl flex flex-col h-full max-h-200">
              <div className="px-6 py-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/20">
                <div className="flex items-center gap-3">
                  <div className="bg-rose-500/20 p-2 rounded-lg">
                    <ClipboardList className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-sm tracking-wide">
                      COMPLIANCE MONITOR
                    </h2>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
                      Real-time risk assessment stream
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 bg-[#0f172a] px-3 py-1 rounded-full border border-slate-700/50">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-400">
                      LIVE FEED
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {logs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                    <Search className="w-12 h-12 mb-4 opacity-10" />
                    <p className="text-sm italic">
                      Listening for on-chain events...
                    </p>
                  </div>
                ) : (
                  logs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`group relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 ${
                        log.level === "CRITICAL"
                          ? "bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10"
                          : log.level === "WARNING"
                            ? "bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10"
                            : "bg-slate-700/10 border-slate-700/50 hover:bg-slate-700/20"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-widest ${
                              log.level === "CRITICAL"
                                ? "bg-rose-500 text-white"
                                : log.level === "WARNING"
                                  ? "bg-amber-500 text-white"
                                  : "bg-slate-700 text-slate-300"
                            }`}
                          >
                            {log.event}
                          </div>
                          {log.txHash && (
                            <span className="text-[10px] font-mono text-slate-500 hover:text-emerald-400 cursor-help transition-colors">
                              {log.txHash.substring(0, 16)}...
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 bg-[#0f172a] px-2 py-0.5 rounded border border-slate-700/50">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      {log.reason && (
                        <div className="flex items-start gap-2 mb-4 p-3 rounded-xl bg-black/20 border border-white/5">
                          <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-300 leading-relaxed">
                            <span className="text-rose-400 font-bold uppercase text-[10px] mr-2">
                              Risk Flag:
                            </span>
                            {log.reason}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 text-[11px] font-mono">
                        <div className="bg-[#0f172a] p-2 rounded-lg border border-slate-700/30">
                          <span className="text-slate-500 block mb-1 uppercase text-[9px]">
                            Origin
                          </span>
                          <span className="text-slate-300 break-all">
                            {log.sender || "N/A"}
                          </span>
                        </div>
                        <div className="bg-[#0f172a] p-2 rounded-lg border border-slate-700/30">
                          <span className="text-slate-500 block mb-1 uppercase text-[9px]">
                            Target
                          </span>
                          <span className="text-slate-300 break-all">
                            {log.receiver || "N/A"}
                          </span>
                        </div>
                        {log.amount && (
                          <div className="col-span-2 flex justify-between items-center bg-slate-800/40 p-2 rounded-lg border border-slate-700/30">
                            <span className="text-slate-500 uppercase text-[9px]">
                              Asset Transfer Value
                            </span>
                            <span className="text-emerald-400 font-bold">
                              {log.amount} ETH
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  );
};

export default App;
