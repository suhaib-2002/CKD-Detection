import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, Loader, X, RefreshCw, Server } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ─────────────────────────────────────────────────────────────────

interface Alert {
  id: string;
  dot: "red" | "amber" | "rose";
  label: string;
  subtext: string;
  time: string;
  badge: "critical" | "warning" | "info";
}

interface StatusRow {
  icon: "check" | "running";
  label: string;
  subtext: string;
  badge: "active" | "running" | "healthy" | "scheduled";
}

// ─── Sub-components ─────────────────────────────────────────────────────────

const DashboardSystemStatus: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: "PATIENT-CKD-042", dot: "red", label: "PATIENT-CKD-042", subtext: "Serum Creatinine spike detected (>4.5 mg/dl)", time: "2 mins ago", badge: "critical" },
    { id: "DATA-INGEST-103", dot: "amber", label: "DATA-INGEST-103", subtext: "Missing Specific Gravity value in session data", time: "15 mins ago", badge: "warning" },
    { id: "FASTAPI-ENGINE", dot: "rose", label: "FASTAPI-ENGINE", subtext: "Ensemble Model weight synchronization completed", time: "1 hour ago", badge: "info" },
    { id: "PATIENT-CKD-087", dot: "amber", label: "PATIENT-CKD-087", subtext: "Hemoglobin below critical threshold (<7 g/dl)", time: "2 hours ago", badge: "warning" },
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const systemStatuses: StatusRow[] = [
    { icon: "check", label: "FastAPI Integration", subtext: "Last sync: 2 mins ago", badge: "active" },
    { icon: "check", label: "Patient Data Repository", subtext: "Last sync: 5 mins ago", badge: "active" },
    { icon: "running", label: "Prediction Engine", subtext: "Validating test matrix...", badge: "running" },
    { icon: "check", label: "API Gateway Client", subtext: "23 active clinical sessions", badge: "healthy" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* ── Alerts ─────────────────────────────────────────────────── */}
      <div className="lg:col-span-7 bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={15} className="text-rose-500" />
            <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Active Clinical Alerts</h3>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{alerts.length} Pending</span>
        </div>

        <div className="space-y-0 relative min-h-[100px]">
          <AnimatePresence initial={false}>
            {alerts.length > 0 ? alerts.map((alert, i) => (
              <motion.div 
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex items-start gap-4 py-3 group ${i !== alerts.length - 1 ? "border-b border-slate-50" : ""}`}
              >
                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${alert.dot === 'red' ? 'bg-rose-500' : alert.dot === 'amber' ? 'bg-amber-400' : 'bg-rose-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-slate-800 leading-none">{alert.label}</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-1.5 leading-snug">{alert.subtext}</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-1.5 uppercase tracking-tight">{alert.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
                    alert.badge === 'critical' ? 'bg-rose-500 text-white border-rose-600' : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}>
                    {alert.badge}
                  </span>
                  <button 
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1 text-slate-300 hover:text-rose-500 hover:bg-slate-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X size={12} />
                  </button>
                </div>
              </motion.div>
            )) : (
              <div className="py-8 text-center">
                <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-2 opacity-20" />
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">All clinical alerts cleared</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── System Status ─────────────────────────────────────────── */}
      <div className="lg:col-span-5 bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Server size={15} className="text-rose-500" />
            <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Engine Status</h3>
          </div>
          <button 
            onClick={handleRefresh}
            className={`p-1.5 text-slate-400 hover:text-rose-500 transition-all ${isRefreshing ? "animate-spin" : ""}`}
          >
            <RefreshCw size={14} />
          </button>
        </div>

        <div className="space-y-0">
          {systemStatuses.map((row, i) => (
            <div key={row.label} className={`flex items-center gap-3 py-3 ${i !== systemStatuses.length - 1 ? "border-b border-slate-50" : ""}`}>
              <div className="flex-shrink-0">
                {row.icon === "check" ? (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                ) : (
                  <Loader size={16} className="text-rose-500 animate-spin" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-slate-700 leading-none">{row.label}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1.5 leading-none">{row.subtext}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
                row.badge === 'active' || row.badge === 'healthy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
              }`}>
                {row.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSystemStatus;
