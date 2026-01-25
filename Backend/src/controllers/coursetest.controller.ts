import { Request, Response } from "express";
import { CustomResponse } from "../config/response.custom";
import {
  createCourseTestService,
  getAllCourseTestsService,
  getCourseTestByIdService,
  updateCourseTestService,
  updateCourseTestFileService,
  updateCourseTestAudioService,
  deleteCourseTestService,
} from "../services/courseTest.service";
import { GetCourseTestRequest } from "../DTOS/CourseTest";
import { AppError } from "../middleware/errorHandler";

// Tạo CourseTest mới với file và audio (audio là optional)
export const createCourseTest = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;

  // Khi sử dụng .fields(), files được lưu trong req.files object
  const files = req.files as any;

  // File là bắt buộc khi tạo CourseTest
  if (!files?.fileTest) {
    throw new AppError("File bài kiểm tra là bắt buộc");
  }

  const fileTestFile = files.fileTest[0];
  const filePath = fileTestFile.filename; // Store only filename

  // Audio là optional
  let audioPath: string | undefined;
  if (files?.audioTest && Array.isArray(files.audioTest)) {
    const audioFile = files.audioTest[0];
    audioPath = audioFile.filename; // Store only filename
  }

  const result = await createCourseTestService(req.body, filePath, audioPath);
  return customRes.success(result, "Tạo bài kiểm tra thành công");
};

// Lấy danh sách CourseTest
export const getAllCourseTests = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const queryParams: GetCourseTestRequest = {
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
    courseId: req.query.courseId ? Number(req.query.courseId) : undefined,
  };
  const result = await getAllCourseTestsService(queryParams);
  return customRes.success(result, "Lấy danh sách bài kiểm tra thành công");
};

// Lấy CourseTest theo ID
export const getCourseTestById = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);

  if (!id) {
    throw new AppError("ID bài kiểm tra không hợp lệ");
  }
  const result = await getCourseTestByIdService(id);
  return customRes.success(result, "Lấy thông tin bài kiểm tra thành công");
};

// Cập nhật CourseTest (metadata)
export const updateCourseTest = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);

  if (!id) {
    throw new AppError("ID bài kiểm tra không hợp lệ");
  }

  const result = await updateCourseTestService(id, req.body);
  return customRes.success(result, "Cập nhật bài kiểm tra thành công");
};

// Cập nhật file của CourseTest
export const updateCourseTestFile = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);

  if (!id) {
    throw new AppError("ID bài kiểm tra không hợp lệ");
  }

  if (!req.file) {
    throw new AppError("File bài kiểm tra là bắt buộc");
  }

  const filePath = req.file.filename; // Store only filename
  const result = updateCourseTestFileService(id, filePath);
  return customRes.success(result, "Cập nhật file bài kiểm tra thành công");
};

// Cập nhật audio của CourseTest
export const updateCourseTestAudio = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);

  if (!id) {
    throw new AppError("ID bài kiểm tra không hợp lệ");
  }

  if (!req.file) {
    throw new AppError("Audio bài kiểm tra là bắt buộc");
  }

  const audioPath = req.file.filename; // Store only filename
  const result = updateCourseTestAudioService(id, audioPath);
  return customRes.success(result, "Cập nhật audio bài kiểm tra thành công");
};

// Xóa CourseTest
export const deleteCourseTest = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);
  if (!id) {
    throw new AppError("ID bài kiểm tra không hợp lệ");
  }
  await deleteCourseTestService(id);
  return customRes.success(null, "Xóa bài kiểm tra thành công");
};
