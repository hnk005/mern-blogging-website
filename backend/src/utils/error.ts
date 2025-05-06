import { StatusCodes } from "http-status-codes";

class BaseError extends Error {
  public readonly name: string;
  public readonly httpCode: StatusCodes;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    httpCode: StatusCodes,
    description: string,
    cause: string[],
    isOperational: boolean
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;
    this.cause = cause;

    Error.captureStackTrace(this);
  }
}

export class APIError extends BaseError {
  constructor(
    name = "",
    httpCode = StatusCodes.INTERNAL_SERVER_ERROR,
    description = "Lỗi máy chủ nội bộ",
    cause: string[] = [],
    isOperational = true
  ) {
    super(name, httpCode, description, cause, isOperational);
  }
}

class ErrorHandler {
  public async handleError(err: Error): Promise<void> {
    await console.error(
      "Error message from the centralized error-handling component: ",
      err
    );
    // await sendMailToAdminIfCritical();
    // await sendEventsToSentry();
  }

  public isTrustedError(error: Error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  }
}

export const errorHandler = new ErrorHandler();
