import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import UserModel from "@/models/User.model";
import {
  formatDataToSend,
  generateUsername,
  isUser,
} from "@/services/auth.service";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fullname, email, password } = req.body;

  try {
    if (!fullname || !email || !password) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid request" });
      return;
    }

    const emailExist = await UserModel.findOne({
      "personal_info.email": email,
    });

    if (emailExist) {
      res.status(StatusCodes.CONFLICT).json({
        message: "Email already exists",
      });
      return;
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
    if (!email || !password) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid request" });
      return;
    }

    const user = await isUser(email, password);
    if (user) {
      res.status(StatusCodes.CREATED).json(formatDataToSend(user));
      return;
    }

    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Email or password is incorrect" });
  } catch (error) {
    next(error);
  }
};
