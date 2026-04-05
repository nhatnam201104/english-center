import prisma from "../config/database";
import { AdmissionStatus } from "@prisma/client";
import { AppError } from "../middleware/errorHandler";

// ─── Admin: Entrance Exam List ───

export const getAllEntranceExamsService = async () => {
  return prisma.entranceExam.findMany({
    include: {
      listening: {
        select: { id: true, name: true, isActive: true, isDone: true },
      },
      reading: {
        select: { id: true, name: true, isActive: true, isDone: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

// ─── Registration ───

export const registerCandidateService = async (
  data: any,
) => {
  const existing = await prisma.admission.findFirst({
    where: { cccd: data.cccd },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    if (existing.status === AdmissionStatus.COMPLETED) {
      // Exam is done — preserve the result, block re-registration
      throw new AppError(
        "Bạn đã hoàn thành bài thi đầu vào. Kết quả đã được ghi nhận vào hệ thống.",
        409,
      );
    }

    // Any other status (in-progress or cancelled) — wipe old data and allow re-register
    await prisma.$transaction([
      prisma.admissionsListening.deleteMany({
        where: { admissionId: existing.id },
      }),
      prisma.admissionsReading.deleteMany({
        where: { admissionId: existing.id },
      }),
      prisma.admission.delete({ where: { id: existing.id } }),
    ]);
  }

  const admission = await prisma.admission.create({
    data: {
      email: data.email,
      fullname: data.fullname,
      phone: data.phone,
      cccd: data.cccd,
      type: data.examType as any,
      status: AdmissionStatus.REGISTERED,
    },
  });

  return { admissionId: admission.id };
};





// ─── Get Attempt State ───

export const getAttemptStateService = async (admission: any) => {
  return {
    admissionId: admission.id,
    status: admission.status,
    type: admission.type,
    expiresAt: admission.expiresAt?.toISOString() ?? null,
    totalListening: admission.totalListening,
    totalReading: admission.totalReading,
    entranceScore: admission.entranceScore,
    isDone: admission.isDone,
  };
};

// ─── Cancel Attempt ───

export const cancelAttemptService = async (admission: any) => {
  if (
    admission.status === AdmissionStatus.COMPLETED ||
    admission.status === AdmissionStatus.CANCELLED
  ) {
    throw new AppError("Bài thi đã kết thúc, không thể hủy", 400);
  }

  await prisma.$transaction([
    prisma.admissionsListening.deleteMany({
      where: { admissionId: admission.id },
    }),
    prisma.admissionsReading.deleteMany({
      where: { admissionId: admission.id },
    }),
    prisma.admission.update({
      where: { id: admission.id },
      data: {
        status: AdmissionStatus.CANCELLED,
        totalListening: 0,
        totalReading: 0,
        entranceScore: 0,
      },
    }),
  ]);

  return { cancelled: true };
};

// ─── Get Results (Admin) ───

export const getResultsService = async (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const skip = (page - 1) * limit;

  const where: any = {
    isDone: true,
    type: "READING_LISTENING",
  };

  if (params.search) {
    where.OR = [
      { fullname: { contains: params.search } },
      { email: { contains: params.search } },
      { cccd: { contains: params.search } },
    ];
  }

  const [data, totalItems] = await Promise.all([
    prisma.admission.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        email: true,
        fullname: true,
        phone: true,
        cccd: true,
        totalListening: true,
        totalReading: true,
        scoreListening: true,
        scoreReading: true,
        entranceScore: true,
        isDone: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.admission.count({ where }),
  ]);

  const results = data.map((d) => ({
    ...d,
    listeningScaledScore: d.scoreListening,
    readingScaledScore: d.scoreReading,
    totalScaledScore: d.entranceScore,
  }));

  return {
    data: results,
    page,
    limit,
    totalPages: Math.ceil(totalItems / limit),
    totalItems,
  };
};

export const getResultByCccdService = async (cccd: string) => {
  const admission = await prisma.admission.findFirst({
    where: {
      cccd,
      isDone: true,
      type: "READING_LISTENING",
    },
    orderBy: { updatedAt: "desc" },
  });

  if (!admission) {
    throw new AppError("Không tìm thấy kết quả cho CCCD này", 404);
  }

  return {
    id: admission.id,
    email: admission.email,
    fullname: admission.fullname,
    phone: admission.phone,
    cccd: admission.cccd,
    totalListening: admission.totalListening,
    totalReading: admission.totalReading,
    listeningScaledScore: admission.scoreListening,
    readingScaledScore: admission.scoreReading,
    totalScaledScore: admission.entranceScore,
    isDone: admission.isDone,
    createdAt: admission.createdAt,
    updatedAt: admission.updatedAt,
  };
};