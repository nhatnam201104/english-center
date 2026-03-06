import axios from "../configs/axios.config";
import type { ApiResponse } from "../types/api.type";
import type {
  TeacherCoursesListResponse,
  TeacherCourseResponse,
  TeacherCourseStudentResponse,
} from "../types/teacher/teacher-portal.response";
import type { GetTeacherCoursesRequest } from "../types/teacher/teacher-portal.request";
import type { GetTeacherFreeDayResponse } from "../types/teacher/get-free-day.response";

// Lấy danh sách khóa học của teacher đang đăng nhập
export const getMyCoursesService = async (
  params?: GetTeacherCoursesRequest,
): Promise<ApiResponse<TeacherCoursesListResponse>> => {
  const res = await axios.get("/teacher/courses", { params });
  return res.data;
};

// Lấy chi tiết khóa học (schedule)
export const getMyCourseDetailService = async (
  scheduleId: number,
): Promise<ApiResponse<TeacherCourseResponse>> => {
  const res = await axios.get(`/teacher/courses/${scheduleId}`);
  return res.data;
};

// Lấy danh sách học sinh trong khóa học
export const getMyCourseStudentsService = async (
  scheduleId: number,
): Promise<ApiResponse<TeacherCourseStudentResponse[]>> => {
  const res = await axios.get(`/teacher/courses/${scheduleId}/students`);
  return res.data;
};

// Lấy lịch rảnh
export const getMyAvailabilityService = async (): Promise<
  ApiResponse<GetTeacherFreeDayResponse>
> => {
  const res = await axios.get("/teacher/availability");
  return res.data;
};

// Cập nhật lịch rảnh
export const updateMyAvailabilityService = async (
  freeDays: { day: string }[],
): Promise<ApiResponse<GetTeacherFreeDayResponse>> => {
  const res = await axios.put("/teacher/availability", { freeDays });
  return res.data;
};
