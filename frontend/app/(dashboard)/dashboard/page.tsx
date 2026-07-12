"use client";

import { useEffect, useState } from "react";
import { getDashboardKpis, type DashboardResponse } from "@/services/dashboard.service";
import DashboardKpis from "@/components/dashboard/dashboard-kpis";
import DashboardCharts from "@/components/dashboard/dashboard-charts";
import { Filter } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    getDashboardKpis().then(setData).catch(console.error);
  }, []);

  if (!data) {
    return <div className="flex h-[50vh] items-center justify-center text-slate-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm md:text-base text-slate-500">
            Real-time overview of your fleet operations.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-50">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      <DashboardKpis data={data} />
      
      <DashboardCharts data={data} />
    </div>
  );
}
