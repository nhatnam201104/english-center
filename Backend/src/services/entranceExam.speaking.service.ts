import prisma from "../config/database";
import { AdmissionStatus } from "@prisma/client";
import { AppError } from "../middleware/errorHandler";
import {

  buildSpeakingImageUrl,
  buildSpeakingAudioUrl,
} from "../utils/fileUrl";

/**
 * Start Speaking attempt for SW exam
 */
export const startSpeakingAttemptService = async (admission: any) => {
  if (admission.type !== "SPEAKING_WRITING") {
    throw new AppError("Exam type must be SPEAKING_WRITING", 400);
  }

  if (
    admission.status !== AdmissionStatus.PENDING &&
    admission.status !== AdmissionStatus.SPEAKING
  ) {
    throw new AppError("Cannot start Speaking in current state", 400);
  }

  // Update status to SPEAKING
  await prisma.admission.update({
    where: { id: admission.id },
    data: { status: AdmissionStatus.SPEAKING },
  });

  return { started: true };
};

/**
 * Load Speaking questions - split into independent questions
 */
export const loadSpeakingService = async (admission: any) => {
  if (admission.status !== AdmissionStatus.SPEAKING) {
    throw new AppError("Cannot load Speaking in current state", 400);
  }

  const entranceExam = await prisma.entranceExam.findUnique({
    where: { id: admission.entranceExamId! },
    include: { speaking: true },
  });

  if (!entranceExam?.speaking) {
    throw new AppError("Speaking exam not found", 404);
  }

  const speakingExam = await prisma.entranceExamSpeaking.findUnique({
    where: { id: entranceExam.speaking.id },
    include: {
      speakingOneTwos: {
        orderBy: { index: "asc" },
      },
      speakingThreeFours: {
        orderBy: { index: "asc" },
      },
      speakingFiveToSevens: {
        orderBy: { index: "asc" },
      },
      speakingEightToTens: {
        orderBy: { index: "asc" },
      },
      speakingElevens: {
        orderBy: { index: "asc" },
      },
    },
  });

  if (!speakingExam) {
    throw new AppError("Speaking exam not found", 404);
  }

  // Load existing answers
  const existingAnswers = await prisma.admissionsSpeaking.findMany({
    where: { admissionId: admission.id },
  });

  const answersMap: Record<string, string | null> = {};
  existingAnswers.forEach((a) => {
    

    answersMap[a.questionId.toString()] = buildSpeakingAudioUrl(a.audioRecord);
  });

  const questions: any[] = [];
  let globalQuestionIndex = 1; // Global index for independent questions

  // Part 1: Read a text aloud - 2 questions
  // 45s preparation + 45s speaking each
  const partOneTwos = speakingExam.speakingOneTwos;
  partOneTwos.forEach((p) => {
    questions.push({
      questionIndex: globalQuestionIndex++,
      question: p.questionOne,
      partType: "Part 1",
      audioRecord: answersMap[`1`] ?? null,
      databaseQuestionId: `1`,
      preparationTime: 45, // 45 seconds
      recordingTime: 45, // 45 seconds
    });
    questions.push({
      questionIndex: globalQuestionIndex++,
      question: p.questionTwo,
      partType: "Part 1",
      audioRecord: answersMap[`2`] ?? null,
      databaseQuestionId: `2`,
      preparationTime: 45, // 45 seconds
      recordingTime: 45, // 45 seconds
    });
  });

  // Part 2: Describe a picture - 2 questions
  // 45s preparation + 30s speaking each
  const partThreeFours = speakingExam.speakingThreeFours;
  partThreeFours.forEach((p) => {
    questions.push({
      questionIndex: globalQuestionIndex++,
      question: "Describe the first picture",
      partType: "Part 2",
      images: [buildSpeakingImageUrl(p.imageThree)],
      audioRecord: answersMap[`3`] ?? null,
      databaseQuestionId: `3`,
      preparationTime: 45, // 45 seconds
      recordingTime: 30, // 30 seconds
    });
    questions.push({
      questionIndex: globalQuestionIndex++,
      question: "Describe the second picture",
      partType: "Part 2",
      images: [buildSpeakingImageUrl(p.imageFour)],
      audioRecord: answersMap[`4`] ?? null,
      databaseQuestionId: `4`,
      preparationTime: 45, // 45 seconds
      recordingTime: 30, // 30 seconds
    });
  });

  // Part 3: Respond to questions - 3 questions related to situation
  // No time limit
  const partFiveToSevens = speakingExam.speakingFiveToSevens;
  partFiveToSevens.forEach((p) => {
    questions.push({
      questionIndex: globalQuestionIndex++,
      question: p.questionFive,
      partType: "Part 3",
      passage: p.passage,
      audioRecord: answersMap[`5`] ?? null,
      databaseQuestionId: `5`,
      preparationTime: 0, // No preparation time
      recordingTime: 0, // No time limit
    });
    questions.push({
      questionIndex: globalQuestionIndex++,
      question: p.questionSix,
      partType: "Part 3",
      passage: p.passage,
      audioRecord: answersMap[`6`] ?? null,
      databaseQuestionId: `6`,
      preparationTime: 0, // No preparation time
      recordingTime: 0, // No time limit
    });
    questions.push({
      questionIndex: globalQuestionIndex++,
      question: p.questionSeven,
      partType: "Part 3",
      passage: p.passage,
      audioRecord: answersMap[`7`] ?? null,
      databaseQuestionId: `7`,
      preparationTime: 0, // No preparation time
      recordingTime: 0, // No time limit
    });
  });

  // Part 4: Respond to questions using information - 3 questions based on table/schedule
  // No time limit
  const partEightToTens = speakingExam.speakingEightToTens;
  partEightToTens.forEach((p) => {
    const image = p.image ? buildSpeakingImageUrl(p.image) : null;
    questions.push({
      questionIndex: globalQuestionIndex++,
      question: p.questionEight,
      partType: "Part 4",
      passage: p.passage,
      image,
      audioRecord: answersMap[`8`] ?? null,
      databaseQuestionId: `8`,
      preparationTime: 0, // No preparation time
      recordingTime: 0, // No time limit
    });
    questions.push({
      questionIndex: globalQuestionIndex++,
      question: p.questionNine,
      partType: "Part 4",
      passage: p.passage,
      image,
      audioRecord: answersMap[`9`] ?? null,
      databaseQuestionId: `9`,
      preparationTime: 0, // No preparation time
      recordingTime: 0, // No time limit
    });
    questions.push({
      questionIndex: globalQuestionIndex++,
      question: p.questionTen,
      partType: "Part 4",
      passage: p.passage,
      image,
      audioRecord: answersMap[`10`] ?? null,
      databaseQuestionId: `10`,
      preparationTime: 0, // No preparation time
      recordingTime: 0, // No time limit
    });
  });

  // Part 5: Express an opinion - 1 question
  // 15s preparation + 60s speaking
  const partElevens = speakingExam.speakingElevens;
  partElevens.forEach((p) => {
    questions.push({
      questionIndex: globalQuestionIndex++,
      question: p.question,
      partType: "Part 5",
      audioRecord: answersMap[`11`] ?? null,
      databaseQuestionId: `11`,
      preparationTime: 15, // 15 seconds
      recordingTime: 60, // 60 seconds
    });
  });

  return { 
    questions, 
    speakingTimeMinutes: 20, // Changed from 60 to 20 minutes per TOEIC standard
  };
};

