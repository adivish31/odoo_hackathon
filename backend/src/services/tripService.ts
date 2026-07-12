import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/errors.js";
import type { Driver, TripStatus, Vehicle } from "../generated/prisma/client.js";
import type { TripCompleteInput, TripCreateInput } from "../utils/validators.js";

const tripInclude = {
  vehicle: true,
  driver: true,
  createdBy: { select: { id: true, name: true, email: true, role: true } },
} as const;

// §12 boundary: a license expiring TODAY is expired. Expiry dates are stored at
// midnight, so comparing against "now" already treats the whole expiry day as past.
function licenseExpired(driver: Driver): boolean {
  return driver.licenseExpiryDate < new Date();
}

// R3: expired-license or suspended drivers can never be assigned/dispatched
function assertDriverEligible(driver: Driver): void {
  if (driver.status === "SUSPENDED") {
    throw new AppError(`${driver.name} is suspended and cannot be assigned`);
  }
  if (licenseExpired(driver)) {
    const date = driver.licenseExpiryDate.toISOString().slice(0, 10);
    throw new AppError(`${driver.name}'s license expired on ${date}`);
  }
}

// R5: cargo must be <= capacity; equality is allowed (§12)
function assertCargoFits(cargoWeightKg: number, vehicle: Vehicle): void {
  const capacity = Number(vehicle.maxLoadCapacityKg);
  if (cargoWeightKg > capacity) {
    throw new AppError(
      `Cargo ${cargoWeightKg} kg exceeds ${vehicle.nameModel} capacity of ${capacity} kg`,
    );
  }
}

export function listTrips(status?: TripStatus) {
  return prisma.trip.findMany({
    where: status ? { status } : undefined,
    include: tripInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function createTrip(input: TripCreateInput, createdById: string) {
  const [vehicle, driver] = await Promise.all([
    prisma.vehicle.findUnique({ where: { id: input.vehicleId } }),
    prisma.driver.findUnique({ where: { id: input.driverId } }),
  ]);
  if (!vehicle) throw new AppError("Vehicle not found", 404);
  if (!driver) throw new AppError("Driver not found", 404);

  // R2: retired/in-shop (or on-trip) vehicles can't be picked
  if (vehicle.status !== "AVAILABLE") {
    throw new AppError(
      `${vehicle.registrationNumber} is ${vehicle.status.toLowerCase().replace("_", " ")} and cannot be assigned`,
    );
  }
  if (driver.status !== "AVAILABLE") {
    throw new AppError(`${driver.name} is ${driver.status.toLowerCase().replace("_", " ")} and cannot be assigned`);
  }
  assertDriverEligible(driver); // R3
  assertCargoFits(input.cargoWeightKg, vehicle); // R5

  return prisma.trip.create({
    data: { ...input, createdById },
    include: tripInclude,
  });
}

export async function dispatchTrip(id: string) {
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: { vehicle: true, driver: true },
  });
  if (!trip) throw new AppError("Trip not found", 404);
  if (trip.status !== "DRAFT") {
    throw new AppError(
      `Only draft trips can be dispatched (this trip is ${trip.status.toLowerCase()})`,
    );
  }

  assertDriverEligible(trip.driver); // R3
  assertCargoFits(Number(trip.cargoWeightKg), trip.vehicle); // R5

  // R4 + R6: guarded updates make concurrent double-dispatch impossible —
  // the losing transaction matches 0 rows and rolls back.
  const v = await prisma.vehicle.updateMany({
    where: { id: trip.vehicleId, status: "AVAILABLE" },
    data: { status: "ON_TRIP" },
  });
  if (v.count === 0) {
    throw new AppError(`${trip.vehicle.registrationNumber} is not available`);
  }
  const d = await prisma.driver.updateMany({
    where: { id: trip.driverId, status: "AVAILABLE" },
    data: { status: "ON_TRIP" },
  });
  if (d.count === 0) {
    throw new AppError(`${trip.driver.name} is not available`);
  }

  return prisma.trip.update({
    where: { id },
    data: { status: "DISPATCHED", dispatchedAt: new Date() },
    include: tripInclude,
  });
}

export async function completeTrip(id: string, input: TripCompleteInput) {
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: { vehicle: true },
  });
  if (!trip) throw new AppError("Trip not found", 404);
  if (trip.status !== "DISPATCHED") {
    throw new AppError(
      `Only dispatched trips can be completed (this trip is ${trip.status.toLowerCase()})`,
    );
  }

  const startOdometerKm = Number(trip.vehicle.odometerKm);
  if (input.finalOdometerKm < startOdometerKm) {
    throw new AppError(
      `Final odometer ${input.finalOdometerKm} km cannot be below the current ${startOdometerKm} km`,
    );
  }

  // R7: trip data recorded, vehicle odometer bumped, both actors freed
  await prisma.vehicle.update({
    where: { id: trip.vehicleId },
    data: { status: "AVAILABLE", odometerKm: input.finalOdometerKm },
  });
  await prisma.driver.update({
    where: { id: trip.driverId },
    data: { status: "AVAILABLE" },
  });
  return prisma.trip.update({
    where: { id },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
      actualDistanceKm: input.finalOdometerKm - startOdometerKm,
      fuelConsumedLiters: input.fuelConsumedLiters,
      revenue: input.revenue,
    },
    include: tripInclude,
  });
}

export async function cancelTrip(id: string) {
  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip) throw new AppError("Trip not found", 404);
  if (trip.status === "COMPLETED") {
    throw new AppError("A completed trip cannot be cancelled"); // §12
  }
  if (trip.status === "CANCELLED") {
    throw new AppError("Trip is already cancelled");
  }

  // R8: cancelling a dispatched trip frees vehicle + driver; a draft needs no flips
  if (trip.status === "DISPATCHED") {
    await prisma.vehicle.update({
      where: { id: trip.vehicleId },
      data: { status: "AVAILABLE" },
    });
    await prisma.driver.update({
      where: { id: trip.driverId },
      data: { status: "AVAILABLE" },
    });
  }

  return prisma.trip.update({
    where: { id },
    data: { status: "CANCELLED" },
    include: tripInclude,
  });
}
