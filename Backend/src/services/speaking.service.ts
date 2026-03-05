import { AppError } from "../middleware/errorHandler";
import prisma from "../config/database";
import { SpeakingResponse } from "../DTOS/Speaking";
import { PagingData } from "../DTOS/pagination";
import {
  CreateSpeakingRequest,
  UpdateSpeakingRequest,
} from "../DTOS/Speaking";
import { deleteOldFiles } from "../utils/dataCoercion";
import { buildSpeakingImageUrl } from "../utils/fileUrl";

// ==================== MAIN EXAM ====================

// Create Speaking Exam
export const createSpeakingService = async (
  data: CreateSpeakingRequest,
): Promise<SpeakingResponse> => {
  try {
    const speaking = await prisma.entranceExamSpeaking.create({
      data: {
        name: data.name,
        isActive: data.isActive !== undefined ? data.isActive : false,
      },
    });

    return toSpeakingResponse(speaking);
  } catch (error) {
    if ((error as any).code === 'P2002') {
      throw new AppError("Tên đề thi đã tồn tại", 400);
    }
    throw new AppError(
      "Lỗi khi tạo đề thi Speaking: " + (error as Error).message,
      500,
    );
  }
};

// Get all Speaking Exams with pagination
export const getAllSpeakingService = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
): Promise<PagingData<SpeakingResponse>> => {
  try {
    const where: any = {};

    if (search) {
      where.OR = [{ name: { contains: search } }];
    }

    const totalItems = await prisma.entranceExamSpeaking.count({ where });

    const speakingExams = await prisma.entranceExamSpeaking.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: "desc" },
    });

    return {
      data: speakingExams.map(toSpeakingResponse),
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    };
  } catch (error) {
    throw new AppError(
      "Lỗi khi lấy danh sách đề thi Speaking: " + (error as Error).message,
      500,
    );
  }
};

// Get Speaking Exam by ID with all parts
export const getSpeakingByIdService = async (
  id: number,
): Promise<SpeakingResponse> => {
  try {
    const speaking = await prisma.entranceExamSpeaking.findUnique({
      where: { id },
      include: {
        speakingOneTwos: {
          orderBy: { index: 'asc' },
        },
        speakingThreeFours: {
          orderBy: { index: 'asc' },
        },
        speakingFiveToSevens: {
          orderBy: { index: 'asc' },
        },
        speakingEightToTens: {
          orderBy: { index: 'asc' },
        },
        speakingElevens: {
          orderBy: { index: 'asc' },
        },
      },
    });

    if (!speaking) {
      throw new AppError("Không tìm thấy đề thi Speaking", 404);
    }

    return toSpeakingResponseWithParts(speaking);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi lấy thông tin đề thi Speaking: " + (error as Error).message,
      500,
    );
  }
};

// Update Speaking Exam
export const updateSpeakingService = async (
  id: number,
  data: UpdateSpeakingRequest,
): Promise<SpeakingResponse> => {
  try {
    const speaking = await prisma.entranceExamSpeaking.findUnique({
      where: { id },
    });

    if (!speaking) {
      throw new AppError("Không tìm thấy đề thi Speaking", 404);
    }

    if (data.name && data.name !== speaking.name) {
      const existing = await prisma.entranceExamSpeaking.findFirst({
        where: { name: data.name },
      });
      if (existing && existing.id !== id) {
        throw new AppError("Tên đề thi đã tồn tại", 400);
      }
    }

    const updated = await prisma.entranceExamSpeaking.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return toSpeakingResponse(updated);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi cập nhật đề thi Speaking: " + (error as Error).message,
      500,
    );
  }
};

// Toggle Active Status
export const toggleActiveSpeakingService = async (
  id: number,
): Promise<SpeakingResponse> => {
  try {
    const speaking = await prisma.entranceExamSpeaking.findUnique({
      where: { id },
    });

    if (!speaking) {
      throw new AppError("Không tìm thấy đề thi Speaking", 404);
    }

    const updated = await prisma.entranceExamSpeaking.update({
      where: { id },
      data: { isActive: !speaking.isActive },
    });

    return toSpeakingResponse(updated);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi cập nhật trạng thái đề thi Speaking: " + (error as Error).message,
      500,
    );
  }
};

