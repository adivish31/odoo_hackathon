"use client";

import { useEffect, useState, useCallback } from "react";
import { Download } from "lucide-react";
import ServiceForm from "@/components/maintenance/service-form";
import MaintenanceKPI from "@/components/maintenance/maintenance-kpi";
import ServiceTable from "@/components/maintenance/service-table";
import { getMaintenance, closeMaintenance } from "@/services/maintenance.service";
import type { MaintenanceData } from "@/types/maintenance";
import { apiError } from "@/lib/api-error";

const EMPTY: MaintenanceData = { kpis: [], records: [] };

import { Wrench } from "lucide-react";
import PageHeader from "@/components/layout/page-header";

export default function MaintenancePage() {
  const [data, setData] = useState<MaintenanceData>(EMPTY);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      setData(await getMaintenance());
    } catch (err) {
      setError(apiError(err, "Failed to load maintenance records."));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleClose(id: string) {
    try {
      await closeMaintenance(id);
      await load();
    } catch (err) {
      alert(apiError(err, "Failed to close record."));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance Management"
        description="Manage vehicle servicing, repairs and maintenance history."
        icon={Wrench}
      />

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Service Form */}
        <div className="lg:col-span-4">
          <ServiceForm onCreated={load} />
        </div>

        {/* Right Section */}
        <div className="lg:col-span-8 space-y-6">
          <MaintenanceKPI data={data.kpis} />
          <ServiceTable data={data.records} onClose={handleClose} />
        </div>
      </div>
    </div>
  );
}
