import { Router } from "express";
import {
  citationController,
  prayerController,
} from "../controllers/openaiController";

const openaiRoutes = Router();

openaiRoutes.get("/citation", citationController);
openaiRoutes.post("/prayer", prayerController);

export default openaiRoutes;
