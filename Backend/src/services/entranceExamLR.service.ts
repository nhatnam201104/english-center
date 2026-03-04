import { AppError } from "../middleware/errorHandler";
import prisma from "../config/database";
import { PagingData } from "../DTOS/pagination";
import {
  CreateListeningRequest,
  CreateReadingRequest,
  UpdateLRRequest,
  GetLRRequest,
  ListeningResponse,
  ReadingResponse,
  AnswerKeyItem,
  QuestionMCDto,
  GroupCreateRequest,
} from "../DTOS/EntranceExamLR";
import {
  toListeningResponse,
  toReadingResponse,
  mapPartOneQuestions,
  mapPartTwoQuestions,
  mapListeningGroups,
  mapPartFiveQuestions,
  mapReadingGroups,
  mapAnswerKeys,
} from "../utils/Mapper/EntranceExamLR/entranceExamLR.mapper";

/* ════════════════════════════════════════════════════════════════
   COMMON – include relations for summary mapping
   ════════════════════════════════════════════════════════════════ */

const LISTENING_INCLUDE = {
  partOnes: true,
  partTwos: true,
  partThrees: true,
  partFours: true,
  trueAnswers: true,
};

const READING_INCLUDE = {
  partFives: true,
  partSixes: true,
  partSevens: true,
  trueAnswers: true,
};

/* Default TOEIC part directions */
const TOEIC_LISTENING_PARTS = [
  {
    relation: "partOnes",
    direction:
      "For each question in this part, you will hear four statements about a picture in your test book. When you hear the statements, you must select the one statement that best describes what you see in the picture.",
    totalQuestion: 6,
  },
  {
    relation: "partTwos",
    direction:
      "You will hear a question or statement and three responses spoken in English. They will not be printed in your test book and will be spoken only one time. Select the best response to the question or statement.",
    totalQuestion: 25,
  },
  {
    relation: "partThrees",
    direction:
      "You will hear some conversations between two or more people. You will be asked to answer three questions about what the speakers say in each conversation.",
    totalQuestion: 39,
  },
  {
    relation: "partFours",
    direction:
      "You will hear some talks given by a single speaker. You will be asked to answer three questions about what the speaker says in each talk.",
    totalQuestion: 30,
  },
];

const TOEIC_READING_PARTS = [
  {
    relation: "partFives",
    direction:
      "A word or phrase is missing in each of the sentences below. Four answer choices are given below each sentence. Select the best answer to complete the sentence.",
    totalQuestion: 30,
  },
  {
    relation: "partSixes",
    direction:
      "Read the texts that follow. A word, phrase, or sentence is missing in parts of each text. Four answer choices for each question are given below the text. Select the best answer to complete the text.",
    totalQuestion: 16,
  },
  {
    relation: "partSevens",
    direction:
      "In this part you will read a selection of texts, such as magazine and newspaper articles, e-mails, and instant messages. Each text or set of texts is followed by several questions. Select the best answer for each question.",
    totalQuestion: 54,
  },
];

/* ════════════════════════════════════════════════════════════════
   LISTENING CRUD
   ════════════════════════════════════════════════════════════════ */

export const createListeningService = async (
  data: CreateListeningRequest,
): Promise<ListeningResponse> => {
  const exists = await prisma.entranceExamListening.findFirst({
    where: { name: data.name },
  });
  if (exists) {
    throw new AppError("Tên đề thi Listening đã tồn tại", 400);
  }

  try {
    const exam = await prisma.$transaction(async (tx) => {
      const created = await tx.entranceExamListening.create({
        data: { name: data.name, direction: data.direction },
      });

      // Auto-create parts
      await tx.partOne.create({
        data: {
          listeningExamId: created.id,
          direction: TOEIC_LISTENING_PARTS[0].direction,
          totalQuestion: TOEIC_LISTENING_PARTS[0].totalQuestion,
        },
      });
      await tx.partTwo.create({
        data: {
          listeningExamId: created.id,
          direction: TOEIC_LISTENING_PARTS[1].direction,
          totalQuestion: TOEIC_LISTENING_PARTS[1].totalQuestion,
        },
      });
      await tx.partThree.create({
        data: {
          listeningExamId: created.id,
          direction: TOEIC_LISTENING_PARTS[2].direction,
          totalQuestion: TOEIC_LISTENING_PARTS[2].totalQuestion,
        },
      });
      await tx.partFour.create({
        data: {
          listeningExamId: created.id,
          direction: TOEIC_LISTENING_PARTS[3].direction,
          totalQuestion: TOEIC_LISTENING_PARTS[3].totalQuestion,
        },
      });

      return tx.entranceExamListening.findUniqueOrThrow({
        where: { id: created.id },
        include: LISTENING_INCLUDE,
      });
    });

    return toListeningResponse(exam);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi tạo đề thi Listening: " + (error as Error).message,
      500,
    );
  }
};

