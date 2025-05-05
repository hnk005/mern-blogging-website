import { signin, signup } from "@/controllers/auth.controller";
import { Router } from "express";

const authRoute = Router();

authRoute.post("/sign-up", signup);
authRoute.post("/sign-in", signin);

export default authRoute;
