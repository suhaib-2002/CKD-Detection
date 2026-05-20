import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const trendData = [
  { day: "Mon", line1: 45, line2: 12 },
  { day: "Tue", line1: 52, line2: 15 },
  { day: "Wed", line1: 48, line2: 18 },
  { day: "Thu", line1: 61, line2: 14 },
  { day: "Fri", line1: 55, line2: 22 },
  { day: "Sat", line1: 42, line2: 10 },
  { day: "Sun", line1: 38, line2: 8 },
];

const distributionData = [
  { name: "Stable",      value: 450, color: "#10b981" },
  { name: "Early Stage",  value: 280, color: "#6366f1" },
  { name: "High Risk",    value: 120, color: "#f43f5e" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#09050d] p-2 border border-white/5 shadow-2xl rounded-lg">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 border-b border-white/5 pb-1">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: entry.color }} />
              <p className="text-[10px] font-bold text-slate-300">
                {entry.name}: <span className="text-white ml-0.5">{entry.value}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const ClinicalTrendCharts: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 h-[280px] bg-[#09050d] rounded-2xl animate-pulse" />
        <div className="lg:col-span-4 h-[280px] bg-[#09050d] rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-1000">
      {/* ── Compressed Diagnostic Trend ────────────────────────────── */}
      <div className="lg:col-span-8 bg-[#09050d] border border-white/5 p-5 rounded-[1.5rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[12px] font-black text-white uppercase tracking-tighter">Diagnostic Trend</h3>
            <p className="text-[9px] text-slate-500 font-bold mt-0.5 uppercase tracking-widest opacity-80">Surveillance Data</p>
          </div>
          <div className="px-2 py-0.5 bg-white/5 rounded-md border border-white/5 text-[8px] font-bold text-indigo-400 uppercase tracking-widest">
            LIVE
          </div>
        </div>

        <div className="w-full h-[200px] min-h-[200px] block relative" style={{ minWidth: '100%', height: '200px' }}>
          <ResponsiveContainer width="99%" height={200}>
            <LineChart data={trendData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#334155', fontSize: 9, fontWeight: 700 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#334155', fontSize: 9, fontWeight: 700 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }} />
              <Line
                name="Stable"
                type="monotone"
                dataKey="line1"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 1.5, fill: '#09050d' }}
                activeDot={{ r: 4, strokeWidth: 0, fill: '#10b981' }}
              />
              <Line
                name="Anomalies"
                type="monotone"
                dataKey="line2"
                stroke="#f43f5e"
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 1.5, fill: '#09050d' }}
                activeDot={{ r: 5, strokeWidth: 0, fill: '#f43f5e' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Compressed Risk Matrix ─────────────────────────────────── */}
      <div className="lg:col-span-4 bg-[#09050d] border border-white/5 p-5 rounded-[1.5rem] shadow-2xl relative overflow-hidden">
        <h3 className="text-[12px] font-black text-white uppercase tracking-tighter mb-6">Risk Matrix</h3>
        
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-full h-[160px] min-h-[160px] block relative" style={{ minWidth: '100%', height: '160px' }}>
            <ResponsiveContainer width="99%" height={160}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-white leading-none">850</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1 opacity-60">Profiles</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 w-full mt-4">
            {distributionData.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-white/5 border border-white/5">
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter leading-none">{item.name}</span>
                <span className="text-[10px] font-black text-white mt-0.5">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalTrendCharts;