export const getAllListeningService = async (
  req: GetLRRequest,
): Promise<PagingData<ListeningResponse>> => {
  try {
    const where: any = {};

    if (req.search) {
      where.name = { contains: req.search };
    }
    if (req.isDone !== undefined) {
      where.isDone = req.isDone;
    }
    if (req.isActive !== undefined) {
      where.isActive = req.isActive;
    }

    const totalItems = await prisma.entranceExamListening.count({ where });

    const exams = await prisma.entranceExamListening.findMany({
      where,
      include: LISTENING_INCLUDE,
      take: req.limit,
      skip: req.page && req.limit ? (req.page - 1) * req.limit : undefined,
      orderBy: req.sortBy
        ? { [req.sortBy]: req.sortOrder || "asc" }
        : { createdAt: "desc" },
    });

    return {
      data: exams.map(toListeningResponse),
      page: req.page || 1,
      limit: req.limit || exams.length,
      totalPages: req.limit ? Math.ceil(totalItems / req.limit) : 1,
      totalItems,
    };
  } catch (error) {
    throw new AppError(
      "Lỗi khi lấy danh sách Listening: " + (error as Error).message,
      500,
    );
  }
};

export const getListeningByIdService = async (
  id: number,
): Promise<ListeningResponse> => {
  const exam = await prisma.entranceExamListening.findUnique({
    where: { id },
    include: LISTENING_INCLUDE,
  });
  if (!exam) throw new AppError("Không tìm thấy đề thi Listening", 404);
  return toListeningResponse(exam);
};

export const updateListeningService = async (
  id: number,
  data: UpdateLRRequest,
): Promise<ListeningResponse> => {
  const exam = await prisma.entranceExamListening.findUnique({
    where: { id },
  });
  if (!exam) throw new AppError("Không tìm thấy đề thi Listening", 404);

  if (data.name && data.name !== exam.name) {
    const dup = await prisma.entranceExamListening.findFirst({
      where: { name: data.name },
    });
    if (dup) throw new AppError("Tên đề thi Listening đã tồn tại", 400);
  }

  try {
    const updated = await prisma.entranceExamListening.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.direction !== undefined && { direction: data.direction }),
      },
      include: LISTENING_INCLUDE,
    });
    return toListeningResponse(updated);
  } catch (error) {
    throw new AppError(
      "Lỗi khi cập nhật đề thi Listening: " + (error as Error).message,
      500,
    );
  }
};

export const deleteListeningService = async (id: number): Promise<void> => {
  const exam = await prisma.entranceExamListening.findUnique({
    where: { id },
  });
  if (!exam) throw new AppError("Không tìm thấy đề thi Listening", 404);
  if (exam.isActive) {
    throw new AppError("Không thể xóa đề thi đang Active", 400);
  }

  try {
    await prisma.entranceExamListening.delete({ where: { id } });
  } catch (error) {
    throw new AppError(
      "Lỗi khi xóa đề thi Listening: " + (error as Error).message,
      500,
    );
  }
};

export const activateListeningService = async (
  id: number,
): Promise<ListeningResponse> => {
  const exam = await prisma.entranceExamListening.findUnique({
    where: { id },
    include: LISTENING_INCLUDE,
  });
  if (!exam) throw new AppError("Không tìm thấy đề thi Listening", 404);

  if (!exam.isDone) {
    throw new AppError(
      "Đề thi chưa hoàn thành tất cả các Part. Vui lòng thêm đủ câu hỏi trước khi kích hoạt.",
      400,
    );
  }
  if (exam.trueAnswers.length === 0) {
    throw new AppError(
      "Đề thi chưa có đáp án. Vui lòng thêm đáp án trước khi kích hoạt.",
      400,
    );
  }

  const updated = await prisma.entranceExamListening.update({
    where: { id },
    data: { isActive: !exam.isActive },
    include: LISTENING_INCLUDE,
  });
  return toListeningResponse(updated);
};

/* ════════════════════════════════════════════════════════════════
   READING CRUD
   ════════════════════════════════════════════════════════════════ */

export const createReadingService = async (
  data: CreateReadingRequest,
): Promise<ReadingResponse> => {
  const exists = await prisma.entranceExamReading.findFirst({
    where: { name: data.name },
  });
  if (exists) {
    throw new AppError("Tên đề thi Reading đã tồn tại", 400);
  }

  try {
    const exam = await prisma.$transaction(async (tx) => {
      const created = await tx.entranceExamReading.create({
        data: { name: data.name, direction: data.direction },
      });

      await tx.partFive.create({
        data: {
          readingExamId: created.id,
          direction: TOEIC_READING_PARTS[0].direction,
          totalQuestion: TOEIC_READING_PARTS[0].totalQuestion,
        },
      });
      await tx.partSix.create({
        data: {
          readingExamId: created.id,
          direction: TOEIC_READING_PARTS[1].direction,
          totalQuestion: TOEIC_READING_PARTS[1].totalQuestion,
        },
      });
      await tx.partSeven.create({
        data: {
          readingExamId: created.id,
          direction: TOEIC_READING_PARTS[2].direction,
          totalQuestion: TOEIC_READING_PARTS[2].totalQuestion,
        },
      });

      return tx.entranceExamReading.findUniqueOrThrow({
        where: { id: created.id },
        include: READING_INCLUDE,
      });
    });

    return toReadingResponse(exam);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi tạo đề thi Reading: " + (error as Error).message,
      500,
    );
  }
};

