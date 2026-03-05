import { Request, Response } from "express";
import { CustomResponse } from "../config/response.custom";
import { AppError } from "../middleware/errorHandler";
import {
  createSpeakingService,
  getAllSpeakingService,
  getSpeakingByIdService,
  updateSpeakingService,
  deleteSpeakingService,
  toggleActiveSpeakingService,
  upsertSpeakingPart1Service,
  getSpeakingPart1ByExamIdService,
  deleteSpeakingPart1Service,
  upsertSpeakingPart2Service,
  getSpeakingPart2ByExamIdService,
  deleteSpeakingPart2Service,
  upsertSpeakingPart3Service,
  getSpeakingPart3ByExamIdService,
  deleteSpeakingPart3Service,
  upsertSpeakingPart4Service,
  getSpeakingPart4ByExamIdService,
  deleteSpeakingPart4Service,
  upsertSpeakingPart5Service,
  getSpeakingPart5ByExamIdService,
  deleteSpeakingPart5Service,
} from "../services/speaking.service";
import { coerceRequestBody, extractFileUrls, mergeBodyWithFiles } from "../utils/dataCoercion";

// ==================== MAIN EXAM ====================

// Create Speaking Exam
export const createSpeaking = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const coercedBody = coerceRequestBody(req.body);
  const result = await createSpeakingService(coercedBody);
  return customRes.success(result, "Tạo đề thi Speaking thành công");
};

// Get all Speaking Exams
export const getAllSpeaking = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const search = req.query.search ? String(req.query.search) : undefined;

  const result = await getAllSpeakingService(page, limit, search);
  return customRes.success(result, "Lấy danh sách đề thi Speaking thành công");
};

// Get Speaking Exam by ID
export const getSpeakingById = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);

  if (!id) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  const result = await getSpeakingByIdService(id);
  return customRes.success(result, "Lấy thông tin đề thi Speaking thành công");
};

// Update Speaking Exam
export const updateSpeaking = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);

  if (!id) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  const coercedBody = coerceRequestBody(req.body);
  const result = await updateSpeakingService(id, coercedBody);
  return customRes.success(result, "Cập nhật đề thi Speaking thành công");
};

// Toggle Active Status
export const toggleActiveSpeaking = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);

  if (!id) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  const result = await toggleActiveSpeakingService(id);
  return customRes.success(result, "Cập nhật trạng thái đề thi Speaking thành công");
};

// Delete Speaking Exam
export const deleteSpeaking = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = Number(req.params.id);

  if (!id) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  await deleteSpeakingService(id);
  return customRes.success(null, "Xóa đề thi Speaking thành công");
};

// ==================== PART 1 (Read a Text Aloud) ====================

export const upsertSpeakingPart1 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const speakingExamId = Number(req.params.id);

  if (!speakingExamId) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  const coercedBody = coerceRequestBody(req.body);
  const result = await upsertSpeakingPart1Service(speakingExamId, coercedBody);
  return customRes.success(result, "Upsert Part 1 Speaking thành công");
};

export const getSpeakingPart1 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const speakingExamId = Number(req.params.id);

  if (!speakingExamId) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  const result = await getSpeakingPart1ByExamIdService(speakingExamId);
  return customRes.success(result, "Lấy Part 1 Speaking thành công");
};

export const deleteSpeakingPart1 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const speakingExamId = Number(req.params.id);

  if (!speakingExamId) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  await deleteSpeakingPart1Service(speakingExamId);
  return customRes.success(null, "Xóa Part 1 Speaking thành công");
};

// ==================== PART 2 (Describe a Picture) ====================

export const upsertSpeakingPart2 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const speakingExamId = Number(req.params.id);

  if (!speakingExamId) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  const coercedBody = coerceRequestBody(req.body);
  const fileUrls = extractFileUrls(req.files as { [fieldname: string]: Express.Multer.File[] });
  const mergedData = mergeBodyWithFiles(coercedBody, fileUrls);

  const result = await upsertSpeakingPart2Service(speakingExamId, mergedData);
  
  const message = (req.files && Object.keys(req.files).length > 0) 
    ? "Upsert Part 2 Speaking thành công (có cập nhật ảnh)"
    : "Upsert Part 2 Speaking thành công";
  
  return customRes.success(result, message);
};

