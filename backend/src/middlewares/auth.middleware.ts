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
    // Remove 'Bearer ' from authHeader
    const jwtToken = authHeader && authHeader.split(" ")[1];
    if (!jwtToken) {
      throw new APIError(
        "UNAUTHORIZED",
        StatusCodes.UNAUTHORIZED,
        "No token provided"
      );
    }

    // Verify the token (this is just a placeholder, implement your own logic)
    const decoded = jwt.verify(jwtToken, process.env.SECRET_ACCESS_KEY) as {
      id: string;
    };

    if (!decoded) {
      throw new APIError(
        "UNAUTHORIZED",
        StatusCodes.UNAUTHORIZED,
        "Invalid token"
      );
    }
    req.user = decoded.id;

    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
