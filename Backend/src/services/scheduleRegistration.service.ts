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