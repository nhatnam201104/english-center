import prisma from "../config/database";
import { AppError } from "../middleware/errorHandler";
import { toScheduleResponse } from "../utils/Mapper/schedule.mapper";
import {
  TeacherCourseResponse,
  TeacherCoursesPagingResponse,
  TeacherCourseStudentResponse,
} from "../DTOS/Teacher";
import { GetTeacherFreeDayResponse } from "../DTOS/Teacher";
import {
  createTeacherFreeDayService,
  getTeacherFreeDayService,
} from "./teacherFreeDay.service";
import { CreateTeacherFreeDay } from "../DTOS/Teacher";

// Helper: compute schedule status
const computeScheduleStatus = (
  startTime: Date,
  endTime: Date,
): "UPCOMING" | "ONGOING" | "FINISHED" => {
  const now = new Date();
  if (now < startTime) return "UPCOMING";
  if (now > endTime) return "FINISHED";
  return "ONGOING";
};

// Helper: get teacherInfo id from userId
const getTeacherInfoByUserId = async (userId: number) => {
  const teacher = await prisma.teacherInfo.findUnique({
    where: { userId },
  });
  if (!teacher) {
    throw new AppError("Không tìm thấy thông tin giáo viên", 404);
  }
  return teacher;
};

// Lấy danh sách khóa học của giáo viên đang đăng nhập
export const getMyCoursesService = async (
  userId: number,
  params: {
    page?: number;
    limit?: number;
    status?: string;
    scheduleType?: string;
  },
): Promise<TeacherCoursesPagingResponse> => {
  const teacher = await getTeacherInfoByUserId(userId);
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = {
    teacherId: teacher.id,
  };

  // Filter theo status (UPCOMING, ONGOING, FINISHED) — post-filter vì computed
  // Filter theo scheduleType (246, 357) — post-filter vì depends on sessions

  // Lấy tất cả schedules của teacher (sẽ post-filter)
  const allSchedules = await prisma.schedule.findMany({
    where,
    orderBy: { startTime: "desc" },
    include: {
      course: true,
      sessions: true,
      teacher: {
        include: {
          user: true,
          freeDays: true,
        },
      },
    },
  });

  // Map to response + compute status
  let results: TeacherCourseResponse[] = allSchedules.map((schedule) => {
    const mapped = toScheduleResponse(schedule);
    return {
      ...mapped,
      status: computeScheduleStatus(schedule.startTime, schedule.endTime),
    };
  });

  // Post-filter theo status
  if (params.status) {
    results = results.filter((r) => r.status === params.status);
  }

  // Post-filter theo schedule type (246 = Mon/Wed/Fri, 357 = Tue/Thu/Sat)
  if (params.scheduleType) {
    const dayMap246 = ["MONDAY", "WEDNESDAY", "FRIDAY"];
    const dayMap357 = ["TUESDAY", "THURSDAY", "SATURDAY"];

    results = results.filter((r) => {
      const sessionDays = r.sessions.map((s) => s.day);
      if (params.scheduleType === "246") {
        return sessionDays.some((d) => dayMap246.includes(d));
      }
      if (params.scheduleType === "357") {
        return sessionDays.some((d) => dayMap357.includes(d));
      }
      return true;
    });
  }

  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / limit);
  const paginatedData = results.slice(skip, skip + limit);

  return {
    data: paginatedData,
    page,
    limit,
    totalPages,
    totalItems,
  };
};

// Lấy chi tiết khóa học (schedule) — kiểm tra ownership
export const getMyCourseDetailService = async (
  userId: number,
  scheduleId: number,
): Promise<TeacherCourseResponse> => {
  const teacher = await getTeacherInfoByUserId(userId);

  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: {
      course: true,
      sessions: {
        orderBy: { startTime: "asc" },
      },
      teacher: {
        include: {
          user: true,
          freeDays: true,
        },
      },
    },
  });

  if (!schedule) {
    throw new AppError("Không tìm thấy lịch học", 404);
  }

  if (schedule.teacherId !== teacher.id) {
    throw new AppError("Bạn không có quyền truy cập lịch học này", 403);
  }

  const mapped = toScheduleResponse(schedule);
  return {
    ...mapped,
    status: computeScheduleStatus(schedule.startTime, schedule.endTime),
  };
};

// Lấy danh sách học sinh trong lịch học — kiểm tra ownership
export const getMyCourseStudentsService = async (
  userId: number,
  scheduleId: number,
): Promise<TeacherCourseStudentResponse[]> => {
  const teacher = await getTeacherInfoByUserId(userId);

  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    select: { teacherId: true },
  });

  if (!schedule) {
    throw new AppError("Không tìm thấy lịch học", 404);
  }

  if (schedule.teacherId !== teacher.id) {
    throw new AppError("Bạn không có quyền truy cập lịch học này", 403);
  }

  const registrations = await prisma.scheduleRegistration.findMany({
    where: { scheduleId },
    include: {
      student: {
        include: {
          user: true,
        },
      },
    },
  });

  return registrations.map((reg) => ({
    studentId: reg.student.id,
    fullname: reg.student.user.fullname,
    email: reg.student.user.email,
    phone: reg.student.user.phone,
  }));
};

// Lấy lịch rảnh của giáo viên đang đăng nhập
export const getMyAvailabilityService = async (
  userId: number,
): Promise<GetTeacherFreeDayResponse> => {
  const teacher = await getTeacherInfoByUserId(userId);
  return getTeacherFreeDayService(teacher.id);
};

// Cập nhật lịch rảnh — delegate to existing service
export const updateMyAvailabilityService = async (
  userId: number,
  freeDays: CreateTeacherFreeDay[],
): Promise<GetTeacherFreeDayResponse> => {
  const teacher = await getTeacherInfoByUserId(userId);
  return createTeacherFreeDayService(teacher.id, freeDays);
};
