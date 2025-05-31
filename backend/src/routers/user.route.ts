import { getProfile, searchUser } from "@/controllers/user.controller";
import validateMiddleware from "@/middlewares/validate.middleware";
import { ParamsUsersSchema, QueryUsersShema } from "@/validators/get.validator";
import { Router } from "express";

const userRoute = Router();

userRoute.get(
  "/search",
  validateMiddleware(QueryUsersShema, "query"),
  searchUser
);
userRoute.get(
  "/profile/:username",
  validateMiddleware(ParamsUsersSchema, "params"),
  getProfile
);

export default userRoute;
