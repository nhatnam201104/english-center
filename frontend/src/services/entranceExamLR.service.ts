import api from "../configs/axios.config";
import type { ApiResponse } from "../types/api.type";
import type {
  ListeningExam,
  ReadingExam,
  PaginatedListeningResponse,
  PaginatedReadingResponse,
  ListeningPartsResponse,
  ReadingPartsResponse,
  AnswerKeyItemResponse,
} from "../types/entrance-exam-lr/response";
import type {
  GetEntranceExamLRRequest,
  CreateListeningRequest,
  CreateReadingRequest,
  UpdateLRRequest,
  SaveAnswerKeyRequest,
  QuestionMCDto,
} from "../types/entrance-exam-lr/request";

const BASE = "/entrance-exam-lr";

/* ══════════════ LISTENING ══════════════ */

export const getAllListening = async (
  params: GetEntranceExamLRRequest,
): Promise<ApiResponse<PaginatedListeningResponse>> => {
  const response = await api.get<ApiResponse<PaginatedListeningResponse>>(
    `${BASE}/listening`,
    { params },
  );
  return response.data;
};

export const getListeningById = async (
  id: number,
): Promise<ApiResponse<ListeningExam>> => {
  const response = await api.get<ApiResponse<ListeningExam>>(
    `${BASE}/listening/${id}`,
  );
  return response.data;
};

export const createListening = async (
  data: CreateListeningRequest,
): Promise<ApiResponse<ListeningExam>> => {
  const response = await api.post<ApiResponse<ListeningExam>>(
    `${BASE}/listening`,
    data,
  );
  return response.data;
};

export const updateListening = async (
  id: number,
  data: UpdateLRRequest,
): Promise<ApiResponse<ListeningExam>> => {
  const response = await api.put<ApiResponse<ListeningExam>>(
    `${BASE}/listening/${id}`,
    data,
  );
  return response.data;
};

export const deleteListening = async (
  id: number,
): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(
    `${BASE}/listening/${id}`,
  );
  return response.data;
};

export const activateListening = async (
  id: number,
): Promise<ApiResponse<ListeningExam>> => {
  const response = await api.patch<ApiResponse<ListeningExam>>(
    `${BASE}/listening/${id}/activate`,
  );
  return response.data;
};

export const getListeningParts = async (
  id: number,
): Promise<ApiResponse<ListeningPartsResponse>> => {
  const response = await api.get<ApiResponse<ListeningPartsResponse>>(
    `${BASE}/listening/${id}/parts`,
  );
  return response.data;
};

export const getListeningAnswerKey = async (
  id: number,
): Promise<ApiResponse<AnswerKeyItemResponse[]>> => {
  const response = await api.get<ApiResponse<AnswerKeyItemResponse[]>>(
    `${BASE}/listening/${id}/answer-key`,
  );
  return response.data;
};

export const saveListeningAnswerKey = async (
  id: number,
  data: SaveAnswerKeyRequest,
): Promise<ApiResponse<AnswerKeyItemResponse[]>> => {
  const response = await api.put<ApiResponse<AnswerKeyItemResponse[]>>(
    `${BASE}/listening/${id}/answer-key`,
    data,
  );
  return response.data;
};

/* ══════════════ READING ══════════════ */

export const getAllReading = async (
  params: GetEntranceExamLRRequest,
): Promise<ApiResponse<PaginatedReadingResponse>> => {
  const response = await api.get<ApiResponse<PaginatedReadingResponse>>(
    `${BASE}/reading`,
    { params },
  );
  return response.data;
};

export const getReadingById = async (
  id: number,
): Promise<ApiResponse<ReadingExam>> => {
  const response = await api.get<ApiResponse<ReadingExam>>(
    `${BASE}/reading/${id}`,
  );
  return response.data;
};

export const createReading = async (
  data: CreateReadingRequest,
): Promise<ApiResponse<ReadingExam>> => {
  const response = await api.post<ApiResponse<ReadingExam>>(
    `${BASE}/reading`,
    data,
  );
  return response.data;
};

export const updateReading = async (
  id: number,
  data: UpdateLRRequest,
): Promise<ApiResponse<ReadingExam>> => {
  const response = await api.put<ApiResponse<ReadingExam>>(
    `${BASE}/reading/${id}`,
    data,
  );
  return response.data;
};

