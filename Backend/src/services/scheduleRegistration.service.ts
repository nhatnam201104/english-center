import prisma from "../config/database";
import { RegisterScheduleRequest } from "../DTOS/Schedule/register-schedule.request";
import { RegisterScheduleResponse } from "../DTOS/Schedule/register-schedule.response";
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
    where: { id: studentId },
  });
  if (!student) throw new AppError("Student không tồn tại", 404);

  // Kiểm tra đã đăng ký chưa (unique constraint)
  const existing = await prisma.scheduleRegistration.findUnique({
    where: { scheduleId_studentId: { scheduleId, studentId } },
  });
  if (existing) throw new AppError("Student đã đăng ký lịch này", 400);

  // Transaction: tạo schedule registration + tăng totalRegister
  const registration = await prisma.$transaction(async (tx) => {
    const reg = await tx.scheduleRegistration.create({
      data: {
        scheduleId,
        studentId,
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