import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import UserModel from "@/models/User.model";
import { formatDataToSend, generateUsername } from "@/services/auth.service";
import { APIError } from "@/utils/error";
import { getAuth } from "firebase-admin/auth";

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
    const user = await UserModel.findOne({ "personal_info.email": email });
    if (!user) {
      throw new APIError(
        "CONFLICT",
        StatusCodes.CONFLICT,
        "Email doesn't exist"
      );
    }

    if (user.google_auth) {
      throw new APIError(
        "FORBIDDEN ",
        StatusCodes.FORBIDDEN,
        "Account was created using google. Try logging in with google"
      );
    }

    if (user.personal_info.password) {
      const isUser = await bcrypt.compare(
        password,
        user.personal_info.password
      );

      if (!isUser) {
        throw new APIError(
          "UNAUTHORIZED",
          StatusCodes.UNAUTHORIZED,
          "Email or password is incorrect"
        );
      }
    }

    res.status(StatusCodes.OK).json(formatDataToSend(user));
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { access_token } = req.body;

  try {
    const decodedUser = await getAuth().verifyIdToken(access_token);

    const { email, picture, name } = decodedUser;

    if (!email || !picture || !name) {
      throw new APIError(
        "BAD_REQUEST",
        StatusCodes.BAD_REQUEST,
        "Missing required user info"
      );
    }

    let user = await UserModel.findOne({
      "personal_info.email": email,
    }).select(
      "personal_info.fullname personal_info.username personal_info.profile_img google_auth"
    );

    if (user) {
      if (!user.google_auth) {
        throw new APIError(
          "FORBIDDEN",
          StatusCodes.FORBIDDEN,
          "This email was up without google. Please login with password to access the acount"
        );
      }

      res.status(StatusCodes.OK).json(formatDataToSend(user));
      return;
    }

    const username = await generateUsername(email);

    user = new UserModel({
      personal_info: {
        fullname: name,
        email,
        profile_img: picture,
        username,
      },
      google_auth: true,
    });

    await user.save();

    res.status(StatusCodes.OK).json(formatDataToSend(user));
  } catch (error) {
    next(error);
  }
};
