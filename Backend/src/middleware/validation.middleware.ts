import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AppError } from "./errorHandler";
import { ZodSchema, ZodError } from "zod";

export const validate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const mess = errors
      .array()
      .map((err) => err.msg)
      .join(", ");

    throw new AppError(mess, 400);
  }

  next();
};

export const validateZod = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((e) => e.message).join(", ");
        next(new AppError(errorMessages, 400));
      } else {
        next(error);
      }
    }
  };
};
