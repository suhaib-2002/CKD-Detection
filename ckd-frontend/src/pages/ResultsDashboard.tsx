import React from "react";
import { 
  CheckCircle2, 
  ArrowLeft, 
  Download, 
  Share2, 
  Activity,
  FileText,
  ShieldAlert
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

interface ResultsDashboardProps {
  prediction: string;
  probability: number;
  featureImportance: { name: string; importance: number }[];
  onReset: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ 
  prediction, 
  probability, 
  featureImportance, 
  onReset 
}) => {
  const isCkd = prediction === "CKD";

  const handlePrint = () => {
    window.print();
  };

  // Compact Gauge Logic
  const gaugeData = [
    { value: probability, color: isCkd ? "#f43f5e" : "#10b981" },
    { value: 100 - probability, color: "#f1f5f9" }
  ];

  return (
    <div className="max-w-5xl mx-auto -mt-4 animate-in fade-in zoom-in-95 duration-700">
      {/* ── Action Toolbar (Surgical) ─────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-widest group"
        >
          <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
            <ArrowLeft size={12} />
          </div>
          New Assessment
        </button>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-indigo-600 bg-white border border-slate-200 rounded-xl transition-all shadow-sm">
            <Share2 size={15} />
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black hover:bg-black transition-all shadow-xl shadow-slate-200 uppercase tracking-widest"
          >
            <Download size={13} /> Export PDF Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Confidence Matrix (Surgical Size) ────────────────────── */}
        <div className="lg:col-span-5 bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-6 left-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Probability</h3>
          </div>
          
          <div className="w-full h-[180px] mt-4 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="70%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {gaugeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute bottom-[15%] flex flex-col items-center">
              <span className={`text-4xl font-black ${isCkd ? "text-rose-600" : "text-emerald-600"} tracking-tighter`}>{probability}%</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Confidence Score</span>
            </div>
          </div>
        </div>

        {/* ── Diagnosis Card (Compressed) ─────────────────────────── */}
        <div className={`lg:col-span-7 border rounded-[2rem] p-8 shadow-sm relative overflow-hidden flex flex-col justify-center ${
          isCkd ? "bg-rose-50/30 border-rose-100" : "bg-emerald-50/30 border-emerald-100"
        }`}>
          <div className="flex items-start gap-5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
              isCkd ? "bg-rose-600 text-white shadow-rose-100" : "bg-emerald-600 text-white shadow-emerald-100"
            }`}>
              {isCkd ? <ShieldAlert size={24} /> : <CheckCircle2 size={24} />}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                {isCkd ? "Chronic Kidney Disease Detected" : "No Clinical Evidence of CKD"}
              </h2>
              <p className="text-[13px] text-slate-500 font-medium mt-3 leading-relaxed max-w-md">
                {isCkd 
                  ? "The neural engine identified high-risk clinical markers. Immediate nephrological consultation is advised for diagnostic confirmation."
                  : "Clinical parameters remain within safe baseline ranges. Regular surveillance and periodic bio-marker checks are recommended."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-8 border-t border-slate-100 pt-6">
            <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Model: XGBoost-v4.2
            </div>
            <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Dynamic Sync
            </div>
          </div>
        </div>
      </div>

      {/* ── Intelligence Matrix (High Density) ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white border border-slate-200/60 rounded-[1.5rem] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-indigo-600" size={18} />
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Neural Feature Importance</h3>
          </div>
          <div className="space-y-4">
            {featureImportance.map((f, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-slate-500">{f.name}</span>
                  <span className="text-slate-900">{Math.round(f.importance * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${f.importance * 100}%` }}
                    className="h-full bg-indigo-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-[1.5rem] p-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="text-indigo-600" size={18} />
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Clinical Protocol</h3>
          </div>
          <div className="space-y-2">
            {[
              "Confirm findings with Serum Creatinine test",
              "Review Blood Pressure trends for 72 hours",
              "Evaluate for Diabetic Nephropathy markers",
              "Schedule Specialist Consultation within 48h"
            ].map((p, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-50/50 rounded-xl border border-transparent hover:border-slate-100 transition-all group">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:scale-125 transition-all" />
                <p className="text-[12px] font-bold text-slate-600 leading-tight">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
