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
import type {
  SpeakingQuestionsResponse,
  SpeakingSubmitResponse,
} from "../types/entrance-exam/speaking.types";
import type {
  WritingQuestionsResponse,
  WritingAnswerRequest,
  WritingSubmitResponse,
} from "../types/entrance-exam/writing.types";

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

// ─── Speaking & Writing Exam Methods ───

export const startSpeakingAttempt = async (
  accessToken: string,
): Promise<ApiResponse<{ started: boolean }>> => {
  const response = await api.post<ApiResponse<{ started: boolean }>>(
    `/entrance-exam/attempt/${accessToken}/speaking/start`,
  );
  return response.data;
};

export const loadSpeakingQuestions = async (
  accessToken: string,
): Promise<ApiResponse<SpeakingQuestionsResponse>> => {
  const response = await api.get<ApiResponse<SpeakingQuestionsResponse>>(
    `/entrance-exam/attempt/${accessToken}/speaking`,
  );
  return response.data;
};

export const saveSpeakingAnswer = async (
  accessToken: string,
  data: FormData,
): Promise<ApiResponse<{ saved: boolean }>> => {
  const response = await api.post<ApiResponse<{ saved: boolean }>>(
    `/entrance-exam/attempt/${accessToken}/speaking/answer`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const submitSpeaking = async (
  accessToken: string,
): Promise<ApiResponse<SpeakingSubmitResponse>> => {
  const response = await api.post<ApiResponse<SpeakingSubmitResponse>>(
    `/entrance-exam/attempt/${accessToken}/speaking/submit`,
  );
  return response.data;
};

export const loadWritingQuestions = async (
  accessToken: string,
): Promise<ApiResponse<WritingQuestionsResponse>> => {
  const response = await api.get<ApiResponse<WritingQuestionsResponse>>(
    `/entrance-exam/attempt/${accessToken}/writing`,
  );
  return response.data;
};

export const saveWritingAnswer = async (
  accessToken: string,
  data: WritingAnswerRequest,
): Promise<ApiResponse<{ saved: boolean }>> => {
  const response = await api.put<ApiResponse<{ saved: boolean }>>(
    `/entrance-exam/attempt/${accessToken}/writing/answer`,
    data,
  );
  return response.data;
};

export const submitWriting = async (
  accessToken: string,
): Promise<ApiResponse<WritingSubmitResponse>> => {
  const response = await api.post<ApiResponse<WritingSubmitResponse>>(
    `/entrance-exam/attempt/${accessToken}/writing/submit`,
  );
  return response.data;
};
