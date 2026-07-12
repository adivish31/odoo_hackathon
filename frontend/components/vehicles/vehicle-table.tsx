"use client";

import { Ban, Edit2 } from "lucide-react";
import type { Vehicle, VehicleStatus } from "@/types/vehicle";

interface Props {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onRetire: (id: string) => void;
}

const statusColors: Record<VehicleStatus, string> = {
  AVAILABLE: "bg-emerald-500 text-white",
  ON_TRIP: "bg-blue-400 text-white",
  IN_SHOP: "bg-amber-500 text-white",
  RETIRED: "bg-red-400 text-white",
};

export default function VehicleTable({ vehicles, onEdit, onRetire }: Props) {
  if (vehicles.length === 0) {
    return (
      <div className="bg-[#1e1e1e] border border-white/10 rounded-xl p-12 text-center text-slate-400">
        <p className="text-sm">No vehicles found.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1e1e1e] border border-white/10 rounded-xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-slate-400 border-b border-white/10 text-xs tracking-wider uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Reg. No. (Unique)</th>
              <th className="px-6 py-4 font-medium">Name/Model</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Capacity</th>
              <th className="px-6 py-4 font-medium">Odometer</th>
              <th className="px-6 py-4 font-medium">Acq. Cost</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4 font-medium">{vehicle.registrationNumber}</td>
                <td className="px-6 py-4">{vehicle.nameModel}</td>
                <td className="px-6 py-4 capitalize">{vehicle.type}</td>
                <td className="px-6 py-4">
                  {vehicle.maxLoadCapacityKg >= 1000
                    ? `${(vehicle.maxLoadCapacityKg / 1000).toFixed(1)} Ton`
                    : `${vehicle.maxLoadCapacityKg} kg`}
                </td>
                <td className="px-6 py-4">
                  {Number(vehicle.odometerKm).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {Number(vehicle.acquisitionCost).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-md ${
                      statusColors[vehicle.status]
                    }`}
                  >
                    {vehicle.status === "ON_TRIP"
                      ? "On Trip"
                      : vehicle.status === "IN_SHOP"
                        ? "In Shop"
                        : vehicle.status.charAt(0) +
                          vehicle.status.slice(1).toLowerCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(vehicle)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  {vehicle.status !== "RETIRED" && (
                    <button
                      onClick={() => onRetire(vehicle.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 transition-colors"
                      title="Retire"
                    >
                      <Ban size={16} />
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