export const getSpeakingPart2 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const speakingExamId = Number(req.params.id);

  if (!speakingExamId) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  const result = await getSpeakingPart2ByExamIdService(speakingExamId);
  return customRes.success(result, "Lấy Part 2 Speaking thành công");
};

export const deleteSpeakingPart2 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const speakingExamId = Number(req.params.id);

  if (!speakingExamId) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  await deleteSpeakingPart2Service(speakingExamId);
  return customRes.success(null, "Xóa Part 2 Speaking thành công");
};

// ==================== PART 3 (Respond to Questions) ====================

export const upsertSpeakingPart3 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const speakingExamId = Number(req.params.id);

  if (!speakingExamId) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  const coercedBody = coerceRequestBody(req.body);
  const result = await upsertSpeakingPart3Service(speakingExamId, coercedBody);
  return customRes.success(result, "Upsert Part 3 Speaking thành công");
};

export const getSpeakingPart3 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const speakingExamId = Number(req.params.id);

  if (!speakingExamId) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  const result = await getSpeakingPart3ByExamIdService(speakingExamId);
  return customRes.success(result, "Lấy Part 3 Speaking thành công");
};

export const deleteSpeakingPart3 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const speakingExamId = Number(req.params.id);

  if (!speakingExamId) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  await deleteSpeakingPart3Service(speakingExamId);
  return customRes.success(null, "Xóa Part 3 Speaking thành công");
};

// ==================== PART 4 (Respond to Questions using Information Provided) ====================

export const upsertSpeakingPart4 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const speakingExamId = Number(req.params.id);

  if (!speakingExamId) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  const coercedBody = coerceRequestBody(req.body);
  const fileUrls = extractFileUrls(req.files as { [fieldname: string]: Express.Multer.File[] });
  const mergedData = mergeBodyWithFiles(coercedBody, fileUrls);

  const result = await upsertSpeakingPart4Service(speakingExamId, mergedData);
  
  const message = (req.files && Object.keys(req.files).length > 0) 
    ? "Upsert Part 4 Speaking thành công (có cập nhật ảnh)"
    : "Upsert Part 4 Speaking thành công";
  
  return customRes.success(result, message);
};

export const getSpeakingPart4 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const speakingExamId = Number(req.params.id);

  if (!speakingExamId) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  const result = await getSpeakingPart4ByExamIdService(speakingExamId);
  return customRes.success(result, "Lấy Part 4 Speaking thành công");
};

export const deleteSpeakingPart4 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const speakingExamId = Number(req.params.id);

  if (!speakingExamId) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  await deleteSpeakingPart4Service(speakingExamId);
  return customRes.success(null, "Xóa Part 4 Speaking thành công");
};

// ==================== PART 5 (Express an Opinion) ====================

export const upsertSpeakingPart5 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const speakingExamId = Number(req.params.id);

  if (!speakingExamId) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  const coercedBody = coerceRequestBody(req.body);
  const result = await upsertSpeakingPart5Service(speakingExamId, coercedBody);
  return customRes.success(result, "Upsert Part 5 Speaking thành công");
};

export const getSpeakingPart5 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const speakingExamId = Number(req.params.id);

  if (!speakingExamId) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  const result = await getSpeakingPart5ByExamIdService(speakingExamId);
  return customRes.success(result, "Lấy Part 5 Speaking thành công");
};

export const deleteSpeakingPart5 = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const speakingExamId = Number(req.params.id);

  if (!speakingExamId) {
    throw new AppError("ID đề thi không hợp lệ");
  }

  await deleteSpeakingPart5Service(speakingExamId);
  return customRes.success(null, "Xóa Part 5 Speaking thành công");
};
