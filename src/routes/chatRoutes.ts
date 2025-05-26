import { Router } from "express";
import { streamChat } from "../controllers/chatController";
import { relationshipChat } from "../controllers/relationshipController";
import { lifeChallengesChat } from "../controllers/lifeChallengesController";
import { validate } from "../middleware/validate";
import { streamingSchema } from "../validators/streamingValidator";
import { relationshipSchema } from "../validators/relationshipValidator";
import { authenticate } from "../middleware/validateJwt";

const chatRoutes = Router();

chatRoutes.use(authenticate);

chatRoutes.post("/stream", validate(streamingSchema), streamChat);
chatRoutes.post(
  "/relationship",
  validate(relationshipSchema),
  relationshipChat
);
chatRoutes.post(
  "/life-challenges",
  validate(relationshipSchema),
  lifeChallengesChat
);

export default chatRoutes;
