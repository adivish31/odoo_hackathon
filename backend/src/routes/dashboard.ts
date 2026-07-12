import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { verifyJWT } from "../middleware/auth.js";
import { dashboardQuery } from "../utils/validators.js";
import type { VehicleStatus } from "../generated/prisma/client.js";

const router = Router();
router.use(verifyJWT);

// Dashboard is the landing page — every authenticated role sees it.
router.get("/kpis", async (req, res) => {
  const q = dashboardQuery.parse(req.query);

  // Vehicle filters (type/status/region) narrow the fleet the KPIs are computed over.
  const vehicles = await prisma.vehicle.findMany({
    where: {
      ...(q.type && { type: q.type }),
      ...(q.status && { status: q.status }),
      ...(q.region && { region: q.region }),
    },
    select: { status: true },
  });

  const byStatus: Record<VehicleStatus, number> = {
    AVAILABLE: 0,
    ON_TRIP: 0,
    IN_SHOP: 0,
    RETIRED: 0,
  };
  for (const v of vehicles) byStatus[v.status]++;

  const activeVehicles = vehicles.length - byStatus.RETIRED; // non-retired fleet
  const fleetUtilizationPct =
    activeVehicles > 0 ? Math.round((byStatus.ON_TRIP / activeVehicles) * 1000) / 10 : 0;

  const [draftTrips, dispatchedTrips, completedTrips, drivers] = await Promise.all([
    prisma.trip.count({ where: { status: "DRAFT" } }),
    prisma.trip.count({ where: { status: "DISPATCHED" } }),
    prisma.trip.count({ where: { status: "COMPLETED" } }),
    prisma.driver.groupBy({ by: ["status"], _count: true }),
  ]);

  const driverCounts = Object.fromEntries(drivers.map((d) => [d.status, d._count]));
  const driversOnDuty = (driverCounts.AVAILABLE ?? 0) + (driverCounts.ON_TRIP ?? 0);

  res.json({
    vehicles: {
      total: vehicles.length,
      active: activeVehicles,
      available: byStatus.AVAILABLE,
      onTrip: byStatus.ON_TRIP,
      inShop: byStatus.IN_SHOP,
      retired: byStatus.RETIRED,
      byStatus,
    },
    trips: {
      active: dispatchedTrips,
      draft: draftTrips,
      completed: completedTrips,
    },
    drivers: {
      onDuty: driversOnDuty,
      available: driverCounts.AVAILABLE ?? 0,
      onTrip: driverCounts.ON_TRIP ?? 0,
      offDuty: driverCounts.OFF_DUTY ?? 0,
      suspended: driverCounts.SUSPENDED ?? 0,
    },
    fleetUtilizationPct,
  });
});

export default router;
