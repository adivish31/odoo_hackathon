"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, CarFront } from "lucide-react";
import VehicleTable from "@/components/vehicles/vehicle-table";
import AddVehicleModal from "@/components/vehicles/add-vehicle-modal";
import { getVehicles, createVehicle, updateVehicle, retireVehicle } from "@/services/vehicle.service";
import type { Vehicle, VehicleType, VehicleStatus, VehicleCreateInput, VehicleListFilters } from "@/types/vehicle";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [filters, setFilters] = useState<VehicleListFilters>({
    type: "ALL",
    status: "ALL",
    search: "",
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getVehicles(filters);
      setVehicles(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load vehicles.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
  };

  const handleSubmit = async (data: VehicleCreateInput, id?: string) => {
    if (id) {
      await updateVehicle(id, data);
    } else {
      await createVehicle(data);
    }
    fetchVehicles();
  };

  const handleRetire = async (id: string) => {
    if (!confirm("Are you sure you want to retire this vehicle? It will no longer be available for dispatch.")) return;
    try {
      await retireVehicle(id);
      fetchVehicles();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to retire vehicle.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <CarFront size={28} className="text-amber-600" />
            Vehicle Registry
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Manage your fleet of trucks, vans, bikes, and buses.
          </p>
        </div>
      </div>

      {/* Filters & Actions Bar */}
      <div className="bg-[#1e1e1e] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Type Filter */}
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="bg-[#2a2a2a] text-slate-200 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Type: All</option>
            <option value="truck">Truck</option>
            <option value="van">Van</option>
            <option value="bike">Bike</option>
            <option value="bus">Bus</option>
          </select>

          {/* Status Filter */}
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="bg-[#2a2a2a] text-slate-200 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Status: All</option>
            <option value="AVAILABLE">Available</option>
            <option value="ON_TRIP">On Trip</option>
            <option value="IN_SHOP">In Shop</option>
            <option value="RETIRED">Retired</option>
          </select>

          {/* Search */}
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search reg. no..."
            className="bg-[#2a2a2a] text-slate-200 border border-white/10 rounded-lg px-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:border-amber-500"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Add Vehicle
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className={loading ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
        <VehicleTable vehicles={vehicles} onEdit={handleOpenEdit} onRetire={handleRetire} />
      </div>

      {/* Rule note matching screenshot */}
      <p className="text-xs font-medium text-amber-600 px-2 mt-2">
        Rule: Registration No. must be unique • Retired/In Shop vehicles are hidden from Trip Dispatcher
      </p>

      {/* Modal */}
      {isModalOpen && (
        <AddVehicleModal
          initialData={editingVehicle}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
