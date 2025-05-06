import { Request, Response, NextFunction } from "express";
import { APIError, errorHandler } from "@/utils/error";

const { isTrustedError, handleError } = errorHandler;

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!isTrustedError(err)) {
    next(err);
  }
  handleError(err);
  const httpCode = err instanceof APIError && err.httpCode;
  if (httpCode) {
    res.status(httpCode).json({ message: err.message, error: err.cause });
    return;
  }
  next(err);
};

export default errorMiddleware;
