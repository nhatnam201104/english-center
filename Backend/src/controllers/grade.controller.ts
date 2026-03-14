import { Response } from "express";
import { StudentRequest } from "../middleware/studentAuth.middleware";
import { CustomResponse } from "../config/response.custom";
import { getStudentGradesService } from "../services/grade.service";

export const getStudentGrades = async (
  req: StudentRequest,
  res: Response
): Promise<void> => {
  const customRes = res as CustomResponse;
  const { page = "1", limit = "10" } = req.query;
  
  const result = await getStudentGradesService(req.student!.id, {
    page: Number(page),
    limit: Number(limit),
  });
  
  return customRes.success(result, "Lấy danh sách điểm thành công");
};