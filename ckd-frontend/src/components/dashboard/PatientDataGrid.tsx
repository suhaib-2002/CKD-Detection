import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  Download, 
  Database,
  Link as LinkIcon,
  User,
  Activity,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Edit2,
  Save,
  Clock,
  ChevronDown,
  LayoutGrid
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { storage, type PatientRecord } from "../../utils/storage.ts";

// ── Components ────────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: string; onStatusChange: (newStatus: any) => void }> = ({ status, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const statusConfig: Record<string, string> = {
    "Active Risk": "bg-rose-50 text-rose-600 border-rose-100",
    "Stable":      "bg-emerald-50 text-emerald-600 border-emerald-100",
    "Evaluating":  "bg-amber-50 text-amber-600 border-amber-100",
  };

  const options = ["Active Risk", "Stable", "Evaluating"];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border flex items-center gap-1.5 hover:bg-white transition-all ${statusConfig[status] || "bg-slate-50 text-slate-500 border-slate-100"}`}
      >
        {status}
        <ChevronDown size={10} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              className="absolute left-0 mt-2 w-36 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { onStatusChange(opt); setIsOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-tight hover:bg-slate-50 transition-colors ${opt === status ? "text-rose-600 bg-rose-50/30" : "text-slate-500"}`}
                >
                  {opt}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────