// Delete Speaking Exam
export const deleteSpeakingService = async (id: number): Promise<void> => {
  try {
    const speaking = await prisma.entranceExamSpeaking.findUnique({
      where: { id },
    });

    if (!speaking) {
      throw new AppError("Không tìm thấy đề thi Speaking", 404);
    }

    await prisma.$transaction(async (tx) => {
      // Delete all related parts
      await tx.speakingOneTwo.deleteMany({ where: { speakingExamId: id } });
      await tx.speakingThreeFour.deleteMany({ where: { speakingExamId: id } });
      await tx.speakingFiveToSeven.deleteMany({ where: { speakingExamId: id } });
      await tx.speakingEightToTen.deleteMany({ where: { speakingExamId: id } });
      await tx.speakingEleven.deleteMany({ where: { speakingExamId: id } });

      // Delete exam
      await tx.entranceExamSpeaking.delete({ where: { id } });
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi xóa đề thi Speaking: " + (error as Error).message,
      500,
    );
  }
};

// ==================== PART 1 (SpeakingOneTwo) - Read a Text Aloud ====================

export const upsertSpeakingPart1Service = async (
  speakingExamId: number,
  data: any,
): Promise<any> => {
  try {
    const speaking = await prisma.entranceExamSpeaking.findUnique({
      where: { id: speakingExamId },
    });

    if (!speaking) {
      throw new AppError("Không tìm thấy đề thi Speaking", 404);
    }

    const result = await prisma.speakingOneTwo.upsert({
      where: { speakingExamId_index: { speakingExamId, index: 1 } },
      update: {
        ...(data.questionOne !== undefined && { questionOne: data.questionOne }),
        ...(data.questionTwo !== undefined && { questionTwo: data.questionTwo }),
      },
      create: {
        speakingExamId,
        questionOne: data.questionOne,
        questionTwo: data.questionTwo,
      },
    });

    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi upsert Part 1 Speaking: " + (error as Error).message,
      500,
    );
  }
};

export const getSpeakingPart1ByExamIdService = async (speakingExamId: number): Promise<any[]> => {
  try {
    const parts = await prisma.speakingOneTwo.findMany({
      where: { speakingExamId },
      orderBy: { index: 'asc' },
    });
    return parts;
  } catch (error) {
    throw new AppError(
      "Lỗi khi lấy Part 1 Speaking: " + (error as Error).message,
      500,
    );
  }
};

export const deleteSpeakingPart1Service = async (
  speakingExamId: number,
): Promise<void> => {
  try {
    const existing = await prisma.speakingOneTwo.findFirst({
      where: { speakingExamId, index: 1 },
    });

    if (!existing) {
      throw new AppError(`Không tìm thấy Part 1 Speaking`, 404);
    }

    await prisma.speakingOneTwo.delete({
      where: { id: existing.id },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi xóa Part 1 Speaking: " + (error as Error).message,
      500,
    );
  }
};

// ==================== PART 2 (SpeakingThreeFour) - Describe a Picture ====================

export const upsertSpeakingPart2Service = async (
  speakingExamId: number,
  data: any,
): Promise<any> => {
  try {
    // 1. Check if speaking exam exists
    const speaking = await prisma.entranceExamSpeaking.findUnique({
      where: { id: speakingExamId },
    });

    if (!speaking) {
      throw new AppError("Không tìm thấy đề thi Speaking", 404);
    }

    // 2. Fetch existing record
    const existing = await prisma.speakingThreeFour.findUnique({
      where: { speakingExamId_index: { speakingExamId, index: 2 } },
    });

    // 3. Prepare final data with merge logic
    let finalData: any;

    if (existing) {
      // UPDATE: Merge old + new data (preserve images not sent in request)
      finalData = {
        imageThree: data.imageThree ?? existing.imageThree,
        imageFour: data.imageFour ?? existing.imageFour,
      };

      // Delete old files only if they are being replaced
      const filesToDelete: string[] = [];
      if (data.imageThree && existing.imageThree && data.imageThree !== existing.imageThree) {
        filesToDelete.push(existing.imageThree);
      }
      if (data.imageFour && existing.imageFour && data.imageFour !== existing.imageFour) {
        filesToDelete.push(existing.imageFour);
      }
      await deleteOldFiles(filesToDelete);
    } else {
      // CREATE: Validate all required fields
      if (!data.imageThree || !data.imageFour) {
        throw new AppError("Khi tạo mới, phải cung cấp cả 2 ảnh (Câu 3 và Câu 4)", 400);
      }
      finalData = {
        imageThree: data.imageThree,
        imageFour: data.imageFour,
      };
    }

    // 4. Execute upsert with prepared data
    const result = await prisma.speakingThreeFour.upsert({
      where: { speakingExamId_index: { speakingExamId, index: 2 } },
      update: finalData,
      create: {
        speakingExam: { connect: { id: speakingExamId } },
        ...finalData,
      },
    });

    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi upsert Part 2 Speaking: " + (error as Error).message,
      500,
    );
  }
};

