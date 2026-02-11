import { Request, Response } from "express";
import { CustomResponse } from "../config/response.custom";
import { RegisterScheduleRequest } from "../DTOS/Schedule/register-schedule.request";
import { registerScheduleService } from "../services/scheduleRegistration.service";

// Đăng ký khóa học (lịch học) dành cho Student
export const registerSchedule = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const data: RegisterScheduleRequest = req.body;

  const result = await registerScheduleService(data);
  return customRes.success(result, "Đăng ký lịch học thành công");
};