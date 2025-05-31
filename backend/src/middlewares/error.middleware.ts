import { Request, Response, NextFunction } from "express";
import { APIError, errorHandler } from "@/utils/error";
import { formatDataResponse } from "@/utils/format";

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
  if (err instanceof APIError) {
    const { message } = err;
    const cause = (err.cause as []) ?? [];
    res
      .status(err.httpCode)
      .json(formatDataResponse({ message: message, error: cause }));
    return;
  }

  handleError(err);
};

export default errorMiddleware;
