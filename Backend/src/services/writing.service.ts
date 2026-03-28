import { AppError } from "../middleware/errorHandler";
import prisma from "../config/database";
import { WritingResponse } from "../DTOS/Writing";
import { PagingData } from "../DTOS/pagination";
import {
  CreateWritingRequest,
  UpdateWritingRequest,
  CreatePart1Request,
  UpdatePart1Request,
  CreatePart2Request,
  UpdatePart2Request,
  CreatePart3Request,
  UpdatePart3Request,
} from "../DTOS/Writing";
import { deleteOldFiles } from "../utils/dataCoercion";
import { buildWritingImageUrl } from "../utils/fileUrl";

// ==================== MAIN EXAM ====================

// Create Writing Exam
export const createWritingService = async (
  data: CreateWritingRequest,
): Promise<WritingResponse> => {
  try {
    // Coerce boolean and number values
    const payload = {
      name: data.name,
      isActive: typeof data.isActive === 'string' 
        ? data.isActive === 'true' || data.isActive === '1'
        : (data.isActive ?? false),
    };

    const writing = await prisma.entranceExamWriting.create({
      data: payload,
    });

    return toWritingResponse(writing);
  } catch (error) {
    if ((error as any).code === 'P2002') {
      throw new AppError("Tên đề thi đã tồn tại", 400);
    }
    throw new AppError(
      "Lỗi khi tạo đề thi Writing: " + (error as Error).message,
      500,
    );
  }
};

// Get all Writing Exams with pagination
export const getAllWritingService = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
): Promise<PagingData<WritingResponse>> => {
  try {
    const where: any = {};

    if (search) {
      where.OR = [{ name: { contains: search } }];
    }

    const totalItems = await prisma.entranceExamWriting.count({ where });

    const writingExams = await prisma.entranceExamWriting.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: "desc" },
    });

    return {
      data: writingExams.map(toWritingResponse),
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    };
  } catch (error) {
    throw new AppError(
      "Lỗi khi lấy danh sách đề thi Writing: " + (error as Error).message,
      500,
    );
  }
};

// Get Writing Exam by ID with all parts
export const getWritingByIdService = async (
  id: number,
): Promise<WritingResponse> => {
  try {
    const writing = await prisma.entranceExamWriting.findUnique({
      where: { id },
      include: {
        writingOneToFives: {
          orderBy: { index: 'asc' },
        },
        writingSixSevens: {
          orderBy: { index: 'asc' },
        },
        writingEights: {
          orderBy: { index: 'asc' },
        },
      },
    });

    if (!writing) {
      throw new AppError("Không tìm thấy đề thi Writing", 404);
    }

    return toWritingResponseWithParts(writing);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi lấy thông tin đề thi Writing: " + (error as Error).message,
      500,
    );
  }
};

// Update Writing Exam
export const updateWritingService = async (
  id: number,
  data: UpdateWritingRequest,
): Promise<WritingResponse> => {
  try {
    const writing = await prisma.entranceExamWriting.findUnique({
      where: { id },
    });

    if (!writing) {
      throw new AppError("Không tìm thấy đề thi Writing", 404);
    }

    if (data.name && data.name !== writing.name) {
      const existing = await prisma.entranceExamWriting.findFirst({
        where: { name: data.name },
      });
      if (existing && existing.id !== id) {
        throw new AppError("Tên đề thi đã tồn tại", 400);
      }
    }

    // Coerce boolean values
    const updateData: any = {
      ...(data.name !== undefined && { name: data.name }),
    };

    if (data.isActive !== undefined) {
      updateData.isActive = typeof data.isActive === 'string'
        ? data.isActive === 'true' || data.isActive === '1'
        : data.isActive;
    }

    const updated = await prisma.entranceExamWriting.update({
      where: { id },
      data: updateData,
    });

    return toWritingResponse(updated);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi cập nhật đề thi Writing: " + (error as Error).message,
      500,
    );
  }
};

