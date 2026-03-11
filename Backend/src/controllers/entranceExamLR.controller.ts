import { Request, Response } from "express";
import { CustomResponse } from "../config/response.custom";
import { AppError } from "../middleware/errorHandler";
import { GetLRRequest } from "../DTOS/EntranceExamLR";
import {
  // Listening
  createListeningService,
  getAllListeningService,
  getListeningByIdService,
  updateListeningService,
  deleteListeningService,
  activateListeningService,
  getListeningPartsService,
  getListeningAnswerKeyService,
  saveListeningAnswerKeyService,
  // Reading
  createReadingService,
  getAllReadingService,
  getReadingByIdService,
  updateReadingService,
  deleteReadingService,
  activateReadingService,
  getReadingPartsService,
  getReadingAnswerKeyService,
  saveReadingAnswerKeyService,
  // Parts – add questions / groups
  updatePartDirectionService,
  addPartOneQuestionService,
  addPartTwoQuestionService,
  addPartThreeGroupService,
  addPartFourGroupService,
  addPartFiveQuestionService,
  addPartSixGroupService,
  addPartSevenGroupService,
  // Parts – delete
  deletePartOneQuestionService,
  deletePartTwoQuestionService,
  deletePartThreeGroupService,
  deletePartFourGroupService,
  deletePartFiveQuestionService,
  deletePartSixGroupService,
  deletePartSevenGroupService,
} from "../services/entranceExamLR.service";

/* ══════════════ helper ══════════════ */
const parseId = (val: any, label = "ID"): number => {
  const id = Number(val);
  if (!id || isNaN(id)) throw new AppError(`${label} không hợp lệ`);
  return id;
};

// questions may arrive as a pre-parsed array (after express-validator sanitizer)
// or as a raw JSON string — handle both
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseQuestions = (value: unknown): any[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try { return JSON.parse(value); } catch { return []; }
  }
  return [];
};

const buildQueryParams = (query: any): GetLRRequest => ({
  limit: query.limit ? Number(query.limit) : undefined,
  page: query.page ? Number(query.page) : undefined,
  sortBy: query.sortBy ? String(query.sortBy) : undefined,
  sortOrder:
    query.sortOrder === "asc"
      ? "asc"
      : query.sortOrder === "desc"
        ? "desc"
        : undefined,
  search: query.search ? String(query.search) : undefined,
  isDone: query.isDone !== undefined ? query.isDone === "true" : undefined,
  isActive:
    query.isActive !== undefined ? query.isActive === "true" : undefined,
});

/* ══════════════════════════════════════════════════════════════
   LISTENING CRUD
   ══════════════════════════════════════════════════════════════ */

export const createListening = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await createListeningService(req.body);
  return customRes.success(result, "Tạo đề thi Listening thành công");
};

export const getAllListening = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await getAllListeningService(buildQueryParams(req.query));
  return customRes.success(result, "Lấy danh sách Listening thành công");
};

export const getListeningById = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = parseId(req.params.id);
  const result = await getListeningByIdService(id);
  return customRes.success(result, "Lấy thông tin Listening thành công");
};

export const updateListening = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = parseId(req.params.id);
  const result = await updateListeningService(id, req.body);
  return customRes.success(result, "Cập nhật Listening thành công");
};

export const deleteListening = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = parseId(req.params.id);
  await deleteListeningService(id);
  return customRes.success(null, "Xóa Listening thành công");
};

export const activateListening = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = parseId(req.params.id);
  const result = await activateListeningService(id);
  return customRes.success(result, "Cập nhật trạng thái Active thành công");
};

/* ══════════════════════════════════════════════════════════════
   READING CRUD
   ══════════════════════════════════════════════════════════════ */

export const createReading = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await createReadingService(req.body);
  return customRes.success(result, "Tạo đề thi Reading thành công");
};

export const getAllReading = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const result = await getAllReadingService(buildQueryParams(req.query));
  return customRes.success(result, "Lấy danh sách Reading thành công");
};

