import api from "../configs/axios.config";
import type { ApiResponse } from "../types/api.type";
import type { CreateSpeakingRequest, GetSpeakingRequest, UpdateSpeakingRequest, UpsertSpeakingPart1Request, UpsertSpeakingPart3Request, UpsertSpeakingPart5Request } from "../types/speaking/request";
import type {
  SpeakingResponse,
  SpeakingOneTwo,
  SpeakingThreeFour,
  SpeakingFiveToSeven,
  SpeakingEightToTen,
  SpeakingEleven,
} from "../types/speaking/response";


// ==================== MAIN EXAM ====================

export const getAllSpeakingExams = async (
  params: GetSpeakingRequest,
): Promise<ApiResponse<any>> => {
  const response = await api.get<ApiResponse<any>>("/speaking", {
    params,
  });
  return response.data;
};

export const getSpeakingById = async (id: number): Promise<ApiResponse<SpeakingResponse>> => {
  const response = await api.get<ApiResponse<SpeakingResponse>>(`/speaking/${id}`);
  return response.data;
};

export const createSpeaking = async (
  data: CreateSpeakingRequest,
): Promise<ApiResponse<SpeakingResponse>> => {
  const response = await api.post<ApiResponse<SpeakingResponse>>("/speaking", data);
  return response.data;
};

export const updateSpeaking = async (
  data: UpdateSpeakingRequest,
): Promise<ApiResponse<SpeakingResponse>> => {
  const response = await api.put<ApiResponse<SpeakingResponse>>(`/speaking/${data.id}`, data);
  return response.data;
};

export const deleteSpeaking = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/speaking/${id}`);
  return response.data;
};

export const toggleActiveSpeaking = async (id: number): Promise<ApiResponse<SpeakingResponse>> => {
  const response = await api.patch<ApiResponse<SpeakingResponse>>(`/speaking/${id}/toggle-active`);
  return response.data;
};

// ==================== PART 1 ====================

export const getSpeakingPart1 = async (examId: number): Promise<ApiResponse<SpeakingOneTwo[]>> => {
  const response = await api.get<ApiResponse<SpeakingOneTwo[]>>(`/speaking/${examId}/part1`);
  return response.data;
};

export const upsertSpeakingPart1 = async (
  examId: number,
  data: UpsertSpeakingPart1Request,
): Promise<ApiResponse<SpeakingOneTwo>> => {
  const response = await api.put<ApiResponse<SpeakingOneTwo>>(
    `/speaking/${examId}/part1`,
    data,
  );
  return response.data;
};

export const deleteSpeakingPart1 = async (examId: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/speaking/${examId}/part1`);
  return response.data;
};

// ==================== PART 2 ====================

export const getSpeakingPart2 = async (examId: number): Promise<ApiResponse<SpeakingThreeFour[]>> => {
  const response = await api.get<ApiResponse<SpeakingThreeFour[]>>(`/speaking/${examId}/part2`);
  return response.data;
};

export const upsertSpeakingPart2 = async (
  examId: number,
  formData: FormData,
): Promise<ApiResponse<SpeakingThreeFour>> => {
  const response = await api.put<ApiResponse<SpeakingThreeFour>>(
    `/speaking/${examId}/part2`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const deleteSpeakingPart2 = async (examId: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/speaking/${examId}/part2`);
  return response.data;
};

// ==================== PART 3 ====================

export const getSpeakingPart3 = async (examId: number): Promise<ApiResponse<SpeakingFiveToSeven[]>> => {
  const response = await api.get<ApiResponse<SpeakingFiveToSeven[]>>(`/speaking/${examId}/part3`);
  return response.data;
};

export const upsertSpeakingPart3 = async (
  examId: number,
  data: UpsertSpeakingPart3Request,
): Promise<ApiResponse<SpeakingFiveToSeven>> => {
  const response = await api.put<ApiResponse<SpeakingFiveToSeven>>(
    `/speaking/${examId}/part3`,
    data,
  );
  return response.data;
};

export const deleteSpeakingPart3 = async (examId: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/speaking/${examId}/part3`);
  return response.data;
};

// ==================== PART 4 ====================

export const getSpeakingPart4 = async (examId: number): Promise<ApiResponse<SpeakingEightToTen[]>> => {
  const response = await api.get<ApiResponse<SpeakingEightToTen[]>>(`/speaking/${examId}/part4`);
  return response.data;
};

export const upsertSpeakingPart4 = async (
  examId: number,
  formData: FormData,
): Promise<ApiResponse<SpeakingEightToTen>> => {
  const response = await api.put<ApiResponse<SpeakingEightToTen>>(
    `/speaking/${examId}/part4`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const deleteSpeakingPart4 = async (examId: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/speaking/${examId}/part4`);
  return response.data;
};

// ==================== PART 5 ====================

export const getSpeakingPart5 = async (examId: number): Promise<ApiResponse<SpeakingEleven[]>> => {
  const response = await api.get<ApiResponse<SpeakingEleven[]>>(`/speaking/${examId}/part5`);
  return response.data;
};

export const upsertSpeakingPart5 = async (
  examId: number,
  data: UpsertSpeakingPart5Request,
): Promise<ApiResponse<SpeakingEleven>> => {
  const response = await api.put<ApiResponse<SpeakingEleven>>(
    `/speaking/${examId}/part5`,
    data,
  );
  return response.data;
};

export const deleteSpeakingPart5 = async (examId: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/speaking/${examId}/part5`);
  return response.data;
};
