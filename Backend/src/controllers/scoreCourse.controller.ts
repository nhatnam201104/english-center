import { Request, Response } from "express";
import { CustomResponse } from "../config/response.custom";
import { AppError } from "../middleware/errorHandler";
import {
  getScoreCourseByCourseTestAndStudentService,
  createScoreCourseService,
  updateScoreCourseService,
} from "../services/scoreCourse.service";
import { GetScoreCourseByCourseTestAndStudentRequest } from "../DTOS/ScoreCourse";

export const getScoreCourseByCourseTestAndStudent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const customRes = res as CustomResponse;
  const params: GetScoreCourseByCourseTestAndStudentRequest = {
    courseTestId: Number(req.params.courseTestId),
    studentId: Number(req.params.studentId),
  };

  if (!params.courseTestId) {
    throw new AppError("courseTestId không hợp lệ", 400);
  }

  if (!params.studentId) {
    throw new AppError("studentId không hợp lệ", 400);
  }

  const result = await getScoreCourseByCourseTestAndStudentService(
    params.courseTestId,
    params.studentId,
  );

  customRes.success(result, "Lấy điểm bài kiểm tra thành công");
};

export const createScoreCourse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const customRes = res as CustomResponse;
  const courseTestId = Number(req.params.courseTestId);
  const studentId = Number(req.params.studentId);
  const score = req.body.score ? Number(req.body.score) : 0;

  if (!courseTestId) {
    throw new AppError("courseTestId không hợp lệ", 400);
  }

  if (!studentId) {
    throw new AppError("studentId không hợp lệ", 400);
  }

  const result = await createScoreCourseService(courseTestId, studentId, score);

  customRes.success(result, "Tạo điểm bài kiểm tra thành công");
};

export const updateScoreCourse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const customRes = res as CustomResponse;
  const courseTestId = Number(req.params.courseTestId);
  const studentId = Number(req.params.studentId);
  const score = Number(req.body.score);

  if (!courseTestId) {
    throw new AppError("courseTestId không hợp lệ", 400);
  }

  if (!studentId) {
    throw new AppError("studentId không hợp lệ", 400);
  }

  if (isNaN(score)) {
    throw new AppError("score không hợp lệ", 400);
  }

  const result = await updateScoreCourseService(courseTestId, studentId, score);

  customRes.success(result, "Cập nhật điểm bài kiểm tra thành công");
};
