import { Router } from "express";
import {
  getStreakActivityController,
  getStreakInfoController,
  updateStreakController,
} from "../controllers/streakController";
import { authenticate } from "../middleware/validateJwt";

const streakRoutes = Router();

streakRoutes.use(authenticate);

streakRoutes.get("/info", getStreakInfoController);

streakRoutes.post("/update", updateStreakController);

streakRoutes.get("/activity", getStreakActivityController);

export default streakRoutes;
