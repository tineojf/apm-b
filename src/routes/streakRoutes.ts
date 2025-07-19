import { Router } from "express";
import { authenticate } from "../middleware/validateJwt";
import { streakActivitySchema } from "../validators/dateStringValidator";
import { streakTodaySchema } from "../validators/streak/streakValidator";
import { validate } from "../middleware/validate";
import {
  getStreakActivityController,
  getStreakInfoController,
  getStreakOfWeekController,
  getStreakOfMonthController,
  updateStreakController,
  getHasPrayedTodayController,
} from "../controllers/streakController";

const streakRoutes = Router();

streakRoutes.use(authenticate);

streakRoutes.get("/activity", getStreakActivityController);
streakRoutes.get("/info", getStreakInfoController);
streakRoutes.get(
  "/weekly-days",
  validate(streakTodaySchema),
  getStreakOfWeekController
);
streakRoutes.get(
  "/monthly-progress",
  validate(streakTodaySchema),
  getStreakOfMonthController
);

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
