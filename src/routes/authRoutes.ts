import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
} from "../controllers/authController";

const authRoutes = Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/refresh-token", refreshToken);

export default authRoutes;
