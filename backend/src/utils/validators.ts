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
export const MAINT_STATUSES = ["OPEN", "CLOSED"] as const;
export const EXPENSE_CATS = ["TOLL", "PARKING", "REPAIR", "MISC"] as const;

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

// ---------- Maintenance ----------

export const maintenanceCreateSchema = z.object({
  vehicleId: z.string().min(1),
  type: z.string().min(1),
  description: z.string().optional(),
  cost: z.number().min(0),
});

export const maintenanceListQuery = z.object({
  vehicleId: z.string().optional(),
  status: z.enum(MAINT_STATUSES).optional(),
});

// ---------- Fuel logs ----------

export const fuelLogSchema = z.object({
  vehicleId: z.string().min(1),
  tripId: z.string().optional(),
  liters: z.number().positive(),
  cost: z.number().min(0),
  date: z.coerce.date().optional(),
});

export const fuelLogListQuery = z.object({
  vehicleId: z.string().optional(),
  tripId: z.string().optional(),
});

// ---------- Expenses ----------

export const expenseSchema = z.object({
  vehicleId: z.string().min(1),
  tripId: z.string().optional(),
  category: z.enum(EXPENSE_CATS),
  amount: z.number().positive(),
  date: z.coerce.date().optional(),
});

export const expenseListQuery = z.object({
  vehicleId: z.string().optional(),
  category: z.enum(EXPENSE_CATS).optional(),
});

// ---------- Dashboard ----------

export const dashboardQuery = z.object({
  type: z.enum(VEHICLE_TYPES).optional(),
  status: z.enum(VEHICLE_STATUSES).optional(),
  region: z.string().optional(),
});
