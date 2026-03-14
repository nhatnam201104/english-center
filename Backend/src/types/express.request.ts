import { Request } from "express";
import { JwtPayload } from "./index";

export type AuthRequest = Request & {
  user?: JwtPayload;
};