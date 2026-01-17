// src/middleware/customResponse.ts
import type { NextFunction, Request, Response } from "express";
import { CustomResponse } from "../config/response.custom";

export const customResponseMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const customRes = res as CustomResponse;
  customRes.success = (data?: any, message: string = "Success") => {
    customRes.status(200).json({
      success: true,
      message,
      data,
    });
  };

  customRes.error = (message: string, status: number = 500) => {
    customRes.status(status).json({
      success: false,
      message,
    });
  };

  next();
};
