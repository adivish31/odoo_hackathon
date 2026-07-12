import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/errors.js";
import { signToken, type AuthUser } from "../middleware/auth.js";
import { loginSchema, registerSchema } from "../utils/validators.js";

const router = Router();

router.post("/register", async (req, res) => {
  const data = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new AppError(`An account with ${data.email} already exists`, 409);

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, role: data.role, passwordHash },
  });

  const payload: AuthUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  res.status(201).json({ token: signToken(payload), user: payload });
});

router.post("/login", async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError("Invalid email or password", 401);
  }

  const payload: AuthUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  res.json({ token: signToken(payload), user: payload });
});

export default router;
