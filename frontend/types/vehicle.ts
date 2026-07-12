/* ── Vehicle types matching the Express backend response ── */

export type VehicleStatus = "AVAILABLE" | "ON_TRIP" | "IN_SHOP" | "RETIRED";
export type VehicleType = "truck" | "van" | "bike" | "bus";

export interface Vehicle {
  id: string;
  registrationNumber: string;
  nameModel: string;
  type: VehicleType;
  maxLoadCapacityKg: number;
  odometerKm: number;
  acquisitionCost: number;
  region: string | null;
  status: VehicleStatus;
}

export interface VehicleCreateInput {
  registrationNumber: string;
  nameModel: string;
  type: VehicleType;
  maxLoadCapacityKg: number;
  odometerKm?: number;
  acquisitionCost: number;
  region?: string;
}

export interface VehicleUpdateInput extends Partial<VehicleCreateInput> {
  status?: VehicleStatus;
}