/**
 * Save Speaking audio answer
 */
export const saveSpeakingAnswerService = async (
  admission: any,
  questionIndex: number,
  databaseQuestionId: string | undefined,
  audioPath: string,
) => {
  if (admission.status !== AdmissionStatus.SPEAKING) {
    throw new AppError("Cannot save Speaking answer in current state", 400);
  }

  // Use databaseQuestionId if provided, otherwise fallback to questionIndex
  // For backward compatibility with old frontend that doesn't send databaseQuestionId
  const questionIdToSave = databaseQuestionId
    ? parseInt(databaseQuestionId)
    : questionIndex; // questionIndex is used as fallback

  // Upsert answer
  const existing = await prisma.admissionsSpeaking.findFirst({
    where: {
      admissionId: admission.id,
      questionId: questionIdToSave,
    },
  });

  if (existing) {
    await prisma.admissionsSpeaking.update({
      where: { id: existing.id },
      data: { audioRecord: audioPath },
    });
  } else {
    await prisma.admissionsSpeaking.create({
      data: {
        admissionId: admission.id,
        questionId: questionIdToSave,
        audioRecord: audioPath,
      },
    });
  }

  return { saved: true };
};

/**
 * Submit Speaking section - only update status, NO grading
 * Grading will be done together with Writing
 */
export const submitSpeakingService = async (admission: any) => {
  if (admission.status !== AdmissionStatus.SPEAKING) {
    throw new AppError("Cannot submit Speaking in current state", 400);
  }

  // Only update status to SPEAKING_DONE
  // Grading will be handled by Writing submit service
  await prisma.admission.update({
    where: { id: admission.id },
    data: {
      status: AdmissionStatus.SPEAKING_DONE,
    },
  });

  return {
    submitted: true,
  };
};
