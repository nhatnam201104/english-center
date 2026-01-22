import axios from "../configs/axios.config";
import type { ApiResponse } from "../types/api.type";
import type {
  CreateStudentRequest,
  UpdateStudentRequest,
  GetStudentRequest,
} from "../types/student/request";
import type { StudentResponse, StudentListResponse } from "../types/student/response";

export const getAllStudentsService = async (
  params?: GetStudentRequest
): Promise<ApiResponse<StudentListResponse>> => {
  const URL_API = "/students";
  const res = await axios.get(URL_API, { params });
  return res.data;
};

export const getStudentByIdService = async (
  id: number
): Promise<ApiResponse<StudentResponse>> => {
  const URL_API = `/students/${id}`;
  const res = await axios.get(URL_API);
  return res.data;
};

export const createStudentService = async (
  data: CreateStudentRequest
): Promise<ApiResponse<StudentResponse>> => {
  const URL_API = "/students";
  const res = await axios.post(URL_API, data);
  return res.data;
};

export const updateStudentService = async (
  id: number,
  data: UpdateStudentRequest
): Promise<ApiResponse<StudentResponse>> => {
  const URL_API = `/students/${id}`;
  const res = await axios.put(URL_API, data);
  return res.data;
};

export const deleteStudentService = async (
  id: number
): Promise<ApiResponse<null>> => {
  const URL_API = `/students/${id}`;
  const res = await axios.delete(URL_API);
  return res.data;
};
