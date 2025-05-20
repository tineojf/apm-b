import { Router } from "express";
import { getStreakInfoController } from "../controllers/streakController";
import { authenticate } from "../middleware/validateJwt";

const streakRoutes = Router();

streakRoutes.use(authenticate);

streakRoutes.get("/info", getStreakInfoController);

// streakRoutes.post("/update", updateStreakController);

export default streakRoutes;
