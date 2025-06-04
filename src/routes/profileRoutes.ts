import { Router } from "express";
import {
  getProfile,
  createProfile,
  updateProfile,
} from "../controllers/profileController";
import { authenticate } from "../middleware/validateJwt";

const profileRoutes = Router();

profileRoutes.use(authenticate);

profileRoutes.get("/", getProfile);
profileRoutes.post("/", createProfile);
profileRoutes.put("/", updateProfile);

export default profileRoutes;
