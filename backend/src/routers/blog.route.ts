import {
  createBlog,
  getBlogById,
  getLatestBlog,
  getTrendingBlog,
  updateBlog,
} from "@/controllers/blog.controller";
import { verifyAccessToken } from "@/middlewares/auth.middleware";
import validateMiddleware from "@/middlewares/validate.middleware";
import { BlogSchema } from "@/validators/blog.validator";
import {
  ParamsBlogsSchema,
  QueryBlogsSchema,
} from "@/validators/get.validator";
import { Router } from "express";

const blogRoute = Router();

//public
blogRoute.get("/latest", validateMiddleware(QueryBlogsSchema, "query"), getLatestBlog);
blogRoute.get("/trending", getTrendingBlog);
blogRoute.get("/:id", validateMiddleware(ParamsBlogsSchema, "params"), getBlogById);

//private
blogRoute.post(
  "/create",
  validateMiddleware(BlogSchema),
  verifyAccessToken,
  createBlog
);
blogRoute.put(
  "/update",
  validateMiddleware(BlogSchema),
  verifyAccessToken,
  updateBlog
);
export default blogRoute;
