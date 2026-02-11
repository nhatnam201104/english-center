import type { ApiResponse } from "../types/api.type";
import type { ScheduleListResponse, ScheduleResponse } from "../types/schedule/schedule.response";
import axios from "../configs/axios.config";
import type { CreateScheduleRequest } from "../types/schedule/create-schedule.request";

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

