import { Request, Response } from "express";
import { CustomResponse } from "../config/response.custom";
import { RegisterScheduleRequest } from "../DTOS/Schedule/register-schedule.request";
import type { AuthRequest } from "../types/express.request";
import {
  registerScheduleService,
  getScheduleStudentsService,
  getEligibleStudentsForScheduleService,
  getStudentScheduleByCourseIdService,
  getStudentSchedulesService,
  getAllSchedulesByStudentIdService,
  removeStudentFromScheduleService,
} from "../services/scheduleRegistration.service";
import { getStudentByUserIdService } from "../services/student.service";
import { AppError } from "../middleware/errorHandler";

// Đăng ký khóa học (lịch học) dành cho Student
export const registerSchedule = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const authReq = req as AuthRequest;
  const userId = authReq.user?.id;

  if (!userId) {
    return customRes.error("Không tìm thấy thông tin user", 401);
  }

  const student = await getStudentByUserIdService(userId);
  const data: RegisterScheduleRequest = {
    scheduleId: Number(req.body.scheduleId),
    studentId: student.id,
  };

  const result = await registerScheduleService(data);
  return customRes.success(result, "Đăng ký lịch học thành công");
};

// Admin: Lấy danh sách học sinh trong schedule
export const getScheduleStudents = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const scheduleId = Number(req.params.id);
  const search = req.query.search ? String(req.query.search) : undefined;
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;

  const result = await getScheduleStudentsService(scheduleId, { search, page, limit });
  return customRes.success(result, "Lấy danh sách học sinh thành công");
};

// Admin: Thêm học sinh vào schedule
export const addStudentToSchedule = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const scheduleId = Number(req.params.id);
  const { studentId } = req.body;

  const result = await registerScheduleService({ scheduleId, studentId });
  return customRes.success(result, "Thêm học sinh vào lớp thành công");
};

// Admin: Lấy danh sách học sinh hợp lệ để thêm vào schedule
export const getEligibleStudentsForSchedule = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const scheduleId = Number(req.params.id);
  const search = req.query.search ? String(req.query.search) : undefined;
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;

  const result = await getEligibleStudentsForScheduleService(scheduleId, {
    search,
    page,
    limit,
  });

  return customRes.success(result, "Lấy danh sách học sinh hợp lệ thành công");
};
// Student: Lấy schedule đã đăng ký theo courseId
export const getStudentScheduleByCourseId = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const authReq = req as AuthRequest;
  const userId = authReq.user?.id;
  const courseId = Number(req.params.courseId);

  if (!userId) {
    return customRes.error("Không tìm thấy thông tin user", 401);
  }

  if (!courseId) {
    throw new AppError("ID khóa học không hợp lệ", 400);
  }

  // Lấy studentId từ userId
  const student = await getStudentByUserIdService(userId);
  const result = await getStudentScheduleByCourseIdService(student.id, courseId);
  return customRes.success(result, "Lấy lịch học thành công");
};

// Student: Lấy danh sách schedules đã đăng ký
export const getStudentSchedules = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const authReq = req as AuthRequest;
  const userId = authReq.user?.id;
  
  if (!userId) {
    return customRes.error("Không tìm thấy thông tin user", 401);
  }

  // Lấy studentId từ userId
  const student = await getStudentByUserIdService(userId);
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;

  const result = await getStudentSchedulesService(student.id, { page, limit });
  return customRes.success(result, "Lấy danh sách lịch học thành công");
};

// Lấy tất cả schedules theo studentId
export const getAllSchedulesByStudentId = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const studentId = Number(req.params.studentId);
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;

  if (!studentId) {
    throw new AppError("studentId không hợp lệ", 400);
  }

  const result = await getAllSchedulesByStudentIdService({
    studentId,
    page,
    limit,
  });

  return customRes.success(result, "Lấy tất cả lịch học của học sinh thành công");
};

// Admin: Xóa học sinh khỏi schedule
export const removeStudentFromSchedule = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const scheduleId = Number(req.params.id);
  const studentId = Number(req.params.studentId);

  await removeStudentFromScheduleService(scheduleId, studentId);
  return customRes.success(null, "Xóa học sinh khỏi lớp thành công");
};