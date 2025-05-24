import {
  createBlog,
  getLatestBlog,
  getTrendingBlog,
} from "@/controllers/blog.controller";
import authMiddleware from "@/middlewares/auth.middleware";
import validateMiddleware from "@/middlewares/validate.middleware";
import { createBlogSchema } from "@/validators/blog.validator";
import { Router } from "express";

const blogRoute = Router();

blogRoute.get("/latest", getLatestBlog);
blogRoute.get("/trending", getTrendingBlog);
blogRoute.post(
  "/create",
  authMiddleware,
  validateMiddleware(createBlogSchema),
  createBlog
);

export default blogRoute;
