"use client";

import { useState } from "react";
import { MaintenanceLog, closeMaintenance } from "@/services/maintenance.service";
import { format } from "date-fns";

export default function ServiceTable({
  data,
  onRecordClosed
}: {
  data: MaintenanceLog[];
  onRecordClosed?: () => void;
}) {
  const [closingId, setClosingId] = useState<string | null>(null);

  const handleClose = async (id: string) => {
    try {
      setClosingId(id);
      await closeMaintenance(id);
      if (onRecordClosed) onRecordClosed();
    } catch (err: any) {
      alert(err.response?.data?.error || err.message || "Failed to close maintenance");
    } finally {
      setClosingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="p-5 border-b">
        <h2 className="text-xl font-semibold">
          Service Log
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4">Vehicle</th>
              <th className="p-4">Service</th>
              <th className="p-4">Cost</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-500">
                  No maintenance records found.
                </td>
              </tr>
            )}
            {data.map((item) => (
              <tr key={item.id} className="border-t hover:bg-slate-50">
                <td className="p-4">
                  <p className="font-semibold">
                    {item.vehicle?.registrationNumber || item.vehicleId}
                  </p>
                  <p className="text-sm text-slate-500">
                    {item.vehicle?.nameModel}
                  </p>
                </td>
                
                <td className="p-4">
                  <p className="font-medium">{item.type}</p>
                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-[200px]">{item.description}</p>
                  )}
                </td>
                
                <td className="p-4">
                  ₹{Number(item.cost).toLocaleString()}
                </td>
                
                <td className="p-4">
                  {format(new Date(item.openedAt), "MMM d, yyyy")}
                </td>
                
                <td className="p-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    item.status === "OPEN" 
                      ? "bg-yellow-100 text-yellow-800" 
                      : "bg-green-100 text-green-800"
                  }`}>
                    {item.status}
                  </span>
                </td>
                
                <td className="p-4 text-right">
                  {item.status === "OPEN" && (
                    <button
                      onClick={() => handleClose(item.id)}
                      disabled={closingId === item.id}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      {closingId === item.id ? "Closing..." : "Close Log"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}