import { useState } from "react";
import { Loader2, Globe, ShieldAlert, Trash2, PlusCircle } from "lucide-react";
import {
  useSanctions,
  useAddToSanctions,
  useRemoveFromSanctions,
} from "../hooks/useSentinel";

const SanctionsPage = () => {
  const [countryName, setCountryName] = useState("");
  const [restriction, setRestriction] = useState("TOTAL_BLOCK");

  // 1. Fetching Data
  const { data: sanctionsData, isLoading } = useSanctions();
  const nations = sanctionsData?.data || [];
  console.log(nations);

  // 2. Mutations
  const addMutation = useAddToSanctions();
  const removeMutation = useRemoveFromSanctions();

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!countryName) return;

    addMutation.mutate(
      { country: countryName, restriction },
      {
        onSuccess: () => setCountryName(""), // Reset input on success
      },
    );
  };

  const handleRemove = (id: string) => {
    if (window.confirm("Lift all protocol sanctions for this jurisdiction?")) {
      removeMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
            Sanctioned Jurisdictions
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
            FATF High-Risk Framework // Protocol v4.2
          </p>
        </div>
      </div>

      {/* --- QUICK ADD COUNTRY FORM --- */}
      <form
        onSubmit={handleUpdate}
        className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-blue-500/5 border border-blue-500/20 p-5 rounded-3xl backdrop-blur-md"
      >
        <div className="lg:col-span-2 relative">
          <input
            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
            placeholder="Country Name (e.g. Russia)"
            className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all font-bold"
            required
          />
        </div>
        <select
          title="restriction"
          value={restriction}
          onChange={(e) => setRestriction(e.target.value)}
          className="bg-[#020617] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 outline-none appearance-none cursor-pointer"
        >
          <option value="TOTAL_BLOCK">TOTAL_BLOCK</option>
          <option value="ENHANCED_DUE_DILIGENCE">ENHANCED_DUE_DILIGENCE</option>
          <option value="PARTIAL_LIMIT">PARTIAL_LIMIT</option>
        </select>
        <button
          disabled={addMutation.isPending}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
        >
          {addMutation.isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <>
              <PlusCircle size={14} />
              Update Registry
            </>
          )}
        </button>
      </form>

      {/* --- COUNTRY GRID --- */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-blue-500" size={40} />
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            Synchronizing Global Sanctions...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {nations.length > 0 ? (
            nations.map(
              (nation: {
                _id: string;
                country: string;
                restriction: string;
              }) => (
                <div
                  key={nation._id}
                  className="group relative p-6 bg-slate-900/20 border border-white/5 rounded-4xl flex items-center justify-between hover:border-blue-500/30 transition-all overflow-hidden"
                >
                  {/* Visual Accent */}
                  <div
                    className={`absolute top-0 right-0 w-16 h-16 opacity-5 -mr-4 -mt-4 transition-transform group-hover:scale-110`}
                  >
                    <Globe size={64} />
                  </div>

                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center font-black text-slate-500 group-hover:text-blue-400 transition-colors uppercase font-mono">
                      {nation.country.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-black text-white uppercase tracking-tight text-sm">
                        {nation.country}
                      </h3>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-widest ${
                          nation.restriction === "TOTAL_BLOCK"
                            ? "text-rose-500"
                            : "text-amber-500"
                        }`}
                      >
                        {nation.restriction.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 relative z-10">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        nation.restriction === "TOTAL_BLOCK"
                          ? "bg-rose-500"
                          : "bg-amber-500"
                      } animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]`}
                    />
                    <button
                      title="delete"
                      onClick={() => handleRemove(nation._id)}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-500 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ),
            )
          ) : (
            <div className="col-span-full py-20 bg-slate-900/10 border border-dashed border-white/5 rounded-4xl flex flex-col items-center justify-center">
              <ShieldAlert size={48} className="text-slate-800 mb-4" />
              <p className="text-slate-600 font-black text-xs uppercase tracking-widest">
                Registry Clear // No Active Sanctions
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SanctionsPage;
