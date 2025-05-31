import { getProfile, searchUser } from "@/controllers/user.controller";
import { Router } from "express";

const userRoute = Router();

userRoute.get("/search", searchUser);
userRoute.get("/profile/:username", getProfile);

export default userRoute;