const PatientDataGrid: React.FC = () => {
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [search, setSearch]   = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const itemsPerPage = 7;

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setRecords(storage.getRecords());
  };

  const filtered = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || 
                            r.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleStatusChange = (id: string, newStatus: any) => {
    const updated = storage.updateRecord(id, { status: newStatus });
    setRecords(updated);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ["ID", "Name", "Type", "Status", "Completeness", "Last Sync"];
      const csvContent = [
        headers.join(","),
        ...records.map(r => [r.id, r.name, r.ingestionType, r.status, `${r.completeness}%`, r.lastSync].join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `CKD_Patient_Registry_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 1200);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to purge this clinical record?")) {
      const updated = storage.deleteRecord(id);
      setRecords(updated);
      if (currentData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleUpdatePatient = (id: string, updates: any) => {
    const updated = storage.updateRecord(id, updates);
    setRecords(updated);
    if (selectedPatient?.id === id) {
      setSelectedPatient({ ...selectedPatient, ...updates });
    }
  };

  return (
    <div className="bg-white border border-slate-200/50 rounded-2xl overflow-hidden shadow-sm">
      {/* ── Toolbar ──────────────────────────────────────────────── */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/10">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            <input 
              type="text" 
              placeholder="Search Clinical Records..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-[12px] font-medium text-slate-600 placeholder-slate-300 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/5 transition-all"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {["All", "Active Risk", "Stable", "Evaluating"].map((status) => (
              <button
                key={status}
                onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all border ${
                  statusFilter === status 
                    ? "bg-rose-600 text-white border-rose-600 shadow-sm" 
                    : "bg-white text-slate-400 border-slate-200 hover:border-rose-300 hover:text-rose-500"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={refreshData}
            className="p-2 text-slate-300 hover:text-rose-500 transition-all"
            title="Refresh Data"
          >
            <Clock size={16} />
          </button>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-xl font-semibold text-[11px] hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm disabled:opacity-50"
          >
            {isExporting ? <div className="w-3 h-3 border-2 border-slate-200 border-t-rose-500 rounded-full animate-spin" /> : <Download size={13} />}
            {isExporting ? "PREPARING..." : "EXPORT CSV"}
          </button>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/30 text-slate-400 border-b border-slate-100">
              <th className="px-6 py-3 text-[9px] font-semibold uppercase tracking-widest">Patient Identity</th>
              <th className="px-6 py-3 text-[9px] font-semibold uppercase tracking-widest">Source</th>
              <th className="px-6 py-3 text-[9px] font-semibold uppercase tracking-widest">Status</th>
              <th className="px-6 py-3 text-[9px] font-semibold uppercase tracking-widest">Integrity</th>
              <th className="px-6 py-3 text-[9px] font-semibold uppercase tracking-widest">Last Sync</th>
              <th className="px-6 py-3 text-[9px] font-semibold uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {currentData.length > 0 ? currentData.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50/20 transition-all group cursor-default">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-rose-50 group-hover:text-rose-500 transition-all">
                      <User size={14} />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-slate-700 leading-tight">{record.name}</p>
                      <p className="text-[10px] font-medium text-slate-400 mt-0.5 tracking-tight uppercase">{record.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {record.ingestionType === "REST API" ? <Database size={12} className="text-rose-400" /> : <LinkIcon size={12} className="text-slate-300" />}
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-tight">{record.ingestionType}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={record.status} onStatusChange={(newS) => handleStatusChange(record.id, newS)} />
                </td>
                <td className="px-6 py-4">
                  <div className="w-24 space-y-1.5">
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${record.completeness > 90 ? "bg-emerald-400" : "bg-rose-400"}`} 
                        style={{ width: `${record.completeness}%` }} 
                      />
                    </div>
                    <div className="flex justify-between text-[8px] font-semibold text-slate-400 uppercase tracking-tighter">
                      <span>{record.completeness}% Quality</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[11px] font-medium text-slate-400">
                  {record.lastSync}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                    <button onClick={() => { setSelectedPatient(record); setIsEditMode(false); }} className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 transition-all" title="View Assessment">
                      <Eye size={14} />
                    </button>
                    <button onClick={() => { setSelectedPatient(record); setIsEditMode(true); }} className="p-1.5 text-slate-300 hover:text-emerald-500 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 transition-all" title="Edit Profile">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(record.id)} className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 transition-all" title="Purge Record">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <Activity size={24} className="mx-auto text-slate-100 mb-3" />
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">No matching clinical records</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ───────────────────────────────────────────── */}
      <div className="px-5 py-3 bg-slate-50/20 flex items-center justify-between border-t border-slate-100">
        <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">
          Active Registry <span className="mx-1 text-slate-200">|</span> {filtered.length} Valid Profiles
        </p>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-1 text-slate-300 hover:text-rose-500 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 flex items-center justify-center text-[10px] font-semibold rounded-lg transition-all ${
                  currentPage === page 
                    ? "bg-rose-600 text-white shadow-md shadow-rose-100" 
                    : "text-slate-400 hover:bg-white hover:border-slate-200 border border-transparent"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1 text-slate-300 hover:text-rose-500 disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ── SaaS Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedPatient && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPatient(null)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-2xl bg-white rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-200/50"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-100">
                    <LayoutGrid size={20} />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold text-slate-800 tracking-tight leading-none">
                      {isEditMode ? "Edit Clinical Assessment" : "Clinical Assessment Details"}
                    </h2>
                    <p className="text-[9px] font-semibold text-slate-400 mt-2 uppercase tracking-[0.2em]">{selectedPatient.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPatient(null)}
                  className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-300 hover:text-rose-500"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="px-8 py-6 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">Patient Name</label>
                    {isEditMode ? (
                      <input 
                        type="text" 
                        value={selectedPatient.name}
                        onChange={(e) => handleUpdatePatient(selectedPatient.id, { name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-rose-400 transition-all"
                      />
                    ) : (
                      <p className="text-[15px] font-semibold text-slate-800">{selectedPatient.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">Clinical Phase</label>
                    <div className="pt-0.5">
                      <StatusBadge 
                        status={selectedPatient.status} 
                        onStatusChange={(s) => handleStatusChange(selectedPatient.id, s)} 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                    <h3 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-2">
                      <Activity size={14} /> Clinical Parameters
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(selectedPatient.data || {}).map(([key, val]: [string, any]) => (
                      <div key={key} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all group">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2.5 group-hover:text-rose-400 transition-colors">{key}</p>
                        {isEditMode ? (
                          <input 
                            type="text" 
                            value={val}
                            onChange={(e) => {
                              const newData = { ...selectedPatient.data, [key]: e.target.value };
                              handleUpdatePatient(selectedPatient.id, { data: newData });
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-[12px] font-medium text-slate-700 focus:outline-none focus:border-rose-400 transition-all"
                          />
                        ) : (
                          <p className="text-[14px] font-semibold text-slate-700">{val}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-end gap-3">
                {isEditMode ? (
                  <button 
                    onClick={() => { setSelectedPatient(null); setIsEditMode(false); }}
                    className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-100"
                  >
                    <Save size={14} /> Update Record
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditMode(true)}
                    className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <Edit2 size={14} /> Edit Clinical File
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientDataGrid;