export const getReadingById = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = parseId(req.params.id);
  const result = await getReadingByIdService(id);
  return customRes.success(result, "Lấy thông tin Reading thành công");
};

export const updateReading = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = parseId(req.params.id);
  const result = await updateReadingService(id, req.body);
  return customRes.success(result, "Cập nhật Reading thành công");
};

export const deleteReading = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = parseId(req.params.id);
  await deleteReadingService(id);
  return customRes.success(null, "Xóa Reading thành công");
};

export const activateReading = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const id = parseId(req.params.id);
  const result = await activateReadingService(id);
  return customRes.success(result, "Cập nhật trạng thái Active thành công");
};

/* ══════════════════════════════════════════════════════════════
   PARTS – Get detail
   ══════════════════════════════════════════════════════════════ */

export const getListeningParts = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const examId = parseId(req.params.id, "Exam ID");
  const result = await getListeningPartsService(examId);
  return customRes.success(result, "Lấy chi tiết Parts Listening thành công");
};

export const getReadingParts = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const examId = parseId(req.params.id, "Exam ID");
  const result = await getReadingPartsService(examId);
  return customRes.success(result, "Lấy chi tiết Parts Reading thành công");
};

/* ══════════════════════════════════════════════════════════════
   PARTS – Update direction
   ══════════════════════════════════════════════════════════════ */

export const updatePartDirection = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const partNo = parseId(req.params.partNo, "Part No");
  const partId = parseId(req.params.partId, "Part ID");
  const { direction } = req.body;
  const result = await updatePartDirectionService(partNo, partId, direction);
  return customRes.success(result, `Cập nhật direction Part ${partNo} thành công`);
};

/* ══════════════════════════════════════════════════════════════
   PARTS – Add questions / groups
   ══════════════════════════════════════════════════════════════ */

export const addPartOneQuestion = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const partId = parseId(req.params.partId, "Part ID");

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const audioFile = files?.["audio"]?.[0];
  const imageFile = files?.["image"]?.[0];

  if (!audioFile) throw new AppError("Audio là bắt buộc cho Part 1");
  if (!imageFile) throw new AppError("Image là bắt buộc cho Part 1");

  const data = {
    question: req.body.question || "",  // Not required for Part 1
    audio: audioFile.filename,
    image: imageFile.filename,
  };

  const result = await addPartOneQuestionService(partId, data);
  return customRes.success(result, "Thêm câu hỏi Part 1 thành công");
};

export const addPartTwoQuestion = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const partId = parseId(req.params.partId, "Part ID");

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const audioFile = files?.["audio"]?.[0];

  if (!audioFile) throw new AppError("Audio là bắt buộc cho Part 2");

  const data = {
    question: req.body.question || "Mark your answer on your answer sheet.",
    audio: audioFile.filename,
  };

  const result = await addPartTwoQuestionService(partId, data);
  return customRes.success(result, "Thêm câu hỏi Part 2 thành công");
};

export const addPartThreeGroup = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const partId = parseId(req.params.partId, "Part ID");

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const audioFile = files?.["audio"]?.[0];
  const imageFile = files?.["image"]?.[0];

  if (!audioFile) throw new AppError("Audio là bắt buộc cho Part 3");

  const data = {
    audio: audioFile.filename,
    image: imageFile?.filename,
    questions: parseQuestions(req.body.questions),
  };

  const result = await addPartThreeGroupService(partId, data);
  return customRes.success(result, "Thêm nhóm câu hỏi Part 3 thành công");
};

export const addPartFourGroup = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const partId = parseId(req.params.partId, "Part ID");

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const audioFile = files?.["audio"]?.[0];
  const imageFile = files?.["image"]?.[0];

  if (!audioFile) throw new AppError("Audio là bắt buộc cho Part 4");

  const data = {
    audio: audioFile.filename,
    image: imageFile?.filename,
    questions: parseQuestions(req.body.questions),
  };

  const result = await addPartFourGroupService(partId, data);
  return customRes.success(result, "Thêm nhóm câu hỏi Part 4 thành công");
};

