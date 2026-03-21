import api from '../configs/axios.config';
import type { ApiResponse } from '../types/api.type';
import type { CreateScoreCourseRequest } from '../types/scoreCourse/create-scoreCourse.request';
import type { ScoreCourse } from '../types/scoreCourse/scoreCourse.response';

export const createScoreCourse = async (
  courseTestId: number,
  studentId: number,
  data: CreateScoreCourseRequest,
): Promise<ApiResponse<ScoreCourse>> => {
  const response = await api.post<ApiResponse<ScoreCourse>>(
    `/score-courses/course-tests/${courseTestId}/students/${studentId}`,
    data,
  );

  return response.data;
};

export interface UpdateScoreCourseRequest {
  score: number;
}

export const updateScoreCourse = async (
  courseTestId: number,
  studentId: number,
  data: UpdateScoreCourseRequest,
): Promise<ApiResponse<ScoreCourse>> => {
  const response = await api.put<ApiResponse<ScoreCourse>>(
    `/score-courses/course-tests/${courseTestId}/students/${studentId}`,
    data,
  );

  return response.data;
};

export const getScoreCourseByCourseTestAndStudent = async (
  courseTestId: number,
  studentId: number,
): Promise<ApiResponse<ScoreCourse | null>> => {
  const response = await api.get<ApiResponse<ScoreCourse | null>>(
    `/score-courses/course-tests/${courseTestId}/students/${studentId}`,
  );

  return response.data;
};
