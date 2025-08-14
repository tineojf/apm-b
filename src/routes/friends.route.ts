import { Router } from "express";
import {
  getFriendByFullNameController,
  getPendingFriendRequestController,
  sendRequestFriendshipController,
  updateStatusFriendController,
} from "../controllers/friendsController";
import { authenticate } from "../middleware/validateJwt";
import { validate } from "../middleware/validate";
import { processRequestFriendSchema } from "../validators/friend/processRequestFriendValidator";

const friendsRoutes = Router();

friendsRoutes.use(authenticate);

friendsRoutes.get("/search", getFriendByFullNameController);

friendsRoutes.post("/request", sendRequestFriendshipController);

friendsRoutes.get("/request", getPendingFriendRequestController);

friendsRoutes.post(
  "/request/process",
  validate(processRequestFriendSchema),
  updateStatusFriendController
);

export default friendsRoutes;