export const getSpeakingPart2ByExamIdService = async (speakingExamId: number): Promise<any[]> => {
  try {
    const parts = await prisma.speakingThreeFour.findMany({
      where: { speakingExamId },
      orderBy: { index: 'asc' },
    });
    // Build URL for images
    return parts.map((part) => ({
      ...part,
      imageThree: buildSpeakingImageUrl(part.imageThree),
      imageFour: buildSpeakingImageUrl(part.imageFour),
    }));
  } catch (error) {
    throw new AppError(
      "Lỗi khi lấy Part 2 Speaking: " + (error as Error).message,
      500,
    );
  }
};

export const deleteSpeakingPart2Service = async (
  speakingExamId: number,
): Promise<void> => {
  try {
    const existing = await prisma.speakingThreeFour.findFirst({
      where: { speakingExamId, index: 2 },
    });

    if (!existing) {
      throw new AppError(`Không tìm thấy Part 2 Speaking`, 404);
    }

    const filesToDelete = [
      existing.imageThree,
      existing.imageFour,
    ].filter(Boolean);
    
    await deleteOldFiles(filesToDelete);

    await prisma.speakingThreeFour.delete({
      where: { id: existing.id },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi xóa Part 2 Speaking: " + (error as Error).message,
      500,
    );
  }
};

// ==================== PART 3 (SpeakingFiveToSeven) - Respond to Questions ====================

export const upsertSpeakingPart3Service = async (
  speakingExamId: number,
  data: any,
): Promise<any> => {
  try {
    const speaking = await prisma.entranceExamSpeaking.findUnique({
      where: { id: speakingExamId },
    });

    if (!speaking) {
      throw new AppError("Không tìm thấy đề thi Speaking", 404);
    }

    const result = await prisma.speakingFiveToSeven.upsert({
      where: { speakingExamId_index: { speakingExamId, index: 3 } },
      update: {
        ...(data.passage !== undefined && { passage: data.passage }),
        ...(data.questionFive !== undefined && { questionFive: data.questionFive }),
        ...(data.questionSix !== undefined && { questionSix: data.questionSix }),
        ...(data.questionSeven !== undefined && { questionSeven: data.questionSeven }),
      },
      create: {
        speakingExamId,
        passage: data.passage,
        questionFive: data.questionFive,
        questionSix: data.questionSix,
        questionSeven: data.questionSeven,
      },
    });

    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi upsert Part 3 Speaking: " + (error as Error).message,
      500,
    );
  }
};

export const getSpeakingPart3ByExamIdService = async (speakingExamId: number): Promise<any[]> => {
  try {
    const parts = await prisma.speakingFiveToSeven.findMany({
      where: { speakingExamId },
      orderBy: { index: 'asc' },
    });
    return parts;
  } catch (error) {
    throw new AppError(
      "Lỗi khi lấy Part 3 Speaking: " + (error as Error).message,
      500,
    );
  }
};

export const deleteSpeakingPart3Service = async (
  speakingExamId: number,
): Promise<void> => {
  try {
    const existing = await prisma.speakingFiveToSeven.findFirst({
      where: { speakingExamId, index: 3 },
    });

    if (!existing) {
      throw new AppError(`Không tìm thấy Part 3 Speaking`, 404);
    }

    await prisma.speakingFiveToSeven.delete({
      where: { id: existing.id },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi xóa Part 3 Speaking: " + (error as Error).message,
      500,
    );
  }
};

// ==================== PART 4 (SpeakingEightToTen) - Respond to Questions using Information Provided ====================

export const upsertSpeakingPart4Service = async (
  speakingExamId: number,
  data: any,
): Promise<any> => {
  try {
    // 1. Check if speaking exam exists
    const speaking = await prisma.entranceExamSpeaking.findUnique({
      where: { id: speakingExamId },
    });

    if (!speaking) {
      throw new AppError("Không tìm thấy đề thi Speaking", 404);
    }

    // 2. Fetch existing record
    const existing = await prisma.speakingEightToTen.findUnique({
      where: { speakingExamId_index: { speakingExamId, index: 4 } },
    });

    // 3. Prepare final data with merge logic
    let finalData: any;

    if (existing) {
      // UPDATE: Merge old + new data (preserve fields not sent in request)
      finalData = {
        passage: data.passage ?? existing.passage,
        questionEight: data.questionEight ?? existing.questionEight,
        questionNine: data.questionNine ?? existing.questionNine,
        questionTen: data.questionTen ?? existing.questionTen,
        image: data.image ?? existing.image,
      };

      // Delete old image file only if it's being replaced
      const filesToDelete: string[] = [];
      if (data.image && existing.image && data.image !== existing.image) {
        filesToDelete.push(existing.image);
      }
      await deleteOldFiles(filesToDelete);
    } else {
      // CREATE: At least one field is required (image is optional)
      if (!data.passage && !data.questionEight && !data.questionNine && !data.questionTen && !data.image) {
        throw new AppError("Khi tạo mới, phải cung cấp ít nhất một trường dữ liệu", 400);
      }
      finalData = {
        passage: data.passage,
        questionEight: data.questionEight,
        questionNine: data.questionNine,
        questionTen: data.questionTen,
        image: data.image,
      };
    }

    // 4. Execute upsert with prepared data
    const result = await prisma.speakingEightToTen.upsert({
      where: { speakingExamId_index: { speakingExamId, index: 4 } },
      update: finalData,
      create: {
        speakingExam: { connect: { id: speakingExamId } },
        ...finalData,
      },
    });

    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi upsert Part 4 Speaking: " + (error as Error).message,
      500,
    );
  }
};

