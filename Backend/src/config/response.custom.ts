import type { Response } from "express";

export interface CustomResponse extends Response {
  success: (data?: any, message?: string) => void;
  error: (message: string, status?: number) => void;
}
