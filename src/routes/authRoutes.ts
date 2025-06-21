import { Router } from "express";
import { loginSchema, registerSchema } from "../validators/auth/authValidator";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/validateJwt";
import {
  registerUserController,
  loginUserController,
  refreshToken,
  validateTokenController,
  updateUserController,
  deleteUserController,
} from "../controllers/authController";

const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), registerUserController);
authRoutes.post("/login", validate(loginSchema), loginUserController);
authRoutes.post("/refresh-token", refreshToken);
authRoutes.post("/validate-token", validateTokenController);
authRoutes.put("/update", authenticate, validate(registerSchema), updateUserController);
authRoutes.delete("/delete", authenticate, deleteUserController);

export default authRoutes;
