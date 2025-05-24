
import { APIError } from "@/utils/error";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ObjectSchema } from "joi";

const validateMiddleware =
  (schema: ObjectSchema) =>
  (req: Request, _: Response, next: NextFunction): void => {
    try {
      const { error } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        throw new APIError(
          "BAD_REQUEST",
          StatusCodes.BAD_REQUEST,
          "Bad request format",
          error.details.map((e) => e.message)
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default validateMiddleware;
