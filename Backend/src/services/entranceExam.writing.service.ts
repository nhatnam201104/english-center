import prisma from "../config/database";
import { AdmissionStatus } from "@prisma/client";
import { AppError } from "../middleware/errorHandler";
import { buildWritingImageUrl } from "../utils/fileUrl";
import { gradeSpeakingAndWritingService } from "./gradeSpeakingAndWriting.service";

/**
 * Load Writing questions - split into independent questions
 */
export const loadWritingService = async (admission: any) => {
  if (
    admission.status !== AdmissionStatus.SPEAKING_DONE &&
    admission.status !== AdmissionStatus.WRITING
  ) {
    throw new AppError("Must complete Speaking before Writing", 400);
  }

  const entranceExam = await prisma.entranceExam.findUnique({
    where: { id: admission.entranceExamId! },
    include: { writing: true },
  });

  if (!entranceExam?.writing) {
    throw new AppError("Writing exam not found", 404);
  }

  const writingExam = await prisma.entranceExamWriting.findUnique({
    where: { id: entranceExam.writing.id },
    include: {
      writingOneToFives: {
        orderBy: { index: "asc" },
      },
      writingSixSevens: {
        orderBy: { index: "asc" },
      },
      writingEights: {
        orderBy: { index: "asc" },
      },
    },
  });

  if (!writingExam) {
    throw new AppError("Writing exam not found", 404);
  }

  // Update status to WRITING
  if (admission.status === AdmissionStatus.SPEAKING_DONE) {
    await prisma.admission.update({
      where: { id: admission.id },
      data: { status: AdmissionStatus.WRITING },
    });
  }

  // Load existing answers
  const existingAnswers = await prisma.admissionsWriting.findMany({
    where: { admissionId: admission.id },
  });
  const answersMap: Record<string, string> = {};
  existingAnswers.forEach((a) => {
    answersMap[a.questionId.toString()] = a.answer ?? "";
  });

  const questions: any[] = [];
  let globalQuestionIndex = 1; // Global index for independent questions

  // Part 1-5 (5 questions - split independently) - TOEIC: ~1 minute each
  const partOneToFives = writingExam.writingOneToFives;
  partOneToFives.forEach((p) => {
    questions.push({
      questionIndex: globalQuestionIndex++,
      question: "Write a sentence based on picture 1",
      partType: "Part 1",
      images: [buildWritingImageUrl(p.imageOne)],
      answer: answersMap[`1`] ?? null,
      databaseQuestionId: `1`,
      suggestedTime: 1, // 1 minute
    });
    questions.push({
      questionIndex: globalQuestionIndex++,
      question: "Write a sentence based on picture 2",
      partType: "Part 2",
      images: [buildWritingImageUrl(p.imageTwo)],
      answer: answersMap[`2`] ?? null,
      databaseQuestionId: `2`,
      suggestedTime: 1, // 1 minute
    });
    questions.push({
      questionIndex: globalQuestionIndex++,
      question: "Write a sentence based on picture 3",
      partType: "Part 3",
      images: [buildWritingImageUrl(p.imageThree)],
      answer: answersMap[`3`] ?? null,
      databaseQuestionId: `3`,
      suggestedTime: 1, // 1 minute
    });
    questions.push({
      questionIndex: globalQuestionIndex++,
      question: "Write a sentence based on picture 4",
      partType: "Part 4",
      images: [buildWritingImageUrl(p.imageFour)],
      answer: answersMap[`4`] ?? null,
      databaseQuestionId: `4`,
      suggestedTime: 1, // 1 minute
    });
    questions.push({
      questionIndex: globalQuestionIndex++,
      question: "Write a sentence based on picture 5",
      partType: "Part 5",
      images: [buildWritingImageUrl(p.imageFive)],
      answer: answersMap[`5`] ?? null,
      databaseQuestionId: `5`,
      suggestedTime: 1, // 1 minute
    });
  });

  // Part 6-7 (2 questions - split independently) - TOEIC: ~10 minutes each
  const partSixSevens = writingExam.writingSixSevens;
  partSixSevens.forEach((p) => {
    questions.push({
      questionIndex: globalQuestionIndex++,
      question: "Respond to email 1",
      partType: "Part 6",
      images: [buildWritingImageUrl(p.imageSix)],
      answer: answersMap[`6`] ?? null,
      databaseQuestionId: `6`,
      suggestedTime: 10, // 10 minutes
    });
    questions.push({
      questionIndex: globalQuestionIndex++,
      question: "Respond to email 2",
      partType: "Part 7",
      images: [buildWritingImageUrl(p.imageSeven)],
      answer: answersMap[`7`] ?? null,
      databaseQuestionId: `7`,
      suggestedTime: 10, // 10 minutes
    });
  });

  // Part 8 (1 question) - TOEIC: ~30 minutes
  const partEights = writingExam.writingEights;
  partEights.forEach((p) => {
    questions.push({
      questionIndex: globalQuestionIndex++,
      question: p.questionEight,
      partType: "Part 8",
      answer: answersMap[`8`] ?? null,
      databaseQuestionId: `8`,
      suggestedTime: 30, // 30 minutes
    });
  });

  return { questions, writingTimeMinutes: 60 };
};

/**
 * Save Writing text answer
 */
export const saveWritingAnswerService = async (
  admission: any,
  questionIndex: number,
  databaseQuestionId: string | undefined,
  answer: string,
) => {
  if (admission.status !== AdmissionStatus.WRITING) {
    throw new AppError("Cannot save Writing answer in current state", 400);
  }

  // Use databaseQuestionId if provided, otherwise fallback to questionIndex
  // For backward compatibility with old frontend that doesn't send databaseQuestionId
  const questionIdToSave = databaseQuestionId 
    ? parseInt(databaseQuestionId)
    : questionIndex; // questionIndex is used as fallback

  // Upsert answer
  const existing = await prisma.admissionsWriting.findFirst({
    where: {
      admissionId: admission.id,
      questionId: questionIdToSave,
    },
  });

  if (existing) {
    await prisma.admissionsWriting.update({
      where: { id: existing.id },
      data: { answer },
    });
  } else {
    await prisma.admissionsWriting.create({
      data: {
        admissionId: admission.id,
        questionId: questionIdToSave,
        answer,
      },
    });
  }

  return { saved: true };
};

/**
 * Submit Writing section and grade both Speaking & Writing together
 * Then send result email
 */
export const submitWritingService = async (admission: any) => {
  if (admission.status !== AdmissionStatus.WRITING) {
    throw new AppError("Cannot submit Writing in current state", 400);
  }

  // Call gradeSpeakingAndWritingService to grade both sections
  const result = await gradeSpeakingAndWritingService(admission);

  return {
    totalRawScore: result.writing.totalRawScore,
    scaledScore: result.writing.scaledScore,
    speakingScaled: result.speaking.scaledScore,
    totalScaledScore: result.totalScaledScore,
    gradingResults: result.writing.gradingResults,
  };
};
