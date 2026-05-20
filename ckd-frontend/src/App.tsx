import React, { useState } from "react";
import Sidebar from "./components/layout/Sidebar.tsx";
import MultiStepForm from "./components/forms/MultiStepForm.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import PatientsPage from "./pages/PatientsPage.tsx";
import CaseHistoryPage from "./pages/CaseHistoryPage.tsx";
import AnalyticsPage from "./pages/AnalyticsPage.tsx";
import SurveillancePage from "./pages/SurveillancePage.tsx";
import CompliancePage from "./pages/CompliancePage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import { Search, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const pageMeta: Record<string, { title: string; sub: string }> = {
  dashboard:    { title: "Clinical Dashboard",      sub: "Real-time Patient Insights" },
  predict:      { title: "Neural Prediction",       sub: "XGBoost Engine Validation" },
  patients:     { title: "Patient Records",         sub: "Master Clinical Registry" },
  history:      { title: "Case History",            sub: "Longitudinal Timeline" },
  analytics:    { title: "Analytics Terminal",      sub: "Risk Distribution Intelligence" },
  surveillance: { title: "Engine Surveillance",     sub: "Health & Node Monitoring" },
  compliance:   { title: "Project Compliance",      sub: "Regulatory Data Standards" },
  settings:     { title: "System Settings",         sub: "Engine Configuration" },
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const notifications = [
    { id: 1, text: "High-Risk Patient Detected (CKD-9241)", time: "2m ago", type: "urgent" },
    { id: 2, text: "System Calibration Complete", time: "1h ago", type: "info" },
    { id: 3, text: "Registry Sync Successful", time: "3h ago", type: "success" },
  ];

  const meta = pageMeta[activeTab] || pageMeta.dashboard;

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":    return <Dashboard />;
      case "predict":      return <MultiStepForm />;
      case "patients":     return <PatientsPage onNavigate={setActiveTab} />;
      case "history":      return <CaseHistoryPage />;
      case "analytics":    return <AnalyticsPage />;
      case "surveillance": return <SurveillancePage />;
      case "compliance":   return <CompliancePage />;
      case "settings":     return <SettingsPage />;
      default:             return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 ml-60 min-h-screen flex flex-col overflow-x-hidden">
        {/* ── Navbar ────────────────────────────────────────────────── */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-xl group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search Clinical Parameters or Modules..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = searchVal.toLowerCase();
                    if (val.includes('predict')) setActiveTab('predict');
                    else if (val.includes('patient')) setActiveTab('patients');
                    else if (val.includes('analytic')) setActiveTab('analytics');
                    else if (val.includes('complian')) setActiveTab('compliance');
                    else if (val.includes('settin')) setActiveTab('settings');
                    else if (val.includes('dash')) setActiveTab('dashboard');
                    else {
                      setActiveTab('patients');
                      setSearchVal("");
                    }
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-[13px] font-medium text-slate-600 placeholder-slate-300 focus:outline-none focus:border-rose-400 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-8 relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border border-transparent relative ${
                showNotifications ? "bg-rose-50 text-rose-600 border-rose-100" : "text-slate-400 hover:bg-slate-50 hover:text-rose-600"
              }`}
            >
              <Bell size={18} />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white" />
            </button>

            {/* ── Notifications ──────────────────────────────────────── */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">System Alerts</span>
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[9px] font-bold rounded-md">3 NEW</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-all cursor-pointer group">
                        <div className="flex items-start gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                            n.type === 'urgent' ? 'bg-rose-500' : n.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`} />
                          <div>
                            <p className="text-[11px] font-semibold text-slate-700 leading-tight group-hover:text-slate-900">{n.text}</p>
                            <p className="text-[9px] font-medium text-slate-400 mt-1 uppercase tracking-tight">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-3 bg-white text-[10px] font-bold text-rose-600 uppercase tracking-widest hover:bg-slate-50 transition-all">
                    View Activity Log
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="h-5 w-[1px] bg-slate-200 mx-1" />
            <div className="flex items-center gap-3 pl-2">
               <div className="text-right hidden sm:block">
                 <p className="text-[12px] font-bold text-slate-800 leading-none">Dr. Maida</p>
                 <p className="text-[10px] text-emerald-500 font-semibold mt-1.5 uppercase tracking-wider">Online</p>
               </div>
               <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white text-[12px] font-bold shadow-lg">
                 M
               </div>
            </div>
          </div>
        </header>

        {/* ── Main Content Area ─────────────────────────────────────── */}
        <div className="flex-1 p-5 lg:p-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Clinical Portal</span>
                <span className="text-slate-200">/</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{meta.sub}</span>
              </div>
              <h1 className="text-[28px] font-bold text-slate-900 tracking-tight leading-none">{meta.title}</h1>
            </div>

            {renderPage()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;