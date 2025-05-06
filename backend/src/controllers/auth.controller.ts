import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import UserModel from "@/models/User.model";
import {
  formatDataToSend,
  generateUsername,
  isUser,
} from "@/services/auth.service";
import { APIError } from "@/utils/error";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fullname, email, password } = req.body;

  try {
    const emailExist = await UserModel.findOne({
      "personal_info.email": email,
    });

    if (emailExist) {
      throw new APIError(
        "CONFLICT",
        StatusCodes.CONFLICT,
        "Email already exists"
      );
    }

    const username = await generateUsername(email);
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new UserModel({
      personal_info: {
        fullname,
        email,
        password: hashPassword,
        username,
      },
    });

    await user.save();

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Create Account successfully!" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const user = await isUser(email, password);
    if (!user) {
      throw new APIError(
        "UNAUTHORIZED",
        StatusCodes.UNAUTHORIZED,
        "Email or password is incorrect"
      );
    }

    res.status(StatusCodes.OK).json(formatDataToSend(user));
  } catch (error) {
    next(error);
  }
};
