import BlogModel from "@/models/Blog.model";
import UserModel from "@/models/User.model";
import { APIError } from "@/utils/error";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { nanoid } from "nanoid";

export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorId = req.user;

  const { title, des, banner, tags, content, draft } = req.body;

  try {
    const blogId =
      title
        .replace(/[^a-zA-Z0-9]/g, "-")
        .replace(/\s+/g, "-")
        .trim() + nanoid();

    const blog = new BlogModel({
      title,
      des,
      banner,
      content,
      tags,
      author: authorId,
      blog_id: blogId,
      draft: Boolean(draft),
    });

    const data = await blog.save();

    const incrementVal = draft ? 0 : 1;

    await UserModel.findByIdAndUpdate(
      { _id: authorId },
      {
        $inc: {
          "account_info.total_posts": incrementVal,
        },
        $push: { blogs: data._id },
      }
    );

    res.status(StatusCodes.CREATED).json({
      message: draft ? "Draft saved successfully" : "Blog created successfully",
      id: data.blog_id,
    });
  } catch (error) {
    next(error);
  }
};

export const getLatestBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { tag, search, author } = req.query;

  try {
    const page = Number(req.query.page) ?? 1;
    const limit = Number(req.query.limit) ?? 5;
    const skip = (page - 1) * limit;

    const findQuery = {} as { [key: string]: any };
    findQuery.draft = false;

    if (typeof tag === "string") {
      findQuery.tags = tag;
    }

    if (typeof search === "string") {
      findQuery.title = new RegExp(search, "i");
    }

    if (typeof author === "string") {
      findQuery.author = author;
    }

    const totalDocs = await BlogModel.countDocuments(findQuery);

    const data = await BlogModel.find(findQuery)
      .populate(
        "author",
        "personal_info.profile_img personal_info.username personal_info.fullname -_id"
      )
      .sort({ publishedAt: -1 })
      .select("blog_id title des banner activity tags publishedAt -_id")
      .skip(skip)
      .limit(limit);

    res.status(StatusCodes.OK).json({
      results: data,
      page,
      totalDocs,
    });
  } catch (error) {
    next(error);
  }
};

export const getTrendingBlog = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  const limit = 10;

  try {
    const data = await BlogModel.find({ draft: false })
      .populate(
        "author",
        "personal_info.profile_img personal_info.username personal_info.fullname -_id"
      )
      .sort({
        "activity.total_read": -1,
        "activity.total_likes": -1,
        publishedAt: -1,
      })
      .select("blog_id title publishedAt -_id")
      .limit(limit);

    res.status(StatusCodes.OK).json({ blogs: data });
  } catch (error) {
    next(error);
  }
};

export const getBlogById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: blog_id } = req.params;

  const incrementVal = 1;
  try {
    const data = await BlogModel.findOneAndUpdate(
      { blog_id },
      { $inc: { "activity.total_reads": incrementVal } }
    )
      .populate(
        "author",
        "personal_info.fullname personal_info.username  personal_info.profile_img -_id"
      )
      .select("title des content banner activity publishedAt blog_id tags");

    if (!data) {
      throw new APIError("NOT_FOUND", StatusCodes.NOT_FOUND, "Blog not found");
    }

    res.status(StatusCodes.OK).json({ blog: data });
  } catch (error) {
    next(error);
  }
};