// Toggle Active Status
export const toggleActiveWritingService = async (
  id: number,
): Promise<WritingResponse> => {
  try {
    const writing = await prisma.entranceExamWriting.findUnique({
      where: { id },
      include: {
        writingOneToFives: true,
        writingSixSevens: true,
        writingEights: true,
      },
    });

    if (!writing) {
      throw new AppError("Không tìm thấy đề thi Writing", 404);
    }
    if (!checkIsdone(writing)) {
      throw new AppError(
        "Không thể thay đổi trạng thái của đề thi chưa hoàn chỉnh",
        400,
      );
    }
    const updated = await prisma.entranceExamWriting.update({
      where: { id },
      data: { isActive: !writing.isActive , isDone: true},
    });

    return toWritingResponse(updated);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi cập nhật trạng thái đề thi Writing: " + (error as Error).message,
      500,
    );
  }
};

// Delete Writing Exam
export const deleteWritingService = async (id: number): Promise<void> => {
  try {
    const writing = await prisma.entranceExamWriting.findUnique({
      where: { id },
    });

    if (!writing) {
      throw new AppError("Không tìm thấy đề thi Writing", 404);
    }

    await prisma.$transaction(async (tx) => {
      // Delete all related parts
      await tx.writingOneToFive.deleteMany({ where: { writingExamId: id } });
      await tx.writingSixSeven.deleteMany({ where: { writingExamId: id } });
      await tx.writingEight.deleteMany({ where: { writingExamId: id } });

      // Delete exam
      await tx.entranceExamWriting.delete({ where: { id } });
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi xóa đề thi Writing: " + (error as Error).message,
      500,
    );
  }
};

// ==================== PART 1 (WritingOneToFive) ====================

// UPSERT Part 1 - Replace both create & update
// Index is handled by database default value
export const upsertPart1Service = async (
  writingExamId: number,
  data: UpdatePart1Request & CreatePart1Request,
): Promise<any> => {
  try {
    // 1. Check if writing exam exists
    const writing = await prisma.entranceExamWriting.findUnique({
      where: { id: writingExamId },
    });

    if (!writing) {
      throw new AppError("Không tìm thấy đề thi Writing", 404);
    }

    // 2. Fetch existing record
    const DEFAULT_INDEX = 1;
    const existing = await prisma.writingOneToFive.findUnique({
      where: { writingExamId_index: { writingExamId, index: DEFAULT_INDEX } },
    });

    // 3. Prepare final data with merge logic
    let finalData: any;

    if (existing) {
      // UPDATE: Merge old + new data (preserve images not sent in request)
      finalData = {
        imageOne: data.imageOne ?? existing.imageOne,
        imageTwo: data.imageTwo ?? existing.imageTwo,
        imageThree: data.imageThree ?? existing.imageThree,
        imageFour: data.imageFour ?? existing.imageFour,
        imageFive: data.imageFive ?? existing.imageFive,
      };

      // Delete old files only if they are being replaced
      const filesToDelete: string[] = [];
      if (data.imageOne && existing.imageOne && data.imageOne !== existing.imageOne) {
        filesToDelete.push(existing.imageOne);
      }
      if (data.imageTwo && existing.imageTwo && data.imageTwo !== existing.imageTwo) {
        filesToDelete.push(existing.imageTwo);
      }
      if (data.imageThree && existing.imageThree && data.imageThree !== existing.imageThree) {
        filesToDelete.push(existing.imageThree);
      }
      if (data.imageFour && existing.imageFour && data.imageFour !== existing.imageFour) {
        filesToDelete.push(existing.imageFour);
      }
      if (data.imageFive && existing.imageFive && data.imageFive !== existing.imageFive) {
        filesToDelete.push(existing.imageFive);
      }
      await deleteOldFiles(filesToDelete);
    } else {
      // CREATE: Validate all required fields (all 5 images are required)
      if (!data.imageOne || !data.imageTwo || !data.imageThree || !data.imageFour || !data.imageFive) {
        throw new AppError("Khi tạo mới, phải cung cấp đủ cả 5 ảnh (Câu 1 đến Câu 5)", 400);
      }
      finalData = {
        imageOne: data.imageOne,
        imageTwo: data.imageTwo,
        imageThree: data.imageThree,
        imageFour: data.imageFour,
        imageFive: data.imageFive,
      };
    }

    // 4. Execute upsert with prepared data
    const result = await prisma.writingOneToFive.upsert({
      where: { writingExamId_index: { writingExamId, index: DEFAULT_INDEX } },
      update: finalData,
      create: {
        writingExamId,
        ...finalData,
      },
    });

    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi upsert Part 1: " + (error as Error).message,
      500,
    );
  }
};

