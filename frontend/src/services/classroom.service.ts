import api from "../configs/axios.config";
import type { ApiResponse } from "../types/api.type";
import type {
  Classroom,
  PaginatedClassroomResponse,
} from "../types/classroom/response";
import type {
  CreateClassroomRequest,
  UpdateClassroomRequest,
  GetClassroomRequest,
} from "../types/classroom/request";

// Service
export const getAllClassrooms = async (
  params: GetClassroomRequest,
): Promise<ApiResponse<PaginatedClassroomResponse>> => {
  const response = await api.get<ApiResponse<PaginatedClassroomResponse>>(
    "/classrooms",
    { params },
  );
  return response.data;
};

export const createClassroom = async (
  data: CreateClassroomRequest,
): Promise<ApiResponse<Classroom>> => {
  const response = await api.post<ApiResponse<Classroom>>("/classrooms", data);
  return response.data;
};

export const getClassroomById = async (
  id: number,
): Promise<ApiResponse<Classroom>> => {
  const response = await api.get<ApiResponse<Classroom>>(`/classrooms/${id}`);
  return response.data;
};

export const updateClassroom = async (
  data: UpdateClassroomRequest,
): Promise<ApiResponse<Classroom>> => {
  const response = await api.put<ApiResponse<Classroom>>(
    `/classrooms/${data.id}`,
    data,
  );
  return response.data;
};

export const deleteClassroom = async (
  id: number,
): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/classrooms/${id}`);
  return response.data;
};
