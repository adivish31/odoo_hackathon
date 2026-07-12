"use client";

import { useEffect, useState } from "react";
import ServiceForm from "@/components/maintenance/service-form";
import MaintenanceKPI from "@/components/maintenance/maintenance-kpi";
import ServiceTable from "@/components/maintenance/service-table";

import { listMaintenance, type MaintenanceLog } from "@/services/maintenance.service";

import { Download, Plus } from "lucide-react";

export default function MaintenancePage() {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await listMaintenance();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Calculate KPIs
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlySpend = logs
    .filter(log => {
      const openedAt = new Date(log.openedAt);
      return openedAt.getMonth() === currentMonth && openedAt.getFullYear() === currentYear;
    })
    .reduce((sum, log) => sum + Number(log.cost), 0);

  const unitsInShop = logs.filter(log => log.status === "OPEN").length;
  
  // Overdue: open for more than 7 days
  const overdueService = logs.filter(log => {
    if (log.status !== "OPEN") return false;
    const openedAt = new Date(log.openedAt);
    const diffTime = Math.abs(new Date().getTime() - openedAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays > 7;
  }).length;

  const kpis = [
    {
      title: "Monthly Spend",
      value: `₹${monthlySpend.toLocaleString()}`,
      icon: "payments"
    },
    {
      title: "Units In Shop",
      value: unitsInShop.toString().padStart(2, "0"),
      icon: "precision_manufacturing"
    },
    {
      title: "Overdue Service",
      value: overdueService.toString().padStart(2, "0"),
      icon: "warning"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Maintenance Management
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Manage vehicle servicing, repairs and maintenance history.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm">
            <Download size={18} />
            Export Logs
          </button>
          
          <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">
            <Plus size={18} />
            New Schedule
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        
        {/* Service Form */}
        <div className="lg:col-span-4">
          <ServiceForm onRecordAdded={fetchLogs} />
        </div>

        {/* Right Section */}
        <div className="lg:col-span-8 space-y-6">
          {/* KPI */}
          <MaintenanceKPI data={kpis} />

          {/* Table */}
          {loading ? (
            <div className="flex justify-center p-8 text-slate-500">Loading maintenance logs...</div>
          ) : (
            <ServiceTable data={logs} onRecordClosed={fetchLogs} />
          )}
        </div>
      </div>
    </div>
  );
}