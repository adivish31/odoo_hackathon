import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/errors.js";
import type { MaintStatus } from "../generated/prisma/client.js";

const maintInclude = { vehicle: true } as const;

export function listMaintenance(filter: { vehicleId?: string; status?: MaintStatus }) {
  return prisma.maintenanceLog.findMany({
    where: {
      ...(filter.vehicleId && { vehicleId: filter.vehicleId }),
      ...(filter.status && { status: filter.status }),
    },
    include: maintInclude,
    orderBy: { openedAt: "desc" },
  });
}

export function openMaintenance(input: {
  vehicleId: string;
  type: string;
  description?: string;
  cost: number;
}) {
  return prisma.$transaction(async (tx) => {
    const vehicle = await tx.vehicle.findUnique({ where: { id: input.vehicleId } });
    if (!vehicle) throw new AppError("Vehicle not found", 404);

    // R9 + §12: an on-trip vehicle can't enter the shop; a retired one is terminal
    if (vehicle.status === "ON_TRIP") {
      throw new AppError(
        `${vehicle.registrationNumber} is on an active trip — complete or cancel it before opening maintenance`,
      );
    }
    if (vehicle.status === "RETIRED") {
      throw new AppError(`${vehicle.registrationNumber} is retired and cannot enter maintenance`);
    }

    const log = await tx.maintenanceLog.create({ data: input, include: maintInclude });

    // R9: opening maintenance flips the vehicle to IN_SHOP
    if (vehicle.status !== "IN_SHOP") {
      await tx.vehicle.update({ where: { id: vehicle.id }, data: { status: "IN_SHOP" } });
    }
    return tx.maintenanceLog.findUniqueOrThrow({ where: { id: log.id }, include: maintInclude });
  });
}

export function closeMaintenance(id: string) {
  return prisma.$transaction(async (tx) => {
    const log = await tx.maintenanceLog.findUnique({ where: { id }, include: { vehicle: true } });
    if (!log) throw new AppError("Maintenance log not found", 404);
    if (log.status === "CLOSED") throw new AppError("This maintenance log is already closed");

    await tx.maintenanceLog.update({
      where: { id },
      data: { status: "CLOSED", closedAt: new Date() },
    });

    // R10: only return to AVAILABLE when no other open jobs remain, and never revive a
    // retired vehicle. Guard on IN_SHOP so an odd state can't be flipped by mistake.
    const stillOpen = await tx.maintenanceLog.count({
      where: { vehicleId: log.vehicleId, status: "OPEN" },
    });
    if (stillOpen === 0 && log.vehicle.status === "IN_SHOP") {
      await tx.vehicle.update({ where: { id: log.vehicleId }, data: { status: "AVAILABLE" } });
    }

    return tx.maintenanceLog.findUniqueOrThrow({ where: { id }, include: maintInclude });
  });
}
