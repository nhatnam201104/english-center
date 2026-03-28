import { Request, Response } from "express";
import type { CustomResponse } from "../config/response.custom";
import {
  getAllEntranceExamsService,
  registerCandidateService,
  startAttemptService,
  getAttemptStateService,
  loadListeningService,
  loadReadingService,
  saveAnswerService,
  submitListeningService,
  submitReadingService,
  cancelAttemptService,
  getResultsService,
  getResultByCccdService,
  startSpeakingAttemptService,
  loadSpeakingService,
  saveSpeakingAnswerService,
  submitSpeakingService,
  loadWritingService,
  saveWritingAnswerService,
  submitWritingService,
} from "../services/entranceExam.service";

// ─── Admin: Entrance Exam List ───

export const getAllEntranceExams = async (_req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await getAllEntranceExamsService();
  return customRes.success(result);
};

// ─── Public: Registration ───

export const registerCandidate = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await registerCandidateService(req.body);
  return customRes.success(result, "Đăng ký thành công");
};

export const startAttempt = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const admissionId = parseInt(req.params.admissionId as string, 10);
  const result = await startAttemptService(admissionId);
  return customRes.success(result, "Bắt đầu bài thi thành công");
};

// ─── Attempt Session (accessToken validated by middleware) ───

export const getAttemptState = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await getAttemptStateService(req.admission);
  return customRes.success(result);
};

export const loadListening = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await loadListeningService(req.admission);
  return customRes.success(result, "Tải bài Listening thành công");
};

export const loadReading = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await loadReadingService(req.admission);
  return customRes.success(result, "Tải bài Reading thành công");
};

export const saveAnswer = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const { section, questionIndex, answerId } = req.body;
  const result = await saveAnswerService(
    req.admission,
    section,
    parseInt(questionIndex, 10),
    parseInt(answerId, 10),
  );
  return customRes.success(result, "Lưu đáp án thành công");
};

export const submitListening = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await submitListeningService(req.admission);
  return customRes.success(result, "Nộp bài Listening thành công");
};

export const submitReading = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await submitReadingService(req.admission);
  return customRes.success(result, "Nộp bài thi thành công");
};

export const cancelAttempt = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await cancelAttemptService(req.admission);
  return customRes.success(result, "Hủy bài thi thành công");
};

// ─── Admin: Results ───

export const getResults = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await getResultsService({
    page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
    limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
    search: req.query.search as string | undefined,
  });
  return customRes.success(result, "Lấy danh sách kết quả thành công");
};

export const getResultByCccd = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await getResultByCccdService(req.params.cccd as string);
  return customRes.success(result, "Lấy kết quả thành công");
};

// ─── Speaking & Writing Exam Methods ───

export const startSpeakingAttempt = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await startSpeakingAttemptService(req.admission);
  return customRes.success(result, "Bắt đầu bài Speaking thành công");
};

export const loadSpeaking = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await loadSpeakingService(req.admission);
  return customRes.success(result, "Tải câu hỏi Speaking thành công");
};

export const saveSpeakingAnswer = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const { questionIndex, databaseQuestionId } = req.body;
  
  const audioPath = req.file?.filename || "";
  const result = await saveSpeakingAnswerService(
    req.admission,
    parseInt(questionIndex, 10),
    databaseQuestionId,
    audioPath
  );
  return customRes.success(result, "Lưu câu trả lời Speaking thành công");
};

export const submitSpeaking = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await submitSpeakingService(req.admission);
  return customRes.success(result, "Nộp bài Speaking thành công");
};

export const loadWriting = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await loadWritingService(req.admission);
  return customRes.success(result, "Tải câu hỏi Writing thành công");
};

export const saveWritingAnswer = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const { questionIndex, databaseQuestionId, answer } = req.body;
  const result = await saveWritingAnswerService(
    req.admission,
    parseInt(questionIndex, 10),
    databaseQuestionId,
    answer
  );
  return customRes.success(result, "Lưu câu trả lời Writing thành công");
};

export const submitWriting = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await submitWritingService(req.admission);
  return customRes.success(result, "Nộp bài Writing thành công");
};
