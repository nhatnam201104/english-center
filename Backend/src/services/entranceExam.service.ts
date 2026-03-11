import prisma from "../config/database";
import { AdmissionStatus } from "@prisma/client";
import { AppError } from "../middleware/errorHandler";
import { computeScaledScore, ANSWER_MAP, EXAM_EXPIRY_MINUTES } from "../config/scoreConfig";
import {
  buildEntranceExamLRAudioUrl,
  buildEntranceExamLRImageUrl,
} from "../utils/fileUrl";
import type { RegisterCandidateRequest } from "../DTOS/EntranceExam";
import { sendExamResultEmail } from "../utils/email.service";
import crypto from "crypto";

// ─── Admin: Entrance Exam List ───

export const getAllEntranceExamsService = async () => {
  return prisma.entranceExam.findMany({
    include: {
      listening: { select: { id: true, name: true, isActive: true, isDone: true } },
      reading: { select: { id: true, name: true, isActive: true, isDone: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

// ─── Registration ───

export const registerCandidateService = async (data: RegisterCandidateRequest) => {
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
      prisma.admissionsListening.deleteMany({ where: { admissionId: existing.id } }),
      prisma.admissionsReading.deleteMany({ where: { admissionId: existing.id } }),
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

// ─── Start Attempt ───

export const startAttemptService = async (admissionId: number) => {
  const admission = await prisma.admission.findUnique({
    where: { id: admissionId },
  });

  if (!admission) {
    throw new AppError("Không tìm thấy đăng ký", 404);
  }

  // If already has an active attempt (not completed/cancelled), return it
  if (
    admission.accessToken &&
    !["COMPLETED", "CANCELLED"].includes(admission.status)
  ) {
    return {
      admissionId: admission.id,
      accessToken: admission.accessToken,
      expiresAt: admission.expiresAt?.toISOString() ?? "",
    };
  }

  // Find all active & done listening exams
  const activeListenings = await prisma.entranceExamListening.findMany({
    where: { isDone: true, isActive: true },
  });

  // Find all active & done reading exams
  const activeReadings = await prisma.entranceExamReading.findMany({
    where: { isDone: true, isActive: true },
  });

  if (activeListenings.length === 0 || activeReadings.length === 0) {
    throw new AppError(
      "Hiện tại không có bài thi đầu vào đang hoạt động (cần ít nhất 1 đề Listening và 1 đề Reading đã active)",
      404,
    );
  }

  // Random pick one listening and one reading
  const pickedListening = activeListenings[Math.floor(Math.random() * activeListenings.length)];
  const pickedReading = activeReadings[Math.floor(Math.random() * activeReadings.length)];

  // Create EntranceExam wrapper dynamically
  const entranceExam = await prisma.entranceExam.create({
    data: {
      name: `Đề thi đầu vào - ${new Date().toISOString()}`,
      type: admission.type as any,
      time: 120,
      listeningExamId: pickedListening.id,
      readingExamId: pickedReading.id,
    },
  });

  const accessToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + EXAM_EXPIRY_MINUTES * 60 * 1000);

  const updated = await prisma.admission.update({
    where: { id: admissionId },
    data: {
      accessToken,
      status: AdmissionStatus.PENDING,
      entranceExamId: entranceExam.id,
      expiresAt,
      isDone: false,
      totalListening: 0,
      totalReading: 0,
      entranceScore: 0,
    },
  });

  return {
    admissionId: updated.id,
    accessToken: updated.accessToken!,
    expiresAt: updated.expiresAt?.toISOString() ?? "",
  };
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

// ─── Load Listening Questions ───

export const loadListeningService = async (admission: any) => {
  if (
    admission.status !== AdmissionStatus.PENDING &&
    admission.status !== AdmissionStatus.LISTENING
  ) {
    throw new AppError("Không thể tải bài Listening ở trạng thái hiện tại", 400);
  }

  const entranceExam = await prisma.entranceExam.findUnique({
    where: { id: admission.entranceExamId! },
    include: { listening: true },
  });

  if (!entranceExam?.listening) {
    throw new AppError("Không tìm thấy đề thi Listening", 404);
  }

  const listeningExam = await prisma.entranceExamListening.findUnique({
    where: { id: entranceExam.listening.id },
    include: {
      partOnes: {
        include: { questions: { orderBy: { index: "asc" } } },
      },
      partTwos: {
        include: { questions: { orderBy: { index: "asc" } } },
      },
      partThrees: {
        include: {
          groups: {
            orderBy: { index: "asc" },
            include: { questions: { orderBy: { index: "asc" } } },
          },
        },
      },
      partFours: {
        include: {
          groups: {
            orderBy: { index: "asc" },
            include: { questions: { orderBy: { index: "asc" } } },
          },
        },
      },
    },
  });

  if (!listeningExam) {
    throw new AppError("Không tìm thấy đề thi Listening", 404);
  }

  // Update status to LISTENING
  if (admission.status === AdmissionStatus.PENDING) {
    await prisma.admission.update({
      where: { id: admission.id },
      data: { status: AdmissionStatus.LISTENING },
    });
  }

  // Load existing answers for this admission
  const existingAnswers = await prisma.admissionsListening.findMany({
    where: { admissionId: admission.id },
  });
  const answersMap: Record<number, number | null> = {};
  existingAnswers.forEach((a) => {
    answersMap[a.questionId] = a.answerId;
  });

  const parts = [];

  // Part 1
  const partOne = listeningExam.partOnes[0];
  if (partOne) {
    parts.push({
      partNo: 1,
      partName: "Part 1 – Photographs",
      direction: partOne.direction,
      type: "single" as const,
      questions: partOne.questions.map((q) => ({
        index: q.index,
        question: q.question,
        audio: buildEntranceExamLRAudioUrl(q.audio),
        image: buildEntranceExamLRImageUrl(q.image),
        savedAnswer: answersMap[q.index] ?? null,
      })),
    });
  }

  // Part 2
  const partTwo = listeningExam.partTwos[0];
  if (partTwo) {
    parts.push({
      partNo: 2,
      partName: "Part 2 – Question-Response",
      direction: partTwo.direction,
      type: "single" as const,
      questions: partTwo.questions.map((q) => ({
        index: q.index,
        question: q.question,
        audio: buildEntranceExamLRAudioUrl(q.audio),
        image: null,
        savedAnswer: answersMap[q.index] ?? null,
      })),
    });
  }

  // Part 3
  const partThree = listeningExam.partThrees[0];
  if (partThree) {
    parts.push({
      partNo: 3,
      partName: "Part 3 – Conversations",
      direction: partThree.direction,
      type: "group" as const,
      groups: partThree.groups.map((g) => ({
        index: g.index,
        audio: buildEntranceExamLRAudioUrl(g.audio),
        image: g.image ? buildEntranceExamLRImageUrl(g.image) : null,
        fromQuestionIndex: g.fromQuestionIndex,
        toQuestionIndex: g.toQuestionIndex,
        questions: g.questions.map((q) => ({
          index: q.index,
          question: q.question,
          answerA: q.answerA,
          answerB: q.answerB,
          answerC: q.answerC,
          answerD: q.answerD,
          savedAnswer: answersMap[q.index] ?? null,
        })),
      })),
    });
  }

  // Part 4
  const partFour = listeningExam.partFours[0];
  if (partFour) {
    parts.push({
      partNo: 4,
      partName: "Part 4 – Talks",
      direction: partFour.direction,
      type: "group" as const,
      groups: partFour.groups.map((g) => ({
        index: g.index,
        audio: buildEntranceExamLRAudioUrl(g.audio),
        image: g.image ? buildEntranceExamLRImageUrl(g.image) : null,
        fromQuestionIndex: g.fromQuestionIndex,
        toQuestionIndex: g.toQuestionIndex,
        questions: g.questions.map((q) => ({
          index: q.index,
          question: q.question,
          answerA: q.answerA,
          answerB: q.answerB,
          answerC: q.answerC,
          answerD: q.answerD,
          savedAnswer: answersMap[q.index] ?? null,
        })),
      })),
    });
  }

  return { parts };
};

// ─── Load Reading Questions ───

export const loadReadingService = async (admission: any) => {
  if (
    admission.status !== AdmissionStatus.LISTENING_DONE &&
    admission.status !== AdmissionStatus.READING
  ) {
    throw new AppError("Phải hoàn thành Listening trước khi làm Reading", 400);
  }

  const entranceExam = await prisma.entranceExam.findUnique({
    where: { id: admission.entranceExamId! },
    include: { reading: true },
  });

  if (!entranceExam?.reading) {
    throw new AppError("Không tìm thấy đề thi Reading", 404);
  }

  const readingExam = await prisma.entranceExamReading.findUnique({
    where: { id: entranceExam.reading.id },
    include: {
      partFives: {
        include: { questions: { orderBy: { index: "asc" } } },
      },
      partSixes: {
        include: {
          groups: {
            orderBy: { index: "asc" },
            include: { questions: { orderBy: { index: "asc" } } },
          },
        },
      },
      partSevens: {
        include: {
          groups: {
            orderBy: { index: "asc" },
            include: { questions: { orderBy: { index: "asc" } } },
          },
        },
      },
    },
  });

  if (!readingExam) {
    throw new AppError("Không tìm thấy đề thi Reading", 404);
  }

  // Update status to READING
  if (admission.status === AdmissionStatus.LISTENING_DONE) {
    await prisma.admission.update({
      where: { id: admission.id },
      data: { status: AdmissionStatus.READING },
    });
  }

  // Load existing answers
  const existingAnswers = await prisma.admissionsReading.findMany({
    where: { admissionId: admission.id },
  });
  const answersMap: Record<number, number | null> = {};
  existingAnswers.forEach((a) => {
    answersMap[a.questionId] = a.answerId;
  });

  const parts = [];

  // Part 5
  const partFive = readingExam.partFives[0];
  if (partFive) {
    parts.push({
      partNo: 5,
      partName: "Part 5 – Incomplete Sentences",
      direction: partFive.direction,
      type: "single" as const,
      questions: partFive.questions.map((q) => ({
        index: q.index,
        question: q.question,
        answerA: q.answerA,
        answerB: q.answerB,
        answerC: q.answerC,
        answerD: q.answerD,
        savedAnswer: answersMap[q.index] ?? null,
      })),
    });
  }

  // Part 6
  const partSix = readingExam.partSixes[0];
  if (partSix) {
    parts.push({
      partNo: 6,
      partName: "Part 6 – Text Completion",
      direction: partSix.direction,
      type: "group" as const,
      groups: partSix.groups.map((g) => ({
        index: g.index,
        question: g.question ?? null,
        image: g.image ? buildEntranceExamLRImageUrl(g.image) : null,
        fromQuestionIndex: g.fromQuestionIndex,
        toQuestionIndex: g.toQuestionIndex,
        questions: g.questions.map((q) => ({
          index: q.index,
          question: q.question,
          answerA: q.answerA,
          answerB: q.answerB,
          answerC: q.answerC,
          answerD: q.answerD,
          savedAnswer: answersMap[q.index] ?? null,
        })),
      })),
    });
  }

  // Part 7
  const partSeven = readingExam.partSevens[0];
  if (partSeven) {
    parts.push({
      partNo: 7,
      partName: "Part 7 – Reading Comprehension",
      direction: partSeven.direction,
      type: "group" as const,
      groups: partSeven.groups.map((g) => ({
        index: g.index,
        question: g.question ?? null,
        image: g.image ? buildEntranceExamLRImageUrl(g.image) : null,
        fromQuestionIndex: g.fromQuestionIndex,
        toQuestionIndex: g.toQuestionIndex,
        questions: g.questions.map((q) => ({
          index: q.index,
          question: q.question,
          answerA: q.answerA,
          answerB: q.answerB,
          answerC: q.answerC,
          answerD: q.answerD,
          savedAnswer: answersMap[q.index] ?? null,
        })),
      })),
    });
  }

  return {
    parts,
    readingTimeMinutes: 75,
  };
};

// ─── Save Answer ───

export const saveAnswerService = async (
  admission: any,
  section: string,
  questionIndex: number,
  answerId: number,
) => {
  // Validate attempt status matches section
  if (section === "LISTENING" && admission.status !== AdmissionStatus.LISTENING) {
    throw new AppError("Không thể lưu đáp án Listening ở trạng thái hiện tại", 400);
  }
  if (section === "READING" && admission.status !== AdmissionStatus.READING) {
    throw new AppError("Không thể lưu đáp án Reading ở trạng thái hiện tại", 400);
  }

  const table = section === "LISTENING" ? "admissionsListening" : "admissionsReading";

  // Upsert: find existing answer or create new
  const existing = await (prisma as any)[table].findFirst({
    where: {
      admissionId: admission.id,
      questionId: questionIndex,
    },
  });

  if (existing) {
    await (prisma as any)[table].update({
      where: { id: existing.id },
      data: { answerId },
    });
  } else {
    await (prisma as any)[table].create({
      data: {
        admissionId: admission.id,
        questionId: questionIndex,
        answerId,
      },
    });
  }

  return { saved: true };
};

// ─── Submit Listening ───

export const submitListeningService = async (admission: any) => {
  if (admission.status !== AdmissionStatus.LISTENING) {
    throw new AppError("Không thể submit Listening ở trạng thái hiện tại", 400);
  }

  // Get true answers
  const entranceExam = await prisma.entranceExam.findUnique({
    where: { id: admission.entranceExamId! },
    include: { listening: true },
  });

  if (!entranceExam?.listening) {
    throw new AppError("Không tìm thấy đề thi", 404);
  }

  const trueAnswers = await prisma.entranceExamListeningTrueAnswer.findMany({
    where: { entranceExamListeningId: entranceExam.listening.id },
    orderBy: { index: "asc" },
  });

  // Get user answers
  const userAnswers = await prisma.admissionsListening.findMany({
    where: { admissionId: admission.id },
  });

  // Score: compare answerId (1-4) with trueAnswer (A-D)
  let rawScore = 0;
  const trueMap: Record<number, string> = {};
  trueAnswers.forEach((ta) => {
    trueMap[ta.index] = ta.answer;
  });

  userAnswers.forEach((ua) => {
    const trueAnswer = trueMap[ua.questionId];
    if (trueAnswer && ua.answerId) {
      const userLetter = ANSWER_MAP[ua.answerId];
      if (userLetter === trueAnswer) {
        rawScore++;
      }
    }
  });

  const listeningScaled = computeScaledScore(rawScore, "LISTENING", trueAnswers.length);

  await prisma.admission.update({
    where: { id: admission.id },
    data: {
      status: AdmissionStatus.LISTENING_DONE,
      totalListening: rawScore,
      scoreListening: listeningScaled,
    },
  });

  return { totalListening: rawScore, scoreListening: listeningScaled };
};

// ─── Submit Reading & Final Score ───

export const submitReadingService = async (admission: any) => {
  if (admission.status !== AdmissionStatus.READING) {
    throw new AppError("Không thể submit Reading ở trạng thái hiện tại", 400);
  }

  // Get true answers
  const entranceExam = await prisma.entranceExam.findUnique({
    where: { id: admission.entranceExamId! },
    include: { reading: true },
  });

  if (!entranceExam?.reading) {
    throw new AppError("Không tìm thấy đề thi", 404);
  }

  const trueAnswers = await prisma.entranceExamReadingTrueAnswer.findMany({
    where: { entranceExamReadingId: entranceExam.reading.id },
    orderBy: { index: "asc" },
  });

  // Get user answers
  const userAnswers = await prisma.admissionsReading.findMany({
    where: { admissionId: admission.id },
  });

  // Score reading
  let readingRaw = 0;
  const trueMap: Record<number, string> = {};
  trueAnswers.forEach((ta) => {
    trueMap[ta.index] = ta.answer;
  });

  userAnswers.forEach((ua) => {
    const trueAnswer = trueMap[ua.questionId];
    if (trueAnswer && ua.answerId) {
      const userLetter = ANSWER_MAP[ua.answerId];
      if (userLetter === trueAnswer) {
        readingRaw++;
      }
    }
  });

  // Reload to get stored listening score (already computed with correct denominator)
  const freshAdmission = await prisma.admission.findUnique({
    where: { id: admission.id },
  });
  const listeningRaw = freshAdmission?.totalListening ?? 0;

  // Compute scaled scores — use actual question counts as denominator
  const listeningScaled = freshAdmission?.scoreListening ?? computeScaledScore(listeningRaw, "LISTENING", trueAnswers.length);
  const readingScaled = computeScaledScore(readingRaw, "READING", trueAnswers.length);
  const totalScaled = listeningScaled + readingScaled;

  // Update admission with all scores persisted
  await prisma.admission.update({
    where: { id: admission.id },
    data: {
      status: AdmissionStatus.COMPLETED,
      isDone: true,
      totalReading: readingRaw,
      scoreListening: listeningScaled,
      scoreReading: readingScaled,
      entranceScore: totalScaled,
    },
  });

  // Send result email with registration token (fire-and-forget)
  if (freshAdmission?.email) {
    // Create registration token for course enrollment link
    const tokenValue = crypto.randomUUID();
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    prisma.registrationToken.create({
      data: {
        token: tokenValue,
        admissionId: admission.id,
        expiresAt: tokenExpiresAt,
      },
    }).then(() => {
      sendExamResultEmail(freshAdmission.email, freshAdmission.fullname, {
        listeningRaw,
        readingRaw,
        listeningScaled,
        readingScaled,
        totalScaled,
      }, tokenValue, tokenExpiresAt).catch((err) => console.error("Failed to send exam result email:", err));
    }).catch((err) => console.error("Failed to create registration token:", err));
  }

  return {
    totalListening: listeningRaw,
    totalReading: readingRaw,
    listeningScaledScore: listeningScaled,
    readingScaledScore: readingScaled,
    totalScaledScore: totalScaled,
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
