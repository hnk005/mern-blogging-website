import {
  signin,
  signup,
  googleAuth,
  refreshToken,
  signout,
  me,
} from "@/controllers/auth.controller";
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "@/middlewares/auth.middleware";
import validateMiddleware from "@/middlewares/validate.middleware";
import { SignInSchema, SignUpSchema } from "@/validators/auth.validator";
import { Router } from "express";

const authRoute = Router();

//public
authRoute.post("/sign-up", validateMiddleware(SignUpSchema), signup);
authRoute.post("/sign-in", validateMiddleware(SignInSchema), signin);
authRoute.post("/google-auth", googleAuth);

//private
authRoute.get("/me", verifyAccessToken, me);
authRoute.get("/refresh-token", verifyRefreshToken, refreshToken);
authRoute.post("/sign-out", verifyAccessToken, signout);

export default authRoute;
