import { z } from "zod";

export const ROLES = [
  "FLEET_MANAGER",
  "DISPATCHER",
  "SAFETY_OFFICER",
  "FINANCIAL_ANALYST",
] as const;
export const VEHICLE_TYPES = ["truck", "van", "bike", "bus"] as const;
export const VEHICLE_STATUSES = ["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"] as const;
export const DRIVER_STATUSES = ["AVAILABLE", "ON_TRIP", "OFF_DUTY", "SUSPENDED"] as const;
export const TRIP_STATUSES = ["DRAFT", "DISPATCHED", "COMPLETED", "CANCELLED"] as const;

// ---------- Auth ----------

export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(ROLES),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

// ---------- Vehicles ----------

export const vehicleCreateSchema = z.object({
  registrationNumber: z.string().min(1),
  nameModel: z.string().min(1),
  type: z.enum(VEHICLE_TYPES),
  maxLoadCapacityKg: z.number().positive(),
  odometerKm: z.number().min(0).default(0),
  acquisitionCost: z.number().min(0),
  region: z.string().optional(),
});

export const vehicleUpdateSchema = vehicleCreateSchema.partial().extend({
  status: z.enum(VEHICLE_STATUSES).optional(),
});

export const vehicleListQuery = z.object({
  type: z.enum(VEHICLE_TYPES).optional(),
  status: z.enum(VEHICLE_STATUSES).optional(),
  region: z.string().optional(),
  search: z.string().optional(),
});

// ---------- Drivers ----------

export const driverCreateSchema = z.object({
  name: z.string().min(1),
  licenseNumber: z.string().min(1),
  licenseCategory: z.enum(VEHICLE_TYPES),
  licenseExpiryDate: z.coerce.date(),
  contactNumber: z.string().min(1),
  safetyScore: z.number().int().min(0).max(100).default(100),
});

export const driverUpdateSchema = driverCreateSchema.partial().extend({
  status: z.enum(DRIVER_STATUSES).optional(),
});

// RBAC matrix: Safety Officer may only edit status + safety score
export const driverSafetyUpdateSchema = z.object({
  status: z.enum(DRIVER_STATUSES).optional(),
  safetyScore: z.number().int().min(0).max(100).optional(),
});

export const driverListQuery = z.object({
  status: z.enum(DRIVER_STATUSES).optional(),
  search: z.string().optional(),
});

// ---------- Trips ----------

export const tripCreateSchema = z.object({
  source: z.string().min(1),
  destination: z.string().min(1),
  vehicleId: z.string().min(1),
  driverId: z.string().min(1),
  cargoWeightKg: z.number().positive(),
  plannedDistanceKm: z.number().positive(),
});

export const tripCompleteSchema = z.object({
  finalOdometerKm: z.number().positive(),
  fuelConsumedLiters: z.number().positive(),
  revenue: z.number().min(0).default(0),
});

export const tripListQuery = z.object({
  status: z.enum(TRIP_STATUSES).optional(),
});

export type TripCreateInput = z.infer<typeof tripCreateSchema>;
export type TripCompleteInput = z.infer<typeof tripCompleteSchema>;
