import { Router } from "express";
import { getProfile } from "../controllers/profileController";
import { authenticate } from "../middleware/validateJwt";

const profileRoutes = Router();

profileRoutes.use(authenticate);

profileRoutes.get("/", getProfile);

export default profileRoutes;
