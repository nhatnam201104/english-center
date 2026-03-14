import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AppError } from "./errorHandler";
import prisma from "../config/database";

export interface StudentRequest extends Request {
  student?: {
    id: number;
    userId: number;
    fullname: string;
    email: string;
  };
}

export const authenticateStudent = async (
  req: StudentRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No token provided", 401);
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token) as { id: number; role: string };

    if (decoded.role !== "STUDENT") {
      throw new AppError("Access denied. Student role required.", 403);
    }

    const studentInfo = await prisma.studentInfo.findUnique({
      where: { userId: decoded.id },
      include: { user: true },
    });

    if (!studentInfo) {
      throw new AppError("Student not found", 404);
    }

    req.student = {
      id: studentInfo.id,
      userId: studentInfo.userId,
      fullname: studentInfo.user.fullname,
      email: studentInfo.user.email,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Invalid or expired token", 401));
    }
  }
};