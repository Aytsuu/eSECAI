"use client";

import React from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Users, ShoppingCart, DollarSign, Activity,
  ArrowUpRight, ArrowDownRight, Circle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

// Data
const revenueData = [
  { month: "Jan", revenue: 32000, prev: 27000 },
  { month: "Feb", revenue: 41000, prev: 30000 },
  { month: "Mar", revenue: 37000, prev: 32000 },
  { month: "Apr", revenue: 53000, prev: 38000 },
  { month: "May", revenue: 49000, prev: 41000 },
  { month: "Jun", revenue: 62000, prev: 45000 },
  { month: "Jul", revenue: 58000, prev: 47000 },
];

const trafficData = [
  { day: "Mon", visits: 420 },
  { day: "Tue", visits: 680 },
  { day: "Wed", visits: 540 },
  { day: "Thu", visits: 810 },
  { day: "Fri", visits: 720 },
  { day: "Sat", visits: 390 },
  { day: "Sun", visits: 310 },
];

const transactions = [
  { id: "TXN-8821", user: "Aria Chen",    amount: "$1,240.00", status: "completed", time: "2m ago"  },
  { id: "TXN-8820", user: "James Okoro",  amount: "$390.50",   status: "pending",   time: "14m ago" },
  { id: "TXN-8819", user: "Lena Müller",  amount: "$2,800.00", status: "completed", time: "1h ago"  },
  { id: "TXN-8818", user: "Ryo Tanaka",   amount: "$75.00",    status: "failed",    time: "2h ago"  },
  { id: "TXN-8817", user: "Sofia Ibarra", amount: "$540.20",   status: "completed", time: "3h ago"  },
];

const statusMap = {
  completed: { dot: "#22c55e", pill: "bg-green-500/10 text-green-400" },
  pending:   { dot: "#f59e0b", pill: "bg-amber-500/10 text-amber-400" },
  failed:    { dot: "#ef4444", pill: "bg-red-500/10 text-red-400"     },
};

const channels = [
  { label: "Organic Search", pct: 62, bar: "bg-indigo-500" },
  { label: "Paid Ads",       pct: 21, bar: "bg-cyan-500"   },
  { label: "Referral",       pct: 11, bar: "bg-amber-500"  },
  { label: "Direct",         pct: 6,  bar: "bg-slate-500"  },
];

const glance = [
  { label: "Avg. Order Value", value: "$59.56" },
  { label: "Bounce Rate",      value: "38.2%"  },
  { label: "Avg. Session",     value: "3m 41s" },
];

// Chart Tooltips
const RevenueTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-semibold" style={{ color: p.color }}>
          ${p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

const TrafficTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      <p className="font-semibold text-cyan-400">{payload[0].value} visits</p>
    </div>
  );
};


const SectionLabel = ({ children }) => (
  <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-500">
    {children}
  </p>
);

