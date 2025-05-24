import { signin, signup, googleAuth } from "@/controllers/auth.controller";
import validateMiddleware from "@/middlewares/validate.middleware";
import { SignInSchema, SignUpSchema } from "@/validators/auth.validator";
import { Router } from "express";

const authRoute = Router();

authRoute.post("/sign-up", validateMiddleware(SignUpSchema), signup);
authRoute.post("/sign-in", validateMiddleware(SignInSchema), signin);
authRoute.post("/google-auth", googleAuth);

export default authRoute;
