import { signin, signup } from "@/controllers/auth.controller";
import validate from "@/middlewares/validate.middleware";
import { SignInSchema, SignUpSchema } from "@/validators/auth.validator";
import { Router } from "express";

const authRoute = Router();

authRoute.post("/sign-up", validate(SignUpSchema), signup);
authRoute.post("/sign-in", validate(SignInSchema), signin);

export default authRoute;
