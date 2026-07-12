import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/errors.js";
import { requireRole, verifyJWT } from "../middleware/auth.js";
import {
  vehicleCreateSchema,
  vehicleListQuery,
  vehicleUpdateSchema,
} from "../utils/validators.js";

const router = Router();
router.use(verifyJWT);

// RBAC matrix: every role can view vehicles
router.get("/", async (req, res) => {
  const q = vehicleListQuery.parse(req.query);
  const vehicles = await prisma.vehicle.findMany({
    where: {
      ...(q.type && { type: q.type }),
      ...(q.status && { status: q.status }),
      ...(q.region && { region: q.region }),
      ...(q.search && {
        OR: [
          { registrationNumber: { contains: q.search, mode: "insensitive" } },
          { nameModel: { contains: q.search, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { registrationNumber: "asc" },
  });
  res.json(vehicles);
});

router.post("/", requireRole("FLEET_MANAGER"), async (req, res) => {
  const data = vehicleCreateSchema.parse(req.body);

  // R1: unique registration number with a friendly error
  const existing = await prisma.vehicle.findUnique({
    where: { registrationNumber: data.registrationNumber },
  });
  if (existing) {
    throw new AppError(`Vehicle ${data.registrationNumber} already exists`, 409);
  }

  const vehicle = await prisma.vehicle.create({ data });
  res.status(201).json(vehicle);
});

router.put("/:id", requireRole("FLEET_MANAGER"), async (req, res) => {
  const data = vehicleUpdateSchema.parse(req.body);
  const vehicle = await prisma.vehicle.update({
    where: { id: (req.params.id as string) },
    data,
  });
  res.json(vehicle);
});

// §12: vehicles with history are never hard-deleted — DELETE soft-retires
router.delete("/:id", requireRole("FLEET_MANAGER"), async (req, res) => {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: (req.params.id as string) } });
  if (!vehicle) throw new AppError("Vehicle not found", 404);
  if (vehicle.status === "ON_TRIP") {
    throw new AppError(
      `${vehicle.registrationNumber} is on an active trip and cannot be retired`,
    );
  }
  const retired = await prisma.vehicle.update({
    where: { id: vehicle.id },
    data: { status: "RETIRED" },
  });
  res.json(retired);
});

export default router;
