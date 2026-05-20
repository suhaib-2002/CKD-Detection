import React, { useState } from "react";
import { 
  Activity, 
  BarChart2,
  ShieldCheck,
  Target,
  CheckCircle2,
  AlertTriangle,
  X,
  Server,
  Loader
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ClinicalTrendCharts from "../components/charts/ClinicalTrendCharts.tsx";
import { storage } from "../utils/storage.ts";
import Counter from "../components/common/Counter.tsx";

const ActiveAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState([
    { id: "PATIENT-042", msg: "Serum Creatinine spike detected (>4.5 mg/dl)", time: "2 mins ago", type: "critical" },
    { id: "DATA-103",    msg: "Missing Specific Gravity value in session data.", time: "15 mins ago", type: "warning" },
    { id: "SYSTEM-01",   msg: "Daily clinical registry synchronization completed.", time: "1 hour ago", type: "info" },
    { id: "PATIENT-087", msg: "Inconsistent Hematology data detected for record 087.", time: "2 hours ago", type: "warning" },
  ]);

  const dismiss = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="bg-white border border-slate-200/50 rounded-2xl p-5 h-full shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <AlertTriangle size={15} className="text-rose-500" />
          <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Clinical Alerts</h3>
        </div>
      </div>
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {alerts.map((alert, i) => (
            <motion.div 
              key={alert.id} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex gap-4 group border-b border-slate-50 pb-4 last:border-0"
            >
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                alert.type === "critical" ? "bg-rose-500" : alert.type === "warning" ? "bg-amber-500" : "bg-rose-400"
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <p className="text-[11px] font-bold text-slate-700 tracking-tight uppercase leading-none">{alert.id}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${
                      alert.type === "critical" ? "bg-rose-500 text-white border-rose-600" : "bg-slate-50 text-slate-400 border-slate-200"
                    }`}>
                      {alert.type}
                    </span>
                    <button 
                      onClick={() => dismiss(alert.id)}
                      className="p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug font-medium">{alert.msg}</p>
                <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-tight">{alert.time}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const SystemStatusList: React.FC = () => {
  const systems = [
    { name: "FastAPI ML Integration", status: "Active", time: "Last sync: 2 mins ago", type: "active" },
    { name: "Clinical Data Registry", status: "Active", time: "Last sync: 5 mins ago", type: "active" },
    { name: "Prediction Engine", status: "Running", time: "Validating test matrix...", type: "running" },
    { name: "API Gateway Client", status: "Healthy", time: "23 active sessions", type: "healthy" },
  ];

  return (
    <div className="bg-white border border-slate-200/50 rounded-2xl p-5 h-full shadow-sm">
      <div className="flex items-center gap-2.5 mb-5">
         <Server size={15} className="text-rose-500" />
         <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Engine Status</h3>
      </div>
      <div className="space-y-4">
        {systems.map((sys, i) => (
          <div key={i} className={`flex items-center justify-between gap-4 pb-3 border-b border-slate-50 last:border-0 last:pb-0 group`}>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all group-hover:scale-110 ${
                sys.type === "running" ? "bg-rose-50 border-rose-100 text-rose-500" : "bg-emerald-50 border-emerald-100 text-emerald-500"
              }`}>
                {sys.type === "running" ? <Loader size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
              </div>
              <div>
                <p className="text-[12px] font-bold text-slate-700 leading-none group-hover:text-rose-600 transition-colors">{sys.name}</p>
                <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{sys.time}</p>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
              sys.type === "running" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
            }`}>
              {sys.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const records = storage.getRecords();
  const totalRecords = records.length;

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* ── Top Row: Stats (Animated Counters) ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Profiles",  value: totalRecords, trend: "+2.3%", icon: <BarChart2 />, up: true, suffix: "" },
          { label: "Risk Detections", value: 142,   trend: "+1.8%", icon: <Activity />, up: true, suffix: "" },
          { label: "Data Quality",    value: 98.2,  trend: "-0.3%", icon: <ShieldCheck />, up: false, suffix: "%", decimals: 1 },
          { label: "Model Accuracy",  value: 98.2,  trend: "Stable", icon: <Target />, up: true, suffix: "%", decimals: 1 },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200/50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-2">
               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.label}</span>
               <div className={`p-1 rounded-lg border border-transparent transition-all ${stat.up ? "bg-emerald-50 text-emerald-500 group-hover:border-emerald-200" : "bg-rose-50 text-rose-500 group-hover:border-rose-200"}`}>
                 {React.cloneElement(stat.icon as React.ReactElement, { size: 12 } as any)}
               </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <h3 className="text-[17px] font-bold text-slate-900 tracking-tight leading-none">
                <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
              </h3>
            </div>
            <div className={`inline-flex items-center mt-2.5 px-1.5 py-0.5 rounded text-[7px] font-bold uppercase tracking-widest ${stat.up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      {/* ── Middle Row: Charts ─────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm">
        <ClinicalTrendCharts />
      </div>

      {/* ── Bottom Row: Lists ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <ActiveAlerts />
        </div>
        <div className="lg:col-span-5">
          <SystemStatusList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
