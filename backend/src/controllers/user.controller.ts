import UserModel from "@/models/User.model";
import { APIError } from "@/utils/error";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const searchUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, limit } = req.query;

  const maxLimit = limit ? Number(limit) : 50;

  try {
    const data = await UserModel.find({
      "personal_info.username": new RegExp(username as string, "i"),
    })
      .select(
        "personal_info.profile_img personal_info.username personal_info.fullname -_id"
      )
      .limit(maxLimit);
    res.status(StatusCodes.OK).json({ users: data });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.params;

  try {
    const data = await UserModel.findOne({
      "personal_info.username": username,
    }).select("-personal_info.password -google_auth -updateAt -blogs");

    if (!data) {
      throw new APIError("NOT_FOUND", StatusCodes.NOT_FOUND, "User not found");
    }
    res.status(StatusCodes.OK).json({ user: data });
  } catch (error) {
    next(error);
  }
};
