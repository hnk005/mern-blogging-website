import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import UserModel from "@/models/User.model";
import {
  generateAccessToken,
  generateRefreshToken,
  generateUsername,
} from "@/services/auth.service";
import { APIError } from "@/utils/error";
import { getAuth } from "firebase-admin/auth";
import { formatDataResponse, formatDataToSendUser } from "@/utils/format";
import { redisClient } from "@/config/connectionDB";

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

    const formatResponse = formatDataResponse({
      message: "Create Account successfully!",
    });

    res.status(StatusCodes.CREATED).json(formatResponse);
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

    const userId = user._id as string;
    const accessToken = generateAccessToken(userId);

    const refreshToken = generateRefreshToken(userId);

    const refreshTokenCookieName =
      process.env.REFRESH_TOKEN_COOKIE_NAME ?? "refresh_token";

    res.cookie(refreshTokenCookieName, refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    await redisClient.set(`refreshToken:${userId}`, refreshToken);

    const formatUser = formatDataToSendUser(user);
    const formatResponse = formatDataResponse({
      message: "Login successfully",
      data: {
        access_token: accessToken,
        user: formatUser,
      },
    });

    res.status(StatusCodes.OK).json(formatResponse);
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
    } else {
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
    }

    const userId = user._id as string;
    const accessToken = generateAccessToken(userId);

    const refreshToken = generateRefreshToken(userId);

    const refreshTokenCookieName =
      process.env.REFRESH_TOKEN_COOKIE_NAME ?? "refresh_token";

    res.cookie(refreshTokenCookieName, refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    await redisClient.set(`refreshToken:${userId}`, refreshToken);

    const formatUser = formatDataToSendUser(user);
    const formatResponse = formatDataResponse({
      message: "Login successfully",
      data: {
        access_token: accessToken,
        user: formatUser,
      },
    });

    res.status(StatusCodes.OK).json(formatResponse);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user;
  try {
    const accessToken = generateAccessToken(userId);

    const formatData = formatDataResponse({
      message: "refresh token successfully",
      data: {
        access_token: accessToken,
      },
    });
    res.status(StatusCodes.OK).json(formatDataResponse(formatData));
  } catch (err) {
    next(err);
  }
};

export const signout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user;

  try {
    redisClient.del(`refreshToken:${userId}`);
    res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME);
    res.status(StatusCodes.OK).json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user;

  try {
    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      throw new APIError(
        "BAD_REQUEST",
        StatusCodes.BAD_REQUEST,
        "The requested user does not exist."
      );
    }
    const formatUser = formatDataToSendUser(user);
    const formatData = formatDataResponse({
      message: "Successfully",
      data: formatUser,
    });

    res.status(StatusCodes.OK).json(formatData);
  } catch (err) {
    next(err);
  }
};
