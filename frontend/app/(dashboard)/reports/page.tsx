"use client";

import { useEffect, useState } from "react";
import { Calendar, Download, BarChart3 } from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import KpiCard from "@/components/reports/kpi-card";
import RevenueChart from "@/components/reports/revenue-chart";
import VehicleCostCard from "@/components/reports/vehicle-cost";
import OperationalInsightsTable from "@/components/reports/operational-table";
import { getReports, downloadReportCsv } from "@/services/report.service";
import type { ReportResponse } from "@/types/report";
import { apiError } from "@/lib/api-error";

const EMPTY: ReportResponse = { kpis: [], revenue: [], vehicles: [], operations: [] };
export default function ReportsPage() {
  const [report, setReport] = useState<ReportResponse>(EMPTY);
  const [error, setError] = useState("");

  useEffect(() => {
    getReports()
      .then(setReport)
      .catch((err) => setError(apiError(err, "Failed to load reports.")));
  }, []);

  async function handleExport() {
    try {
      await downloadReportCsv();
    } catch (err) {
      alert(apiError(err, "Failed to export CSV."));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Real-time performance metrics and historical fleet data."
        icon={BarChart3}
        actions={
          <>
            <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-[6px] border border-hairline bg-panel-raised text-ink px-4 py-2 text-sm hover:brightness-110 transition">
              <Calendar size={18} />
              Last 30 Days
            </button>
            <button
              onClick={handleExport}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-[6px] bg-reflect px-4 py-2 text-sm text-[#1A1300] font-semibold hover:brightness-110 transition"
            >
              <Download size={18} />
              Export CSV
            </button>
          </>
        }
      />

      {error && (
        <div className="p-3 text-[0.875rem] rounded-[6px] bg-stop/10 text-stop border border-stop/30 font-medium">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {report.kpis.map((item) => (
          <KpiCard key={item.title} data={item} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={report.revenue} />
        </div>
        <VehicleCostCard data={report.vehicles} />
      </div>

      {/* Operational Table */}
      <OperationalInsightsTable data={report.operations} />
    </div>
  );
}
