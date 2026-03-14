import prisma from "../config/database";
import { RegisterScheduleRequest } from "../DTOS/Schedule/register-schedule.request";
import { RegisterScheduleResponse } from "../DTOS/Schedule/register-schedule.response";
import { StudentResponse } from "../DTOS/Student/student.response";
import { toStudentResponse } from "../utils/Mapper/student.mapper";
import { AppError } from "../middleware/errorHandler";

// Đăng ký Schedule dành cho Student
export const registerScheduleService = async (
  data: RegisterScheduleRequest,
): Promise<RegisterScheduleResponse> => {
  const { scheduleId, studentId } = data;

  // Kiểm tra schedule có tồn tại
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
  });
  if (!schedule) throw new AppError("Schedule không tồn tại", 404);

  // Kiểm tra hs có tồn tại
  const student = await prisma.studentInfo.findUnique({
    where: { id: Number(studentId) },
  });
  if (!student) throw new AppError("Student không tồn tại", 404);

  // Kiểm tra đã đăng ký chưa (unique constraint)
  const existing = await prisma.scheduleRegistration.findUnique({
    where: { scheduleId_studentId: { scheduleId, studentId: Number(studentId) } },
  });
  if (existing) throw new AppError("Student đã đăng ký lịch này", 400);

  // Transaction: tạo schedule registration + tăng totalRegister
  const registration = await prisma.$transaction(async (tx) => {
    const reg = await tx.scheduleRegistration.create({
      data: {
        scheduleId,
        studentId: Number(studentId),
      },
    });

    // Tăng totalRegister
    await tx.schedule.update({
      where: { id: scheduleId },
      data: { totalRegister: { increment: 1 } },
    });

    return reg;
  });

  return {
    scheduleId: registration.scheduleId,
    studentId: registration.studentId,
    createdAt: registration.createdAt,
  };
};

// Admin: Lấy danh sách học sinh đã đăng ký trong một schedule
export const getScheduleStudentsService = async (
  scheduleId: number,
  { search, page = 1, limit = 10 }: { search?: string; page?: number; limit?: number },
): Promise<{ data: StudentResponse[]; totalItems: number; totalPages: number; page: number; limit: number }> => {
  const schedule = await prisma.schedule.findUnique({ where: { id: scheduleId } });
  if (!schedule) throw new AppError("Schedule không tồn tại", 404);

  const where: any = {
    scheduleId,
    student: {
      deletedAt: null,
      user: { deletedAt: null },
    },
  };

  if (search) {
    where.student = {
      ...where.student,
      user: {
        ...where.student.user,
        OR: [
          { fullname: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
        ],
      },
    };
  }

  const totalItems = await prisma.scheduleRegistration.count({ where });

  const registrations = await prisma.scheduleRegistration.findMany({
    where,
    include: { student: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  return {
    data: registrations.map((r) => toStudentResponse(r.student)),
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    page,
    limit,
  };
};

// Student: Lấy danh sách schedules mà student đã đăng ký
export const getStudentSchedulesService = async (
  studentId: number,
  { page = 1, limit = 10 }: { page?: number; limit?: number } = {},
): Promise<{ data: any[]; totalItems: number; totalPages: number; page: number; limit: number }> => {
  const where: any = {
    studentId,
    student: { deletedAt: null },
  };

  const totalItems = await prisma.scheduleRegistration.count({ where });

  const registrations = await prisma.scheduleRegistration.findMany({
    where,
    include: {
      schedule: {
        include: {
          teacher: { include: { user: true } },
          course: true,
          classroom: true,
          sessions: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const data = registrations
    .map((r) => ({
      id: r.schedule.id,
      teacher: {
        id: r.schedule.teacher.id,
        fullname: r.schedule.teacher.user.fullname,
      },
      classroom: {
        id: r.schedule.classroom.id,
        name: r.schedule.classroom.name,
      },
      course: {
        id: r.schedule.course.id,
        name: r.schedule.course.name,
        type: r.schedule.course.type,
        skill: r.schedule.course.courseSkill,
      },
      totalSlot: r.schedule.totalSlot,
      totalRegister: r.schedule.totalRegister,
      startTime: r.schedule.startTime,
      endTime: r.schedule.endTime,
      createdAt: r.schedule.createdAt,
      updatedAt: r.schedule.updatedAt,
      sessions: r.schedule.sessions.map(session => ({
        id: session.id,
        day: session.day,
        startTime: session.startTime,
        endTime: session.endTime,
      })),
    }))
    // Filter to show only courses that have started
    .filter((schedule) => {
      const now = new Date();
      const startTime = new Date(schedule.startTime);
      return startTime <= now;
    })
    // Deduplicate by course - chỉ giữ schedule đầu tiên của mỗi course
    .filter((schedule, index, self) => 
      index === self.findIndex((s) => s.course.id === schedule.course.id)
    );

  return {
    data,
    totalItems: data.length,
    totalPages: Math.ceil(data.length / limit),
    page,
    limit,
  };
};

// Admin: Xóa học sinh khỏi schedule
export const removeStudentFromScheduleService = async (
  scheduleId: number,
  studentId: number,
): Promise<void> => {
  const registration = await prisma.scheduleRegistration.findUnique({
    where: { scheduleId_studentId: { scheduleId, studentId } },
  });
  if (!registration) throw new AppError("Học sinh chưa đăng ký lịch học này", 404);

  await prisma.$transaction(async (tx) => {
    await tx.scheduleRegistration.delete({
      where: { scheduleId_studentId: { scheduleId, studentId } },
    });
    await tx.schedule.update({
      where: { id: scheduleId },
      data: { totalRegister: { decrement: 1 } },
    });
  });
};