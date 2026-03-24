import api from "../configs/axios.config";
import type { ApiResponse } from "../types/api.type";
import type {
  ValidateTokenResponse,
  CheckParentResponse,
  AvailableSchedule,
  StudentAvailableSchedulesResponse,
  CreateDraftResponse,
  CreatePaymentUrlResponse,
  EnrollmentStatusResponse,
  PaymentReturnResult,
} from "../types/enrollment/response";
import type {
  CreateEnrollmentDraftRequest,
  CreatePaymentUrlRequest,
} from "../types/enrollment/request";

export const validateToken = async (
  token: string,
): Promise<ApiResponse<ValidateTokenResponse>> => {
  const response = await api.get<ApiResponse<ValidateTokenResponse>>(
    `/enrollment/validate/${token}`,
  );
  return response.data;
};

export const checkParent = async (
  phone: string,
): Promise<ApiResponse<CheckParentResponse>> => {
  const response = await api.get<ApiResponse<CheckParentResponse>>(
    `/enrollment/check-parent`,
    { params: { phone } },
  );
  return response.data;
};

export const getAvailableSchedules = async (
  admissionType: string,
): Promise<ApiResponse<AvailableSchedule[]>> => {
  const response = await api.get<ApiResponse<AvailableSchedule[]>>(
    `/enrollment/schedules`,
    { params: { admissionType } },
  );
  return response.data;
};

export const createDraft = async (
  data: CreateEnrollmentDraftRequest,
): Promise<ApiResponse<CreateDraftResponse>> => {
  const response = await api.post<ApiResponse<CreateDraftResponse>>(
    `/enrollment/draft`,
    data,
  );
  return response.data;
};

export const getStudentAvailableSchedules = async (): Promise<
  ApiResponse<StudentAvailableSchedulesResponse>
> => {
  const response = await api.get<ApiResponse<StudentAvailableSchedulesResponse>>(
    `/enrollment/student/schedules`,
  );
  return response.data;
};

export const createStudentDraft = async (
  data: Omit<CreateEnrollmentDraftRequest, "token" | "candidateData">,
): Promise<ApiResponse<CreateDraftResponse>> => {
  const response = await api.post<ApiResponse<CreateDraftResponse>>(
    `/enrollment/student/draft`,
    data,
  );
  return response.data;
};

export const createPaymentUrl = async (
  data: CreatePaymentUrlRequest,
): Promise<ApiResponse<CreatePaymentUrlResponse>> => {
  const response = await api.post<ApiResponse<CreatePaymentUrlResponse>>(
    `/payment/create-url`,
    data,
  );
  return response.data;
};

export const getEnrollmentStatus = async (
  txnRef: string,
): Promise<ApiResponse<EnrollmentStatusResponse>> => {
  const response = await api.get<ApiResponse<EnrollmentStatusResponse>>(
    `/enrollment/status/${txnRef}`,
  );
  return response.data;
};

export const getPaymentReturn = async (
  queryString: string,
): Promise<ApiResponse<PaymentReturnResult>> => {
  const response = await api.get<ApiResponse<PaymentReturnResult>>(
    `/payment/return?${queryString}`,
  );
  return response.data;
};
