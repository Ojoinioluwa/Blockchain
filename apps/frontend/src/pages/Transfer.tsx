import React, { useState, useMemo } from "react";
import {
  Send,
  Wallet,
  ArrowRightLeft,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Coins,
  History,
  Globe,
} from "lucide-react";
// Added useTransfer to your imports
import { useAuditLogs, useBlacklist, useTransfer } from "../hooks/useSentinel";

const TransferPage = () => {
  const [form, setForm] = useState({
    recipient: "",
    amount: "",
    asset: "ETH",
  });

  const [status, setStatus] = useState<
    "idle" | "review" | "success" | "denied" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // 1. Hook Integration
  const { data: logData } = useAuditLogs();
  const { data: blacklistData } = useBlacklist();
  const { mutateAsync: executeTransfer, isPending: isTransferring } =
    useTransfer();

  // 2. Security Logic: Blacklist Lookup
  const blacklistedAddresses = useMemo(() => {
    return new Set(
      blacklistData?.data?.map((b: { address: string }) =>
        b.address.toLowerCase(),
      ) || [],
    );
  }, [blacklistData]);

  // 3. UI Logic: Recent Activity
  const recentTransfers = useMemo(() => {
    return (
      logData?.data
        ?.filter((l: { event: string }) => l.event === "TRANSACTION_SETTLED")
        .slice(0, 4) || []
    );
  }, [logData]);

  console.log(recentTransfers);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setErrorMessage("");

    const recipientClean = form.recipient.trim().toLowerCase();

    // --- STAGE 1: SENTINEL AML CHECK (Client-Side) ---
    if (blacklistedAddresses.has(recipientClean)) {
      setStatus("denied");
      return;
    }

    // --- STAGE 2: EXECUTE MUTATION (Server-Side) ---
    try {
      await executeTransfer({
        toAddress: form.recipient,
        amountInEth: parseFloat(form.amount),
        asset: form.asset,
      });

      setStatus("success");
      setForm({ recipient: "", amount: "", asset: "ETH" }); // Reset form
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          "Protocol transmission failure",
      );
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-in zoom-in duration-500">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
            <ShieldCheck size={48} strokeWidth={1.5} />
          </div>
          <div className="absolute inset-0 rounded-full animate-ping bg-emerald-500/5 opacity-50" />
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
          Transfer Confirmed
        </h2>
        <p className="text-slate-400 mt-3 font-medium text-center max-w-xs leading-relaxed">
          The transaction has been broadcast to the network and verified by the
          Sentinel node.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-10 px-10 py-4 bg-slate-900 border border-white/5 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-800 transition-all"
        >
          New Transaction
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* --- LEFT: TRANSFER INTERFACE --- */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-[#020617] border border-white/5 p-10 rounded-[3rem] shadow-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Globe size={160} className="text-blue-500" />
          </div>

          <div className="flex items-center gap-5 mb-10 relative z-10">
            <div className="p-4 bg-blue-600/10 rounded-3xl text-blue-400 border border-blue-500/10">
              <Send size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                Protocol Transfer
              </h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1 italic">
                V2 Velocity Engine Active
              </p>
            </div>
          </div>

          <form onSubmit={handleTransfer} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Destination Address
              </label>
              <div className="relative">
                <Wallet
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600"
                  size={20}
                />
                <input
                  required
                  placeholder="0x..."
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm text-white focus:border-blue-500/40 outline-none font-mono"
                  value={form.recipient}
                  onChange={(e) =>
                    setForm({ ...form, recipient: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Amount
                </label>
                <input
                  title="Amount"
                  required
                  type="number"
                  step="0.01"
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-5 px-6 text-sm text-white focus:border-blue-500/40 outline-none font-mono"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Asset
                </label>
                <select
                  title="asset"
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-5 px-6 text-sm text-white outline-none appearance-none font-bold"
                  value={form.asset}
                  onChange={(e) => setForm({ ...form, asset: e.target.value })}
                >
                  <option>ETH</option>
                  <option>USDC</option>
                </select>
              </div>
            </div>

            {/* ERROR HANDLING: BLACKLIST */}
            {status === "denied" && (
              <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-start gap-4 text-rose-400 animate-in fade-in slide-in-from-top-2">
                <AlertTriangle size={20} className="shrink-0 mt-1" />
                <div className="text-[11px]">
                  <p className="font-black uppercase tracking-widest mb-1">
                    Sentinel Block: Blacklisted Address
                  </p>
                  <p>
                    Transaction terminated. Destination address is flagged for
                    high-risk activity.
                  </p>
                </div>
              </div>
            )}

            {/* ERROR HANDLING: API FAILURE */}
            {status === "error" && (
              <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex items-start gap-4 text-amber-400 animate-in fade-in slide-in-from-top-2">
                <AlertTriangle size={20} className="shrink-0 mt-1" />
                <div className="text-[11px]">
                  <p className="font-black uppercase tracking-widest mb-1">
                    Execution Failure
                  </p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            <button
              disabled={isTransferring}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4"
            >
              {isTransferring ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Broadcasting to Node...
                </>
              ) : (
                <>
                  Confirm & Execute
                  <ArrowRightLeft size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* --- RIGHT: SIDEBAR --- */}
      <div className="lg:col-span-5 space-y-8">
        <div className="p-8 bg-linear-to-br from-indigo-700 to-blue-900 rounded-[2.5rem] text-white shadow-3xl relative overflow-hidden">
          <div className="relative z-10">
            <ShieldCheck size={32} className="mb-4 opacity-80" />
            <h3 className="font-black uppercase tracking-tighter text-xl italic">
              Compliance Guard
            </h3>
            <p className="text-blue-100/70 text-[11px] leading-loose mt-4 font-bold uppercase tracking-widest">
              Live Address Screening against FATF & OFAC databases.
            </p>
          </div>
          <Coins className="absolute -bottom-8 -right-8 text-white/10 w-48 h-48 rotate-12" />
        </div>

        {/* Real-time History */}
        <div className="bg-[#020617] border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
          <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
            <History size={16} className="text-blue-500" />
            Audit Log Preview
          </h4>

          <div className="space-y-4">
            {recentTransfers.map(
              (log: {
                amount: number;
                receiver: string;
                _id: string;
                asset: string;
              }) => (
                <div
                  key={log._id}
                  className="p-5 bg-slate-900/40 rounded-2xl border border-white/5 flex justify-between items-center group"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-white transition-colors">
                      {log.receiver.slice(0, 16)}..
                    </span>
                    <span className="text-[9px] font-black text-emerald-500/80 uppercase tracking-tighter flex items-center gap-1">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />{" "}
                      Compliant
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-white">
                      {log.amount} {log.asset || "ETH"}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferPage;
