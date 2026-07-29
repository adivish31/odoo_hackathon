"use client";

import { useEffect, useState } from "react";
import { getDashboardKpis, type DashboardKpis } from "@/services/dashboard.service";
import { apiError } from "@/lib/api-error";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function Kpi({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-panel-raised border border-hairline rounded-[10px] p-5">
      <p className="text-3xl font-bold font-heading text-ink">{value}</p>
      <p className="text-sm text-ink-dim mt-1 font-semibold uppercase tracking-widest">{label}</p>
    </div>
  );
}

// Colors from TransitOps palette
const COLORS = {
  amber: "#FFB000",
  go: "#05D472",
  reflect: "#2E7CFF",
  caution: "#F5B011",
  stop: "#E92C3D",
  faint: "#4B5563"
};

import { LayoutDashboard } from "lucide-react";
import PageHeader from "@/components/layout/page-header";

export default function DashboardPage() {
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardKpis()
      .then(setKpis)
      .catch((err) => setError(apiError(err, "Failed to load dashboard.")));
  }, []);

  const v = kpis?.vehicles;
  const d = kpis?.drivers;
  const t = kpis?.trips;

  // Chart Data preparation
  const vehicleData = [
    { name: "Available", value: v?.available || 0, color: COLORS.go },
    { name: "On Trip", value: v?.onTrip || 0, color: COLORS.reflect },
    { name: "In Shop", value: v?.inShop || 0, color: COLORS.caution },
    { name: "Retired", value: v?.retired || 0, color: COLORS.faint },
  ].filter(item => item.value > 0);

  const driverData = [
    { name: "Available", value: d?.available || 0, color: COLORS.go },
    { name: "On Trip", value: d?.onTrip || 0, color: COLORS.reflect },
    { name: "Off Duty", value: d?.offDuty || 0, color: COLORS.faint },
    { name: "Suspended", value: d?.suspended || 0, color: COLORS.stop },
  ];

  const tripData = [
    { name: "Draft", value: t?.draft || 0, color: COLORS.caution },
    { name: "Active", value: t?.active || 0, color: COLORS.reflect },
    { name: "Completed", value: t?.completed || 0, color: COLORS.go },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-panel border border-hairline p-3 rounded-[6px] shadow-lg">
          <p className="text-[0.875rem] font-medium text-ink">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Fleet, drivers, and dispatch at a glance."
        icon={LayoutDashboard}
      />

      {error && (
        <div className="rounded-[6px] bg-stop/10 border border-stop/30 px-4 py-3 text-sm text-stop">
          {error}
        </div>
      )}

      {/* Fleet utilization banner */}
      <div className="bg-bitumen border border-hairline rounded-[10px] p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-dim">
            Fleet Utilization
          </p>
          <p className="text-[0.875rem] text-ink mt-1 font-medium">Vehicles on trip ÷ active fleet</p>
        </div>
        <p className="text-5xl font-bold font-mono text-amber">
          {kpis ? `${kpis.fleetUtilizationPct}%` : "…"}
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Kpi label="Active Vehicles" value={v?.active ?? "…"} />
        <Kpi label="Available Vehicles" value={v?.available ?? "…"} />
        <Kpi label="In Maintenance" value={v?.inShop ?? "…"} />
        <Kpi label="Active Trips" value={t?.active ?? "…"} />
        <Kpi label="Pending Trips" value={t?.draft ?? "…"} />
        <Kpi label="Drivers On Duty" value={d?.onDuty ?? "…"} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Vehicle Status Chart */}
        <div className="bg-panel border border-hairline rounded-[10px] p-5 h-[350px] flex flex-col">
          <h3 className="text-lg font-bold font-heading text-ink mb-4">Vehicle Status</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {vehicleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", color: "var(--ink)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Driver Status Chart */}
        <div className="bg-panel border border-hairline rounded-[10px] p-5 h-[350px] flex flex-col">
          <h3 className="text-lg font-bold font-heading text-ink mb-4">Driver Status</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={driverData} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "var(--ink-dim)", fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--panel-raised)" }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {driverData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trips Overview Chart */}
        <div className="bg-panel border border-hairline rounded-[10px] p-5 h-[350px] flex flex-col">
          <h3 className="text-lg font-bold font-heading text-ink mb-4">Trips Overview</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tripData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "var(--ink-dim)", fontSize: 12 }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--panel-raised)" }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {tripData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
