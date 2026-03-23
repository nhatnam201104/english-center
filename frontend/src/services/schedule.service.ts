import type { ApiResponse } from "../types/api.type";
import type { ScheduleListResponse, ScheduleResponse } from "../types/schedule/schedule.response";
import axios from "../configs/axios.config";
import type { CreateScheduleRequest } from "../types/schedule/create-schedule.request";
import type { StudentResponse } from "../types/student/response";

export interface ScheduleStudentListResponse {
  data: StudentResponse[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface StudentScheduleSessionResponse {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
}

export interface StudentScheduleByIdResponse {
  id: number;
  teacher?: {
    id: number;
    userId: number;
    fullname: string;
    email: string;
    phone: string;
    degree: string;
    isTeaching: boolean;
    avatar: string;
    createdAt: string;
    updatedAt: string;
    days: string[];
  };
  classroom?: {
    id: number;
    name: string;
    maxSize: number;
    createdAt: string;
    updatedAt: string;
  };
  totalSlot: number;
  totalRegister: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  course?: {
    id: number;
    type: string;
    name: string;
    courseSkill: string;
    status: string;
    price: number;
    sale: number;
    thumbnail: string;
    totalSession: number;
    minBand: number;
    maxBand: number;
    createdAt: string;
    updatedAt: string;
  };
  sessions: StudentScheduleSessionResponse[];
}

export interface StudentSchedulesByStudentIdResponse {
  data: StudentScheduleByIdResponse[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

// Tạo schedule + session schedule
export const createSchedule = async (
  data: CreateScheduleRequest
): Promise<ApiResponse<ScheduleResponse>> => {
  const response = await axios.post<ApiResponse<ScheduleResponse>>(
    "/schedule",
    data
  );
  return response.data;
};

// Lấy 3 course có thời gian bắt đầu gần hiện tại nhất
export const getUpcomingSchedules = async (): Promise<ApiResponse<ScheduleResponse[]>> => {
  const response = await axios.get<ApiResponse<ScheduleResponse[]>>("/schedule/upcoming");
  return response.data;
};

// Lấy tất cả Schedule còn hiệu lực (startTime > hôm nay) + phân trang
export const getActiveSchedules = async (
  page = 1,
  limit = 10,
  courseId?: number,
): Promise<ApiResponse<ScheduleListResponse>> => {
  const response = await axios.get<ApiResponse<ScheduleListResponse>>(
    "/schedule/active-schedule",
    {
      params: { page, limit, courseId },
    }
  );

  return response.data;
};

// Lấy tất cả Schedule + phân trang
export const getAllSchedules = async (
  page = 1,
  limit = 10,
): Promise<ApiResponse<ScheduleListResponse>> => {
  const response = await axios.get<ApiResponse<ScheduleListResponse>>(
    "/schedule",
    {
      params: { page, limit },
    }
  );

  return response.data;
};

// Lấy chi tiết Schedule theo ID
export const getScheduleById = async (
  id: number
): Promise<ApiResponse<ScheduleResponse>> => {
  const response = await axios.get<ApiResponse<ScheduleResponse>>(
    `/schedule/${id}`
  );

  return response.data;
};

// Admin: Lấy danh sách học sinh trong schedule
export const getScheduleStudents = async (
  scheduleId: number,
  params?: { search?: string; page?: number; limit?: number },
): Promise<ApiResponse<ScheduleStudentListResponse>> => {
  const response = await axios.get<ApiResponse<ScheduleStudentListResponse>>(
    `/schedule/${scheduleId}/students`,
    { params }
  );
  return response.data;
};

// Admin: Lấy danh sách học sinh hợp lệ để thêm vào schedule
export const getEligibleStudentsForSchedule = async (
  scheduleId: number,
  params?: { search?: string; page?: number; limit?: number },
): Promise<ApiResponse<ScheduleStudentListResponse>> => {
  const response = await axios.get<ApiResponse<ScheduleStudentListResponse>>(
    `/schedule/${scheduleId}/eligible-students`,
    { params }
  );
  return response.data;
};

// Admin: Thêm học sinh vào schedule
export const addStudentToSchedule = async (
  scheduleId: number,
  studentId: number,
): Promise<ApiResponse<unknown>> => {
  const response = await axios.post<ApiResponse<unknown>>(
    `/schedule/${scheduleId}/students`,
    { studentId }
  );
  return response.data;
};

// Admin: Xóa học sinh khỏi schedule
export const removeStudentFromSchedule = async (
  scheduleId: number,
  studentId: number,
): Promise<ApiResponse<unknown>> => {
  const response = await axios.delete<ApiResponse<unknown>>(
    `/schedule/${scheduleId}/students/${studentId}`
  );
  return response.data;
};

// Student: Lấy danh sách schedules đã đăng ký
export const getStudentSchedules = async (
  page = 1,
  limit = 10,
): Promise<ApiResponse<ScheduleListResponse>> => {
  const response = await axios.get<ApiResponse<ScheduleListResponse>>(
    "/schedule/student/my-schedules",
    {
      params: { page, limit },
    }
  );
  return response.data;
};

export const getSchedulesByStudentId = async (
  studentId: number,
  page = 1,
  limit = 10,
): Promise<ApiResponse<StudentSchedulesByStudentIdResponse>> => {
  const response = await axios.get<ApiResponse<StudentSchedulesByStudentIdResponse>>(
    `/schedules/student/${studentId}/schedules`,
    {
      params: { page, limit },
    }
  );

  return response.data;
};