// Stat Card 
const StatCard = ({ icon: Icon, label, value, delta, deltaLabel, iconClass, iconBgClass }) => {
  const isUp = delta >= 0;
  return (
    <Card className="p-5">
      <div className="flex justify-between items-start">
        <div>
          <SectionLabel>{label}</SectionLabel>
          <p className="mt-2.5 mb-1.5 text-2xl font-bold text-slate-100 font-mono tracking-tight">
            {value}
          </p>
          <div className="flex items-center gap-1">
            {isUp
              ? <ArrowUpRight size={13} className="text-green-400" />
              : <ArrowDownRight size={13} className="text-red-400" />}
            <span className={`text-xs font-semibold ${isUp ? "text-green-400" : "text-red-400"}`}>
              {Math.abs(delta)}%
            </span>
            <span className="text-xs text-slate-500">{deltaLabel}</span>
          </div>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBgClass}`}>
          <Icon size={18} className={iconClass} />
        </div>
      </div>
    </Card>
  );
};

// Main Render
export default () => {
  const urlParams = useSearchParams();
  const router = useRouter();
  const toastFired = React.useRef(false);

  const [activeTab, setActiveTab] = React.useState<string>("revenue");

  React.useEffect(() => {
    const notFoundMessage = urlParams.get("toast");
    if (notFoundMessage && !toastFired.current) {
      toastFired.current = true;
      toast.error(notFoundMessage);
      router.replace("/dashboard");
    }
  }, []);

  return (
    <div className="text-slate-200">
      {/* ── KPI Row ── */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard icon={DollarSign}   label="Total Revenue" value="$62,430" delta={12.4} deltaLabel="vs last mo." iconClass="text-indigo-400" iconBgClass="bg-indigo-500/10" />
        <StatCard icon={Users}        label="Active Users"  value="8,291"   delta={5.1}  deltaLabel="vs last mo." iconClass="text-cyan-400"   iconBgClass="bg-cyan-500/10"   />
        <StatCard icon={ShoppingCart} label="Orders"        value="1,048"   delta={-2.3} deltaLabel="vs last mo." iconClass="text-amber-400"  iconBgClass="bg-amber-500/10"  />
        <StatCard icon={Activity}     label="Conversion"    value="3.84%"   delta={0.6}  deltaLabel="vs last mo." iconClass="text-green-400"  iconBgClass="bg-green-500/10"  />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: "1fr 300px" }}>

        {/* Revenue Area Chart */}
        <Card className="p-5">
          <div className="flex justify-between items-center mb-5">
            <div>
              <SectionLabel>Revenue Overview</SectionLabel>
              <p className="mt-1 text-xl font-bold text-slate-100">
                $62,430{" "}
                <span className="text-sm font-medium text-green-400">↑ 12.4%</span>
              </p>
            </div>
            <div className="flex gap-1.5">
              {["revenue", "prev"].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    activeTab === t
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                      : "border-slate-700 bg-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {t === "revenue" ? "This Month" : "Last Month"}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="prevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#64748b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<RevenueTooltip />} />
              {activeTab === "prev" && (
                <Area type="monotone" dataKey="prev" stroke="#64748b" strokeWidth={1.5} fill="url(#prevGrad)" dot={false} />
              )}
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Traffic Bar Chart */}
        <Card className="p-5">
          <SectionLabel>Weekly Traffic</SectionLabel>
          <p className="mt-1 mb-4 text-xl font-bold text-slate-100">
            3,870 <span className="text-sm font-medium text-cyan-400">visits</span>
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trafficData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barSize={14}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<TrafficTooltip />} cursor={{ fill: "rgba(6,182,212,0.04)" }} />
              <Bar dataKey="visits" fill="#06b6d4" radius={[5, 5, 0, 0]} fillOpacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 280px" }}>

        {/* Transactions Table */}
        <Card>
          <div className="flex justify-between items-center px-5 py-4 border-b border-slate-800">
            <div>
              <SectionLabel>Recent Transactions</SectionLabel>
              <p className="mt-0.5 text-xs text-slate-500">Latest 5 activity entries</p>
            </div>
            <button className="text-xs font-medium text-slate-400 border border-slate-700 rounded-lg px-3 py-1.5 hover:text-slate-200 hover:border-slate-500 transition-colors cursor-pointer bg-transparent">
              View all
            </button>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-800">
                {["Transaction", "User", "Amount", "Status", "Time"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold tracking-widest uppercase text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => {
                const s = statusMap[tx.status];
                return (
                  <tr
                    key={tx.id}
                    className={`hover:bg-slate-800/40 transition-colors ${i < transactions.length - 1 ? "border-b border-slate-800" : ""}`}
                  >
                    <td className="px-5 py-3.5 text-xs text-slate-400 font-mono">{tx.id}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-200">{tx.user}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-100 font-mono">{tx.amount}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${s.pill}`}>
                        <Circle size={5} fill={s.dot} color={s.dot} />
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">{tx.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {/* Right Panel */}
        <div className="flex flex-col gap-4">

          {/* Top Channels */}
          <Card className="p-5 flex-1">
            <SectionLabel>Top Channels</SectionLabel>
            <div className="mt-4 space-y-3.5">
              {channels.map(ch => (
                <div key={ch.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-slate-300">{ch.label}</span>
                    <span className="text-xs font-semibold text-slate-400 font-mono">{ch.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full opacity-80 ${ch.bar}`}
                      style={{ width: `${ch.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* At a Glance */}
          <Card className="p-5">
            <SectionLabel>At a Glance</SectionLabel>
            <div className="mt-3 divide-y divide-slate-800">
              {glance.map(s => (
                <div key={s.label} className="flex justify-between items-center py-2.5">
                  <span className="text-xs text-slate-500">{s.label}</span>
                  <span className="text-sm font-bold text-slate-100 font-mono">{s.value}</span>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};