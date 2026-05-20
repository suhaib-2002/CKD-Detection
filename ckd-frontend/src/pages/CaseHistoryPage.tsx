import React, { useState } from "react";
import DashboardSystemStatus from "../components/dashboard/DashboardSystemStatus.tsx";
import { History, Activity, ChevronRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CaseHistoryPage: React.FC = () => {
  const [filter, setFilter] = useState("All");
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null);

  const timelineEntries = [
    { time: "10:30 AM", patient: "Patient Alpha (CKD-042)", action: "Assessment re-run triggered — Serum Creatinine flag detected", detail: "The engine detected a 40% spike in creatinine levels compared to last month. Patient flagged for immediate nephrology review.", color: "bg-rose-500", status: "Critical" },
    { time: "10:15 AM", patient: "Patient Bravo (CKD-103)", action: "Full 24-parameter assessment completed — Result: Stable", detail: "XGBoost engine validation complete. Risk score: 12.3 (Low). All bio-markers within healthy clinical range.", color: "bg-emerald-500", status: "Healthy" },
    { time: "09:58 AM", patient: "Patient Delta (CKD-201)", action: "Step 2 data incomplete — Hemoglobin missing", detail: "Systemic data sync failed for Step 2. Manual entry required to complete the prediction cycle.", color: "bg-amber-400", status: "Warning" },
    { time: "09:40 AM", patient: "FastAPI Engine",          action: "Ensemble model weights synchronized successfully", detail: "Node v4.2 weights applied to production. 0.02ms latency achieved during handshake.", color: "bg-rose-400", status: "System" },
    { time: "09:22 AM", patient: "Patient Echo (CKD-319)",  action: "Assessment completed — Result: Stable", detail: "Final report generated. Patient remains in clinical Phase 1.", color: "bg-emerald-500", status: "Healthy" },
  ];

  const filteredEntries = filter === "All" ? timelineEntries : timelineEntries.filter(e => e.status === filter);

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      {/* ── Active Alerts ────────────────────────────────────────── */}
      <DashboardSystemStatus />

      {/* ── Longitudinal Timeline ─────────────────────────────────── */}
      <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-sm shadow-rose-100">
               <History size={16} />
             </div>
             <div>
               <h3 className="text-[14px] font-bold text-slate-800">Longitudinal Timeline</h3>
               <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Audit log of all engine activities</p>
             </div>
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-100">
            {["All", "Critical", "Warning", "Healthy"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${
                  filter === f 
                    ? "bg-white text-rose-600 shadow-sm border border-slate-200/50" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-0 relative">
          <AnimatePresence mode="popLayout">
            {filteredEntries.map((item, i) => {
              const isExpanded = selectedEntry === i;
              return (
                <motion.div 
                  key={item.patient + i} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex items-stretch gap-6 group relative"
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 border-2 border-white shadow-sm z-10 ${item.color} mt-1`} />
                    {i < filteredEntries.length - 1 && <div className="w-[1.5px] flex-1 bg-slate-50 group-hover:bg-rose-100 transition-colors" />}
                  </div>
                  <div className="pb-6 pt-0 flex-1">
                    <div 
                      onClick={() => setSelectedEntry(isExpanded ? null : i)}
                      className={`p-3 rounded-xl transition-all cursor-pointer border border-transparent ${
                        isExpanded ? "bg-slate-50/80 border-slate-200/50 shadow-sm" : "hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{item.time}</span>
                          <span className="text-[13px] font-bold text-slate-700 tracking-tight leading-none">{item.patient}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
                            item.status === "Critical" ? "bg-rose-50 text-rose-600 border-rose-100" : 
                            item.status === "Healthy" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                            "bg-white text-slate-500 border-slate-200"
                          }`}>{item.status}</span>
                          <ChevronRight size={12} className={`text-slate-300 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                        </div>
                      </div>
                      <p className="text-[12px] text-slate-500 font-medium leading-relaxed">{item.action}</p>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 pt-3 border-t border-slate-200/50 flex gap-3">
                              <Info size={14} className="text-rose-400 flex-shrink-0 mt-0.5" />
                              <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                                {item.detail}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CaseHistoryPage;
