import { AppError } from "../middleware/errorHandler";
import prisma from "../config/database";
import { ClassroomResponse } from "../DTOS/Classroom/classroom.response";
import { toClassroomResponse } from "../utils/Mapper/classroom.mapper";
import { PagingData } from "../DTOS/pagination";
import {
  CreateClassroomRequest,
  GetClassroomRequest,
  UpdateClassroomRequest,
} from "../DTOS/Classroom";

// Tạo lớp học mới
export const createClassroomService = async (
  data: CreateClassroomRequest,
): Promise<ClassroomResponse> => {
  // Kiểm tra tên lớp học đã tồn tại
  const existingClassroom = await prisma.classroom.findUnique({
    where: { name: data.name },
  });

  if (existingClassroom) {
    throw new AppError("Tên lớp học đã tồn tại", 400);
  }

  try {
    const classroom = await prisma.classroom.create({
      data: {
        name: data.name,
        maxSize: Number(data.maxSize) || 0,
      },
    });

    return toClassroomResponse(classroom);
  } catch (error) {
    throw new AppError("Lỗi khi tạo lớp học: " + (error as Error).message, 500);
  }
};

// Lấy danh sách lớp học với filters
export const getAllClassroomsService = async (
  req: GetClassroomRequest,
): Promise<PagingData<ClassroomResponse>> => {
  try {
    // Build where clause
    const where: any = {};

    // Filter by name (search)
    if (req.search) {
      where.name = {
        contains: req.search,
      };
    }

    // Filter by size range
    if (req.minSize !== undefined || req.maxSize !== undefined) {
      where.maxSize = {};
      if (req.minSize !== undefined) {
        where.maxSize.gte = req.minSize;
      }
      if (req.maxSize !== undefined) {
        where.maxSize.lte = req.maxSize;
      }
    }

    // Đếm tổng số classrooms
    const totalItems = await prisma.classroom.count({ where });

    // Lấy danh sách classrooms
    const classrooms = await prisma.classroom.findMany({
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
      data: classrooms.map(toClassroomResponse),
      page: req.page || 1,
      limit: req.limit || classrooms.length,
      totalPages: req.limit ? Math.ceil(totalItems / req.limit) : 1,
      totalItems,
    };
  } catch (error) {
    throw new AppError(
      "Lỗi khi lấy danh sách lớp học: " + (error as Error).message,
      500,
    );
  }
};

// Lấy lớp học theo ID
export const getClassroomByIdService = async (
  id: number,
): Promise<ClassroomResponse> => {
  try {
    const classroom = await prisma.classroom.findUnique({
      where: { id },
    });

    if (!classroom) {
      throw new AppError("Không tìm thấy lớp học", 404);
    }

    return toClassroomResponse(classroom);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi lấy thông tin lớp học: " + (error as Error).message,
      500,
    );
  }
};

// Cập nhật lớp học
export const updateClassroomService = async (
  id: number,
  data: UpdateClassroomRequest,
): Promise<ClassroomResponse> => {
  // Kiểm tra lớp học tồn tại
  const classroom = await prisma.classroom.findUnique({
    where: { id },
  });

  if (!classroom) {
    throw new AppError("Không tìm thấy lớp học", 404);
  }

  // Kiểm tra tên lớp học đã tồn tại nếu có thay đổi
  if (data.name && data.name !== classroom.name) {
    const existingClassroom = await prisma.classroom.findUnique({
      where: { name: data.name },
    });
    if (existingClassroom && existingClassroom.name !== classroom.name) {
      throw new AppError("Tên lớp học đã tồn tại", 400);
    }
  }

  try {
    const updatedClassroom = await prisma.classroom.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.maxSize !== undefined && { maxSize: Number(data.maxSize) }),
      },
    });

    return toClassroomResponse(updatedClassroom);
  } catch (error) {
    throw new AppError(
      "Lỗi khi cập nhật lớp học: " + (error as Error).message,
      500,
    );
  }
};

// Xóa lớp học (hard delete vì không có deletedAt trong schema)
export const deleteClassroomService = async (id: number): Promise<void> => {
  const classroom = await prisma.classroom.findUnique({
    where: { id },
  });

  if (!classroom) {
    throw new AppError("Không tìm thấy lớp học", 404);
  }

  // Kiểm tra xem lớp học có đang được sử dụng bởi khóa học nào không
  const schedulesCount = await prisma.schedule.count({
    where: { classroomId: id },
  });

  if (schedulesCount > 0) {
    // Lấy danh sách các khóa học đang sử dụng lớp học này để hiển thị thông báo chi tiết
    const schedules = await prisma.schedule.findMany({
      where: { classroomId: id },
      include: {
        course: true,
      },
    });

    const courseNames = schedules
      .map((s) => s.course.name)
      .filter((name, index, self) => self.indexOf(name) === index) // Remove duplicates
      .join(", ");

    throw new AppError(
      `Không thể xóa lớp học vì đang có ${schedulesCount} lịch học sử dụng. Các khóa học liên quan: ${courseNames}`,
      400,
    );
  }

  try {
    await prisma.classroom.delete({
      where: { id },
    });
  } catch (error) {
    throw new AppError("Lỗi khi xóa lớp học: " + (error as Error).message, 500);
  }
};
