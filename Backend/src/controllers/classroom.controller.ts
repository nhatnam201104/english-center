import { Request, Response } from "express";
import { CustomResponse } from "../config/response.custom";
import {
  createClassroomService,
  getAllClassroomsService,
  getClassroomByIdService,
  updateClassroomService,
  deleteClassroomService,
} from "../services/classroom.service";
import { GetClassroomRequest } from "../DTOS/Classroom";
import { AppError } from "../middleware/errorHandler";

// Tạo lớp học mới
export const createClassroom = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await createClassroomService(req.body);
  return customRes.success(result, "Tạo lớp học thành công");
};

// Lấy danh sách lớp học
export const getAllClassrooms = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const queryParams: GetClassroomRequest = {
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
    minSize: req.query.minSize ? Number(req.query.minSize) : undefined,
    maxSize: req.query.maxSize ? Number(req.query.maxSize) : undefined,
  };
  const result = await getAllClassroomsService(queryParams);
  return customRes.success(result, "Lấy danh sách lớp học thành công");
};

// Lấy lớp học theo ID
export const getClassroomById = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);

  if (!id) {
    throw new AppError("ID lớp học khóng hợp le");
  }
  const result = await getClassroomByIdService(id);
  return customRes.success(result, "Lấy thông tin lớp học thành công");
};

// Cập nhật lớp học
export const updateClassroom = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);

  if (!id) {
    throw new AppError("ID lớp học khóng hợp le");
  }
  const result = await updateClassroomService(id, req.body);
  return customRes.success(result, "Cập nhật lớp học thành công");
};

// Xóa lớp học
export const deleteClassroom = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);

  if (!id) {
    throw new AppError("ID lớp học khóng hợp le");
  }
  await deleteClassroomService(id);
  return customRes.success(null, "Xóa lớp học thành công");
};
