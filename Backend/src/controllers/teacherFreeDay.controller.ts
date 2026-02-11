import { Request, Response } from "express";
import { CustomResponse } from "../config/response.custom";
import { createTeacherFreeDayService, getTeacherFreeDayService } from "../services/teacherFreeDay.service";

// Tạo ngày rảnh cho giáo viên
export const createTeacherFreeDay = async (
  req: Request,
  res: Response,
) => {
  const customRes = res as CustomResponse;
  const teacherId = Number(req.params.id);

  const result = await createTeacherFreeDayService(
    teacherId,
    req.body.freeDays,
  );

  return customRes.success(
    result,
    'Tạo ngày rảnh cho giáo viên thành công',
  );
};

// Lấy ngày rảnh của giáo viên
export const getTeacherFreeDay = async (
  req: Request,
  res: Response,
) => {
  const customRes = res as CustomResponse;
  const teacherId = Number(req.params.id);

  const result = await getTeacherFreeDayService(teacherId);

  return customRes.success(
    result,
    'Lấy ngày rảnh của giáo viên thành công',
  );
};