// Get Part 1 by writing exam ID
export const getPart1ByExamIdService = async (writingExamId: number): Promise<any[]> => {
  try {
    const parts = await prisma.writingOneToFive.findMany({
      where: { writingExamId },
      orderBy: { index: 'asc' },
    });

    // Convert image filenames to full URLs
    return parts.map((part: any) => ({
      ...part,
      imageOne: buildWritingImageUrl(part.imageOne),
      imageTwo: buildWritingImageUrl(part.imageTwo),
      imageThree: buildWritingImageUrl(part.imageThree),
      imageFour: buildWritingImageUrl(part.imageFour),
      imageFive: buildWritingImageUrl(part.imageFive),
    }));
  } catch (error) {
    throw new AppError(
      "Lỗi khi lấy Part 1: " + (error as Error).message,
      500,
    );
  }
};

// DELETE Part 1 - Add file cleanup
export const deletePart1Service = async (
  writingExamId: number,
  index: number,
): Promise<void> => {
  try {
    const existing = await prisma.writingOneToFive.findFirst({
      where: { writingExamId, index },
    });

    if (!existing) {
      throw new AppError(`Không tìm thấy câu hỏi index ${index} trong Part 1`, 404);
    }

    // Delete associated image files
    const filesToDelete = [
      existing.imageOne,
      existing.imageTwo,
      existing.imageThree,
      existing.imageFour,
      existing.imageFive,
    ].filter(Boolean);
    
    await deleteOldFiles(filesToDelete);

    // Delete record from database
    await prisma.writingOneToFive.delete({
      where: { id: existing.id },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi xóa Part 1: " + (error as Error).message,
      500,
    );
  }
};

// ==================== PART 2 (WritingSixSeven) ====================

// UPSERT Part 2 - Index is handled by database default value
export const upsertPart2Service = async (
  writingExamId: number,
  data: UpdatePart2Request & CreatePart2Request,
): Promise<any> => {
  try {
    // 1. Check if writing exam exists
    const writing = await prisma.entranceExamWriting.findUnique({
      where: { id: writingExamId },
    });

    if (!writing) {
      throw new AppError("Không tìm thấy đề thi Writing", 404);
    }

    // 2. Fetch existing record
    const DEFAULT_INDEX = 2;
    const existing = await prisma.writingSixSeven.findUnique({
      where: { writingExamId_index: { writingExamId, index: DEFAULT_INDEX } },
    });

    // 3. Prepare final data with merge logic
    let finalData: any;

    if (existing) {
      // UPDATE: Merge old + new data (preserve images not sent in request)
      finalData = {
        imageSix: data.imageSix ?? existing.imageSix,
        imageSeven: data.imageSeven ?? existing.imageSeven,
      };

      // Delete old files only if they are being replaced
      const filesToDelete: string[] = [];
      if (data.imageSix && existing.imageSix && data.imageSix !== existing.imageSix) {
        filesToDelete.push(existing.imageSix);
      }
      if (data.imageSeven && existing.imageSeven && data.imageSeven !== existing.imageSeven) {
        filesToDelete.push(existing.imageSeven);
      }
      await deleteOldFiles(filesToDelete);
    } else {
      // CREATE: Validate all required fields (both images are required)
      if (!data.imageSix || !data.imageSeven) {
        throw new AppError("Khi tạo mới, phải cung cấp cả 2 ảnh (Câu 6 và Câu 7)", 400);
      }
      finalData = {
        imageSix: data.imageSix,
        imageSeven: data.imageSeven,
      };
    }

    // 4. Execute upsert with prepared data
    const result = await prisma.writingSixSeven.upsert({
      where: { writingExamId_index: { writingExamId, index: DEFAULT_INDEX } },
      update: finalData,
      create: {
        writingExamId,
        ...finalData,
      },
    });

    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi upsert Part 2: " + (error as Error).message,
      500,
    );
  }
};

export const getPart2ByExamIdService = async (writingExamId: number): Promise<any[]> => {
  try {
    const parts = await prisma.writingSixSeven.findMany({
      where: { writingExamId },
      orderBy: { index: 'asc' },
    });

    // Convert image filenames to full URLs
    return parts.map((part: any) => ({
      ...part,
      imageSix: buildWritingImageUrl(part.imageSix),
      imageSeven: buildWritingImageUrl(part.imageSeven),
    }));
  } catch (error) {
    throw new AppError(
      "Lỗi khi lấy Part 2: " + (error as Error).message,
      500,
    );
  }
};

