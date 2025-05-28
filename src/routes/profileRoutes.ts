import { Router } from "express";
import { getProfile, createProfile } from "../controllers/profileController";
import { authenticate } from "../middleware/validateJwt";

const profileRoutes = Router();

profileRoutes.use(authenticate);

profileRoutes.get("/", getProfile);
profileRoutes.post("/", createProfile);

export default profileRoutes;
