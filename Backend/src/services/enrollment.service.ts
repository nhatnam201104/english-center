import prisma from "../config/database";
import bcrypt from "bcryptjs";
import { AppError } from "../middleware/errorHandler";
import type { CreateEnrollmentDraftRequest } from "../DTOS/Enrollment/enrollment.request";
import type {
  ValidateTokenResponse,
  CheckParentResponse,
  CreateDraftResponse,
  EnrollmentStatusResponse,
} from "../DTOS/Enrollment/enrollment.response";

// ─── Validate Registration Token ───

export const validateTokenService = async (
  token: string,
): Promise<ValidateTokenResponse> => {
  const regToken = await prisma.registrationToken.findUnique({
    where: { token },
    include: { admission: true },
  });

  if (!regToken) {
    throw new AppError("Token không hợp lệ hoặc không tồn tại", 404);
  }

  // Token validity is determined solely by expiry — no single-use restriction
  if (regToken.expiresAt < new Date()) {
    throw new AppError("Link đăng ký đã hết hạn (24 giờ)", 400);
  }

  // Block if this admission already completed enrollment
  const completed = await prisma.enrollmentDraft.findFirst({
    where: { admissionId: regToken.admissionId, status: "COMPLETED" },
  });
  if (completed) {
    throw new AppError("Bạn đã đăng ký khóa học thành công rồi", 400);
  }

  const admission = regToken.admission;

  return {
    admissionId: admission.id,
    admissionType: admission.type,
    fullname: admission.fullname,
    email: admission.email,
    phone: admission.phone,
    cccd: admission.cccd,
    tokenId: regToken.id,
  };
};

// ─── Check Parent by Phone ───

export const checkParentService = async (
  phone: string,
): Promise<CheckParentResponse> => {
  const user = await prisma.user.findUnique({
    where: { phone },
    include: { parentInfo: true },
  });

  if (!user || user.role !== "PARENT" || !user.parentInfo || user.deletedAt) {
    return { found: false };
  }

  return {
    found: true,
    parentId: user.parentInfo.id,
    fullname: user.fullname,
    phone: user.phone,
  };
};

// ─── Get Available Schedules for Enrollment ───

export const getAvailableSchedulesService = async (admissionType: string) => {
  const courseSkill =
    admissionType === "READING_LISTENING"
      ? "READING_LISTENING"
      : "SPEAKING_WRITING";

  const now = new Date();

  const schedules = await prisma.schedule.findMany({
    where: {
      course: {
        courseSkill,
        status: "ACTIVE",
      },
      startTime: { gt: now },
    },
    include: {
      course: {
        select: {
          id: true,
          name: true,
          price: true,
          sale: true,
          courseSkill: true,
          totalSession: true,
        },
      },
      classroom: { select: { id: true, name: true, maxSize: true } },
      teacher: {
        select: { id: true, user: { select: { fullname: true } } },
      },
      _count: {
        select: {
          registrations: true,
          seatReservations: {
            where: { status: "ACTIVE", expiresAt: { gt: now } },
          },
        },
      },
    },
    orderBy: { startTime: "asc" },
  });

  return schedules.map((s) => {
    const occupied = s._count.registrations + s._count.seatReservations;
    return {
      id: s.id,
      course: s.course,
      classroom: s.classroom,
      teacher: { id: s.teacher.id, fullname: s.teacher.user.fullname },
      startTime: s.startTime,
      endTime: s.endTime,
      totalSlot: s.totalSlot,
      occupied,
      available: s.totalSlot - occupied,
    };
  });
};

// ─── Create Enrollment Draft ───

export const createDraftService = async (
  data: CreateEnrollmentDraftRequest,
): Promise<CreateDraftResponse> => {
  // 1. Validate token — only expiry matters, no single-use restriction
  const regToken = await prisma.registrationToken.findUnique({
    where: { token: data.token },
    include: { admission: true },
  });

  if (!regToken) {
    throw new AppError("Token không hợp lệ", 404);
  }
  if (regToken.expiresAt < new Date()) {
    throw new AppError("Link đăng ký đã hết hạn (24 giờ)", 400);
  }

  // 2. Block if enrollment already completed for this admission
  const completedDraft = await prisma.enrollmentDraft.findFirst({
    where: { admissionId: regToken.admissionId, status: "COMPLETED" },
  });
  if (completedDraft) {
    throw new AppError("Bạn đã đăng ký khóa học thành công rồi", 400);
  }

  // 3. If a valid in-progress draft already exists for this admission, reuse it
  //    (handles browser back / retry without duplicating seat reservations)
  const now = new Date();
  const reusableDraft = await prisma.enrollmentDraft.findFirst({
    where: {
      admissionId: regToken.admissionId,
      status: { in: ["DRAFT", "PENDING_PAYMENT"] },
      expiresAt: { gt: now },
    },
    orderBy: { createdAt: "desc" },
  });
  if (reusableDraft) {
    return { draftId: reusableDraft.id, expiresAt: reusableDraft.expiresAt };
  }

  // 4. Validate schedule exists and has available slots
  const schedule = await prisma.schedule.findUnique({
    where: { id: Number(data.scheduleId) },
    include: {
      course: true,
      classroom: true,
      _count: {
        select: {
          registrations: true,
          seatReservations: {
            where: { status: "ACTIVE", expiresAt: { gt: now } },
          },
        },
      },
    },
  });

  if (!schedule) {
    throw new AppError("Lịch học không tồn tại", 404);
  }

  const occupied =
    schedule._count.registrations + schedule._count.seatReservations;
  if (occupied >= schedule.totalSlot) {
    throw new AppError("Lịch học đã hết chỗ", 400);
  }

  // 5. Check if candidate email/phone already exists as a student
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.candidateData.email },
        { phone: data.candidateData.phone },
      ],
      role: "STUDENT",
      deletedAt: null,
    },
  });
  if (existingUser) {
    throw new AppError(
      "Email hoặc số điện thoại đã được sử dụng bởi học sinh khác",
      409,
    );
  }

  // 6. Create draft + seat reservation (30-minute payment window)
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  const draft = await prisma.$transaction(async (tx) => {
    const newDraft = await tx.enrollmentDraft.create({
      data: {
        admissionId: regToken.admissionId,
        registrationTokenId: regToken.id,
        candidateData: data.candidateData as any,
        parentData: data.parentData ? (data.parentData as any) : undefined,
        scheduleId: Number(data.scheduleId),
        status: "DRAFT",
        expiresAt,
      },
    });

    await tx.seatReservation.create({
      data: {
        enrollmentDraftId: newDraft.id,
        scheduleId: Number(data.scheduleId),
        status: "ACTIVE",
        expiresAt,
      },
    });

    return newDraft;
  });

  return {
    draftId: draft.id,
    expiresAt: draft.expiresAt,
  };
};

