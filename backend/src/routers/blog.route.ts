import {
  createBlog,
  getBlogById,
  getLatestBlog,
  getTrendingBlog,
  updateBlog,
} from "@/controllers/blog.controller";
import { verifyAccessToken } from "@/middlewares/auth.middleware";
import validateMiddleware from "@/middlewares/validate.middleware";
import { createBlogSchema } from "@/validators/blog.validator";
import { Router } from "express";

const blogRoute = Router();

//public
blogRoute.get("/latest", getLatestBlog);
blogRoute.get("/trending", getTrendingBlog);
blogRoute.get("/:id", getBlogById);

//private
blogRoute.post(
  "/create",
  verifyAccessToken,
  validateMiddleware(createBlogSchema),
  createBlog
);
blogRoute.put("/update", verifyAccessToken, updateBlog);
export default blogRoute;
