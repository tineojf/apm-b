import { Router } from "express";
import { authenticate } from "../middleware/validateJwt";
import { validate } from "../middleware/validate";
import { profileSchema } from "../validators/profile/profileValidator";
import {
  getProfile,
  createProfile,
  updateProfile,
} from "../controllers/profileController";

const profileRoutes = Router();

profileRoutes.use(authenticate);

profileRoutes.get("/", getProfile);
profileRoutes.post("/", validate(profileSchema), createProfile);
profileRoutes.put("/", validate(profileSchema), updateProfile);

export default profileRoutes;
