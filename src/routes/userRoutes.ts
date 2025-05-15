import { Router } from "express";
import { registerUser } from "../controllers/userController";

const userRoutes = Router();

userRoutes.post("/register", registerUser);

export default userRoutes;
