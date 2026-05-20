import React, { useState } from "react";
import { 
  Shield, 
  CheckCircle2, 
  Search, 
  FileSearch, 
  Clock 
} from "lucide-react";

const CompliancePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [checklist, setChecklist] = useState([
    { label: "Data Encryption at Rest (AES-256)", checked: true },
    { label: "Patient Anonymization Protocols", checked: true },
    { label: "Neural Model Bias Audits", checked: true },
    { label: "Multi-Factor Authentication", checked: true },
    { label: "Access Logging & Auditing", checked: true },
    { label: "API Rate Limiting", checked: false },
  ]);

  const auditLogs = [
    { user: "Dr. Maida", action: "Accessed Patient Record CKD-9482", role: "Admin", time: "5 mins ago", node: "192.168.1.42" },
    { user: "FastAPI System", action: "Generated Risk Profile for session XJ-01", role: "System", time: "1 hour ago", node: "Internal" },
    { user: "Dr. Maida", action: "Modified System Weights (Slight Calibration)", role: "Admin", time: "3 hours ago", node: "192.168.1.42" },
    { user: "Patient Portal", action: "Read-only access to lab results (ID-087)", role: "Client", time: "5 hours ago", node: "10.0.4.12" },
  ];

  const toggleCheck = (index: number) => {
    const updated = [...checklist];
    updated[index].checked = !updated[index].checked;
    setChecklist(updated);
  };

  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-[1400px] mx-auto">
      {/* ── Compressed Status Metrics ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/60 p-5 rounded-[1.5rem] shadow-sm relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-all">
            <Shield size={100} />
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Security Status</p>
          <h3 className="text-xl font-black text-slate-900 tracking-tighter">Audit Ready</h3>
          <div className="mt-3 flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-wider">
            <CheckCircle2 size={14} /> Protocols Active
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 p-5 rounded-[1.5rem] shadow-sm relative overflow-hidden">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Data Retention</p>
          <h3 className="text-xl font-black text-slate-900 tracking-tighter">7 Years</h3>
          <div className="mt-3 flex items-center gap-2 text-indigo-500 font-bold text-[10px] uppercase tracking-wider">
            <Clock size={14} /> Next Purge: 2033
          </div>
        </div>

        <div className="bg-indigo-600 p-5 rounded-[1.5rem] shadow-xl shadow-indigo-100 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-8 text-white opacity-[0.05] group-hover:scale-110 transition-all">
            <CheckCircle2 size={100} />
          </div>
          <p className="text-[9px] font-black text-indigo-100 uppercase tracking-widest mb-1 opacity-60">Audit Score</p>
          <h3 className="text-2xl font-black text-white tracking-tighter leading-none mb-2">100/100</h3>
          <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest opacity-80 italic">HIPAA Compliant</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Compact Standards Checklist ───────────────────────────── */}
        <div className="lg:col-span-4 bg-white border border-slate-200/60 rounded-[1.5rem] p-5 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileSearch size={14} />
            </div>
            Standards Checklist
          </h3>
          <div className="space-y-3.5">
            {checklist.map((item, i) => (
              <div 
                key={i} 
                onClick={() => toggleCheck(i)}
                className="flex items-center gap-3 group cursor-pointer"
              >
                <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                  item.checked ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-200 group-hover:border-indigo-400"
                }`}>
                  {item.checked && <CheckCircle2 size={10} strokeWidth={3} />}
                </div>
                <span className={`text-[11px] font-bold transition-colors ${item.checked ? "text-slate-800" : "text-slate-400 group-hover:text-slate-600"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Compact Audit Logs ────────────────────────────────────── */}
        <div className="lg:col-span-8 bg-white border border-slate-200/60 rounded-[1.5rem] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Surgical Audit Logs</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              <input 
                type="text" 
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg py-1.5 pl-9 pr-4 text-[11px] font-bold text-slate-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all w-48"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-50 bg-slate-50/20">
                  <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest">User</th>
                  <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest">Action</th>
                  <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest">Time</th>
                  <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest">Node</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLogs.length > 0 ? filteredLogs.map((log, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                          {log.user.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-700 leading-tight">{log.user}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{log.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-[11px] font-bold text-slate-600">{log.action}</td>
                    <td className="px-6 py-3 text-[10px] font-bold text-slate-400">{log.time}</td>
                    <td className="px-6 py-3">
                      <span className="text-[10px] font-black text-indigo-500 bg-indigo-50/50 px-2 py-0.5 rounded-md">{log.node}</span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-300 font-bold uppercase tracking-widest text-[10px]">No audit matches</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompliancePage;