// ─── Get Enrollment Status by TxnRef ───

export const getEnrollmentStatusService = async (
  txnRef: string,
): Promise<EnrollmentStatusResponse> => {
  const payment = await prisma.paymentTransaction.findUnique({
    where: { txnRef },
    include: {
      enrollmentDraft: {
        include: {
          admission: true,
          seatReservation: {
            include: {
              schedule: {
                include: { course: { select: { name: true } } },
              },
            },
          },
        },
      },
    },
  });

  if (!payment) {
    throw new AppError("Không tìm thấy giao dịch", 404);
  }

  const draft = payment.enrollmentDraft;
  const schedule = draft.seatReservation?.schedule;

  return {
    txnRef: payment.txnRef,
    status: payment.status,
    courseName: schedule?.course?.name,
    scheduleInfo: schedule
      ? `${schedule.startTime.toLocaleDateString("vi-VN")} - ${schedule.endTime.toLocaleDateString("vi-VN")}`
      : undefined,
    studentName: draft.admission.fullname,
  };
};

// ─── Finalize Enrollment (called by IPN) ───

export const finalizeEnrollmentService = async (
  enrollmentDraftId: number,
): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    const draft = await tx.enrollmentDraft.findUnique({
      where: { id: enrollmentDraftId },
      include: {
        seatReservation: true,
        payment: true,
        admission: true,
      },
    });

    if (!draft) {
      throw new AppError("Không tìm thấy draft", 404);
    }

    if (draft.status === "COMPLETED") {
      return; // Idempotent
    }

    const candidateData = draft.candidateData as any;
    const parentData = draft.parentData as any;
    const scheduleId = draft.scheduleId!;

    // 1. Create student user + studentInfo
    const hashedPassword = await bcrypt.hash(candidateData.password, 10);

    const studentUser = await tx.user.create({
      data: {
        fullname: candidateData.fullname,
        email: candidateData.email,
        password: hashedPassword,
        phone: candidateData.phone,
        role: "STUDENT",
      },
    });

    const studentInfo = await tx.studentInfo.create({
      data: {
        userId: studentUser.id,
        dob: candidateData.dob ? new Date(candidateData.dob) : undefined,
        cccd: candidateData.cccd,
        scoreRl: draft.admission.scoreListening ?? 0,
        scoreSw: draft.admission.scoreSpeaking ?? 0,
      },
    });

    // 2. Handle parent
    if (parentData) {
      let parentInfoId: number;
      let parentUserId: number | null = null;

      if (parentData.existingParentId) {
        const existingParent = await tx.parentInfo.findUnique({
          where: { id: parentData.existingParentId },
          select: { userId: true },
        });

        parentUserId = existingParent?.userId ?? null;
        parentInfoId = parentData.existingParentId;
      } else {
        const parentHashedPassword = await bcrypt.hash(
          parentData.password,
          10,
        );
        const parentUser = await tx.user.create({
          data: {
            fullname: parentData.fullname,
            email: parentData.email,
            password: parentHashedPassword,
            phone: parentData.phone,
            role: "PARENT",
          },
        });

        parentUserId = parentUser.id;

        const parentInfo = await tx.parentInfo.create({
          data: { userId: parentUser.id },
        });
        parentInfoId = parentInfo.id;
      }

      await tx.parentStudent.create({
        data: {
          parentId: parentInfoId,
          studentId: studentInfo.id,
        },
      });

      await tx.paymentTransaction.updateMany({
        where: {
          enrollmentDraftId,
          payerUserId: null,
        },
        data: {
          payerUserId: parentUserId,
        },
      });
    }

    await tx.paymentTransaction.updateMany({
      where: {
        enrollmentDraftId,
        studentUserId: null,
      },
      data: {
        studentUserId: studentUser.id,
      },
    });

    // 3. Register schedule
    await tx.scheduleRegistration.create({
      data: {
        scheduleId,
        studentId: studentInfo.id,
      },
    });

    await tx.schedule.update({
      where: { id: scheduleId },
      data: { totalRegister: { increment: 1 } },
    });

    // 4. Register course
    const schedule = await tx.schedule.findUnique({
      where: { id: scheduleId },
    });

    if (schedule) {
      await tx.studentRegisterCourse.create({
        data: {
          studentId: studentInfo.id,
          courseId: schedule.coursesId,
        },
      });
    }

    // 5. Update statuses
    await tx.enrollmentDraft.update({
      where: { id: enrollmentDraftId },
      data: { status: "COMPLETED" },
    });

    if (draft.seatReservation) {
      await tx.seatReservation.update({
        where: { id: draft.seatReservation.id },
        data: { status: "CONVERTED" },
      });
    }
  });
};
