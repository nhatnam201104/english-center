import api from "../configs/axios.config";
import type { ApiResponse } from "../types/api.type";
import type { Course, PaginatedCourseResponse } from "../types/course/response";
import type {
  CreateCourseRequest,
  UpdateCourseRequest,
  GetCourseRequest,
} from "../types/course/request";

// Service
export const getAllCourses = async (
  params: GetCourseRequest,
): Promise<ApiResponse<PaginatedCourseResponse>> => {
  const response = await api.get<ApiResponse<PaginatedCourseResponse>>(
    "/courses",
    {
      params,
    },
  );
  return response.data;
};

export const createCourse = async (
  data: CreateCourseRequest,
): Promise<ApiResponse<Course>> => {
  const response = await api.post<ApiResponse<Course>>("/courses", data);
  return response.data;
};

export const getCourseById = async (
  id: number,
): Promise<ApiResponse<Course>> => {
  const response = await api.get<ApiResponse<Course>>(`/courses/${id}`);
  return response.data;
};

export const updateCourse = async (
  data: UpdateCourseRequest | FormData,
  id?: number,
): Promise<ApiResponse<Course>> => {
  // If id is provided separately, use it (for FormData case)
  const courseId = id !== undefined ? id : (data as UpdateCourseRequest).id;
  const response = await api.put<ApiResponse<Course>>(
    `/courses/${courseId}`,
    data,
  );

  return response.data;
};

export const deleteCourse = async (id: number): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/courses/${id}`);
  return response.data;
};

// Lấy danh sách khóa học đã đăng ký của học sinh
export const getEnrolledCourses = async (): Promise<ApiResponse<Course[]>> => {
  const response = await api.get<ApiResponse<Course[]>>("/students/me/courses");
  return response.data;
};
