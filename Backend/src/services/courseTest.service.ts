import { AppError } from "../middleware/errorHandler";
import prisma from "../config/database";
import { CourseTestResponse } from "../DTOS/CourseTest/coursetest.response";
import { toCourseTestResponse } from "../utils/Mapper/coursetest.mapper";
import { PagingData } from "../DTOS/pagination";
import {
  CreateCourseTestRequest,
  GetCourseTestRequest,
  UpdateCourseTestRequest,
} from "../DTOS/CourseTest";
import fs from "fs";
import path from "path";

// Tạo CourseTest mới với file và audio (audio là optional)
export const createCourseTestService = async (
  data: CreateCourseTestRequest,
  fileTest: string,
  audioTest?: string,
): Promise<CourseTestResponse> => {
  // Convert ID to number
  const courseId = Number(data.courseId);
  const index = Number(data.index);

  // Kiểm tra course tồn tại
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new AppError("Không tìm thấy khóa học", 404);
  }

  // Kiểm tra tên CourseTest đã tồn tại trong cùng course
  const existingCourseTest = await prisma.courseTest.findFirst({
    where: {
      courseId: courseId,
      name: data.name,
    },
  });

  if (existingCourseTest) {
    throw new AppError("Tên bài kiểm tra đã tồn tại trong khóa học này", 400);
  }

  try {
    const courseTest = await prisma.courseTest.create({
      data: {
        courseId: courseId,
        name: data.name,
        index: index,
        fileTest: fileTest,
        audioTest: audioTest || null,
      },
    });

    return toCourseTestResponse(courseTest);
  } catch (error) {
    throw new AppError(
      "Lỗi khi tạo bài kiểm tra: " + (error as Error).message,
      500,
    );
  }
};

// Lấy danh sách CourseTest với filters
export const getAllCourseTestsService = async (
  req: GetCourseTestRequest,
): Promise<PagingData<CourseTestResponse>> => {
  try {
    // Build where clause
    const where: any = {};

    // Search trong name
    if (req.search) {
      where.name = {
        contains: req.search,
      };
    }

    // Filter by courseId - convert to number
    if (req.courseId) {
      where.courseId = Number(req.courseId);
    }

    // Đếm tổng số courseTests
    const totalItems = await prisma.courseTest.count({ where });

    // Lấy danh sách courseTests
    const courseTests = await prisma.courseTest.findMany({
      where,
      take: req.limit,
      skip: req.page && req.limit ? (req.page - 1) * req.limit : undefined,
      orderBy: req.sortBy
        ? {
            [req.sortBy]: req.sortOrder || "asc",
          }
        : { createdAt: "desc" },
    });

    return {
      data: courseTests.map(toCourseTestResponse),
      page: req.page || 1,
      limit: req.limit || courseTests.length,
      totalPages: req.limit ? Math.ceil(totalItems / req.limit) : 1,
      totalItems,
    };
  } catch (error) {
    throw new AppError(
      "Lỗi khi lấy danh sách bài kiểm tra: " + (error as Error).message,
      500,
    );
  }
};

// Lấy CourseTest theo ID
export const getCourseTestByIdService = async (
  id: number,
): Promise<CourseTestResponse> => {
  try {
    const courseTest = await prisma.courseTest.findUnique({
      where: { id },
    });

    if (!courseTest) {
      throw new AppError("Không tìm thấy bài kiểm tra", 404);
    }

    return toCourseTestResponse(courseTest);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi lấy thông tin bài kiểm tra: " + (error as Error).message,
      500,
    );
  }
};

