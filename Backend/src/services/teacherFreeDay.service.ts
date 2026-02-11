import { DayOfWeek } from "@prisma/client";
import { CreateTeacherFreeDay, GetTeacherFreeDayResponse } from "../DTOS/Teacher";
import prisma from "../config/database";
import { AppError } from "../middleware/errorHandler";

// Tạo / cập nhật ngày rảnh cho giáo viên
export const createTeacherFreeDayService = async (
  teacherId: number,
  freeDays: CreateTeacherFreeDay[],
): Promise<GetTeacherFreeDayResponse> => {
  // Ngày user gửi lên (unique)
  const requestedDays: DayOfWeek[] = Array.from(
    new Set((freeDays ?? []).map(d => d.day as DayOfWeek)),
  );

  // FreeDay hiện tại
  const existing = await prisma.teacherFreeDay.findMany({
    where: { teacherId },
    select: { day: true },
  });
  const existingDays = existing.map(d => d.day);

  // Các ngày bị khóa do schedule còn hiệu lực
  const lockedRaw = await prisma.scheduleSession.findMany({
    where: {
      schedule: {
        teacherId,
        endTime: { gt: new Date() }, // chỉ schedule tương lai
      },
    },
    select: { day: true },
  });
  const lockedDays = Array.from(new Set(lockedRaw.map(d => d.day)));

  // Không cho tạo freeDay trùng ngày đang có schedule
  const invalidDays = requestedDays.filter(day =>
    lockedDays.includes(day),
  );

  if (invalidDays.length > 0) {
    throw new AppError(
      `Không thể tạo ngày rảnh vì giáo viên đang có lịch dạy vào: ${invalidDays.join(', ')}`,
      400,
    );
  }

  // Ngày được phép xóa (không nằm trong request & không bị khóa)
  const daysToDelete = existingDays.filter(
    day => !requestedDays.includes(day) && !lockedDays.includes(day),
  );

  // Ngày cần thêm
  const daysToAdd = requestedDays.filter(
    day => !existingDays.includes(day),
  );

  await prisma.$transaction(async (tx) => {
    if (daysToDelete.length > 0) {
      await tx.teacherFreeDay.deleteMany({
        where: {
          teacherId,
          day: { in: daysToDelete },
        },
      });
    }

    if (daysToAdd.length > 0) {
      await tx.teacherFreeDay.createMany({
        data: daysToAdd.map(day => ({
          teacherId,
          day,
        })),
        skipDuplicates: true,
      });
    }
  });

  // Danh sách freeDay cuối cùng
  const finalDays = existingDays
    .filter(day => !daysToDelete.includes(day))
    .concat(daysToAdd);

  return {
    day: Array.from(new Set(finalDays)),
  };
};


// Lấy ngày rảnh của giáo viên
export const getTeacherFreeDayService = async (
  teacherId: number,
): Promise<GetTeacherFreeDayResponse> => {
  try {
    const freeDays = await prisma.teacherFreeDay.findMany({
      where: {
        teacherId,
      },
      select: {
        day: true,
      },
      orderBy: {
        day: 'asc',
      },
    });

    return {
      day: freeDays.map((d) => d.day),
    };
  } catch (error) {
    throw new AppError(
      'Lỗi khi lấy ngày rảnh của giáo viên: ' +
        (error as Error).message,
      500,
    );
  }
};