export const getAllReadingService = async (
  req: GetLRRequest,
): Promise<PagingData<ReadingResponse>> => {
  try {
    const where: any = {};

    if (req.search) {
      where.name = { contains: req.search };
    }
    if (req.isDone !== undefined) {
      where.isDone = req.isDone;
    }
    if (req.isActive !== undefined) {
      where.isActive = req.isActive;
    }

    const totalItems = await prisma.entranceExamReading.count({ where });

    const exams = await prisma.entranceExamReading.findMany({
      where,
      include: READING_INCLUDE,
      take: req.limit,
      skip: req.page && req.limit ? (req.page - 1) * req.limit : undefined,
      orderBy: req.sortBy
        ? { [req.sortBy]: req.sortOrder || "asc" }
        : { createdAt: "desc" },
    });

    return {
      data: exams.map(toReadingResponse),
      page: req.page || 1,
      limit: req.limit || exams.length,
      totalPages: req.limit ? Math.ceil(totalItems / req.limit) : 1,
      totalItems,
    };
  } catch (error) {
    throw new AppError(
      "Lỗi khi lấy danh sách Reading: " + (error as Error).message,
      500,
    );
  }
};

export const getReadingByIdService = async (
  id: number,
): Promise<ReadingResponse> => {
  const exam = await prisma.entranceExamReading.findUnique({
    where: { id },
    include: READING_INCLUDE,
  });
  if (!exam) throw new AppError("Không tìm thấy đề thi Reading", 404);
  return toReadingResponse(exam);
};

export const updateReadingService = async (
  id: number,
  data: UpdateLRRequest,
): Promise<ReadingResponse> => {
  const exam = await prisma.entranceExamReading.findUnique({
    where: { id },
  });
  if (!exam) throw new AppError("Không tìm thấy đề thi Reading", 404);

  if (data.name && data.name !== exam.name) {
    const dup = await prisma.entranceExamReading.findFirst({
      where: { name: data.name },
    });
    if (dup) throw new AppError("Tên đề thi Reading đã tồn tại", 400);
  }

  try {
    const updated = await prisma.entranceExamReading.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.direction !== undefined && { direction: data.direction }),
      },
      include: READING_INCLUDE,
    });
    return toReadingResponse(updated);
  } catch (error) {
    throw new AppError(
      "Lỗi khi cập nhật đề thi Reading: " + (error as Error).message,
      500,
    );
  }
};

export const deleteReadingService = async (id: number): Promise<void> => {
  const exam = await prisma.entranceExamReading.findUnique({
    where: { id },
  });
  if (!exam) throw new AppError("Không tìm thấy đề thi Reading", 404);
  if (exam.isActive) {
    throw new AppError("Không thể xóa đề thi đang Active", 400);
  }

  try {
    await prisma.entranceExamReading.delete({ where: { id } });
  } catch (error) {
    throw new AppError(
      "Lỗi khi xóa đề thi Reading: " + (error as Error).message,
      500,
    );
  }
};

export const activateReadingService = async (
  id: number,
): Promise<ReadingResponse> => {
  const exam = await prisma.entranceExamReading.findUnique({
    where: { id },
    include: READING_INCLUDE,
  });
  if (!exam) throw new AppError("Không tìm thấy đề thi Reading", 404);

  if (!exam.isDone) {
    throw new AppError(
      "Đề thi chưa hoàn thành tất cả các Part. Vui lòng thêm đủ câu hỏi trước khi kích hoạt.",
      400,
    );
  }
  if (exam.trueAnswers.length === 0) {
    throw new AppError(
      "Đề thi chưa có đáp án. Vui lòng thêm đáp án trước khi kích hoạt.",
      400,
    );
  }

  const updated = await prisma.entranceExamReading.update({
    where: { id },
    data: { isActive: !exam.isActive },
    include: READING_INCLUDE,
  });
  return toReadingResponse(updated);
};

/* ════════════════════════════════════════════════════════════════
   LISTENING PARTS – Get detail
   ════════════════════════════════════════════════════════════════ */

