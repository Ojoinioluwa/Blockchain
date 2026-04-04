import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { ShieldAlert, RefreshCcw, Home } from "lucide-react";

const ErrorPage = () => {
  const error = useRouteError();
  let errorMessage = "An unexpected system interrupt has occurred.";

  if (isRouteErrorResponse(error)) {
    errorMessage =
      error.status === 404
        ? "Protocol Error: Requested resource not found on Sentinel Node."
        : error.statusText;
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-slate-200">
      {/* Background Glows to match Dashboard */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-rose-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/20 shadow-2xl shadow-rose-500/10 animate-pulse">
            <ShieldAlert size={48} className="text-rose-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
            System Breach
          </h1>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">
            Error Code:{" "}
            {isRouteErrorResponse(error)
              ? error.status
              : "500_INTERNAL_FAILURE"}
          </p>
        </div>

        <p className="text-slate-400 text-sm leading-relaxed font-medium">
          {errorMessage}
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
          >
            <Home size={14} />
            Return to Command Center
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 w-full py-3 text-slate-500 hover:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
          >
            <RefreshCcw size={12} />
            Re-initialize Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
