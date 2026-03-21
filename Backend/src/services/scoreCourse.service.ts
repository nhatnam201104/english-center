import prisma from "../config/database";
import { ScoreCourseResponse } from "../DTOS/ScoreCourse";
import { AppError } from "../middleware/errorHandler";
import { toScoreCourseResponse } from "../utils/Mapper/scoreCourse.mapper";

export const getScoreCourseByCourseTestAndStudentService = async (
  courseTestId: number,
  studentId: number,
): Promise<ScoreCourseResponse> => {
  try {
    const scoreCourse = await prisma.scoreCourse.findUnique({
      where: {
        courseTestId_studentId: {
          courseTestId,
          studentId,
        },
      },
    });

    if (!scoreCourse) {
      throw new AppError("Chưa có học viên nào tham gia bài kiểm tra này", 404);
    }

    return toScoreCourseResponse(scoreCourse);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "Lỗi khi lấy điểm bài kiểm tra: " + (error as Error).message,
      500,
    );
  }
};

export const createScoreCourseService = async (
  courseTestId: number,
  studentId: number,
  score: number = 0,
): Promise<ScoreCourseResponse> => {
  try {
    // Kiểm tra courseTest tồn tại
    const courseTest = await prisma.courseTest.findUnique({
      where: { id: courseTestId },
    });

    if (!courseTest) {
      throw new AppError("Không tìm thấy bài kiểm tra", 404);
    }

    // Kiểm tra student tồn tại
    const student = await prisma.studentInfo.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new AppError("Không tìm thấy học viên", 404);
    }

    // Kiểm tra xem đã tồn tại score này chưa
    const existingScore = await prisma.scoreCourse.findUnique({
      where: {
        courseTestId_studentId: {
          courseTestId,
          studentId,
        },
      },
    });

    if (existingScore) {
      throw new AppError(
        "Điểm bài kiểm tra cho học viên này đã tồn tại",
        400,
      );
    }

    const scoreCourse = await prisma.scoreCourse.create({
      data: {
        courseTestId,
        studentId,
        score,
      },
    });

    return toScoreCourseResponse(scoreCourse);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "Lỗi khi tạo điểm bài kiểm tra: " + (error as Error).message,
      500,
    );
  }
};

export const updateScoreCourseService = async (
  courseTestId: number,
  studentId: number,
  score: number,
): Promise<ScoreCourseResponse> => {
  try {
    // Kiểm tra score có hợp lệ không (>=0 và <=100)
    if (score < 0 || score > 100) {
      throw new AppError("Điểm phải từ 0 đến 100", 400);
    }

    // Kiểm tra scoreCourse tồn tại
    const scoreCourse = await prisma.scoreCourse.findUnique({
      where: {
        courseTestId_studentId: {
          courseTestId,
          studentId,
        },
      },
    });

    if (!scoreCourse) {
      throw new AppError("Không tìm thấy điểm bài kiểm tra", 404);
    }

    const updatedScoreCourse = await prisma.scoreCourse.update({
      where: {
        courseTestId_studentId: {
          courseTestId,
          studentId,
        },
      },
      data: {
        score,
      },
    });

    return toScoreCourseResponse(updatedScoreCourse);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "Lỗi khi cập nhật điểm bài kiểm tra: " + (error as Error).message,
      500,
    );
  }
};
