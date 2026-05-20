import React from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  History,
  BarChart3,
  ActivitySquare,
  Scale,
  Settings,
  Zap
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: "dashboard",    icon: <LayoutDashboard size={18} />, label: "Dashboard"       },
    { id: "predict",      icon: <ClipboardList   size={18} />, label: "Predict CKD"     },
    { id: "patients",     icon: <Users           size={18} />, label: "Patient Records"  },
    { id: "history",      icon: <History         size={18} />, label: "Case History"     },
    { id: "analytics",    icon: <BarChart3       size={18} />, label: "Analytics"        },
    { id: "surveillance", icon: <ActivitySquare  size={18} />, label: "Surveillance"     },
    { id: "compliance",   icon: <Scale           size={18} />, label: "Compliance"       },
    { id: "settings",     icon: <Settings        size={18} />, label: "Settings"         },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#0b1224] flex flex-col z-50 border-r border-slate-800/60 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
      {/* ── Brand ──────────────────────────────────────────────────── */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
            <Zap size={14} fill="white" />
          </div>
          <div>
            <h1 className="text-[15px] font-black text-white tracking-tight leading-none">CKD GUARD</h1>
            <p className="text-[9px] text-slate-500 font-bold mt-1.5 uppercase tracking-widest">Clinical Engine</p>
          </div>
        </div>
      </div>

      {/* ── Navigation ─────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-left transition-all relative group ${
                isActive 
                  ? "text-white bg-rose-600 shadow-lg shadow-rose-600/20" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <span className={`transition-colors ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`}>
                {item.icon}
              </span>
              <span className={`text-[13px] font-bold tracking-tight`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white/40" />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── User Profile ───────────────────────────────────────────── */}
      <div className="p-4 border-t border-slate-800/40">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
          <div className="w-8 h-8 rounded-full bg-rose-600 border border-rose-400 flex items-center justify-center text-[11px] font-black text-white">
            DM
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-white leading-none">Dr. Maida</p>
            <p className="text-[10px] text-rose-500 mt-1.5 font-bold uppercase tracking-wider">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
