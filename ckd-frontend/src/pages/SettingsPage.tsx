import React, { useState } from "react";
import { 
  User, 
  Shield, 
  Bell, 
  Cpu, 
  ChevronRight, 
  Globe, 
  Mail, 
  Lock, 
  Zap, 
  Save,
  AlertCircle,
  Copy,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  
  // States for interactive elements
  const [mfaActive, setMfaActive] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState([
    { id: "email", label: "Email Critical Reports", desc: "Daily PDF summaries of high-risk findings.", active: true },
    { id: "realtime", label: "Real-time Engine Alerts", desc: "Push notifications for every prediction run.", active: true },
    { id: "sync", label: "Database Sync Events", desc: "Logs of all registry updates.", active: false },
  ]);

  const tabs = [
    { id: "general", label: "General", icon: <Globe size={16} /> },
    { id: "security", label: "Security", icon: <Shield size={16} /> },
    { id: "api", label: "API & Neural Engine", icon: <Cpu size={16} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
  ];

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      triggerToast("Configuration Updated Successfully");
    }, 1000);
  };

  const toggleNotification = (id: string) => {
    setNotificationSettings(prev => prev.map(item => 
      item.id === id ? { ...item, active: !item.active } : item
    ));
    triggerToast("Notification Preferences Updated");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    triggerToast("API Key Copied to Clipboard");
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Settings Sidebar (Compact) ──────────────────────────────── */}
        <div className="lg:w-60 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all border ${
                activeTab === tab.id 
                  ? "bg-white text-rose-600 shadow-sm border-slate-200/50" 
                  : "text-slate-500 hover:bg-white hover:text-slate-800 border-transparent"
              }`}
            >
              <span className={`${activeTab === tab.id ? "text-rose-500" : "text-slate-400"}`}>
                {tab.icon}
              </span>
              <span className="text-[12px] font-bold">{tab.label}</span>
              {activeTab === tab.id && <ChevronRight size={12} className="ml-auto text-rose-300" />}
            </button>
          ))}
        </div>

        {/* ── Content Area (SaaS Style) ───────────────────────────────── */}
        <div className="flex-1">
          <div className="bg-white border border-slate-200/50 rounded-2xl p-6 shadow-sm min-h-[450px] relative">
            {activeTab === "general" && (
              <div className="space-y-6 max-w-2xl animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">Clinical Profile</h3>
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">Manage your personal and clinical identity within the portal.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                      <input 
                        type="text" 
                        defaultValue="Dr. Maida" 
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[12px] outline-none focus:border-rose-400 transition-all font-bold text-slate-700" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                      <input 
                        type="email" 
                        defaultValue="maida@ckdguard.ai" 
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[12px] outline-none focus:border-rose-400 transition-all font-bold text-slate-700" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50">
                   <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-rose-600 text-white text-[11px] font-bold rounded-xl shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all flex items-center gap-2 uppercase tracking-widest disabled:opacity-50"
                   >
                     {isSaving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                     {isSaving ? "Saving..." : "Save Profile Changes"}
                   </button>
                </div>
              </div>
            )}

            {activeTab === "api" && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">Neural Engine & API</h3>
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">Configure model integration and integration keys.</p>
                </div>

                <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <Zap className="text-rose-400" size={18} />
                      <span className="text-[13px] font-bold tracking-tight">FastAPI Production Key</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-widest">Live Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-[12px] text-slate-300 tracking-wider overflow-hidden truncate">
                      sk_ckd_live_v42_engine_alpha_7792
                    </div>
                    <button 
                      onClick={() => copyToClipboard("sk_ckd_live_v42_engine_alpha_7792")}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-slate-300 transition-all active:scale-95"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-5 border border-slate-100 rounded-2xl hover:border-rose-100 transition-all group">
                    <p className="text-[12px] font-bold text-slate-700 mb-1">Model Version</p>
                    <p className="text-[10px] text-slate-400 mb-4">Select ensemble weights for validation.</p>
                    <select 
                      onChange={(e) => triggerToast(`Engine Migrating to ${e.target.value}`)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-rose-400 cursor-pointer"
                    >
                      <option>XGBoost Ensemble v4.2 (Latest)</option>
                      <option>XGBoost Ensemble v4.1</option>
                      <option>Random Forest v3.0 (Legacy)</option>
                    </select>
                  </div>
                  <div className="p-5 border border-slate-100 rounded-2xl hover:border-rose-100 transition-all">
                    <p className="text-[12px] font-bold text-slate-700 mb-1">Inference Speed</p>
                    <p className="text-[10px] text-slate-400 mb-4">Balance between latency and prediction depth.</p>
                    <input type="range" className="w-full accent-rose-600" />
                    <div className="flex justify-between mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>Low Latency</span>
                      <span>Deep Analysis</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6 max-w-2xl animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-4 p-5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800">
                  <AlertCircle size={20} className="text-rose-500" />
                  <div>
                    <p className="text-[12px] font-bold">Multi-Factor Authentication (MFA)</p>
                    <p className="text-[10px] font-medium opacity-80">MFA is mandatory for all administrative nodes.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setMfaActive(!mfaActive);
                      triggerToast(mfaActive ? "MFA Security Disabled" : "MFA Security Enabled");
                    }}
                    className={`ml-auto px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                      mfaActive ? "bg-rose-600 text-white" : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {mfaActive ? "Active" : "Inactive"}
                  </button>
                </div>

                <div className="space-y-4 pt-4">
                  <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Security Credentials</h4>
                  <div className="space-y-3">
                     <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Current Neural Password" 
                          className="w-full pl-10 pr-12 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[12px] outline-none focus:border-rose-400 transition-all font-bold text-slate-700" 
                        />
                        <button 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-400"
                        >
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                     </div>
                     <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input type="password" placeholder="New Access Key" className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-[12px] outline-none focus:border-rose-400 transition-all font-bold text-slate-700" />
                     </div>
                  </div>
                  <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSaving && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    Update Credentials
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === "notifications" && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">Notification Channels</h3>
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">Define how the system alerts you of critical risk events.</p>
                </div>
                
                <div className="space-y-3">
                  {notificationSettings.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => toggleNotification(item.id)}
                      className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:border-rose-100 transition-all group cursor-pointer"
                    >
                      <div>
                        <p className={`text-[12px] font-bold transition-colors ${item.active ? "text-slate-700" : "text-slate-400"}`}>{item.label}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
                      </div>
                      <div className={`w-9 h-5 rounded-full p-1 transition-all ${item.active ? "bg-rose-600" : "bg-slate-200"}`}>
                        <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-all ${item.active ? "translate-x-4" : ""}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Toast Feedback */}
            <AnimatePresence>
              {showToast && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, x: 20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, y: 20, x: 20 }}
                  className="absolute bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 z-[60]"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{toastMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
