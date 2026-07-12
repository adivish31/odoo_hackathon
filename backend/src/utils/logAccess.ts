import { prisma } from "../lib/prisma.js";
import { AppError } from "./errors.js";
import type { AuthUser } from "../middleware/auth.js";

export async function assertVehicleExists(vehicleId: string) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) throw new AppError("Vehicle not found", 404);
  return vehicle;
}

// RBAC matrix: a dispatcher may only log fuel/expenses against trips they created.
export async function assertTripAccess(tripId: string, user: AuthUser) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) throw new AppError("Trip not found", 404);
  if (user.role === "DISPATCHER" && trip.createdById !== user.id) {
    throw new AppError("You can only log against your own trips", 403);
  }
  return trip;
}
