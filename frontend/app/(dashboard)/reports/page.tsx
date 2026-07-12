"use client";
import KpiCard from "@/components/reports/kpi-card";
import RevenueChart from "@/components/reports/revenue-chart";
import VehicleCostCard from "@/components/reports/vehicle-cost";
import OperationalInsightsTable from "@/components/reports/operational-table";
import ExportButton from "@/components/reports/export-button";
import { getReports } from "@/services/report.service";


import {
  Calendar,
  Download,
} from "lucide-react";

export default function ReportsPage() {

  return (
    <div className="space-y-6">
      {/* Header */}

      <div
        className="
        flex
        flex-col
        gap-4
        md:flex-row
        md:items-center
        md:justify-between
      "
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Reports & Analytics
          </h1>

          <p className="mt-1 text-sm md:text-base text-slate-500">
            Real-time performance metrics and historical fleet data.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            className="
              flex
              w-full
              sm:w-auto
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              bg-white
              px-4
              py-2
              text-sm
            "
          >
            <Calendar size={18} />
            Last 30 Days
          </button>

          <ExportButton />
        </div>
      </div>

      {/* KPI */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Fuel Efficiency" fleet={report.fleet} />

        <KpiCard title="Fleet Utilization" fleet={report.fleet} />

        <KpiCard title="Operational Cost" fleet={report.fleet} />

        <KpiCard title="Vehicle ROI" fleet={report.fleet} />
      </div>

      {/* Charts */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart fleet={report.fleet} />
        </div>

        <VehicleCostCard vehicles={report.vehicles} />
      </div>

      {/* Table */}

      <OperationalInsightsTable vehicles={report.vehicles} />
    </div>
  );
}