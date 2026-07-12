import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/errors.js";
import { requireRole, verifyJWT } from "../middleware/auth.js";
import {
  driverCreateSchema,
  driverListQuery,
  driverSafetyUpdateSchema,
  driverUpdateSchema,
} from "../utils/validators.js";

const router = Router();
router.use(verifyJWT);

// RBAC matrix: every role can view drivers
router.get("/", async (req, res) => {
  const q = driverListQuery.parse(req.query);
  const drivers = await prisma.driver.findMany({
    where: {
      ...(q.status && { status: q.status }),
      ...(q.search && {
        OR: [
          { name: { contains: q.search, mode: "insensitive" } },
          { licenseNumber: { contains: q.search, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { name: "asc" },
  });
  res.json(drivers);
});

router.post("/", requireRole("FLEET_MANAGER"), async (req, res) => {
  const data = driverCreateSchema.parse(req.body);

  const existing = await prisma.driver.findUnique({
    where: { licenseNumber: data.licenseNumber },
  });
  if (existing) {
    throw new AppError(`A driver with license ${data.licenseNumber} already exists`, 409);
  }

  const driver = await prisma.driver.create({ data });
  res.status(201).json(driver);
});

// Fleet Manager: full edit. Safety Officer: status + safety score only (RBAC matrix).
router.put(
  "/:id",
  requireRole("FLEET_MANAGER", "SAFETY_OFFICER"),
  async (req, res) => {
    const data =
      req.user!.role === "SAFETY_OFFICER"
        ? driverSafetyUpdateSchema.parse(req.body)
        : driverUpdateSchema.parse(req.body);
    const driver = await prisma.driver.update({
      where: { id: (req.params.id as string) },
      data,
    });
    res.json(driver);
  },
);

router.delete("/:id", requireRole("FLEET_MANAGER"), async (req, res) => {
  const tripCount = await prisma.trip.count({ where: { driverId: (req.params.id as string) } });
  if (tripCount > 0) {
    throw new AppError(
      "Driver has trip history and cannot be deleted — set status to OFF_DUTY or SUSPENDED instead",
    );
  }
  await prisma.driver.delete({ where: { id: (req.params.id as string) } });
  res.status(204).end();
});

export default router;
