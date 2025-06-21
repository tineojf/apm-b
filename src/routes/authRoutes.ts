import { Router } from "express";
import { loginSchema, registerSchema } from "../validators/auth/authValidator";
import { validate } from "../middleware/validate";
import {
  registerUser,
  loginUser,
  refreshToken,
  validateTokenController,
} from "../controllers/authController";

const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), registerUser);
authRoutes.post("/login", validate(loginSchema), loginUser);
authRoutes.post("/refresh-token", refreshToken);
authRoutes.post("/validate-token", validateTokenController);

export default authRoutes;
