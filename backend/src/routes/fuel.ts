import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireRole, verifyJWT } from "../middleware/auth.js";
import { fuelLogListQuery, fuelLogSchema } from "../utils/validators.js";
import { assertTripAccess, assertVehicleExists } from "../utils/logAccess.js";

const router = Router();
router.use(verifyJWT);

// RBAC matrix: FM, Dispatcher, Financial Analyst. Safety Officer: no access.
const canLog = requireRole("FLEET_MANAGER", "DISPATCHER", "FINANCIAL_ANALYST");

router.get("/", canLog, async (req, res) => {
  const q = fuelLogListQuery.parse(req.query);
  const logs = await prisma.fuelLog.findMany({
    where: {
      ...(q.vehicleId && { vehicleId: q.vehicleId }),
      ...(q.tripId && { tripId: q.tripId }),
    },
    include: { vehicle: true },
    orderBy: { date: "desc" },
  });
  res.json(logs);
});

router.post("/", canLog, async (req, res) => {
  const data = fuelLogSchema.parse(req.body);
  await assertVehicleExists(data.vehicleId);
  if (data.tripId) await assertTripAccess(data.tripId, req.user!);
  const log = await prisma.fuelLog.create({ data });
  res.status(201).json(log);
});

export default router;
