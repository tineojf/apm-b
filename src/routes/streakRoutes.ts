import { Router } from "express";
import {
  getStreakActivityController,
  getStreakInfoController,
  updateStreakController,
  getHasPrayedTodayController,
} from "../controllers/streakController";
import { authenticate } from "../middleware/validateJwt";
import { validate } from "../middleware/validate";
import { streakActivitySchema } from "../validators/dateStringValidator";

const streakRoutes = Router();

streakRoutes.use(authenticate);

streakRoutes.get("/info", getStreakInfoController);

streakRoutes.post(
  "/update",
  validate(streakActivitySchema),
  updateStreakController
);

streakRoutes.get(
  "/has-prayed-today",
  validate(streakActivitySchema),
  getHasPrayedTodayController
);

streakRoutes.get("/activity", getStreakActivityController);

export default streakRoutes;
