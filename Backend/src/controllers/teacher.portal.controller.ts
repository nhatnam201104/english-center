import { Request, Response } from "express";
import { CustomResponse } from "../config/response.custom";
import {
  getMyCoursesService,
  getMyCourseDetailService,
  getMyCourseStudentsService,
  getMyAvailabilityService,
  updateMyAvailabilityService,
} from "../services/teacher.portal.service";
import { AppError } from "../middleware/errorHandler";

// Lấy danh sách khóa học của teacher đang đăng nhập
export const getMyCourses = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const userId = req.user.id;

  const result = await getMyCoursesService(userId, {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    status: req.query.status ? String(req.query.status) : undefined,
    scheduleType: req.query.scheduleType
      ? String(req.query.scheduleType)
      : undefined,
  });

  return customRes.success(result, "Lấy danh sách khóa học thành công");
};

// Lấy chi tiết khóa học (schedule)
export const getMyCourseDetail = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const userId = req.user.id;
  const scheduleId = Number(req.params.scheduleId);

  if (!scheduleId || isNaN(scheduleId)) {
    throw new AppError("ID lịch học không hợp lệ", 400);
  }

  const result = await getMyCourseDetailService(userId, scheduleId);
  return customRes.success(result, "Lấy chi tiết khóa học thành công");
};

// Lấy danh sách học sinh trong khóa học
export const getMyCourseStudents = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const userId = req.user.id;
  const scheduleId = Number(req.params.scheduleId);

  if (!scheduleId || isNaN(scheduleId)) {
    throw new AppError("ID lịch học không hợp lệ", 400);
  }

  const result = await getMyCourseStudentsService(userId, scheduleId);
  return customRes.success(result, "Lấy danh sách học sinh thành công");
};

// Lấy lịch rảnh của teacher đang đăng nhập
export const getMyAvailability = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const userId = req.user.id;

  const result = await getMyAvailabilityService(userId);
  return customRes.success(result, "Lấy lịch rảnh thành công");
};

// Cập nhật lịch rảnh
export const updateMyAvailability = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const userId = req.user.id;

  const freeDays = req.body.freeDays;
  if (!Array.isArray(freeDays)) {
    throw new AppError("Dữ liệu ngày rảnh không hợp lệ", 400);
  }

  const result = await updateMyAvailabilityService(userId, freeDays);
  return customRes.success(result, "Cập nhật lịch rảnh thành công");
};