export const getListeningPartsService = async (examId: number) => {
  const exam = await prisma.entranceExamListening.findUnique({
    where: { id: examId },
    include: {
      partOnes: { include: { questions: { orderBy: { index: "asc" } } } },
      partTwos: { include: { questions: { orderBy: { index: "asc" } } } },
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
  if (!exam) throw new AppError("Không tìm thấy đề thi Listening", 404);

  const partOne = exam.partOnes[0];
  const partTwo = exam.partTwos[0];
  const partThree = exam.partThrees[0];
  const partFour = exam.partFours[0];

  return {
    partOne: partOne
      ? {
          id: partOne.id,
          direction: partOne.direction,
          totalQuestion: partOne.totalQuestion,
          quantityQuestionDone: partOne.quantityQuestionDone,
          isDone: partOne.isDone,
          questions: mapPartOneQuestions(partOne.questions),
        }
      : null,
    partTwo: partTwo
      ? {
          id: partTwo.id,
          direction: partTwo.direction,
          totalQuestion: partTwo.totalQuestion,
          quantityQuestionDone: partTwo.quantityQuestionDone,
          isDone: partTwo.isDone,
          questions: mapPartTwoQuestions(partTwo.questions),
        }
      : null,
    partThree: partThree
      ? {
          id: partThree.id,
          direction: partThree.direction,
          totalQuestion: partThree.totalQuestion,
          quantityQuestionDone: partThree.quantityQuestionDone,
          isDone: partThree.isDone,
          groups: mapListeningGroups(partThree.groups),
        }
      : null,
    partFour: partFour
      ? {
          id: partFour.id,
          direction: partFour.direction,
          totalQuestion: partFour.totalQuestion,
          quantityQuestionDone: partFour.quantityQuestionDone,
          isDone: partFour.isDone,
          groups: mapListeningGroups(partFour.groups),
        }
      : null,
  };
};

/* ════════════════════════════════════════════════════════════════
   READING PARTS – Get detail
   ════════════════════════════════════════════════════════════════ */

export const getReadingPartsService = async (examId: number) => {
  const exam = await prisma.entranceExamReading.findUnique({
    where: { id: examId },
    include: {
      partFives: { include: { questions: { orderBy: { index: "asc" } } } },
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
  if (!exam) throw new AppError("Không tìm thấy đề thi Reading", 404);

  const partFive = exam.partFives[0];
  const partSix = exam.partSixes[0];
  const partSeven = exam.partSevens[0];

  return {
    partFive: partFive
      ? {
          id: partFive.id,
          direction: partFive.direction,
          totalQuestion: partFive.totalQuestion,
          quantityQuestionDone: partFive.quantityQuestionDone,
          isDone: partFive.isDone,
          questions: mapPartFiveQuestions(partFive.questions),
        }
      : null,
    partSix: partSix
      ? {
          id: partSix.id,
          direction: partSix.direction,
          totalQuestion: partSix.totalQuestion,
          quantityQuestionDone: partSix.quantityQuestionDone,
          isDone: partSix.isDone,
          groups: mapReadingGroups(partSix.groups),
        }
      : null,
    partSeven: partSeven
      ? {
          id: partSeven.id,
          direction: partSeven.direction,
          totalQuestion: partSeven.totalQuestion,
          quantityQuestionDone: partSeven.quantityQuestionDone,
          isDone: partSeven.isDone,
          groups: mapReadingGroups(partSeven.groups),
        }
      : null,
  };
};

/* ════════════════════════════════════════════════════════════════
   UPDATE PART DIRECTION
   ════════════════════════════════════════════════════════════════ */

type PartModel =
  | "partOne"
  | "partTwo"
  | "partThree"
  | "partFour"
  | "partFive"
  | "partSix"
  | "partSeven";

const PART_MODEL_MAP: Record<number, PartModel> = {
  1: "partOne",
  2: "partTwo",
  3: "partThree",
  4: "partFour",
  5: "partFive",
  6: "partSix",
  7: "partSeven",
};

export const updatePartDirectionService = async (
  partNo: number,
  partId: number,
  direction: string,
) => {
  const model = PART_MODEL_MAP[partNo];
  if (!model) throw new AppError("Số Part không hợp lệ (1-7)", 400);

  const prismaModel = (prisma as any)[model];

  const part = await prismaModel.findUnique({ where: { id: partId } });
  if (!part)
    throw new AppError(`Không tìm thấy Part ${partNo} với id ${partId}`, 404);

  const updated = await prismaModel.update({
    where: { id: partId },
    data: { direction },
  });

  return updated;
};

/* ════════════════════════════════════════════════════════════════
   ADD QUESTIONS – Part 1 (individual, audio + image)
   ════════════════════════════════════════════════════════════════ */

export const addPartOneQuestionService = async (
  partId: number,
  data: { index: number; question?: string; audio: string; image: string },
) => {
  return prisma.$transaction(async (tx) => {
    const part = await tx.partOne.findUnique({ where: { id: partId } });
    if (!part) throw new AppError("Không tìm thấy Part 1", 404);

    if (part.quantityQuestionDone >= part.totalQuestion) {
      throw new AppError(
        `Part 1 đã đủ ${part.totalQuestion} câu hỏi`,
        400,
      );
    }

    // Check duplicate index
    const dup = await tx.partOneQuestion.findFirst({
      where: { partOneId: partId, index: data.index },
    });
    if (dup)
      throw new AppError(
        `Câu hỏi index ${data.index} đã tồn tại trong Part 1`,
        400,
      );

    const question = await tx.partOneQuestion.create({
      data: {
        partOneId: partId,
        index: data.index,
        question: data.question ?? "",
        audio: data.audio,
        image: data.image,
      },
    });

    const newCount = part.quantityQuestionDone + 1;
    const isDone = newCount >= part.totalQuestion;

    await tx.partOne.update({
      where: { id: partId },
      data: { quantityQuestionDone: newCount, isDone },
    });

    // If part is done, check if ALL parts are done → update exam isDone
    if (isDone) {
      await checkAndUpdateListeningIsDone(tx, part.listeningExamId);
    }

    return question;
  });
};

/* ════════════════════════════════════════════════════════════════
   ADD QUESTIONS – Part 2 (individual, audio only)
   ════════════════════════════════════════════════════════════════ */

export const addPartTwoQuestionService = async (
  partId: number,
  data: { index: number; question: string; audio: string },
) => {
  return prisma.$transaction(async (tx) => {
    const part = await tx.partTwo.findUnique({ where: { id: partId } });
    if (!part) throw new AppError("Không tìm thấy Part 2", 404);

    if (part.quantityQuestionDone >= part.totalQuestion) {
      throw new AppError(
        `Part 2 đã đủ ${part.totalQuestion} câu hỏi`,
        400,
      );
    }

    const dup = await tx.partTwoQuestion.findFirst({
      where: { partTwoId: partId, index: data.index },
    });
    if (dup)
      throw new AppError(
        `Câu hỏi index ${data.index} đã tồn tại trong Part 2`,
        400,
      );

    const question = await tx.partTwoQuestion.create({
      data: {
        partTwoId: partId,
        index: data.index,
        question: data.question,
        audio: data.audio,
      },
    });

    const newCount = part.quantityQuestionDone + 1;
    const isDone = newCount >= part.totalQuestion;

    await tx.partTwo.update({
      where: { id: partId },
      data: { quantityQuestionDone: newCount, isDone },
    });

    if (isDone) {
      await checkAndUpdateListeningIsDone(tx, part.listeningExamId);
    }

    return question;
  });
};

/* ════════════════════════════════════════════════════════════════
   ADD GROUP – Part 3 (group with audio + MC questions)
   ════════════════════════════════════════════════════════════════ */

export const addPartThreeGroupService = async (
  partId: number,
  data: GroupCreateRequest,
) => {
  return prisma.$transaction(async (tx) => {
    const part = await tx.partThree.findUnique({ where: { id: partId } });
    if (!part) throw new AppError("Không tìm thấy Part 3", 404);

    const questionsCount = data.questions.length;
    if (part.quantityQuestionDone + questionsCount > part.totalQuestion) {
      throw new AppError(
        `Thêm ${questionsCount} câu sẽ vượt tổng ${part.totalQuestion} câu (hiện có ${part.quantityQuestionDone})`,
        400,
      );
    }

    const group = await tx.partThreeGroup.create({
      data: {
        partThreeId: partId,
        index: data.index,
        audio: data.audio!,
        image: data.image ?? null,
        fromQuestionIndex: data.fromQuestionIndex,
        toQuestionIndex: data.toQuestionIndex,
        questions: {
          create: data.questions.map((q) => ({
            index: q.index,
            question: q.question,
            answerA: q.answerA,
            answerB: q.answerB,
            answerC: q.answerC,
            answerD: q.answerD,
          })),
        },
      },
      include: { questions: true },
    });

    const newCount = part.quantityQuestionDone + questionsCount;
    const isDone = newCount >= part.totalQuestion;

    await tx.partThree.update({
      where: { id: partId },
      data: { quantityQuestionDone: newCount, isDone },
    });

    if (isDone) {
      await checkAndUpdateListeningIsDone(tx, part.listeningExamId);
    }

    return group;
  });
};

/* ════════════════════════════════════════════════════════════════
   ADD GROUP – Part 4 (group with audio + MC questions)
   ════════════════════════════════════════════════════════════════ */

export const addPartFourGroupService = async (
  partId: number,
  data: GroupCreateRequest,
) => {
  return prisma.$transaction(async (tx) => {
    const part = await tx.partFour.findUnique({ where: { id: partId } });
    if (!part) throw new AppError("Không tìm thấy Part 4", 404);

    const questionsCount = data.questions.length;
    if (part.quantityQuestionDone + questionsCount > part.totalQuestion) {
      throw new AppError(
        `Thêm ${questionsCount} câu sẽ vượt tổng ${part.totalQuestion} câu (hiện có ${part.quantityQuestionDone})`,
        400,
      );
    }

    const group = await tx.partFourGroup.create({
      data: {
        partFourId: partId,
        index: data.index,
        audio: data.audio!,
        image: data.image ?? null,
        fromQuestionIndex: data.fromQuestionIndex,
        toQuestionIndex: data.toQuestionIndex,
        questions: {
          create: data.questions.map((q) => ({
            index: q.index,
            question: q.question,
            answerA: q.answerA,
            answerB: q.answerB,
            answerC: q.answerC,
            answerD: q.answerD,
          })),
        },
      },
      include: { questions: true },
    });

    const newCount = part.quantityQuestionDone + questionsCount;
    const isDone = newCount >= part.totalQuestion;

    await tx.partFour.update({
      where: { id: partId },
      data: { quantityQuestionDone: newCount, isDone },
    });

    if (isDone) {
      await checkAndUpdateListeningIsDone(tx, part.listeningExamId);
    }

    return group;
  });
};

/* ════════════════════════════════════════════════════════════════
   ADD QUESTIONS – Part 5 (standalone MC, no media)
   ════════════════════════════════════════════════════════════════ */

export const addPartFiveQuestionService = async (
  partId: number,
  data: QuestionMCDto,
) => {
  return prisma.$transaction(async (tx) => {
    const part = await tx.partFive.findUnique({ where: { id: partId } });
    if (!part) throw new AppError("Không tìm thấy Part 5", 404);

    if (part.quantityQuestionDone >= part.totalQuestion) {
      throw new AppError(
        `Part 5 đã đủ ${part.totalQuestion} câu hỏi`,
        400,
      );
    }

    const dup = await tx.partFiveQuestion.findFirst({
      where: { partFiveId: partId, index: data.index },
    });
    if (dup)
      throw new AppError(
        `Câu hỏi index ${data.index} đã tồn tại trong Part 5`,
        400,
      );

    const question = await tx.partFiveQuestion.create({
      data: {
        partFiveId: partId,
        index: data.index,
        question: data.question,
        answerA: data.answerA,
        answerB: data.answerB,
        answerC: data.answerC,
        answerD: data.answerD,
      },
    });

    const newCount = part.quantityQuestionDone + 1;
    const isDone = newCount >= part.totalQuestion;

    await tx.partFive.update({
      where: { id: partId },
      data: { quantityQuestionDone: newCount, isDone },
    });

    if (isDone) {
      await checkAndUpdateReadingIsDone(tx, part.readingExamId);
    }

    return question;
  });
};

/* ════════════════════════════════════════════════════════════════
   ADD GROUP – Part 6 (passage group + MC questions)
   ════════════════════════════════════════════════════════════════ */

export const addPartSixGroupService = async (
  partId: number,
  data: GroupCreateRequest,
) => {
  return prisma.$transaction(async (tx) => {
    const part = await tx.partSix.findUnique({ where: { id: partId } });
    if (!part) throw new AppError("Không tìm thấy Part 6", 404);

    const questionsCount = data.questions.length;
    if (part.quantityQuestionDone + questionsCount > part.totalQuestion) {
      throw new AppError(
        `Thêm ${questionsCount} câu sẽ vượt tổng ${part.totalQuestion} câu (hiện có ${part.quantityQuestionDone})`,
        400,
      );
    }

    const group = await tx.partSixGroup.create({
      data: {
        partSixId: partId,
        index: data.index,
        question: data.question ?? null,
        image: data.image ?? null,
        fromQuestionIndex: data.fromQuestionIndex,
        toQuestionIndex: data.toQuestionIndex,
        questions: {
          create: data.questions.map((q) => ({
            index: q.index,
            question: q.question,
            answerA: q.answerA,
            answerB: q.answerB,
            answerC: q.answerC,
            answerD: q.answerD,
          })),
        },
      },
      include: { questions: true },
    });

    const newCount = part.quantityQuestionDone + questionsCount;
    const isDone = newCount >= part.totalQuestion;

    await tx.partSix.update({
      where: { id: partId },
      data: { quantityQuestionDone: newCount, isDone },
    });

    if (isDone) {
      await checkAndUpdateReadingIsDone(tx, part.readingExamId);
    }

    return group;
  });
};

/* ════════════════════════════════════════════════════════════════
   ADD GROUP – Part 7 (passage group + MC questions)
   ════════════════════════════════════════════════════════════════ */

export const addPartSevenGroupService = async (
  partId: number,
  data: GroupCreateRequest,
) => {
  return prisma.$transaction(async (tx) => {
    const part = await tx.partSeven.findUnique({ where: { id: partId } });
    if (!part) throw new AppError("Không tìm thấy Part 7", 404);

    const questionsCount = data.questions.length;
    if (part.quantityQuestionDone + questionsCount > part.totalQuestion) {
      throw new AppError(
        `Thêm ${questionsCount} câu sẽ vượt tổng ${part.totalQuestion} câu (hiện có ${part.quantityQuestionDone})`,
        400,
      );
    }

    const group = await tx.partSevenGroup.create({
      data: {
        partSevenId: partId,
        index: data.index,
        question: data.question ?? null,
        image: data.image ?? null,
        fromQuestionIndex: data.fromQuestionIndex,
        toQuestionIndex: data.toQuestionIndex,
        questions: {
          create: data.questions.map((q) => ({
            index: q.index,
            question: q.question,
            answerA: q.answerA,
            answerB: q.answerB,
            answerC: q.answerC,
            answerD: q.answerD,
          })),
        },
      },
      include: { questions: true },
    });

    const newCount = part.quantityQuestionDone + questionsCount;
    const isDone = newCount >= part.totalQuestion;

    await tx.partSeven.update({
      where: { id: partId },
      data: { quantityQuestionDone: newCount, isDone },
    });

    if (isDone) {
      await checkAndUpdateReadingIsDone(tx, part.readingExamId);
    }

    return group;
  });
};

/* ════════════════════════════════════════════════════════════════
   ANSWER KEY
   ════════════════════════════════════════════════════════════════ */

export const getListeningAnswerKeyService = async (examId: number) => {
  const exam = await prisma.entranceExamListening.findUnique({
    where: { id: examId },
  });
  if (!exam) throw new AppError("Không tìm thấy đề thi Listening", 404);

  const answers = await prisma.entranceExamListeningTrueAnswer.findMany({
    where: { entranceExamListeningId: examId },
    orderBy: { index: "asc" },
  });
  return mapAnswerKeys(answers);
};

export const saveListeningAnswerKeyService = async (
  examId: number,
  answers: AnswerKeyItem[],
) => {
  const exam = await prisma.entranceExamListening.findUnique({
    where: { id: examId },
  });
  if (!exam) throw new AppError("Không tìm thấy đề thi Listening", 404);

  return prisma.$transaction(async (tx) => {
    // Delete existing answers
    await tx.entranceExamListeningTrueAnswer.deleteMany({
      where: { entranceExamListeningId: examId },
    });

    // Bulk create
    await tx.entranceExamListeningTrueAnswer.createMany({
      data: answers.map((a) => ({
        entranceExamListeningId: examId,
        index: Number(a.index),
        answer: a.answer,
      })),
    });

    const saved = await tx.entranceExamListeningTrueAnswer.findMany({
      where: { entranceExamListeningId: examId },
      orderBy: { index: "asc" },
    });
    return mapAnswerKeys(saved);
  });
};

export const getReadingAnswerKeyService = async (examId: number) => {
  const exam = await prisma.entranceExamReading.findUnique({
    where: { id: examId },
  });
  if (!exam) throw new AppError("Không tìm thấy đề thi Reading", 404);

  const answers = await prisma.entranceExamReadingTrueAnswer.findMany({
    where: { entranceExamReadingId: examId },
    orderBy: { index: "asc" },
  });
  return mapAnswerKeys(answers);
};

export const saveReadingAnswerKeyService = async (
  examId: number,
  answers: AnswerKeyItem[],
) => {
  const exam = await prisma.entranceExamReading.findUnique({
    where: { id: examId },
  });
  if (!exam) throw new AppError("Không tìm thấy đề thi Reading", 404);

  return prisma.$transaction(async (tx) => {
    await tx.entranceExamReadingTrueAnswer.deleteMany({
      where: { entranceExamReadingId: examId },
    });

    await tx.entranceExamReadingTrueAnswer.createMany({
      data: answers.map((a) => ({
        entranceExamReadingId: examId,
        index: Number(a.index),
        answer: a.answer,
      })),
    });

    const saved = await tx.entranceExamReadingTrueAnswer.findMany({
      where: { entranceExamReadingId: examId },
      orderBy: { index: "asc" },
    });
    return mapAnswerKeys(saved);
  });
};

/* ════════════════════════════════════════════════════════════════
   DELETE QUESTION / GROUP
   ════════════════════════════════════════════════════════════════ */

export const deletePartOneQuestionService = async (questionId: number) => {
  return prisma.$transaction(async (tx) => {
    const q = await tx.partOneQuestion.findUnique({
      where: { id: questionId },
    });
    if (!q) throw new AppError("Không tìm thấy câu hỏi Part 1", 404);

    await tx.partOneQuestion.delete({ where: { id: questionId } });

    const part = await tx.partOne.findUnique({ where: { id: q.partOneId } });
    if (part) {
      const newCount = Math.max(0, part.quantityQuestionDone - 1);
      await tx.partOne.update({
        where: { id: part.id },
        data: { quantityQuestionDone: newCount, isDone: false },
      });
      await tx.entranceExamListening.update({
        where: { id: part.listeningExamId },
        data: { isDone: false },
      });
    }
  });
};

export const deletePartTwoQuestionService = async (questionId: number) => {
  return prisma.$transaction(async (tx) => {
    const q = await tx.partTwoQuestion.findUnique({
      where: { id: questionId },
    });
    if (!q) throw new AppError("Không tìm thấy câu hỏi Part 2", 404);

    await tx.partTwoQuestion.delete({ where: { id: questionId } });

    const part = await tx.partTwo.findUnique({ where: { id: q.partTwoId } });
    if (part) {
      const newCount = Math.max(0, part.quantityQuestionDone - 1);
      await tx.partTwo.update({
        where: { id: part.id },
        data: { quantityQuestionDone: newCount, isDone: false },
      });
      await tx.entranceExamListening.update({
        where: { id: part.listeningExamId },
        data: { isDone: false },
      });
    }
  });
};

export const deletePartThreeGroupService = async (groupId: number) => {
  return prisma.$transaction(async (tx) => {
    const g = await tx.partThreeGroup.findUnique({
      where: { id: groupId },
      include: { questions: true },
    });
    if (!g) throw new AppError("Không tìm thấy nhóm Part 3", 404);

    await tx.partThreeGroup.delete({ where: { id: groupId } });

    const part = await tx.partThree.findUnique({
      where: { id: g.partThreeId },
    });
    if (part) {
      const newCount = Math.max(
        0,
        part.quantityQuestionDone - g.questions.length,
      );
      await tx.partThree.update({
        where: { id: part.id },
        data: { quantityQuestionDone: newCount, isDone: false },
      });
      await tx.entranceExamListening.update({
        where: { id: part.listeningExamId },
        data: { isDone: false },
      });
    }
  });
};

export const deletePartFourGroupService = async (groupId: number) => {
  return prisma.$transaction(async (tx) => {
    const g = await tx.partFourGroup.findUnique({
      where: { id: groupId },
      include: { questions: true },
    });
    if (!g) throw new AppError("Không tìm thấy nhóm Part 4", 404);

    await tx.partFourGroup.delete({ where: { id: groupId } });

    const part = await tx.partFour.findUnique({
      where: { id: g.partFourId },
    });
    if (part) {
      const newCount = Math.max(
        0,
        part.quantityQuestionDone - g.questions.length,
      );
      await tx.partFour.update({
        where: { id: part.id },
        data: { quantityQuestionDone: newCount, isDone: false },
      });
      await tx.entranceExamListening.update({
        where: { id: part.listeningExamId },
        data: { isDone: false },
      });
    }
  });
};

export const deletePartFiveQuestionService = async (questionId: number) => {
  return prisma.$transaction(async (tx) => {
    const q = await tx.partFiveQuestion.findUnique({
      where: { id: questionId },
    });
    if (!q) throw new AppError("Không tìm thấy câu hỏi Part 5", 404);

    await tx.partFiveQuestion.delete({ where: { id: questionId } });

    const part = await tx.partFive.findUnique({
      where: { id: q.partFiveId },
    });
    if (part) {
      const newCount = Math.max(0, part.quantityQuestionDone - 1);
      await tx.partFive.update({
        where: { id: part.id },
        data: { quantityQuestionDone: newCount, isDone: false },
      });
      await tx.entranceExamReading.update({
        where: { id: part.readingExamId },
        data: { isDone: false },
      });
    }
  });
};

export const deletePartSixGroupService = async (groupId: number) => {
  return prisma.$transaction(async (tx) => {
    const g = await tx.partSixGroup.findUnique({
      where: { id: groupId },
      include: { questions: true },
    });
    if (!g) throw new AppError("Không tìm thấy nhóm Part 6", 404);

    await tx.partSixGroup.delete({ where: { id: groupId } });

    const part = await tx.partSix.findUnique({
      where: { id: g.partSixId },
    });
    if (part) {
      const newCount = Math.max(
        0,
        part.quantityQuestionDone - g.questions.length,
      );
      await tx.partSix.update({
        where: { id: part.id },
        data: { quantityQuestionDone: newCount, isDone: false },
      });
      await tx.entranceExamReading.update({
        where: { id: part.readingExamId },
        data: { isDone: false },
      });
    }
  });
};

export const deletePartSevenGroupService = async (groupId: number) => {
  return prisma.$transaction(async (tx) => {
    const g = await tx.partSevenGroup.findUnique({
      where: { id: groupId },
      include: { questions: true },
    });
    if (!g) throw new AppError("Không tìm thấy nhóm Part 7", 404);

    await tx.partSevenGroup.delete({ where: { id: groupId } });

    const part = await tx.partSeven.findUnique({
      where: { id: g.partSevenId },
    });
    if (part) {
      const newCount = Math.max(
        0,
        part.quantityQuestionDone - g.questions.length,
      );
      await tx.partSeven.update({
        where: { id: part.id },
        data: { quantityQuestionDone: newCount, isDone: false },
      });
      await tx.entranceExamReading.update({
        where: { id: part.readingExamId },
        data: { isDone: false },
      });
    }
  });
};

/* ════════════════════════════════════════════════════════════════
   HELPERS – Check all parts done → update exam isDone
   ════════════════════════════════════════════════════════════════ */

async function checkAndUpdateListeningIsDone(tx: any, examId: number) {
  const p1 = await tx.partOne.findFirst({
    where: { listeningExamId: examId },
  });
  const p2 = await tx.partTwo.findFirst({
    where: { listeningExamId: examId },
  });
  const p3 = await tx.partThree.findFirst({
    where: { listeningExamId: examId },
  });
  const p4 = await tx.partFour.findFirst({
    where: { listeningExamId: examId },
  });

  const allDone =
    p1?.isDone && p2?.isDone && p3?.isDone && p4?.isDone;

  if (allDone) {
    await tx.entranceExamListening.update({
      where: { id: examId },
      data: { isDone: true },
    });
  }
}

async function checkAndUpdateReadingIsDone(tx: any, examId: number) {
  const p5 = await tx.partFive.findFirst({
    where: { readingExamId: examId },
  });
  const p6 = await tx.partSix.findFirst({
    where: { readingExamId: examId },
  });
  const p7 = await tx.partSeven.findFirst({
    where: { readingExamId: examId },
  });

  const allDone = p5?.isDone && p6?.isDone && p7?.isDone;

  if (allDone) {
    await tx.entranceExamReading.update({
      where: { id: examId },
      data: { isDone: true },
    });
  }
}