export const deleteReading = async (
  id: number,
): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(
    `${BASE}/reading/${id}`,
  );
  return response.data;
};

export const activateReading = async (
  id: number,
): Promise<ApiResponse<ReadingExam>> => {
  const response = await api.patch<ApiResponse<ReadingExam>>(
    `${BASE}/reading/${id}/activate`,
  );
  return response.data;
};

export const getReadingParts = async (
  id: number,
): Promise<ApiResponse<ReadingPartsResponse>> => {
  const response = await api.get<ApiResponse<ReadingPartsResponse>>(
    `${BASE}/reading/${id}/parts`,
  );
  return response.data;
};

export const getReadingAnswerKey = async (
  id: number,
): Promise<ApiResponse<AnswerKeyItemResponse[]>> => {
  const response = await api.get<ApiResponse<AnswerKeyItemResponse[]>>(
    `${BASE}/reading/${id}/answer-key`,
  );
  return response.data;
};

export const saveReadingAnswerKey = async (
  id: number,
  data: SaveAnswerKeyRequest,
): Promise<ApiResponse<AnswerKeyItemResponse[]>> => {
  const response = await api.put<ApiResponse<AnswerKeyItemResponse[]>>(
    `${BASE}/reading/${id}/answer-key`,
    data,
  );
  return response.data;
};

/* ══════════════ PARTS – Update direction ══════════════ */

export const updatePartDirection = async (
  partNo: number,
  partId: number,
  direction: string,
): Promise<ApiResponse<unknown>> => {
  const response = await api.patch<ApiResponse<unknown>>(
    `${BASE}/parts/${partNo}/${partId}/direction`,
    { direction },
  );
  return response.data;
};

/* ══════════════ PARTS – Add questions / groups ══════════════ */

export const addPartOneQuestion = async (
  partId: number,
  formData: FormData,
): Promise<ApiResponse<unknown>> => {
  const response = await api.post<ApiResponse<unknown>>(
    `${BASE}/parts/1/${partId}/questions`,
    formData,
  );
  return response.data;
};

export const addPartTwoQuestion = async (
  partId: number,
  formData: FormData,
): Promise<ApiResponse<unknown>> => {
  const response = await api.post<ApiResponse<unknown>>(
    `${BASE}/parts/2/${partId}/questions`,
    formData,
  );
  return response.data;
};

export const addPartThreeGroup = async (
  partId: number,
  formData: FormData,
): Promise<ApiResponse<unknown>> => {
  const response = await api.post<ApiResponse<unknown>>(
    `${BASE}/parts/3/${partId}/groups`,
    formData,
  );
  return response.data;
};

export const addPartFourGroup = async (
  partId: number,
  formData: FormData,
): Promise<ApiResponse<unknown>> => {
  const response = await api.post<ApiResponse<unknown>>(
    `${BASE}/parts/4/${partId}/groups`,
    formData,
  );
  return response.data;
};

export const addPartFiveQuestion = async (
  partId: number,
  data: QuestionMCDto,
): Promise<ApiResponse<unknown>> => {
  const response = await api.post<ApiResponse<unknown>>(
    `${BASE}/parts/5/${partId}/questions`,
    data,
  );
  return response.data;
};

export const addPartSixGroup = async (
  partId: number,
  formData: FormData,
): Promise<ApiResponse<unknown>> => {
  const response = await api.post<ApiResponse<unknown>>(
    `${BASE}/parts/6/${partId}/groups`,
    formData,
  );
  return response.data;
};

export const addPartSevenGroup = async (
  partId: number,
  formData: FormData,
): Promise<ApiResponse<unknown>> => {
  const response = await api.post<ApiResponse<unknown>>(
    `${BASE}/parts/7/${partId}/groups`,
    formData,
  );
  return response.data;
};

/* ══════════════ PARTS – Delete ══════════════ */

export const deletePartQuestion = async (
  partNo: number,
  questionId: number,
): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(
    `${BASE}/parts/${partNo}/questions/${questionId}`,
  );
  return response.data;
};

export const deletePartGroup = async (
  partNo: number,
  groupId: number,
): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(
    `${BASE}/parts/${partNo}/groups/${groupId}`,
  );
  return response.data;
};
