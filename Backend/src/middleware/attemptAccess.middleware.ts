import { Request, Response, NextFunction } from "express";
import { AdmissionStatus } from "@prisma/client";
import prisma from "../config/database";
import { AppError } from "./errorHandler";

// Extend Request to carry attempt data
declare global {
  namespace Express {
    interface Request {
      admission?: any;
    }
  }
}

/**
 * Middleware to validate accessToken from URL params.
 * Fetches the Admission record and attaches to req.admission.
 * Rejects if token invalid, expired, or attempt is done/cancelled.
 */
export const validateAttemptAccess = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const accessToken = req.params.accessToken as string | undefined;

  if (!accessToken) {
    throw new AppError("Access token không được cung cấp", 401);
  }

  const admission = await prisma.admission.findUnique({
    where: { accessToken },
  });

  if (!admission) {
    throw new AppError("Access token không hợp lệ", 401);
  }

  // Check if attempt expired
  if (admission.expiresAt && new Date() > new Date(admission.expiresAt)) {
    // Mark as abandoned if still in progress
    if (
      admission.status !== AdmissionStatus.COMPLETED &&
      admission.status !== AdmissionStatus.CANCELLED
    ) {
      await prisma.admission.update({
        where: { id: admission.id },
        data: { status: AdmissionStatus.CANCELLED },
      });
    }
    throw new AppError("Phiên thi đã hết hạn", 410);
  }

  // Check terminal states
  if (admission.status === AdmissionStatus.CANCELLED) {
    throw new AppError("Bài thi đã bị hủy", 403);
  }

  req.admission = admission;
  next();
};
