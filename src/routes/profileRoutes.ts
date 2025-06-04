import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profileController";
import { authenticate } from "../middleware/validateJwt";
import { validate } from "../middleware/validate";
import { profileSchema } from "../validators/profile/profileValidator";

const profileRoutes = Router();

profileRoutes.use(authenticate);

profileRoutes.get("/", getProfile);
profileRoutes.put("/", validate(profileSchema), updateProfile);

export default profileRoutes;
