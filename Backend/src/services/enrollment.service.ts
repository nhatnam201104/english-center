import prisma from "../config/database";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { AppError } from "../middleware/errorHandler";
import type {
  CreateEnrollmentDraftRequest,
  CreateStudentEnrollmentDraftRequest,
} from "../DTOS/Enrollment/enrollment.request";
import type {
  ValidateTokenResponse,
  CheckParentResponse,
  CreateDraftResponse,
  EnrollmentStatusResponse,
} from "../DTOS/Enrollment/enrollment.response";

const toMinutes = (time: string): number => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

const isDateRangeOverlapped = (
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean => aStart < bEnd && bStart < aEnd;

const hasSessionOverlap = (
  sourceSessions: Array<{ day: string; startTime: string; endTime: string }>,
  targetSessions: Array<{ day: string; startTime: string; endTime: string }>,
): boolean => {
  for (const source of sourceSessions) {
    for (const target of targetSessions) {
      if (source.day !== target.day) continue;

      const overlapped =
        toMinutes(source.startTime) < toMinutes(target.endTime) &&
        toMinutes(source.endTime) > toMinutes(target.startTime);

      if (overlapped) return true;
    }
  }

  return false;
};

const hasScheduleConflict = (
  candidateSchedule: {
    startTime: Date;
    endTime: Date;
    sessions: Array<{ day: string; startTime: string; endTime: string }>;
  },
  existingSchedule: {
    startTime: Date;
    endTime: Date;
    sessions: Array<{ day: string; startTime: string; endTime: string }>;
  },
): boolean => {
  if (
    !isDateRangeOverlapped(
      candidateSchedule.startTime,
      candidateSchedule.endTime,
      existingSchedule.startTime,
      existingSchedule.endTime,
    )
  ) {
    return false;
  }

  return hasSessionOverlap(candidateSchedule.sessions, existingSchedule.sessions);
};

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

// ─── Get Available Schedules for Authenticated Student ───

export const getStudentAvailableSchedulesService = async (
  studentUserId: number,
) => {
  const student = await prisma.studentInfo.findFirst({
    where: {
      userId: studentUserId,
      deletedAt: null,
      user: { deletedAt: null },
    },
    include: {
      user: true,
      scheduleRegistrations: {
        include: {
          schedule: {
            include: {
              course: {
                select: {
                  id: true,
                  name: true,
                  courseSkill: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!student) {
    throw new AppError("Không tìm thấy thông tin học viên", 404);
  }

  const now = new Date();
  const ongoingSkills = new Set(
    student.scheduleRegistrations
      .filter((r) => r.schedule.startTime <= now && r.schedule.endTime >= now)
      .map((r) => r.schedule.course.courseSkill),
  );

  const schedules = await prisma.schedule.findMany({
    where: {
      startTime: { gt: now },
      course: {
        status: "ACTIVE",
      },
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
      sessions: {
        select: {
          id: true,
          day: true,
          startTime: true,
          endTime: true,
        },
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

  return {
    blockedSkills: Array.from(ongoingSkills),
    schedules: schedules.map((s) => {
      const occupied = s._count.registrations + s._count.seatReservations;
      return {
        id: s.id,
        course: s.course,
        classroom: s.classroom,
        teacher: { id: s.teacher.id, fullname: s.teacher.user.fullname },
        sessions: s.sessions,
        startTime: s.startTime,
        endTime: s.endTime,
        totalSlot: s.totalSlot,
        occupied,
        available: s.totalSlot - occupied,
      };
    }),
  };
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

// ─── Create Enrollment Draft for Authenticated Student ───

export const createStudentDraftService = async (
  studentUserId: number,
  data: CreateStudentEnrollmentDraftRequest,
): Promise<CreateDraftResponse> => {
  const now = new Date();

  const student = await prisma.studentInfo.findFirst({
    where: {
      userId: studentUserId,
      deletedAt: null,
      user: { deletedAt: null },
    },
    include: {
      user: true,
      scheduleRegistrations: {
        include: {
          schedule: {
            include: {
              course: {
                select: {
                  id: true,
                  name: true,
                  courseSkill: true,
                },
              },
              sessions: {
                select: {
                  day: true,
                  startTime: true,
                  endTime: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!student) {
    throw new AppError("Không tìm thấy thông tin học viên", 404);
  }

  const schedule = await prisma.schedule.findUnique({
    where: { id: Number(data.scheduleId) },
    include: {
      course: true,
      sessions: {
        select: {
          day: true,
          startTime: true,
          endTime: true,
        },
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
  });

  if (!schedule) {
    throw new AppError("Lịch học không tồn tại", 404);
  }

  if (schedule.startTime <= now) {
    throw new AppError("Không thể đăng ký lịch học đã bắt đầu", 400);
  }

  const occupied =
    schedule._count.registrations + schedule._count.seatReservations;
  if (occupied >= schedule.totalSlot) {
    throw new AppError("Lịch học đã hết chỗ", 400);
  }

  const sameScheduleRegistration = await prisma.scheduleRegistration.findUnique({
    where: {
      scheduleId_studentId: {
        scheduleId: schedule.id,
        studentId: student.id,
      },
    },
  });

  if (sameScheduleRegistration) {
    throw new AppError("Bạn đã đăng ký lịch học này rồi", 400);
  }

  const ongoingSameSkill = student.scheduleRegistrations.find(
    (registration) =>
      registration.schedule.startTime <= now &&
      registration.schedule.endTime >= now &&
      registration.schedule.course.courseSkill === schedule.course.courseSkill,
  );

  if (ongoingSameSkill) {
    throw new AppError(
      "Bạn đang có khóa học đang diễn ra, vui lòng học xong mới tiến hành đăng ký",
      400,
    );
  }

  for (const registration of student.scheduleRegistrations) {
    const conflict = hasScheduleConflict(
      {
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        sessions: schedule.sessions,
      },
      {
        startTime: registration.schedule.startTime,
        endTime: registration.schedule.endTime,
        sessions: registration.schedule.sessions,
      },
    );

    if (conflict) {
      throw new AppError(
        `Lịch học bị trùng với khóa "${registration.schedule.course.name}"`,
        400,
      );
    }
  }

  const parentData = data.parentData;

  if (parentData?.existingParentId) {
    const parent = await prisma.parentInfo.findFirst({
      where: {
        id: parentData.existingParentId,
        deletedAt: null,
        user: { deletedAt: null },
      },
    });

    if (!parent) {
      throw new AppError("Không tìm thấy phụ huynh đã chọn", 404);
    }
  }

  if (parentData && !parentData.existingParentId) {
    const emailExists = await prisma.user.findFirst({
      where: {
        email: parentData.email,
        deletedAt: null,
      },
    });

    if (emailExists) {
      throw new AppError("Email phụ huynh đã tồn tại trong hệ thống", 409);
    }

    const phoneExists = await prisma.user.findFirst({
      where: {
        phone: parentData.phone,
        deletedAt: null,
      },
    });

    if (phoneExists) {
      throw new AppError("Số điện thoại phụ huynh đã tồn tại trong hệ thống", 409);
    }
  }

  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  const admissionType =
    schedule.course.courseSkill === "READING_LISTENING"
      ? "READING_LISTENING"
      : "SPEAKING_WRITING";

  const draft = await prisma.$transaction(async (tx) => {
    const admission = await tx.admission.create({
      data: {
        email: student.user.email,
        fullname: student.user.fullname,
        phone: student.user.phone,
        cccd: student.cccd ?? "",
        type: admissionType,
        scoreListening: student.scoreRl,
        scoreReading: student.scoreRl,
        scoreSpeaking: student.scoreSw,
        scoreWriting: student.scoreSw,
      },
    });

    const registrationToken = await tx.registrationToken.create({
      data: {
        token: randomUUID(),
        admissionId: admission.id,
        expiresAt,
      },
    });

    const newDraft = await tx.enrollmentDraft.create({
      data: {
        admissionId: admission.id,
        registrationTokenId: registrationToken.id,
        candidateData: {
          sourceFlow: "STUDENT_SELF",
          existingStudentId: student.id,
          existingStudentUserId: student.userId,
          fullname: student.user.fullname,
          email: student.user.email,
          phone: student.user.phone,
          cccd: student.cccd,
          dob: student.dob,
        } as any,
        parentData: parentData ? (parentData as any) : undefined,
        scheduleId: schedule.id,
        status: "DRAFT",
        expiresAt,
      },
    });

    await tx.seatReservation.create({
      data: {
        enrollmentDraftId: newDraft.id,
        scheduleId: schedule.id,
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
    const isExistingStudentFlow =
      candidateData?.sourceFlow === "STUDENT_SELF" &&
      !!candidateData?.existingStudentId &&
      !!candidateData?.existingStudentUserId;

    let studentUserId = 0;
    let studentInfoId = 0;

    // 1. Create student user + studentInfo (or use existing student for student flow)
    if (isExistingStudentFlow) {
      const existingStudent = await tx.studentInfo.findFirst({
        where: {
          id: Number(candidateData.existingStudentId),
          userId: Number(candidateData.existingStudentUserId),
          deletedAt: null,
          user: {
            deletedAt: null,
            role: "STUDENT",
          },
        },
      });

      if (!existingStudent) {
        throw new AppError("Không tìm thấy học viên để hoàn tất đăng ký", 404);
      }

      studentUserId = existingStudent.userId;
      studentInfoId = existingStudent.id;
    } else {
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

      studentUserId = studentUser.id;
      studentInfoId = studentInfo.id;
    }

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

      await tx.parentStudent.upsert({
        where: {
          parentId_studentId: {
            parentId: parentInfoId,
            studentId: studentInfoId,
          },
        },
        update: {},
        create: {
          parentId: parentInfoId,
          studentId: studentInfoId,
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
        studentUserId,
      },
    });

    // 3. Register schedule
    const existingRegistration = await tx.scheduleRegistration.findUnique({
      where: {
        scheduleId_studentId: {
          scheduleId,
          studentId: studentInfoId,
        },
      },
    });

    if (!existingRegistration) {
      await tx.scheduleRegistration.create({
        data: {
          scheduleId,
          studentId: studentInfoId,
        },
      });

      await tx.schedule.update({
        where: { id: scheduleId },
        data: { totalRegister: { increment: 1 } },
      });
    }

    // 4. Register course
    const schedule = await tx.schedule.findUnique({
      where: { id: scheduleId },
    });

    if (schedule) {
      await tx.studentRegisterCourse.upsert({
        where: {
          studentId_courseId: {
            studentId: studentInfoId,
            courseId: schedule.coursesId,
          },
        },
        update: {},
        create: {
          studentId: studentInfoId,
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
