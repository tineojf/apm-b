import { Router } from "express";
import {
  getFriendByFullNameController,
  sendRequestFriendshipController,
} from "../controllers/friendsController";
import { authenticate } from "../middleware/validateJwt";

const friendsRoutes = Router();

friendsRoutes.use(authenticate);

friendsRoutes.get("/search", getFriendByFullNameController);

friendsRoutes.post("/request", sendRequestFriendshipController);

export default friendsRoutes;
