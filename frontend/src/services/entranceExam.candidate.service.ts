import api from "../configs/axios.config";
import type { ApiResponse } from "../types/api.type";
import type {
  RegisterCandidateRequest,
  RegisterResponse,
  StartAttemptResponse,
  AttemptStateResponse,
  ListeningLoadResponse,
  ReadingLoadResponse,
  SaveAnswerRequest,
  ScoreResponse,
} from "../types/entrance-exam/candidate.types";

export const registerCandidate = async (
  data: RegisterCandidateRequest,
): Promise<ApiResponse<RegisterResponse>> => {
  const response = await api.post<ApiResponse<RegisterResponse>>(
    "/entrance-exam/register",
    data,
  );
  return response.data;
};

export const startAttempt = async (
  admissionId: number,
): Promise<ApiResponse<StartAttemptResponse>> => {
  const response = await api.post<ApiResponse<StartAttemptResponse>>(
    `/entrance-exam/register/${admissionId}/start`,
  );
  return response.data;
};

export const getAttemptState = async (
  accessToken: string,
): Promise<ApiResponse<AttemptStateResponse>> => {
  const response = await api.get<ApiResponse<AttemptStateResponse>>(
    `/entrance-exam/attempt/${accessToken}`,
  );
  return response.data;
};

export const loadListeningQuestions = async (
  accessToken: string,
): Promise<ApiResponse<ListeningLoadResponse>> => {
  const response = await api.get<ApiResponse<ListeningLoadResponse>>(
    `/entrance-exam/attempt/${accessToken}/listening`,
  );
  return response.data;
};

export const loadReadingQuestions = async (
  accessToken: string,
): Promise<ApiResponse<ReadingLoadResponse>> => {
  const response = await api.get<ApiResponse<ReadingLoadResponse>>(
    `/entrance-exam/attempt/${accessToken}/reading`,
  );
  return response.data;
};

export const saveAnswer = async (
  accessToken: string,
  data: SaveAnswerRequest,
): Promise<ApiResponse<{ saved: boolean }>> => {
  const response = await api.put<ApiResponse<{ saved: boolean }>>(
    `/entrance-exam/attempt/${accessToken}/answer`,
    data,
  );
  return response.data;
};

export const submitListening = async (
  accessToken: string,
): Promise<ApiResponse<{ totalListening: number }>> => {
  const response = await api.post<ApiResponse<{ totalListening: number }>>(
    `/entrance-exam/attempt/${accessToken}/listening/submit`,
  );
  return response.data;
};

export const submitReading = async (
  accessToken: string,
): Promise<ApiResponse<ScoreResponse>> => {
  const response = await api.post<ApiResponse<ScoreResponse>>(
    `/entrance-exam/attempt/${accessToken}/reading/submit`,
  );
  return response.data;
};

export const cancelAttempt = async (
  accessToken: string,
): Promise<ApiResponse<{ cancelled: boolean }>> => {
  const response = await api.post<ApiResponse<{ cancelled: boolean }>>(
    `/entrance-exam/attempt/${accessToken}/cancel`,
  );
  return response.data;
};
