import { CreateScheduleRequest } from "../DTOS/Schedule/create-schedule.request";
import {
  SchedulePagingResponse,
  ScheduleResponse,
} from "../DTOS/Schedule/schedule.response";
import { AppError } from "../middleware/errorHandler";
import prisma from "../config/database";
import { toScheduleResponse } from "../utils/Mapper/schedule.mapper";

// Tạo schedule mới
export const createScheduleService = async (
  data: CreateScheduleRequest,
): Promise<ScheduleResponse> => {
  const courseId = Number(data.coursesId);
  const teacherId = Number(data.teacherId);
  const classroomId = Number(data.classroomId);

  const start = new Date(data.startTime);
  const end = new Date(data.endTime);

  if (end <= start) {
    throw new AppError("Thời gian kết thúc phải sau thời gian bắt đầu", 400);
  }

  // Check course
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new AppError("Khóa học không tồn tại", 404);
  }

  if (course.status !== "ACTIVE") {
    throw new AppError(
      `Không thể tạo lịch cho khóa học ở trạng thái ${course.status}`,
      400,
    );
  }

  // Check teacher
  const teacher = await prisma.teacherInfo.findUnique({
    where: { id: teacherId },
    include: { freeDays: true },
  });

  if (!teacher) {
    throw new AppError("Giáo viên không tồn tại", 404);
  }

  const teacherFreeDaySet = new Set(teacher.freeDays.map((d) => d.day));

  //Check classroom
  const classroom = await prisma.classroom.findUnique({
    where: { id: classroomId },
  });

  if (!classroom) {
    throw new AppError("Phòng học không tồn tại", 404);
  }

  // Tổng sĩ số lấy từ sức chứa phòng học
  const totalSlot = classroom.maxSize;

  // Validate sessions
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  for (const session of data.sessions) {
    // Chỉ kiểm tra nếu giáo viên đã đăng ký lịch rảnh
    if (teacherFreeDaySet.size > 0 && !teacherFreeDaySet.has(session.day)) {
      const freeDaysList = [...teacherFreeDaySet].join(", ");
      throw new AppError(
        `Giáo viên không rảnh vào ${session.day}. Ngày rảnh của giáo viên: ${freeDaysList}`,
        400,
      );
    }

    if (toMinutes(session.endTime) <= toMinutes(session.startTime)) {
      throw new AppError(
        `Giờ kết thúc phải sau giờ bắt đầu (${session.day})`,
        400,
      );
    }
  }

  const days = [...new Set(data.sessions.map((s) => s.day))];

  // Check conflict (teacher + classroom)
  const conflictSessions = await prisma.scheduleSession.findMany({
    where: {
      day: { in: days },
      schedule: {
        AND: [
          {
            startTime: { lte: end },
            endTime: { gte: start },
          },
          {
            OR: [{ teacherId }, { classroomId }],
          },
        ],
      },
    },
    include: {
      schedule: {
        select: {
          teacherId: true,
          classroomId: true,
        },
      },
    },
  });

  for (const session of data.sessions) {
    for (const conflict of conflictSessions) {
      if (conflict.day !== session.day) continue;

      const isOverlap =
        toMinutes(conflict.startTime) < toMinutes(session.endTime) &&
        toMinutes(conflict.endTime) > toMinutes(session.startTime);

      if (!isOverlap) continue;

      if (conflict.schedule.teacherId === teacherId) {
        throw new AppError(
          `Giáo viên bị trùng lịch vào ${session.day} (${session.startTime} - ${session.endTime})`,
          400,
        );
      }

      if (conflict.schedule.classroomId === classroomId) {
        throw new AppError(
          `Phòng học bị trùng lịch vào ${session.day} (${session.startTime} - ${session.endTime})`,
          400,
        );
      }
    }
  }

  // Transaction create
  const schedule = await prisma.$transaction(async (tx) => {
    return tx.schedule.create({
      data: {
        teacherId,
        classroomId,
        coursesId: courseId,
        totalSlot,
        totalRegister: 0,
        startTime: start,
        endTime: end,
        sessions: {
          create: data.sessions.map((s) => ({
            day: s.day,
            startTime: s.startTime,
            endTime: s.endTime,
          })),
        },
      },
      include: {
        course: true,
        sessions: true,
        classroom: true,
        teacher: {
          include: {
            user: true,
            freeDays: true,
          },
        },
      },
    });
  });

  return toScheduleResponse(schedule);
};

// Lấy 3 Schedule gần từ tính từ ngày mai
export const getUpcomingSchedulesService = async (): Promise<
  ScheduleResponse[]
> => {
  const now = new Date();

  const schedules = await prisma.schedule.findMany({
    where: {
      startTime: {
        gte: now,
      },
    },
    orderBy: {
      startTime: "asc",
    },
    take: 3,
    include: {
      course: true,
      sessions: true,
      classroom: true,
      teacher: {
        include: {
          user: true,
          freeDays: true,
        },
      },
    },
  });

  return schedules.map(toScheduleResponse);
};

// Lấy tất cả Schedule còn hiệu lực (startTime > hôm nay) + phân trang
// Nếu có courseId thì lấy tất cả schedule của course đó
export const getActiveSchedulesByCourseIdService = async ({
  page = 1,
  limit = 10,
  courseId,
}: {
  page?: number;
  limit?: number;
  courseId?: number;
}): Promise<SchedulePagingResponse> => {
  const now = new Date();
  const skip = (page - 1) * limit;

  // Nếu có courseId thì chỉ filter theo course (không filter thời gian)
  // Nếu không có courseId thì filter theo thời gian (schedule đang hoạt động)
  const where: any = courseId 
    ? { coursesId: courseId }
    : { startTime: { gt: now } };

  const totalItems = await prisma.schedule.count({
    where,
  });

  const schedules = await prisma.schedule.findMany({
    where,
    orderBy: { startTime: "asc" },
    skip,
    take: limit,
    include: {
      course: true,
      sessions: true,
      classroom: true,
      teacher: {
        include: {
          user: true,
          freeDays: true,
        },
      },
    },
  });

  return {
    data: schedules.map(toScheduleResponse),
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
  };
};

// Lấy tất cả Schedule
export const getAllSchedulesService = async ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}): Promise<SchedulePagingResponse> => {
  const skip = (page - 1) * limit;

  const totalItems = await prisma.schedule.count();

  const schedules = await prisma.schedule.findMany({
    orderBy: { startTime: "asc" },
    skip,
    take: limit,
    include: {
      course: true,
      sessions: true,
      classroom: true,
      teacher: {
        include: {
          user: true,
          freeDays: true,
        },
      },
    },
  });

  return {
    data: schedules.map(toScheduleResponse),
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
  };
};

// Lấy chi tiết Schedule theo ID
export const getScheduleByIdService = async (
  id: number
): Promise<ScheduleResponse> => {
  const schedule = await prisma.schedule.findUnique({
    where: { id },
    include: {
      course: true,
      sessions: {
        orderBy: { startTime: "asc" },
      },
      classroom: true,
      teacher: {
        include: {
          user: true,
          freeDays: true,
        },
      },
    },
  });

  if (!schedule) {
    throw new Error("Không tìm thấy đợt mở lớp");
  }

  return toScheduleResponse(schedule);
};

