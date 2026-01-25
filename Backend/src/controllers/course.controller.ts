import { Request, Response } from "express";
import { CustomResponse } from "../config/response.custom";
import {
  createCourseService,
  getAllCoursesService,
  getCourseByIdService,
  updateCourseService,
  deleteCourseService,
} from "../services/course.service";
import { GetCourseRequest } from "../DTOS/Course";
import { AppError } from "../middleware/errorHandler";

// Tạo khóa học mới
export const createCourse = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;

  // Thumbnail là bắt buộc khi tạo course
  if (!req.file) {
    throw new AppError("Thumbnail là bắt buộc khi tạo khóa học");
  }

  req.body.thumbnail = req.file.filename;
  const result = await createCourseService(req.body);
  return customRes.success(result, "Tạo khóa học thành công");
};

// Lấy danh sách khóa học
export const getAllCourses = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const queryParams: GetCourseRequest = {
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
    type: req.query.type ? String(req.query.type) : undefined,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    minBand: req.query.minBand ? Number(req.query.minBand) : undefined,
    maxBand: req.query.maxBand ? Number(req.query.maxBand) : undefined,
  };
  const result = await getAllCoursesService(queryParams);
  return customRes.success(result, "Lấy danh sách khóa học thành công");
};

// Lấy khóa học theo ID
export const getCourseById = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);

  if (!id) {
    throw new AppError("ID khóa học không hợp lệ");
  }
  const result = await getCourseByIdService(id);
  return customRes.success(result, "Lấy thông tin khóa học thành công");
};

// Cập nhật khóa học
export const updateCourse = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);

  if (!id) {
    throw new AppError("ID khóa học không hợp lệ");
  }

  // Nếu có upload thumbnail
  if (req.file) {
    req.body.thumbnail = req.file.filename;
  }

  const result = await updateCourseService(id, req.body);
  return customRes.success(result, "Cập nhật khóa học thành công");
};

// Xóa khóa học
export const deleteCourse = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);
  if (!id) {
    throw new AppError("ID khóa học không hợp lệ");
  }
  await deleteCourseService(id);
  return customRes.success(null, "Xóa khóa học thành công");
};
