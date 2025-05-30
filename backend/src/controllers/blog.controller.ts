import BlogModel from "@/models/Blog.model";
import UserModel from "@/models/User.model";
import { APIError } from "@/utils/error";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { nanoid } from "nanoid";

declare module "express-serve-static-core" {
  interface Request {
    user: string;
  }
}

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
  const { tag, search, author, page, limit, eliminate_blog } = req.query;

  try {
    const pageCurrent = Number(page) ?? 1;
    const maxlimit = Number(limit) ?? 5;
    const skip = (pageCurrent - 1) * maxlimit;

    const findQuery = {} as { [key: string]: any };
    findQuery.draft = false;

    if (tag) {
      findQuery.tags = tag;
      if (eliminate_blog) {
        findQuery.blog_id = { $ne: eliminate_blog };
      }
    } else if (typeof search == "string") {
      findQuery.title = new RegExp(search, "i");
    } else if (author) {
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
      .limit(maxlimit);

    res.status(StatusCodes.OK).json({
      meta: {
        page: pageCurrent,
        pageSize: maxlimit,
        pages: Math.ceil(totalDocs / maxlimit),
        total: totalDocs,
      },
      result: data,
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
  const top10Treding = 10;

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
      .limit(top10Treding);

    res.status(StatusCodes.OK).json({ message: "successfully", data });
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
  const { draft, mode } = req.query;
  const incrementVal = mode != "edit" ? 1 : 0;

  try {
    const blog = await BlogModel.findOneAndUpdate(
      { blog_id },
      { $inc: { "activity.total_reads": incrementVal } },
      { new: true }
    )
      .populate({
        path: "author",
        select:
          "personal_info.fullname personal_info.username personal_info.profile_img",
      })
      .select(
        "title des content banner activity publishedAt blog_id tags author draft"
      );

    if (!blog) {
      throw new APIError("NOT_FOUND", StatusCodes.NOT_FOUND, "Blog not found");
    }

    const author: any = blog.author;
    if (!author || !author.personal_info || !author.personal_info.username) {
      throw new APIError(
        "NOT_FOUND",
        StatusCodes.NOT_FOUND,
        "Author information not found"
      );
    }

    if (blog.draft && draft !== "true") {
      throw new APIError(
        "BAD_REQUEST",
        StatusCodes.BAD_REQUEST,
        "You can not access draft blogs"
      );
    }

    await UserModel.findOneAndUpdate(
      { "personal_info.username": author.personal_info.username },
      {
        $inc: { "account_info.total_reads": incrementVal },
      }
    );

    res.status(StatusCodes.OK).json({ message: "successfully", data: blog });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorId = req.user;
  const { title, banner, content, tags, des, draft, blog_id } = req.body;

  try {
    const blog = await BlogModel.findOne({ blog_id });

    if (!blog) {
      throw new APIError("NOT_FOUND", StatusCodes.NOT_FOUND, "Blog not found");
    }

    if (blog.author.toString() !== authorId.toString()) {
      throw new APIError(
        "FORBIDDEN",
        StatusCodes.FORBIDDEN,
        "You do not have permission to edit this blog"
      );
    }

    blog.title = title;
    blog.banner = banner;
    blog.content = content;
    blog.tags = tags;
    blog.des = des;
    blog.draft = draft;

    await blog.save();

    res.status(StatusCodes.OK).json({ message: "Blog updated successfully" });
  } catch (error) {
    next(error);
  }
};
