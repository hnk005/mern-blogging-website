import { getProfile, searchUser } from "@/controllers/user.controller";
import authMiddleware from "@/middlewares/auth.middleware";
import { Router } from "express";

const userRoute = Router();

userRoute.get("/search", searchUser);
userRoute.get("/profile", getProfile);

export default userRoute;
