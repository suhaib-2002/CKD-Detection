import React, { useState } from "react";
import { 
  Activity, 
  Zap, 
  Database, 
  RefreshCcw, 
  Clock, 
  AlertCircle,
  Eye,
  Trash2,
  X,
  Download,
  Terminal,
  Server
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Counter from "../components/common/Counter.tsx";

const SurveillancePage: React.FC = () => {
  const [logs, setLogs] = useState([
    { id: "LOG-9482", source: "Lab Registry A", items: 142, status: "Success", time: "2 mins ago", detail: "Full batch synchronization completed. No data collisions detected." },
    { id: "LOG-9481", source: "Manual Ingestion", items: 1,   status: "Success", time: "15 mins ago", detail: "Manual record added via clinical portal. Validation successful." },
    { id: "LOG-9480", source: "FastAPI Sync",    items: 500, status: "Partial", time: "1 hour ago", detail: "Connection timed out for 12 records. Re-queue initiated." },
    { id: "LOG-9479", source: "Serum Database",  items: 89,  status: "Success", time: "3 hours ago", detail: "Routine longitudinal update completed." },
  ]);

  const [selectedLog, setSelectedLog] = useState<any>(null);

  const handleDeleteLog = (id: string) => {
    if (confirm("Permanently archive this synchronization log?")) {
      setLogs(logs.filter(l => l.id !== id));
    }
  };

  const handleExport = () => {
    const csv = [
      ["Session ID", "Source", "Items", "Status", "Time"],
      ...logs.map(l => [l.id, l.source, l.items, l.status, l.time])
    ].map(r => r.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "surveillance_logs.csv";
    a.click();
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      {/* ── Engine Health Metrics ────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Engine Uptime", value: "99.98%", icon: <Clock />, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "API Latency",   value: "24ms",   icon: <Zap />,   color: "text-rose-500", bg: "bg-rose-50" },
          { label: "Sync Status",   value: "Healthy", icon: <RefreshCcw />, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Error Rate",    value: "0.02%",  icon: <AlertCircle />, color: "text-rose-500", bg: "bg-rose-50" },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-slate-200/50 p-3.5 rounded-xl shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center ${s.color} border border-transparent group-hover:border-current/10 transition-all`}>
              {React.cloneElement(s.icon as React.ReactElement, { size: 16 } as any)}
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{s.label}</p>
              <p className="text-[16px] font-bold text-slate-800 mt-1.5 tracking-tight">
                {typeof s.value === 'string' && (s.value.includes('%') || s.value.includes('ms')) ? (
                  <Counter 
                    value={parseFloat(s.value)} 
                    suffix={s.value.includes('%') ? '%' : 'ms'} 
                    decimals={s.value.includes('.') ? 2 : 0} 
                  />
                ) : s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Live Synchronization Logs ─────────────────────────────── */}
        <div className="lg:col-span-8 bg-white border border-slate-200/50 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/10">
            <div>
              <h3 className="text-[13px] font-bold text-slate-800">Live Synchronization Logs</h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Real-time data ingestion and model sync activity.</p>
            </div>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[9px] font-bold text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all uppercase tracking-widest shadow-sm"
            >
              <Download size={12} />
              Export Logs
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30 border-b border-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-5 py-3">Session ID</th>
                  <th className="px-5 py-3">Source</th>
                  <th className="px-5 py-3 text-center">Items</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/20 transition-all group">
                    <td className="px-5 py-3 text-[11px] font-bold text-slate-700">{log.id}</td>
                    <td className="px-5 py-3 text-[11px] font-medium text-slate-500">
                      <div className="flex items-center gap-2">
                        <Database size={12} className="text-slate-300" />
                        {log.source}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[11px] font-bold text-slate-600 text-center">{log.items}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border ${
                        log.status === "Success" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => setSelectedLog(log)}
                          className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 transition-all"
                        >
                          <Eye size={13} />
                        </button>
                        <button 
                          onClick={() => handleDeleteLog(log.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Engine Health & Activity ──────────────────────────────── */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-[13px] font-bold mb-1.5">Neural Health Index</h3>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">System performance within optimal XGBoost validation parameters.</p>
              
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-rose-500">
                  <Counter value={98} />
                </span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Global Score</span>
              </div>
              
              <div className="mt-3 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 w-[98%] shadow-[0_0_8px_rgba(244,63,94,0.4)] transition-all duration-1000" />
              </div>
            </div>
            <Activity className="absolute -right-4 -bottom-4 text-rose-500/10 w-24 h-24 rotate-12 group-hover:scale-110 transition-transform" />
          </div>

          <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
               <Server size={14} className="text-rose-500" />
               <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-widest">API Node Status</h3>
            </div>
            <div className="space-y-3.5">
              {[
                { name: "Production Node 01", status: "Healthy" },
                { name: "FastAPI Backend",    status: "Active" },
                { name: "ML Model Registry",  status: "Active" },
              ].map((node, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                    <span className="text-[11px] font-semibold text-slate-600 group-hover:text-rose-500 transition-colors">{node.name}</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-slate-400 transition-colors">Operational</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Log Detail Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedLog(null)}
              className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/50"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-rose-50 text-rose-500 rounded-lg">
                    <Terminal size={16} />
                  </div>
                  <h4 className="text-[13px] font-bold text-slate-800">Log Details: {selectedLog.id}</h4>
                </div>
                <button onClick={() => setSelectedLog(null)} className="text-slate-300 hover:text-rose-500"><X size={16} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Source</p>
                    <p className="text-[12px] font-semibold text-slate-700 mt-1">{selectedLog.source}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Items Processed</p>
                    <p className="text-[12px] font-semibold text-slate-700 mt-1">{selectedLog.items} Units</p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Diagnostic Output</p>
                  <div className="mt-2 p-3 bg-slate-900 rounded-xl">
                    <code className="text-[10px] text-rose-300 font-mono leading-relaxed">{selectedLog.detail}</code>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-right">
                <button onClick={() => setSelectedLog(null)} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50">Close Diagnostic</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SurveillancePage;
