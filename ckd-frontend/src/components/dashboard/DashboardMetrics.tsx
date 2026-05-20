import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, AlertTriangle, Database, Activity } from "lucide-react";

// ── Animated counter hook ────────────────────────────────────────────────────
const useCounter = (target: number, duration = 1400) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return value;
};

// ── Types ────────────────────────────────────────────────────────────────────
interface MetricConfig {
  label: string;
  rawValue: number;
  displayFn: (v: number) => string;
  trend: "up" | "down" | "warning" | "neutral";
  trendLabel: string;
  trendSub: string;
  icon: React.ReactNode;
}

// ── Single card ──────────────────────────────────────────────────────────────
const MetricCard: React.FC<MetricConfig & { delay: number }> = ({
  label, rawValue, displayFn, trend, trendLabel, trendSub, icon, delay,
}) => {
  const animated = useCounter(rawValue);

  const trendColor =
    trend === "up"      ? "text-emerald-500" :
    trend === "down"    ? "text-rose-500"    :
    trend === "warning" ? "text-amber-500"   :
                          "text-slate-400";

  const iconBg =
    trend === "up"      ? "bg-emerald-50 text-emerald-500" :
    trend === "down"    ? "bg-rose-50 text-rose-500"       :
    trend === "warning" ? "bg-amber-50 text-amber-500"     :
                          "bg-slate-50 text-slate-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.08 }}
      className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.07)] transition-shadow duration-200"
    >
      {/* Top row: label + icon */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          {label}
        </p>
        <div className={`p-1.5 rounded-lg ${iconBg}`}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <p className="text-2xl font-bold text-slate-900 tracking-tight leading-none mb-2">
        {displayFn(animated)}
      </p>

      {/* Trend row */}
      <div className={`flex items-center gap-1 text-[11px] font-semibold ${trendColor}`}>
        {trend === "up"      && <TrendingUp  size={12} />}
        {trend === "down"    && <TrendingDown size={12} />}
        {trend === "warning" && <AlertTriangle size={12} />}
        <span>{trendLabel}</span>
        <span className="font-normal text-slate-400 ml-0.5">{trendSub}</span>
      </div>
    </motion.div>
  );
};

// ── Main component ───────────────────────────────────────────────────────────
const DashboardMetrics: React.FC = () => {
  const cards: (MetricConfig & { delay: number })[] = [
    {
      label: "Total Assessments Run",
      rawValue: 12480,
      displayFn: (v) => v.toLocaleString(),
      trend: "up",
      trendLabel: "+2.3%",
      trendSub: "from last week",
      icon: <Activity size={14} />,
      delay: 1,
    },
    {
      label: "High Risk Anomalies",
      rawValue: 142,
      displayFn: (v) => String(v),
      trend: "warning",
      trendLabel: "Requires clinical review",
      trendSub: "",
      icon: <AlertTriangle size={14} />,
      delay: 2,
    },
    {
      label: "Model Performance",
      rawValue: 982,          // store as 982, display as 98.2%
      displayFn: (v) => (v / 10).toFixed(1) + "%",
      trend: "down",
      trendLabel: "-0.3%",
      trendSub: "variance margin",
      icon: <TrendingDown size={14} />,
      delay: 3,
    },
    {
      label: "Active Core Models",
      rawValue: 4,
      displayFn: () => "4 / 4",
      trend: "neutral",
      trendLabel: "All services functional",
      trendSub: "",
      icon: <Database size={14} />,
      delay: 4,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <MetricCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default DashboardMetrics;