// Cập nhật CourseTest (không cho phép cập nhật file)
export const updateCourseTestService = async (
  id: number,
  data: UpdateCourseTestRequest,
): Promise<CourseTestResponse> => {
  // Kiểm tra CourseTest tồn tại
  const courseTest = await prisma.courseTest.findUnique({
    where: { id },
  });

  if (!courseTest) {
    throw new AppError("Không tìm thấy bài kiểm tra", 404);
  }

  // Convert courseId to number if provided
  const newCourseId = data.courseId ? Number(data.courseId) : undefined;

  // Nếu thay đổi courseId, kiểm tra course mới tồn tại
  if (newCourseId && newCourseId !== courseTest.courseId) {
    const course = await prisma.course.findUnique({
      where: { id: newCourseId },
    });

    if (!course) {
      throw new AppError("Không tìm thấy khóa học", 404);
    }
  }

  // Nếu thay đổi tên, kiểm tra tên đã tồn tại trong course chưa
  if (data.name && data.name !== courseTest.name) {
    const targetCourseId = newCourseId || courseTest.courseId;
    const existingCourseTest = await prisma.courseTest.findFirst({
      where: {
        courseId: targetCourseId,
        name: data.name,
        id: { not: id },
      },
    });

    if (existingCourseTest) {
      throw new AppError("Tên bài kiểm tra đã tồn tại trong khóa học này", 400);
    }
  }

  try {
    const updatedCourseTest = await prisma.courseTest.update({
      where: { id },
      data: {
        ...(data.courseId !== undefined && { courseId: newCourseId }),
        ...(data.name !== undefined && { name: data.name }),
        ...(data.index !== undefined && { index: Number(data.index) }),
      },
    });

    return toCourseTestResponse(updatedCourseTest);
  } catch (error) {
    throw new AppError(
      "Lỗi khi cập nhật bài kiểm tra: " + (error as Error).message,
      500,
    );
  }
};

// Cập nhật file của CourseTest
export const updateCourseTestFileService = async (
  id: number,
  fileTest: string,
): Promise<CourseTestResponse> => {
  // Kiểm tra CourseTest tồn tại
  const courseTest = await prisma.courseTest.findUnique({
    where: { id },
  });

  if (!courseTest) {
    throw new AppError("Không tìm thấy bài kiểm tra", 404);
  }

  // Xóa file cũ nếu có
  if (courseTest.fileTest) {
    const oldFilePath = path.join(process.cwd(), courseTest.fileTest);
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }
  }

  try {
    const updatedCourseTest = await prisma.courseTest.update({
      where: { id },
      data: {
        fileTest: fileTest,
      },
    });

    return toCourseTestResponse(updatedCourseTest);
  } catch (error) {
    throw new AppError(
      "Lỗi khi cập nhật file bài kiểm tra: " + (error as Error).message,
      500,
    );
  }
};

// Cập nhật audio của CourseTest
export const updateCourseTestAudioService = async (
  id: number,
  audioTest: string,
): Promise<CourseTestResponse> => {
  // Kiểm tra CourseTest tồn tại
  const courseTest = await prisma.courseTest.findUnique({
    where: { id },
  });

  if (!courseTest) {
    throw new AppError("Không tìm thấy bài kiểm tra", 404);
  }

  // Xóa audio cũ nếu có
  if (courseTest.audioTest) {
    const oldAudioPath = path.join(process.cwd(), courseTest.audioTest);
    if (fs.existsSync(oldAudioPath)) {
      fs.unlinkSync(oldAudioPath);
    }
  }

  try {
    const updatedCourseTest = await prisma.courseTest.update({
      where: { id },
      data: {
        audioTest: audioTest,
      },
    });

    return toCourseTestResponse(updatedCourseTest);
  } catch (error) {
    throw new AppError(
      "Lỗi khi cập nhật audio bài kiểm tra: " + (error as Error).message,
      500,
    );
  }
};

// Xóa CourseTest (soft/hard delete)
export const deleteCourseTestService = async (id: number): Promise<void> => {
  const courseTest = await prisma.courseTest.findUnique({
    where: { id },
  });

  if (!courseTest) {
    throw new AppError("Không tìm thấy bài kiểm tra", 404);
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Xóa các ScoreCourse liên quan
      await tx.scoreCourse.deleteMany({
        where: { courseTestId: id },
      });

      // Xóa file trên server nếu có
      if (courseTest.fileTest) {
        const filePath = path.join(process.cwd(), courseTest.fileTest);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      // Xóa audio trên server nếu có
      if (courseTest.audioTest) {
        const audioPath = path.join(process.cwd(), courseTest.audioTest);
        if (fs.existsSync(audioPath)) {
          fs.unlinkSync(audioPath);
        }
      }

      // Xóa CourseTest
      await tx.courseTest.delete({
        where: { id },
      });
    });
  } catch (error) {
    throw new AppError(
      "Lỗi khi xóa bài kiểm tra: " + (error as Error).message,
      500,
    );
  }
};
