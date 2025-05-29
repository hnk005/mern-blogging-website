import { APIError } from "@/utils/error";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

const authMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  try {
    const jwtToken = authHeader && authHeader.split(" ")[1];
    if (!jwtToken) {
      throw new APIError(
        "UNAUTHORIZED",
        StatusCodes.UNAUTHORIZED,
        "No token provided"
      );
    }

    const decoded = jwt.verify(jwtToken, process.env.SECRET_ACCESS_KEY) as {
      id: string;
    };

    req.user = decoded.id;

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
      next(
        new APIError(
          "INTERNAL_SERVER_ERROR",
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Server error"
        )
      );
    }
  }
};

export default authMiddleware;
