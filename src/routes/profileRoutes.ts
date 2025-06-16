import { Router } from "express";
import {
  getProfile,
  updateProfile,
  createProfile,
  deleteProfile,
} from "../controllers/profileController";
import { authenticate } from "../middleware/validateJwt";
import { validate } from "../middleware/validate";
import { profileSchema } from "../validators/profile/profileValidator";

const profileRoutes = Router();

profileRoutes.use(authenticate);

profileRoutes.get("/", getProfile);
profileRoutes.post("/", validate(profileSchema), createProfile);
profileRoutes.put("/", validate(profileSchema), updateProfile);
profileRoutes.delete("/", deleteProfile);

export default profileRoutes;
