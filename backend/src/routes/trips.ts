import { Router } from "express";
import { requireRole, verifyJWT } from "../middleware/auth.js";
import {
  tripCompleteSchema,
  tripCreateSchema,
  tripListQuery,
} from "../utils/validators.js";
import {
  cancelTrip,
  completeTrip,
  createTrip,
  dispatchTrip,
  listTrips,
} from "../services/tripService.js";

const router = Router();
router.use(verifyJWT);

router.get("/", async (req, res) => {
  const q = tripListQuery.parse(req.query);
  res.json(await listTrips(q.status));
});

// RBAC matrix: only Fleet Manager + Dispatcher manage trips
const canDispatch = requireRole("FLEET_MANAGER", "DISPATCHER");

router.post("/", canDispatch, async (req, res) => {
  const data = tripCreateSchema.parse(req.body);
  res.status(201).json(await createTrip(data, req.user!.id));
});

router.post("/:id/dispatch", canDispatch, async (req, res) => {
  res.json(await dispatchTrip((req.params.id as string)));
});

router.post("/:id/complete", canDispatch, async (req, res) => {
  const data = tripCompleteSchema.parse(req.body);
  res.json(await completeTrip((req.params.id as string), data));
});

router.post("/:id/cancel", canDispatch, async (req, res) => {
  res.json(await cancelTrip((req.params.id as string)));
});

export default router;
