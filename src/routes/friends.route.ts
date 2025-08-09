import { Router } from "express";
import { getFriendByFullNameController } from "../controllers/friendsController";

const friendsRoutes = Router();

friendsRoutes.get("/search", getFriendByFullNameController);

export default friendsRoutes;
