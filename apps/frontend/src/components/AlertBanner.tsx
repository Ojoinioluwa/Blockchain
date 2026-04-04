// import { useEffect, useState } from "react";
// import {
//   CheckCircle2,
//   AlertCircle,
//   TriangleAlert,
//   X,
//   Info,
// } from "lucide-react";

// /**
//  * Enhanced AlertBanner for the Sentinel AML Platform.
//  * Features:
//  * - Icon integration based on type
//  * - Glassmorphism styling
//  * - Auto-dismiss timer visual (optional)
//  * - Animated entrance
//  */

// const AlertBanner = ({
//   type = "success",
//   text,
//   onClose,
//   autoCloseMs = 5000,
// }) => {
//   const [progress, setProgress] = useState(100);

//   // Handle auto-progress bar if needed
//   useEffect(() => {
//     if (!autoCloseMs) return;
//     const interval = 10;
//     const step = (interval / autoCloseMs) * 100;

//     const timer = setInterval(() => {
//       setProgress((prev) => {
//         if (prev <= 0) {
//           clearInterval(timer);
//           return 0;
//         }
//         return prev - step;
//       });
//     }, interval);

//     return () => clearInterval(timer);
//   }, [autoCloseMs]);

//   const configs = {
//     success: {
//       icon: CheckCircle2,
//       container: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
//       bar: "bg-emerald-500/40",
//       accent: "text-emerald-500",
//       label: "Success",
//     },
//     error: {
//       icon: AlertCircle,
//       container: "bg-rose-500/10 border-rose-500/20 text-rose-400",
//       bar: "bg-rose-500/40",
//       accent: "text-rose-500",
//       label: "Security Alert",
//     },
//     warning: {
//       icon: TriangleAlert,
//       container: "bg-amber-500/10 border-amber-500/20 text-amber-400",
//       bar: "bg-amber-500/40",
//       accent: "text-amber-500",
//       label: "Warning",
//     },
//     info: {
//       icon: Info,
//       container: "bg-blue-500/10 border-blue-500/20 text-blue-400",
//       bar: "bg-blue-500/40",
//       accent: "text-blue-500",
//       label: "Information",
//     },
//   };

//   const config = configs[type] || configs.info;
//   const Icon = config.icon;

//   return (
//     <div
//       className={`
//       relative overflow-hidden group
//       flex items-start gap-4 p-4 rounded-2xl border
//       backdrop-blur-md shadow-lg shadow-black/20
//       animate-in slide-in-from-top-4 fade-in duration-300
//       ${config.container}
//     `}
//     >
//       {/* Visual Indicator Icon */}
//       <div className={`mt-0.5 p-1 rounded-lg ${config.container} border-none`}>
//         <Icon size={18} strokeWidth={2.5} />
//       </div>

//       {/* Content */}
//       <div className="flex-1 space-y-1">
//         <h5 className="text-[10px] font-black uppercase tracking-[0.15em] opacity-80">
//           {config.label}
//         </h5>
//         <p className="text-sm font-medium leading-relaxed">{text}</p>
//       </div>

//       {/* Close Button */}
//       <button
//         title="close"
//         onClick={onClose}
//         className="p-1 rounded-xl hover:bg-white/10 transition-colors text-current opacity-50 group-hover:opacity-100"
//       >
//         X
//         <X size={16} />
//       </button>

//       {/* Progress Bar (Timer Visual) */}
//       {autoCloseMs && (
//         <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
//           <div
//             className={`h-full transition-all linear ${config.bar}`}
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default AlertBanner;
