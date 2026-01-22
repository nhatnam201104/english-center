import { Request, Response } from "express";
import { CustomResponse } from "../config/response.custom";
import {
  createStudentService,
  getAllStudentsService,
  getStudentByIdService,
  updateStudentService,
  deleteStudentService,
} from "../services/student.service";
import { GetStudentRequest } from "../DTOS/Student";

// Tạo học sinh mới
export const createStudent = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await createStudentService(req.body);
  return customRes.success(result, "Tạo học sinh thành công");
};

// Lấy danh sách học sinh
export const getAllStudents = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const queryParams: GetStudentRequest = {
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    page: req.query.page ? Number(req.query.page) : undefined,
    sortBy: req.query.sortBy ? String(req.query.sortBy) : undefined,
    sortOrder:
      req.query.sortOrder === "asc"
        ? "asc"
        : req.query.sortOrder === "desc"
          ? "desc"
          : undefined,
    search: req.query.search ? String(req.query.search) : undefined,
    minScoreRl: req.query.minScoreRl ? Number(req.query.minScoreRl) : undefined,
    maxScoreRl: req.query.maxScoreRl ? Number(req.query.maxScoreRl) : undefined,
    minScoreSw: req.query.minScoreSw ? Number(req.query.minScoreSw) : undefined,
    maxScoreSw: req.query.maxScoreSw ? Number(req.query.maxScoreSw) : undefined,
  };
  const result = await getAllStudentsService(queryParams);
  return customRes.success(result, "Lấy danh sách học sinh thành công");
};

// Lấy học sinh theo ID
export const getStudentById = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);
  const result = await getStudentByIdService(id);
  return customRes.success(result, "Lấy thông tin học sinh thành công");
};

// Cập nhật học sinh
export const updateStudent = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);
  const result = await updateStudentService(id, req.body);
  return customRes.success(result, "Cập nhật học sinh thành công");
};

// Xóa học sinh (soft delete)
export const deleteStudent = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);
  await deleteStudentService(id);
  return customRes.success(null, "Xóa học sinh thành công");
};
