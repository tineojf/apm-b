import { Router } from "express";
import { authenticate } from "../middleware/validateJwt";
import { streakActivitySchema } from "../validators/dateStringValidator";
import { validate } from "../middleware/validate";
import {
  getStreakActivityController,
  getStreakInfoController,
  getStreakOfWeekController,
  getStreakOfMonthController,
  updateStreakController,
  getHasPrayedTodayController,
} from "../controllers/streakController";
import { streakOfWeekSchema } from "../validators/streak/streakOfWeekValidator";

const streakRoutes = Router();

streakRoutes.use(authenticate);

streakRoutes.get("/activity", getStreakActivityController);
streakRoutes.get("/info", getStreakInfoController);
streakRoutes.get(
  "/weekly-days",
  validate(streakOfWeekSchema),
  getStreakOfWeekController
);
streakRoutes.get("/monthly-progress", getStreakOfMonthController);

streakRoutes.post(
  "/update",
  validate(streakActivitySchema),
  updateStreakController
);
streakRoutes.post(
  "/has-prayed-today",
  validate(streakActivitySchema),
  getHasPrayedTodayController
);

export default streakRoutes;