export const getSpeakingPart4ByExamIdService = async (speakingExamId: number): Promise<any[]> => {
  try {
    const parts = await prisma.speakingEightToTen.findMany({
      where: { speakingExamId },
      orderBy: { index: 'asc' },
    });
    // Build URL for image
    return parts.map((part) => ({
      ...part,
      image: buildSpeakingImageUrl(part.image),
    }));
  } catch (error) {
    throw new AppError(
      "Lỗi khi lấy Part 4 Speaking: " + (error as Error).message,
      500,
    );
  }
};

export const deleteSpeakingPart4Service = async (
  speakingExamId: number,
): Promise<void> => {
  try {
    const existing = await prisma.speakingEightToTen.findFirst({
      where: { speakingExamId, index: 4 },
    });

    if (!existing) {
      throw new AppError(`Không tìm thấy Part 4 Speaking`, 404);
    }

    if (existing.image) {
      await deleteOldFiles([existing.image]);
    }

    await prisma.speakingEightToTen.delete({
      where: { id: existing.id },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi xóa Part 4 Speaking: " + (error as Error).message,
      500,
    );
  }
};

// ==================== PART 5 (SpeakingEleven) - Express an Opinion ====================

export const upsertSpeakingPart5Service = async (
  speakingExamId: number,
  data: any,
): Promise<any> => {
  try {
    const speaking = await prisma.entranceExamSpeaking.findUnique({
      where: { id: speakingExamId },
    });

    if (!speaking) {
      throw new AppError("Không tìm thấy đề thi Speaking", 404);
    }

    const result = await prisma.speakingEleven.upsert({
      where: { speakingExamId_index: { speakingExamId, index: 5 } },
      update: {
        ...(data.question !== undefined && { question: data.question }),
      },
      create: {
        speakingExamId,
        question: data.question,
      },
    });

    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi upsert Part 5 Speaking: " + (error as Error).message,
      500,
    );
  }
};

export const getSpeakingPart5ByExamIdService = async (speakingExamId: number): Promise<any[]> => {
  try {
    const parts = await prisma.speakingEleven.findMany({
      where: { speakingExamId },
      orderBy: { index: 'asc' },
    });
    return parts;
  } catch (error) {
    throw new AppError(
      "Lỗi khi lấy Part 5 Speaking: " + (error as Error).message,
      500,
    );
  }
};

export const deleteSpeakingPart5Service = async (
  speakingExamId: number,
): Promise<void> => {
  try {
    const existing = await prisma.speakingEleven.findFirst({
      where: { speakingExamId, index: 5 },
    });

    if (!existing) {
      throw new AppError(`Không tìm thấy Part 5 Speaking`, 404);
    }

    await prisma.speakingEleven.delete({
      where: { id: existing.id },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi xóa Part 5 Speaking: " + (error as Error).message,
      500,
    );
  }
};

// ==================== MAPPERS ====================

function toSpeakingResponse(speaking: any): SpeakingResponse {
  return {
    id: speaking.id,
    name: speaking.name,
    isDone: speaking.isDone,
    isActive: speaking.isActive,
    totalQuestion: speaking.totalQuestion,
    createdAt: speaking.createdAt,
    updatedAt: speaking.updatedAt,
  };
}

function toSpeakingResponseWithParts(speaking: any): SpeakingResponse {
  return {
    id: speaking.id,
    name: speaking.name,
    isDone: speaking.isDone,
    isActive: speaking.isActive,
    totalQuestion: speaking.totalQuestion,
    createdAt: speaking.createdAt,
    updatedAt: speaking.updatedAt,
    speakingOneTwos: speaking.speakingOneTwos,
    speakingThreeFours: speaking.speakingThreeFours.map((part: any) => ({
      ...part,
      imageThree: buildSpeakingImageUrl(part.imageThree),
      imageFour: buildSpeakingImageUrl(part.imageFour),
    })),
    speakingFiveToSevens: speaking.speakingFiveToSevens,
    speakingEightToTens: speaking.speakingEightToTens.map((part: any) => ({
      ...part,
      image: buildSpeakingImageUrl(part.image),
    })),
    speakingElevens: speaking.speakingElevens,
  };
}
