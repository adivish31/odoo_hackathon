"use client";

import { Ban, Edit2 } from "lucide-react";
import type { Vehicle, VehicleStatus } from "@/types/vehicle";
import { StatusBadge } from "@/components/ui/status-badge";
import { PlateChip } from "@/components/ui/plate-chip";

interface Props {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onRetire: (id: string) => void;
}

export default function VehicleTable({ vehicles, onEdit, onRetire }: Props) {
  if (vehicles.length === 0) {
    return (
      <div className="bg-panel border border-hairline rounded-[10px] p-12 text-center text-ink-dim">
        <p className="font-heading text-xl font-semibold uppercase tracking-[0.01em]">No vehicles found.</p>
      </div>
    );
  }

  return (
    <div className="bg-panel border border-hairline rounded-[10px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-panel border-b border-hairline text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-dim">
            <tr>
              <th className="px-6 py-4">Reg. No.</th>
              <th className="px-6 py-4">Name/Model</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Capacity</th>
              <th className="px-6 py-4 text-right">Odometer</th>
              <th className="px-6 py-4 text-right">Acq. Cost</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline text-[0.9375rem] text-ink">
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="hover:bg-panel-raised transition-colors h-[44px]"
              >
                <td className="px-6 py-2">
                  <PlateChip registrationNumber={vehicle.registrationNumber} />
                </td>
                <td className="px-6 py-2">{vehicle.nameModel}</td>
                <td className="px-6 py-2 capitalize">{vehicle.type}</td>
                <td className="px-6 py-2">
                  {vehicle.maxLoadCapacityKg >= 1000
                    ? `${(vehicle.maxLoadCapacityKg / 1000).toFixed(1)} Ton`
                    : `${vehicle.maxLoadCapacityKg} kg`}
                </td>
                <td className="px-6 py-2 tabular-nums text-right font-mono font-medium">
                  {Number(vehicle.odometerKm).toLocaleString()} km
                </td>
                <td className="px-6 py-2 tabular-nums text-right font-mono font-medium">
                  ₹{Number(vehicle.acquisitionCost).toLocaleString()}
                </td>
                <td className="px-6 py-2">
                  <StatusBadge status={vehicle.status} />
                </td>
                <td className="px-6 py-2 text-right flex justify-end gap-2 items-center h-full">
                  <button
                    onClick={() => onEdit(vehicle)}
                    className="p-1.5 rounded-[6px] text-ink-dim hover:text-ink hover:bg-panel-raised transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} strokeWidth={1.75} />
                  </button>
                  {vehicle.status !== "RETIRED" && (
                    <button
                      onClick={() => onRetire(vehicle.id)}
                      className="p-1.5 rounded-[6px] text-stop hover:bg-stop/10 transition-colors"
                      title="Retire"
                    >
                      <Ban size={16} strokeWidth={1.75} />
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
