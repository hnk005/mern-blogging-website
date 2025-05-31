import { APIError } from "@/utils/error";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ObjectSchema } from "joi";

const validateMiddleware =
  (schema: ObjectSchema, type: "body" | "query" | "params" = "body") =>
  (req: Request, _: Response, next: NextFunction): void => {
    let check;
    switch (type) {
      case "body":
        check = req.body;
        break;
      case "query":
        check = req.query;
        break;
      case "params":
        check = req.params;
      default:
        break;
    }
    console.log(req.params);
    try {
      const { error } = schema.validate(check, { abortEarly: false });

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
