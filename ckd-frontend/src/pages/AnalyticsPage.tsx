import React from "react";
import ClinicalTrendCharts from "../components/charts/ClinicalTrendCharts.tsx";
import { Zap, ShieldCheck, Activity } from "lucide-react";
import { storage } from "../utils/storage.ts";
import Counter from "../components/common/Counter.tsx";

const AnalyticsPage: React.FC = () => {
  const records = storage.getRecords();
  const totalCount = records.length;

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      {/* ── Top Row: Intelligence KPIs (SaaS Style) ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { 
            label: "Model Confidence", 
            value: "98.4%", 
            trend: "+0.3% Calibration", 
            count: `v4.2 Stable`,
            color: "text-rose-600", 
            bg: "bg-rose-50",
            icon: <Zap size={14} />
          },
          { 
            label: "Predictive Precision", 
            value: "96.7%", 
            trend: "Clinical Threshold", 
            count: `${totalCount} Profiles`,
            color: "text-emerald-600", 
            bg: "bg-emerald-50",
            icon: <ShieldCheck size={14} />
          },
          { 
            label: "Risk Sensitivity", 
            value: "High", 
            trend: "Optimal Profile Fit", 
            count: "Active Node",
            color: "text-rose-600", 
            bg: "bg-rose-50",
            icon: <Activity size={14} />
          },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200/50 rounded-xl p-3 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
              <div className={`${s.bg} ${s.color} p-1 rounded-lg border border-transparent group-hover:border-current/10 transition-all`}>
                {React.cloneElement(s.icon as React.ReactElement, { size: 12 } as any)}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-[17px] font-bold text-slate-900 tracking-tight leading-none">
                <Counter value={parseFloat(s.value)} suffix={s.value.includes('%') ? '%' : ''} decimals={s.value.includes('.') ? 1 : 0} />
              </h3>
              <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">{s.count}</span>
            </div>
            <div className={`inline-flex items-center mt-2 px-1.5 py-0.5 rounded text-[7px] font-bold uppercase tracking-widest ${s.bg} ${s.color} border border-transparent`}>
              {s.trend}
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Visualization ────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm">
        <ClinicalTrendCharts />
      </div>

      {/* ── Additional Intelligence Context ────────────────────────────── */}
      <div className="bg-slate-900 rounded-2xl p-5 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 border border-rose-500/20 shadow-lg shadow-rose-500/10">
            <Zap size={20} />
          </div>
          <div>
            <p className="text-[13px] font-bold tracking-tight">Neural Engine Synchronization</p>
            <p className="text-[10px] text-slate-400 font-medium mt-1">All model weights and clinical biases optimized for v4.2 stable release.</p>
          </div>
        </div>
        <button className="px-5 py-2 bg-rose-600 hover:bg-rose-700 rounded-xl text-[10px] font-bold transition-all shadow-xl shadow-rose-600/20 uppercase tracking-widest">
          Recalibrate Engine
        </button>
      </div>
    </div>
  );
};

export default AnalyticsPage;
