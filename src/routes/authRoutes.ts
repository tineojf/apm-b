import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
  validateTokenController,
} from "../controllers/authController";

const authRoutes = Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/refresh-token", refreshToken);
authRoutes.post("/validate-token", validateTokenController);

export default authRoutes;
