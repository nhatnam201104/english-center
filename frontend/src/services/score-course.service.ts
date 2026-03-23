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

export interface StudentScoreData {
  id: number;
  courseName: string;
  testName: string;
  score: number;
  createdAt: string;
}

export interface CourseScoreData {
  courseId: number;
  courseName: string;
  totalTests: number;
  averageScore: number;
  highestScore: number;
  scores: {
    id: number;
    testName: string;
    score: number;
    createdAt: string;
  }[];
}

export const getStudentScoresByCourseService = async (
  courseId: number
): Promise<ApiResponse<CourseScoreData>> => {
  try {
    // Get student info to use studentId
    const studentMeResponse = await api.get<ApiResponse<any>>('/students/me');
    const studentId = studentMeResponse.data.data?.userId || studentMeResponse.data.data?.id;

    if (!studentId) {
      return {
        success: false,
        message: 'Không thể lấy thông tin học viên',
        statusCode: 400,
      };
    }

    // Get course tests for this course
    const testsResponse = await api.get<ApiResponse<any[]>>(
      `/course-tests/course/${courseId}`,
    );

    if (!testsResponse.data.success || !testsResponse.data.data) {
      return {
        success: false,
        message: 'Không thể lấy danh sách bài kiểm tra',
        statusCode: 400,
      };
    }

    const tests = testsResponse.data.data;
    const courseScores: CourseScoreData['scores'] = [];

    // For each test, get the student's score
    for (const test of tests) {
      try {
        const scoreResponse = await getScoreCourseByCourseTestAndStudent(
          test.id,
          studentId,
        );

        if (scoreResponse.success && scoreResponse.data && scoreResponse.data.score !== null) {
          courseScores.push({
            id: scoreResponse.data.id,
            testName: test.name,
            score: scoreResponse.data.score,
            createdAt: scoreResponse.data.createdAt,
          });
        }
      } catch (error) {
        // If score doesn't exist, skip this test
        console.warn(`No score found for test ${test.id}`);
      }
    }

    // Calculate statistics
    const totalTests = courseScores.length;
    const averageScore = totalTests > 0
      ? courseScores.reduce((sum, s) => sum + s.score, 0) / totalTests
      : 0;
    const highestScore =
      totalTests > 0 ? Math.max(...courseScores.map((s) => s.score)) : 0;

    // Get course name from the course info
    const courseResponse = await api.get<ApiResponse<any>>(`/courses/${courseId}`);
    const courseName = courseResponse.data.data?.name || 'Unknown Course';

    return {
      success: true,
      message: 'Lấy điểm số thành công',
      data: {
        courseId,
        courseName,
        totalTests,
        averageScore: parseFloat(averageScore.toFixed(1)),
        highestScore,
        scores: courseScores.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
      },
      statusCode: 200,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy điểm số',
      statusCode: 500,
    };
  }
};

export const getStudentScoresService = async (): Promise<ApiResponse<StudentScoreData[]>> => {
  try {
    // Get student's courses
    const coursesResponse = await api.get<ApiResponse<any[]>>('/students/me/courses');
    
    if (!coursesResponse.data.success || !coursesResponse.data.data) {
      return {
        success: false,
        message: 'Không thể lấy danh sách khóa học',
        data: [],
        statusCode: 400,
      };
    }

    const courses = coursesResponse.data.data;
    const allScores: StudentScoreData[] = [];

    // Get student info to use studentId
    const studentMeResponse = await api.get<ApiResponse<any>>('/students/me');
    const studentId = studentMeResponse.data.data?.userId || studentMeResponse.data.data?.id;

    if (!studentId) {
      return {
        success: false,
        message: 'Không thể lấy thông tin học viên',
        data: [],
        statusCode: 400,
      };
    }

    // For each course, get its tests and then get the student's score for each test
    for (const course of courses) {
      try {
        // Get course tests for this course
        const testsResponse = await api.get<ApiResponse<any[]>>(
          `/course-tests/course/${course.id}`,
        );

        if (testsResponse.data.success && testsResponse.data.data) {
          const tests = testsResponse.data.data;

          // For each test, get the student's score
          for (const test of tests) {
            try {
              const scoreResponse = await getScoreCourseByCourseTestAndStudent(
                test.id,
                studentId,
              );

              if (scoreResponse.success && scoreResponse.data && scoreResponse.data.score !== null) {
                allScores.push({
                  id: scoreResponse.data.id,
                  courseName: course.name,
                  testName: test.name,
                  score: scoreResponse.data.score,
                  createdAt: scoreResponse.data.createdAt,
                });
              }
            } catch (error) {
              // If score doesn't exist, skip this test
              console.warn(`No score found for test ${test.id}`);
            }
          }
        }
      } catch (error) {
        console.error(`Error fetching tests for course ${course.id}:`, error);
      }
    }

    // Sort by creation date (newest first)
    allScores.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      success: true,
      message: 'Lấy danh sách điểm thành công',
      data: allScores,
      statusCode: 200,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách điểm',
      data: [],
      statusCode: 500,
    };
  }
};
