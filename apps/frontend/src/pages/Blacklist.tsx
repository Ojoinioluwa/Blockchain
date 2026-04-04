import { useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  ExternalLink,
  UserX,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import {
  useBlacklist,
  useAddToBlacklist,
  useRemoveFromBlacklist,
} from "../hooks/useSentinel";

const BlacklistPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [address, setAddress] = useState("");
  const [reason, setReason] = useState("High-Risk Mixer");

  // 1. Fetching Data
  const { data: blacklistData, isLoading } = useBlacklist({
    address: searchTerm,
  });
  const blacklist = blacklistData?.data || [];

  // 2. Mutations
  const addMutation = useAddToBlacklist();
  const removeMutation = useRemoveFromBlacklist();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    addMutation.mutate(
      { walletAddress: address, reason },
      {
        onSuccess: () => {
          setAddress("");
          setShowAddForm(false);
        },
      },
    );
  };

  const handleRemove = (address: string) => {
    if (
      window.confirm(
        "Are you sure you want to de-list this address from the Sentinel Protocol?",
      )
    ) {
      removeMutation.mutate(address);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
            Address Blacklist
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
            Global Deny-List Protocol // Active Monitoring
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
            showAddForm
              ? "bg-slate-800 text-white border border-white/10"
              : "bg-emerald-500 text-[#020617] shadow-emerald-500/20"
          }`}
        >
          {showAddForm ? (
            "Close Terminal"
          ) : (
            <>
              <Plus size={16} strokeWidth={3} />
              Flag New Address
            </>
          )}
        </button>
      </div>

      {/* --- ADD ADDRESS FORM --- */}
      {showAddForm && (
        <div className="bg-slate-900/40 border border-emerald-500/20 p-6 rounded-4xl backdrop-blur-xl animate-in slide-in-from-top-4">
          <form
            onSubmit={handleAdd}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                Wallet Address
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500/50 outline-none transition-all font-mono"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
                Violation Category
              </label>
              <select
                title="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 focus:border-emerald-500/50 outline-none appearance-none"
              >
                <option value="Money Laundering">Money Laundering</option>
                <option value="Terrorist Financing">Terrorist Financing</option>
                <option value="High-Risk Mixer">High-Risk Mixer</option>
                <option value="Phishing Origin">Phishing Origin</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                disabled={addMutation.isPending}
                className="w-full py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-500/20 transition-all flex justify-center items-center gap-2"
              >
                {addMutation.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  "Submit to Core Protocol"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- SEARCH BAR --- */}
      <div className="relative group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors"
          size={18}
        />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by hash, reason, or status..."
          className="w-full bg-slate-900/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:bg-slate-900/40 focus:border-white/10 transition-all outline-none font-mono"
        />
      </div>

      {/* --- BLACKLIST TABLE --- */}
      <div className="bg-slate-900/20 border border-white/5 rounded-4xl overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/2">
              <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Target Address
              </th>
              <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Risk Factor
              </th>
              <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="p-20 text-center">
                  <Loader2
                    className="animate-spin text-slate-700 mx-auto"
                    size={32}
                  />
                </td>
              </tr>
            ) : blacklist.length > 0 ? (
              blacklist.map((item: any) => (
                <tr
                  key={item._id}
                  className="group hover:bg-white/2 transition-colors"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
                        <UserX size={14} />
                      </div>
                      <span className="font-mono text-sm text-slate-300">
                        {item.walletAddress}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md border bg-rose-500/5 text-rose-400 border-rose-500/20 uppercase">
                      {item.reason}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        title="redirect"
                        className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all"
                      >
                        <ExternalLink size={14} />
                      </button>
                      <button
                        title="delete"
                        onClick={() => handleRemove(item.walletAddress)}
                        disabled={removeMutation.isPending}
                        className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-500 transition-all disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-20 text-center">
                  <ShieldAlert
                    className="mx-auto text-slate-800 mb-4"
                    size={40}
                  />
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                    No Blacklisted Nodes Found
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlacklistPage;
