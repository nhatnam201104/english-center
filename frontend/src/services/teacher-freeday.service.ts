import axios from "../configs/axios.config";
import type { ApiResponse } from "../types/api.type";
import type { CreateTeacherFreeDayRequest } from "../types/teacher/create-free-day.request";
import type { GetTeacherFreeDayResponse } from "../types/teacher/get-free-day.response";

// Lấy ngày rảnh của giáo viên
export const getTeacherFreeDayService = async (
  teacherId: number,
): Promise<ApiResponse<GetTeacherFreeDayResponse>> => {
  const URL_API = `/teachers/${teacherId}/free-days`;
  const res = await axios.get(URL_API);
  return res.data;
};

// Tạo / cập nhật ngày rảnh cho giáo viên
export const createTeacherFreeDayService = async (
  teacherId: number,
  data: CreateTeacherFreeDayRequest,
): Promise<ApiResponse<GetTeacherFreeDayResponse>> => {
  const URL_API = `/teachers/${teacherId}/free-days`;
  const res = await axios.post(URL_API, data);
  return res.data;
};