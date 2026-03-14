import axios from '../configs/axios.config';
import type { ApiResponse } from '../types/api.type';

export interface GradeData {
  id: number;
  courseName: string;
  participationScore: number;
  examScore: number;
  finalScore: number;
  status: 'PASS' | 'FAIL' | 'NOT_GRADED';
  gradedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetGradesResponse {
  data: GradeData[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}

export const getGradesService = async (
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<GetGradesResponse>> => {
  const URL_API = '/grades';
  const res = await axios.get(URL_API, {
    params: { page, limit },
  });
  return res.data;
};