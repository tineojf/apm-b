import { Router } from "express";
import { streamChat } from "../controllers/chatController";
import { validate } from "../middleware/validate";
import { streamingSchema } from "../validators/streamingValidator";

const chatRoutes = Router();

chatRoutes.post("/stream", validate(streamingSchema), streamChat);

export default chatRoutes;
