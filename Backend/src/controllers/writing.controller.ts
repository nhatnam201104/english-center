import { Request, Response } from "express";
import { CustomResponse } from "../config/response.custom";
import { AppError } from "../middleware/errorHandler";
import {
  createWritingService,
  getAllWritingService,
  getWritingByIdService,
  updateWritingService,
  deleteWritingService,
  toggleActiveWritingService,
  upsertPart1Service,
  getPart1ByExamIdService,
  deletePart1Service,
  upsertPart2Service,
  getPart2ByExamIdService,
  deletePart2Service,
  upsertPart3Service,
  getPart3ByExamIdService,
  deletePart3Service,
} from "../services/writing.service";
import { coerceRequestBody, extractFileUrls, mergeBodyWithFiles } from "../utils/dataCoercion";

// ==================== MAIN EXAM ====================

// Create Writing Exam
export const createWriting = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const coercedBody = coerceRequestBody(req.body);
  const result = await createWritingService(coercedBody);
  return customRes.success(result, "Tạo đề thi Writing thành công", 201);
};

// Get all Writing Exams
export const getAllWriting = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const search = req.query.search ? String(req.query.search) : undefined;

  const result = await getAllWritingService(page, limit, search);
  return customRes.success(result, "Lấy danh sách đề thi Writing thành công");
};

// Get Writing Exam by ID
export const getWritingById = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);

  if (!id) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  const result = await getWritingByIdService(id);
  return customRes.success(result, "Lấy thông tin đề thi Writing thành công");
};

// Update Writing Exam
export const updateWriting = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);

  if (!id) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  const coercedBody = coerceRequestBody(req.body);
  const result = await updateWritingService(id, coercedBody);
  return customRes.success(result, "Cập nhật đề thi Writing thành công");
};

// Toggle Active Status
export const toggleActiveWriting = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);

  if (!id) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  const result = await toggleActiveWritingService(id);
  return customRes.success(result, "Cập nhật trạng thái đề thi Writing thành công");
};

// Delete Writing Exam
export const deleteWriting = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);

  if (!id) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  await deleteWritingService(id);
  return customRes.success(null, "Xóa đề thi Writing thành công");
};

// ==================== PART 1 ====================

// UPSERT Part 1 - Unified create/update with file handling
export const upsertPart1 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const writingExamId = Number(req.params.id);

  if (!writingExamId) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  // Coerce data types (convert strings to proper types)
  const coercedBody = coerceRequestBody(req.body);

  // Extract file URLs from multer uploads
  const fileUrls = extractFileUrls(req.files as { [fieldname: string]: Express.Multer.File[] });

  // Merge body data with file URLs (file URLs take precedence)
  const mergedData = mergeBodyWithFiles(coercedBody, fileUrls);

  const result = await upsertPart1Service(writingExamId, mergedData);
  
  const message = (req.files && Object.keys(req.files).length > 0) 
    ? "Upsert Part 1 thành công (có cập nhật ảnh)"
    : "Upsert Part 1 thành công";
  
  return customRes.success(result, message);
};

// Get Part 1
export const getPart1 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const writingExamId = Number(req.params.id);

  if (!writingExamId) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  const result = await getPart1ByExamIdService(writingExamId);
  return customRes.success(result, "Lấy Part 1 thành công");
};

// Delete Part 1
export const deletePart1 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const writingExamId = Number(req.params.id);
  const index = Number(req.params.index);

  if (!writingExamId || !index) {
    throw new AppError("ID đề thi hoặc index không hợp lệ");
  }

  await deletePart1Service(writingExamId, index);
  return customRes.success(null, "Xóa Part 1 thành công");
};

// ==================== PART 2 ====================

// UPSERT Part 2 - Unified create/update with file handling
export const upsertPart2 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const writingExamId = Number(req.params.id);

  if (!writingExamId) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  // Coerce data types
  const coercedBody = coerceRequestBody(req.body);

  // Extract file URLs
  const fileUrls = extractFileUrls(req.files as { [fieldname: string]: Express.Multer.File[] });

  // Merge body with file URLs
  const mergedData = mergeBodyWithFiles(coercedBody, fileUrls);

  const result = await upsertPart2Service(writingExamId, mergedData);
  
  const message = (req.files && Object.keys(req.files).length > 0) 
    ? "Upsert Part 2 thành công (có cập nhật ảnh)"
    : "Upsert Part 2 thành công";
  
  return customRes.success(result, message);
};

// Get Part 2
export const getPart2 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const writingExamId = Number(req.params.id);

  if (!writingExamId) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  const result = await getPart2ByExamIdService(writingExamId);
  return customRes.success(result, "Lấy Part 2 thành công");
};

// Delete Part 2
export const deletePart2 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const writingExamId = Number(req.params.id);
  const index = Number(req.params.index);

  if (!writingExamId || !index) {
    throw new AppError("ID đề thi hoặc index không hợp lệ");
  }

  await deletePart2Service(writingExamId, index);
  return customRes.success(null, "Xóa Part 2 thành công");
};

// ==================== PART 3 ====================

// UPSERT Part 3 - Unified create/update (no files)
export const upsertPart3 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const writingExamId = Number(req.params.id);

  if (!writingExamId) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  // Coerce data types (no files to extract)
  const coercedBody = coerceRequestBody(req.body);

  const result = await upsertPart3Service(writingExamId, coercedBody);
  return customRes.success(result, "Upsert Part 3 thành công");
};

// Get Part 3
export const getPart3 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const writingExamId = Number(req.params.id);

  if (!writingExamId) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  const result = await getPart3ByExamIdService(writingExamId);
  return customRes.success(result, "Lấy Part 3 thành công");
};

// Delete Part 3
export const deletePart3 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const writingExamId = Number(req.params.id);
  const index = Number(req.params.index);

  if (!writingExamId || !index) {
    throw new AppError("ID đề thi hoặc index không hợp lệ");
  }

  await deletePart3Service(writingExamId, index);
  return customRes.success(null, "Xóa Part 3 thành công");
};
