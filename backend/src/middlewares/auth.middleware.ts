import { APIError } from "@/utils/error";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const verifyAccessToken = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  try {
    const accessToken = authHeader && authHeader.split(" ")[1];
    if (!accessToken) {
      throw new APIError(
        "UNAUTHORIZED",
        StatusCodes.UNAUTHORIZED,
        "Please Sign in"
      );
    }

    const decoded = jwt.verify(accessToken, process.env.SECRET_KEY) as {
      id: string;
    };

    req.userId = decoded.id;

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      next(
        new APIError(
          "UNAUTHORIZED",
          StatusCodes.UNAUTHORIZED,
          "Please Sign in againt"
        )
      );
    } else if (error.name === "JsonWebTokenError") {
      next(
        new APIError("UNAUTHORIZED", StatusCodes.UNAUTHORIZED, "Invalid token")
      );
    } else {
      next(error);
    }
  }
};

export const verifyRefreshToken = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME] ?? "";
  try {
    if (!refreshToken) {
      throw new APIError(
        "UNAUTHORIZED",
        StatusCodes.UNAUTHORIZED,
        "Please Sign in"
      );
    }

    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY) as {
      id: string;
    };

    req.userId = decoded.id;

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      next(
        new APIError("UNAUTHORIZED", StatusCodes.UNAUTHORIZED, "Token expired")
      );
    } else if (error.name === "JsonWebTokenError") {
      next(
        new APIError("UNAUTHORIZED", StatusCodes.UNAUTHORIZED, "Invalid token")
      );
    } else {
      next(error);
    }
  }
};
