import React from "react";
import PatientDataGrid from "../components/dashboard/PatientDataGrid.tsx";
import { UserPlus, Users, Activity, BarChart3 } from "lucide-react";
import { storage } from "../utils/storage.ts";
import Counter from "../components/common/Counter.tsx";

interface PatientsPageProps {
  onNavigate: (tab: string) => void;
}

const PatientsPage: React.FC<PatientsPageProps> = ({ onNavigate }) => {
  const records = storage.getRecords();
  const totalCount = records.length;
  const activeRiskCount = records.filter(r => r.status === "Active Risk").length;

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      {/* ── Summary Metrics (Compact) ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
          { label: "Total Profiles", value: totalCount,     trend: "Registry", icon: <Users />, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Active Risk",    value: activeRiskCount, trend: "Urgent",   icon: <Activity />, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Fill Integrity", value: "90.3%",         trend: "Quality",  icon: <BarChart3 />, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200/50 rounded-xl p-3 shadow-sm flex items-center gap-3.5 group hover:shadow-md transition-all">
            <div className={`w-9 h-9 rounded-lg ${s.bg} ${s.color} flex items-center justify-center border border-transparent group-hover:border-rose-100 transition-all`}>
              {React.cloneElement(s.icon as React.ReactElement, { size: 14 } as any)}
            </div>
            <div>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">{s.label}</p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <p className="text-[17px] font-bold text-slate-900 tracking-tight">
                  <Counter value={typeof s.value === 'number' ? s.value : parseFloat(s.value)} suffix={typeof s.value === 'string' && s.value.includes('%') ? '%' : ''} decimals={typeof s.value === 'string' && s.value.includes('.') ? 1 : 0} />
                </p>
                <span className="text-[7px] font-bold text-slate-300 uppercase tracking-tighter">Count</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Patient Management Shell ────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <div>
             <h3 className="text-[15px] font-bold text-slate-800 tracking-tight leading-none">Clinical Registry</h3>
             <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-tight">Real-time Patient Data & Risk Assessment</p>
           </div>
           <button
             onClick={() => onNavigate("predict")}
             className="flex items-center gap-2.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-rose-100 uppercase tracking-widest"
           >
             <UserPlus size={14} />
             Add New Profile
           </button>
        </div>
        <PatientDataGrid />
      </div>
    </div>
  );
};

export default PatientsPage;
