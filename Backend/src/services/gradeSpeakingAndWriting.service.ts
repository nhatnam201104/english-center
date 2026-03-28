import prisma from "../config/database";
import { AdmissionStatus } from "@prisma/client";
import { AppError } from "../middleware/errorHandler";
import {
  buildEntranceExamLRImageUrl,
  buildSpeakingImageUrl,
  buildSpeakingAudioUrl,
} from "../utils/fileUrl";
import {
  gradeSpeakingAnswer,
  calculateSpeakingScaledScore,
  gradeWritingAnswer,
  calculateWritingScaledScore,
} from "./aiGrading.service";
import { sendEmail } from "../utils/email.service";

/**
 * Grade both Speaking and Writing sections together
 * Called when Writing is submitted
 */
export const gradeSpeakingAndWritingService = async (admission: any) => {
  if (admission.status !== AdmissionStatus.WRITING) {
    throw new AppError("Cannot grade in current state", 400);
  }

  // Get exam details
  const entranceExam = await prisma.entranceExam.findUnique({
    where: { id: admission.entranceExamId! },
    include: {
      speaking: true,
      writing: true,
    },
  });

  if (!entranceExam) {
    throw new AppError("Exam not found", 404);
  }

  // ============ GRADE SPEAKING ============
  console.log("Starting Speaking grading...");

  if (!entranceExam.speaking) {
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

  // Get user Speaking answers
  const speakingAnswers = await prisma.admissionsSpeaking.findMany({
    where: { admissionId: admission.id },
  });

  // Create audio path map
  const speakingAudioMap: Record<string, string> = {};
  speakingAnswers.forEach((a) => {
    speakingAudioMap[a.questionId.toString()] = a.audioRecord
      ? "/uploads/speaking-audio/" + a.audioRecord
      : "";
  });

  // Prepare Speaking questions for AI grading
  const speakingQuestionsToGrade: Array<{
    questionIndex: number;
    question: string;
    partType: string;
    audioPath: string;
    passage?: string;
  }> = [];

  let globalQuestionIndex = 1;

  // Part 1 (2 questions)
  speakingExam.speakingOneTwos.forEach((p) => {
    speakingQuestionsToGrade.push({
      questionIndex: globalQuestionIndex++,
      question: p.questionOne,
      partType: "Part 1",
      audioPath: speakingAudioMap[`1`] || "",
    });
    speakingQuestionsToGrade.push({
      questionIndex: globalQuestionIndex++,
      question: p.questionTwo,
      partType: "Part 1",
      audioPath: speakingAudioMap[`2`] || "",
    });
  });

  // Part 3 (2 questions)
  speakingExam.speakingThreeFours.forEach((p) => {
    speakingQuestionsToGrade.push({
      questionIndex: globalQuestionIndex++,
      question: buildSpeakingImageUrl(p.imageThree)?.toString() || "",
      partType: "Part 2",
      audioPath: speakingAudioMap[`3`] || "",
    });
    speakingQuestionsToGrade.push({
      questionIndex: globalQuestionIndex++,
      question: buildSpeakingImageUrl(p.imageFour)?.toString() || "",
      partType: "Part 2",
      audioPath: speakingAudioMap[`4`] || "",
    });
  });

  // Part 3 (3 questions) - include passage
  speakingExam.speakingFiveToSevens.forEach((p) => {
    speakingQuestionsToGrade.push({
      questionIndex: globalQuestionIndex++,
      question: p.questionFive,
      partType: "Part 3",
      passage: p.passage,
      audioPath: speakingAudioMap[`5`] || "",
    });
    speakingQuestionsToGrade.push({
      questionIndex: globalQuestionIndex++,
      question: p.questionSix,
      partType: "Part 3",
      passage: p.passage,
      audioPath: speakingAudioMap[`6`] || "",
    });
    speakingQuestionsToGrade.push({
      questionIndex: globalQuestionIndex++,
      question: p.questionSeven,
      partType: "Part 3",
      passage: p.passage,
      audioPath: speakingAudioMap[`7`] || "",
    });
  });

  // Part 4 (3 questions) - include passage
  speakingExam.speakingEightToTens.forEach((p) => {
    speakingQuestionsToGrade.push({
      questionIndex: globalQuestionIndex++,
      question: p.questionEight,
      partType: "Part 4",
      passage: p.passage,
      audioPath: speakingAudioMap[`8`] || "",
    });
    speakingQuestionsToGrade.push({
      questionIndex: globalQuestionIndex++,
      question: p.questionNine,
      partType: "Part 4",
      passage: p.passage,
      audioPath: speakingAudioMap[`9`] || "",
    });
    speakingQuestionsToGrade.push({
      questionIndex: globalQuestionIndex++,
      question: p.questionTen,
      partType: "Part 4",
      passage: p.passage,
      audioPath: speakingAudioMap[`10`] || "",
    });
  });

  // Part 5 (1 question)
  speakingExam.speakingElevens.forEach((p) => {
    speakingQuestionsToGrade.push({
      questionIndex: globalQuestionIndex++,
      question: p.question,
      partType: "Part 5",
      audioPath: speakingAudioMap[`11`] || "",
    });
  });

  // Grade Speaking questions in parallel
  console.log(
    `Starting parallel Speaking grading for ${speakingQuestionsToGrade.length} questions...`,
  );
  const speakingGradingPromises = speakingQuestionsToGrade.map(async (q) => {
    const result = await gradeSpeakingAnswer(
      q.question,
      q.partType,
      q.audioPath,
      q.passage,
    );
    return {
      questionIndex: q.questionIndex,
      score: result.totalScore,
      feedback: {
        pronunciation: result.pronunciation.feedback,
        grammar: result.grammar.feedback,
        vocabulary: result.vocabulary.feedback,
        fluency: result.fluency.feedback,
        taskAchievement: result.taskAchievement.feedback,
      },
      partType: q.partType,
    };
  });

  const speakingGradingResults = await Promise.all(speakingGradingPromises);
  console.log(
    `Completed Speaking grading for ${speakingGradingResults.length} questions`,
  );

  // Calculate Speaking total raw score
  let speakingTotalRawScore = 0;
  speakingGradingResults.forEach((result) => {
    speakingTotalRawScore += result.score;
  });

  // Calculate Speaking scaled score (10-200)
  const speakingScaledScore = calculateSpeakingScaledScore(
    speakingTotalRawScore,
    speakingQuestionsToGrade.length,
  );

  // ============ GRADE WRITING ============
  console.log("Starting Writing grading...");

  if (!entranceExam.writing) {
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

  // Get user Writing answers
  const writingAnswers = await prisma.admissionsWriting.findMany({
    where: { admissionId: admission.id },
  });

  // Create answer map
  const writingAnswerMap: Record<string, string> = {};
  writingAnswers.forEach((a) => {
    writingAnswerMap[a.questionId.toString()] = a.answer || "";
  });

  // Prepare Writing questions for AI grading
  const writingQuestionsToGrade: Array<{
    questionIndex: number;
    question: string;
    partType: string;
    answer: string;
    images?: string;
  }> = [];

  globalQuestionIndex = 1;

  // Part 1 (5 questions) - based on pictures
  writingExam.writingOneToFives.forEach((p) => {
    const images: string[] = [];
    if (p.imageOne) images.push(buildEntranceExamLRImageUrl(p.imageOne) || "");
    if (p.imageTwo) images.push(buildEntranceExamLRImageUrl(p.imageTwo) || "");
    if (p.imageThree)
      images.push(buildEntranceExamLRImageUrl(p.imageThree) || "");
    if (p.imageFour)
      images.push(buildEntranceExamLRImageUrl(p.imageFour) || "");
    if (p.imageFive)
      images.push(buildEntranceExamLRImageUrl(p.imageFive) || "");
    // Generate questions dynamically (schema doesn't have question fields)
    const imagesStr = images.length > 0 ? images.join(",") : "";
    writingQuestionsToGrade.push({
      questionIndex: globalQuestionIndex++,
      question: "Write a sentence based on picture 1",
      partType: "Part 1",
      answer: writingAnswerMap[`1`] || "",
      images: imagesStr,
    });
    writingQuestionsToGrade.push({
      questionIndex: globalQuestionIndex++,
      question: "Write a sentence based on picture 2",
      partType: "Part 1",
      answer: writingAnswerMap[`2`] || "",
      images: imagesStr,
    });
    writingQuestionsToGrade.push({
      questionIndex: globalQuestionIndex++,
      question: "Write a sentence based on picture 3",
      partType: "Part 1",
      answer: writingAnswerMap[`3`] || "",
      images: imagesStr,
    });
    writingQuestionsToGrade.push({
      questionIndex: globalQuestionIndex++,
      question: "Write a sentence based on picture 4",
      partType: "Part 1",
      answer: writingAnswerMap[`4`] || "",
      images: imagesStr,
    });
    writingQuestionsToGrade.push({
      questionIndex: globalQuestionIndex++,
      question: "Write a sentence based on picture 5",
      partType: "Part 1",
      answer: writingAnswerMap[`5`] || "",
      images: imagesStr,
    });
  });

  // Part 2 (2 questions) - written requests
  writingExam.writingSixSevens.forEach((p) => {
    const imageSixStr = p.imageSix
      ? buildEntranceExamLRImageUrl(p.imageSix) || undefined
      : undefined;
    const imageSevenStr = p.imageSeven
      ? buildEntranceExamLRImageUrl(p.imageSeven) || undefined
      : undefined;

    // Generate questions dynamically (schema doesn't have question fields)
    writingQuestionsToGrade.push({
      questionIndex: globalQuestionIndex++,
      question: "Respond to a written request 1",
      partType: "Part 2",
      answer: writingAnswerMap[`6`] || "",
      images: imageSixStr,
    });
    writingQuestionsToGrade.push({
      questionIndex: globalQuestionIndex++,
      question: "Respond to a written request 2",
      partType: "Part 2",
      answer: writingAnswerMap[`7`] || "",
      images: imageSevenStr,
    });
  });

  // Part 3 (1 question) - opinion essay
  writingExam.writingEights.forEach((p) => {
    writingQuestionsToGrade.push({
      questionIndex: globalQuestionIndex++,
      question: p.questionEight,
      partType: "Part 3",
      answer: writingAnswerMap[`8`] || "",
    });
  });

  // Grade Writing questions in parallel
  console.log(
    `Starting parallel Writing grading for ${writingQuestionsToGrade.length} questions...`,
  );
  const writingGradingPromises = writingQuestionsToGrade.map(async (q) => {
    const result = await gradeWritingAnswer(
      q.question,
      q.partType,
      q.answer,
      q.images,
    );
    return {
      questionIndex: q.questionIndex,
      score: result.totalScore,
      feedback: {
        grammar: result.grammar.feedback,
        vocabulary: result.vocabulary.feedback,
        organization: result.organization.feedback,
        taskFulfillment: result.taskFulfillment.feedback,
        toneAndStyle: result.toneAndStyle.feedback,
      },
      partType: q.partType,
    };
  });

  const writingGradingResults = await Promise.all(writingGradingPromises);
  console.log(
    `Completed Writing grading for ${writingGradingResults.length} questions`,
  );

  // Calculate Writing total raw score
  let writingTotalRawScore = 0;
  writingGradingResults.forEach((result) => {
    writingTotalRawScore += result.score;
  });

  // Calculate Writing scaled score (10-200)
  const writingScaledScore = calculateWritingScaledScore(
    writingTotalRawScore,
    writingQuestionsToGrade.length,
  );

  // Calculate total scaled score (20-400)
  const totalScaledScore = speakingScaledScore + writingScaledScore;

  // ============ UPDATE ADMISSION ============
  await prisma.admission.update({
    where: { id: admission.id },
    data: {
      status: AdmissionStatus.COMPLETED,
      totalSpeaking: speakingTotalRawScore,
      scoreSpeaking: speakingScaledScore,
      totalWriting: writingTotalRawScore,
      scoreWriting: writingScaledScore,
    },
  });

  // ============ SEND EMAIL WITH RESULTS ============
  // Get candidate info
  const candidate = await prisma.admission.findUnique({
    where: { id: admission.id },
    select: {
      fullname: true,
      email: true,
    },
  });

  if (candidate?.email) {
    await sendResultEmail(
      candidate.email,
      candidate.fullname,
      speakingScaledScore,
      writingScaledScore,
      totalScaledScore,
      speakingGradingResults,
      writingGradingResults,
    );
  }

  return {
    speaking: {
      totalRawScore: speakingTotalRawScore,
      scaledScore: speakingScaledScore,
      gradingResults: speakingGradingResults,
    },
    writing: {
      totalRawScore: writingTotalRawScore,
      scaledScore: writingScaledScore,
      gradingResults: writingGradingResults,
    },
    totalScaledScore,
  };
};

/**
 * Send result email with detailed feedback
 */
const sendResultEmail = async (
  email: string,
  name: string,
  speakingScore: number,
  writingScore: number,
  totalScore: number,
  speakingResults: any[],
  writingResults: any[],
) => {
  const speakingLevel = getScoreLevel(speakingScore, 200);
  const writingLevel = getScoreLevel(writingScore, 200);
  const totalLevel = getScoreLevel(totalScore, 400);

  const suggestedCourses = getSuggestedCourses(totalScore);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: #f9f9f9; padding: 30px; }
        .score-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
        .score-display { font-size: 36px; font-weight: bold; color: #667eea; text-align: center; margin: 10px 0; }
        .score-label { text-align: center; color: #666; font-size: 14px; }
        .level-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; color: white; font-size: 12px; font-weight: bold; }
        .level-beginner { background: #95a5a6; }
        .level-intermediate { background: #3498db; }
        .level-advanced { background: #2ecc71; }
        .question-feedback { background: white; padding: 15px; margin-bottom: 10px; border-radius: 5px; border-left: 4px solid #667eea; }
        .question-number { font-weight: bold; color: #667eea; margin-bottom: 5px; }
        .feedback-item { margin: 5px 0; font-size: 13px; }
        .feedback-label { font-weight: bold; color: #555; }
        .courses { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 20px; }
        .course-item { padding: 10px; margin-bottom: 10px; background: #f0f0f0; border-radius: 5px; }
        .footer { background: #666; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Kết quả thi Speaking & Writing</h1>
          <p>Xin chào ${name},</p>
        </div>
        
        <div class="content">
          <h2>Điểm tổng quát</h2>
          <div class="score-card">
            <div class="score-display">${totalScore}/400</div>
            <div class="score-label">Tổng điểm</div>
            <div style="text-align: center; margin-top: 10px;">
              <span class="level-badge level-${totalLevel.toLowerCase()}">${totalLevel}</span>
            </div>
          </div>

          <div style="display: flex; gap: 20px;">
            <div style="flex: 1;">
              <div class="score-card">
                <div class="score-display">${speakingScore}/200</div>
                <div class="score-label">Speaking</div>
                <div style="text-align: center; margin-top: 10px;">
                  <span class="level-badge level-${speakingLevel.toLowerCase()}">${speakingLevel}</span>
                </div>
              </div>
            </div>
            <div style="flex: 1;">
              <div class="score-card">
                <div class="score-display">${writingScore}/200</div>
                <div class="score-label">Writing</div>
                <div style="text-align: center; margin-top: 10px;">
                  <span class="level-badge level-${writingLevel.toLowerCase()}">${writingLevel}</span>
                </div>
              </div>
            </div>
          </div>

          <h2>Chi tiết Speaking (${speakingResults.length} câu)</h2>
          ${speakingResults
            .map(
              (r) => `
            <div class="question-feedback">
              <div class="question-number">Câu ${r.questionIndex} (${r.partType})</div>
              <div class="feedback-item"><span class="feedback-label">Điểm:</span> ${r.score}/25</div>
              <div class="feedback-item"><span class="feedback-label">Phát âm:</span> ${r.feedback.pronunciation}</div>
              <div class="feedback-item"><span class="feedback-label">Ngữ pháp:</span> ${r.feedback.grammar}</div>
              <div class="feedback-item"><span class="feedback-label">Từ vựng:</span> ${r.feedback.vocabulary}</div>
              <div class="feedback-item"><span class="feedback-label">Tự nhiên:</span> ${r.feedback.fluency}</div>
              <div class="feedback-item"><span class="feedback-label">Hoàn thành nhiệm vụ:</span> ${r.feedback.taskAchievement}</div>
            </div>
          `,
            )
            .join("")}

          <h2>Chi tiết Writing (${writingResults.length} câu)</h2>
          ${writingResults
            .map(
              (r) => `
            <div class="question-feedback">
              <div class="question-number">Câu ${r.questionIndex} (${r.partType})</div>
              <div class="feedback-item"><span class="feedback-label">Điểm:</span> ${r.score}/25</div>
              <div class="feedback-item"><span class="feedback-label">Ngữ pháp:</span> ${r.feedback.grammar}</div>
              <div class="feedback-item"><span class="feedback-label">Từ vựng:</span> ${r.feedback.vocabulary}</div>
              <div class="feedback-item"><span class="feedback-label">Cấu trúc:</span> ${r.feedback.organization}</div>
              <div class="feedback-item"><span class="feedback-label">Hoàn thành yêu cầu:</span> ${r.feedback.taskFulfillment}</div>
              <div class="feedback-item"><span class="feedback-label">Văn phong:</span> ${r.feedback.toneAndStyle}</div>
            </div>
          `,
            )
            .join("")}

          <h2>Gợi ý khóa học</h2>
          <div class="courses">
            ${suggestedCourses
              .map(
                (course) => `
              <div class="course-item">
                <strong>${course.name}</strong>
                <p style="margin: 5px 0 0 0; font-size: 13px; color: #666;">${course.description}</p>
              </div>
            `,
              )
              .join("")}
          </div>

          <p style="margin-top: 20px; text-align: center; color: #666;">
            Chúng tôi sẽ liên hệ với bạn sớm để tư vấn chi tiết.
          </p>
        </div>
        
        <div class="footer">
          <p>English Center Management System</p>
          <p style="font-size: 12px; margin-top: 5px;">Email này được gửi tự động, vui lòng không trả lời.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: "Kết quả thi Speaking & Writing - English Center",
    html,
  });
};

const getScoreLevel = (score: number, maxScore: number): string => {
  const percentage = score / maxScore;
  if (percentage >= 0.875) return "Cao cấp";
  if (percentage >= 0.7) return "Trung cấp";
  if (percentage >= 0.5) return "Sơ cấp";
  return "Cơ bản";
};

const getSuggestedCourses = (
  totalScore: number,
): Array<{ name: string; description: string }> => {
  if (totalScore >= 350) {
    return [
      {
        name: "TOEIC Advanced",
        description:
          "Nâng cao kỹ năng Speaking & Writing lên mức chuyên nghiệp",
      },
      {
        name: "Business English Mastery",
        description: "Tiếng Anh thương mại cao cấp",
      },
      { name: "IELTS Preparation", description: "Chuẩn bị cho kỳ thi IELTS" },
    ];
  } else if (totalScore >= 280) {
    return [
      {
        name: "TOEIC Intermediate",
        description: "Cải thiện kỹ năng Speaking & Writing ở mức trung cấp",
      },
      {
        name: "Professional Communication",
        description: "Giao tiếp chuyên nghiệp trong công việc",
      },
      { name: "Advanced Writing", description: "Nâng cao kỹ năng viết" },
    ];
  } else if (totalScore >= 200) {
    return [
      {
        name: "TOEIC Foundation",
        description: "Nền tảng kỹ năng Speaking & Writing",
      },
      {
        name: "Essential Business English",
        description: "Tiếng Anh thương mại cơ bản",
      },
      { name: "Grammar Builder", description: "Củng cố ngữ pháp cơ bản" },
    ];
  } else {
    return [
      {
        name: "TOEIC Beginner",
        description: "Làm quen với kỹ năng Speaking & Writing",
      },
      {
        name: "English for Beginners",
        description: "Tiếng Anh cho người mới bắt đầu",
      },
      { name: "Basic Pronunciation", description: "Cải thiện phát âm cơ bản" },
    ];
  }
};