export const addPartFiveQuestion = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const partId = parseId(req.params.partId, "Part ID");

  const data = {
    question: req.body.question,
    answerA: req.body.answerA,
    answerB: req.body.answerB,
    answerC: req.body.answerC,
    answerD: req.body.answerD,
  };

  const result = await addPartFiveQuestionService(partId, data);
  return customRes.success(result, "Thêm câu hỏi Part 5 thành công");
};

export const addPartSixGroup = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const partId = parseId(req.params.partId, "Part ID");

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const imageFile = files?.["image"]?.[0];

  const data = {
    question: req.body.question || undefined,
    image: imageFile?.filename,
    questions: parseQuestions(req.body.questions),
  };

  const result = await addPartSixGroupService(partId, data);
  return customRes.success(result, "Thêm nhóm câu hỏi Part 6 thành công");
};

export const addPartSevenGroup = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const partId = parseId(req.params.partId, "Part ID");

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const imageFile = files?.["image"]?.[0];

  const data = {
    question: req.body.question || undefined,
    image: imageFile?.filename,
    questions: parseQuestions(req.body.questions),
  };

  const result = await addPartSevenGroupService(partId, data);
  return customRes.success(result, "Thêm nhóm câu hỏi Part 7 thành công");
};

/* ══════════════════════════════════════════════════════════════
   PARTS – Delete question / group
   ══════════════════════════════════════════════════════════════ */

export const deletePartOneQuestion = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const questionId = parseId(req.params.questionId, "Question ID");
  await deletePartOneQuestionService(questionId);
  return customRes.success(null, "Xóa câu hỏi Part 1 thành công");
};

export const deletePartTwoQuestion = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const questionId = parseId(req.params.questionId, "Question ID");
  await deletePartTwoQuestionService(questionId);
  return customRes.success(null, "Xóa câu hỏi Part 2 thành công");
};

export const deletePartThreeGroup = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const groupId = parseId(req.params.groupId, "Group ID");
  await deletePartThreeGroupService(groupId);
  return customRes.success(null, "Xóa nhóm Part 3 thành công");
};

export const deletePartFourGroup = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const groupId = parseId(req.params.groupId, "Group ID");
  await deletePartFourGroupService(groupId);
  return customRes.success(null, "Xóa nhóm Part 4 thành công");
};

export const deletePartFiveQuestion = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const questionId = parseId(req.params.questionId, "Question ID");
  await deletePartFiveQuestionService(questionId);
  return customRes.success(null, "Xóa câu hỏi Part 5 thành công");
};

export const deletePartSixGroup = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const groupId = parseId(req.params.groupId, "Group ID");
  await deletePartSixGroupService(groupId);
  return customRes.success(null, "Xóa nhóm Part 6 thành công");
};

export const deletePartSevenGroup = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const groupId = parseId(req.params.groupId, "Group ID");
  await deletePartSevenGroupService(groupId);
  return customRes.success(null, "Xóa nhóm Part 7 thành công");
};

/* ══════════════════════════════════════════════════════════════
   ANSWER KEY
   ══════════════════════════════════════════════════════════════ */

export const getListeningAnswerKey = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const examId = parseId(req.params.id, "Exam ID");
  const result = await getListeningAnswerKeyService(examId);
  return customRes.success(result, "Lấy đáp án Listening thành công");
};

export const saveListeningAnswerKey = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const examId = parseId(req.params.id, "Exam ID");
  const result = await saveListeningAnswerKeyService(examId, req.body.answers);
  return customRes.success(result, "Lưu đáp án Listening thành công");
};

export const getReadingAnswerKey = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const examId = parseId(req.params.id, "Exam ID");
  const result = await getReadingAnswerKeyService(examId);
  return customRes.success(result, "Lấy đáp án Reading thành công");
};

export const saveReadingAnswerKey = async (req: Request, res: Response) => {
  const customRes = res as CustomResponse;
  const examId = parseId(req.params.id, "Exam ID");
  const result = await saveReadingAnswerKeyService(examId, req.body.answers);
  return customRes.success(result, "Lưu đáp án Reading thành công");
};
