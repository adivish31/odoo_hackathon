/* ── Trip-related types matching the Express backend response ── */

export type TripStatus = "DRAFT" | "DISPATCHED" | "COMPLETED" | "CANCELLED";

export interface TripVehicle {
  id: string;
  registrationNumber: string;
  nameModel: string;
  type: string;
  maxLoadCapacityKg: number;
  odometerKm: number;
  status: string;
}

export interface TripDriver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string;
  contactNumber: string;
  safetyScore: number;
  status: string;
}

export interface TripCreator {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Trip {
  id: string;
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeightKg: number;
  plannedDistanceKm: number;
  actualDistanceKm: number | null;
  fuelConsumedLiters: number | null;
  revenue: number | null;
  status: TripStatus;
  dispatchedAt: string | null;
  completedAt: string | null;
  createdById: string;
  createdAt: string;
  vehicle: TripVehicle;
  driver: TripDriver;
  createdBy: TripCreator;
}

export interface TripCreateInput {
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeightKg: number;
  plannedDistanceKm: number;
}

export interface TripCompleteInput {
  finalOdometerKm: number;
  fuelConsumedLiters: number;
  revenue: number;
}
