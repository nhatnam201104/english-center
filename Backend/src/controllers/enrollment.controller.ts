import { Request, Response } from "express";
import type { CustomResponse } from "../config/response.custom";
import {
  validateTokenService,
  checkParentService,
  getAvailableSchedulesService,
  createDraftService,
  getStudentAvailableSchedulesService,
  createStudentDraftService,
  getEnrollmentStatusService,
} from "../services/enrollment.service";
import type { AuthRequest } from "../types/express.request";

// ─── Validate Registration Token ───

export const validateToken = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await validateTokenService(req.params.token as string);
  return customRes.success(result, "Token hợp lệ");
};

// ─── Check Parent by Phone ───

export const checkParent = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await checkParentService(req.query.phone as string);
  return customRes.success(result);
};

// ─── Get Available Schedules ───

export const getAvailableSchedules = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const admissionType = req.query.admissionType as string;
  const result = await getAvailableSchedulesService(admissionType);
  return customRes.success(result, "Lấy danh sách lịch học thành công");
};

// ─── Create Enrollment Draft ───

export const createDraft = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await createDraftService(req.body);
  return customRes.success(result, "Tạo đơn đăng ký thành công");
};

// ─── Student Self Enrollment: Get Available Schedules ───

export const getStudentAvailableSchedules = async (
  req: Request,
  res: Response,
) => {
  const customRes = res as CustomResponse;
  const authReq = req as AuthRequest;

  if (!authReq.user?.id) {
    return customRes.error("Không tìm thấy thông tin người dùng", 401);
  }

  const result = await getStudentAvailableSchedulesService(authReq.user.id);
  return customRes.success(result, "Lấy danh sách lịch học thành công");
};

// ─── Student Self Enrollment: Create Draft ───

export const createStudentDraft = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const authReq = req as AuthRequest;

  if (!authReq.user?.id) {
    return customRes.error("Không tìm thấy thông tin người dùng", 401);
  }

  const result = await createStudentDraftService(authReq.user.id, req.body);
  return customRes.success(result, "Tạo đơn đăng ký thành công");
};

// ─── Get Enrollment Status ───

export const getEnrollmentStatus = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await getEnrollmentStatusService(req.params.txnRef as string);
  return customRes.success(result);
};