// DELETE Part 2 - Add file cleanup
export const deletePart2Service = async (
  writingExamId: number,
  index: number,
): Promise<void> => {
  try {
    const existing = await prisma.writingSixSeven.findFirst({
      where: { writingExamId, index },
    });

    if (!existing) {
      throw new AppError(`Không tìm thấy câu hỏi index ${index} trong Part 2`, 404);
    }

    const filesToDelete = [
      existing.imageSix,
      existing.imageSeven,
    ].filter(Boolean);
    
    await deleteOldFiles(filesToDelete);

    await prisma.writingSixSeven.delete({
      where: { id: existing.id },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi xóa Part 2: " + (error as Error).message,
      500,
    );
  }
};

// ==================== PART 3 (WritingEight) ====================

// UPSERT Part 3 - Index is handled by database default value
export const upsertPart3Service = async (
  writingExamId: number,
  data: UpdatePart3Request & CreatePart3Request,
): Promise<any> => {
  try {
    const writing = await prisma.entranceExamWriting.findUnique({
      where: { id: writingExamId },
    });

    if (!writing) {
      throw new AppError("Không tìm thấy đề thi Writing", 404);
    }

    // Use default index from schema (@default(3))
    const DEFAULT_INDEX = 3;

    const result = await prisma.writingEight.upsert({
      where: { writingExamId_index: { writingExamId, index: DEFAULT_INDEX } },
      update: {
        ...(data.questionEight !== undefined && { questionEight: data.questionEight }),
      },
      create: {
        writingExamId,
        questionEight: data.questionEight,
      },
    });

    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi upsert Part 3: " + (error as Error).message,
      500,
    );
  }
};

export const getPart3ByExamIdService = async (writingExamId: number): Promise<any[]> => {
  try {
    const parts = await prisma.writingEight.findMany({
      where: { writingExamId },
      orderBy: { index: 'asc' },
    });

    return parts;
  } catch (error) {
    throw new AppError(
      "Lỗi khi lấy Part 3: " + (error as Error).message,
      500,
    );
  }
};

// Delete Part 3 (no files to delete)
export const deletePart3Service = async (
  writingExamId: number,
  index: number,
): Promise<void> => {
  try {
    const existing = await prisma.writingEight.findFirst({
      where: { writingExamId, index },
    });

    if (!existing) {
      throw new AppError(`Không tìm thấy câu hỏi index ${index} trong Part 3`, 404);
    }

    await prisma.writingEight.delete({
      where: { id: existing.id },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Lỗi khi xóa Part 3: " + (error as Error).message,
      500,
    );
  }
};

// ==================== MAPPERS ====================

function toWritingResponse(writing: any): WritingResponse {
  return {
    id: writing.id,
    name: writing.name,
    isDone: writing.isDone,
    isActive: writing.isActive,
    totalQuestion: writing.totalQuestion,
    createdAt: writing.createdAt,
    updatedAt: writing.updatedAt,
  };
}

function toWritingResponseWithParts(writing: any): WritingResponse {
  return {
    id: writing.id,
    name: writing.name,
    isDone: writing.isDone,
    isActive: writing.isActive,
    totalQuestion: writing.totalQuestion,
    createdAt: writing.createdAt,
    updatedAt: writing.updatedAt,
    writingOneToFives: writing.writingOneToFives?.map((part: any) => ({
      ...part,
      imageOne: buildWritingImageUrl(part.imageOne),
      imageTwo: buildWritingImageUrl(part.imageTwo),
      imageThree: buildWritingImageUrl(part.imageThree),
      imageFour: buildWritingImageUrl(part.imageFour),
      imageFive: buildWritingImageUrl(part.imageFive),
    })) || [],
    writingSixSevens: writing.writingSixSevens?.map((part: any) => ({
      ...part,
      imageSix: buildWritingImageUrl(part.imageSix),
      imageSeven: buildWritingImageUrl(part.imageSeven),
    })) || [],
    writingEights: writing.writingEights || [],
  };
}
function checkIsdone(writing: any): boolean {
  const part1Done = writing.writingOneToFives.length > 0;
  const part2Done = writing.writingSixSevens.length > 0;
  const part3Done = writing.writingEights.length > 0;
  return part1Done && part2Done && part3Done;
}