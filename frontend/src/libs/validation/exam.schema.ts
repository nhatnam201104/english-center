import { z } from "zod";

export const createExamSchema = z.object({
  name: z.string().min(1, "Tên đề thi là bắt buộc"),
  isActive: z.boolean().default(false),
});

export const updateExamSchema = z.object({
  name: z.string().min(1, "Tên đề thi là bắt buộc").optional(),
  isActive: z.boolean().optional(),
});

export const part1Schema = z.object({
  imageOne: z.any().optional(),
  imageTwo: z.any().optional(),
  imageThree: z.any().optional(),
  imageFour: z.any().optional(),
  imageFive: z.any().optional(),
});

export const part2Schema = z.object({
  imageSix: z.any().optional(),
  imageSeven: z.any().optional(),
});

export const part3Schema = z.object({
  questionEight: z.string().min(1, "Câu hỏi là bắt buộc"),
});

export type CreateExamFormData = z.infer<typeof createExamSchema>;
export type UpdateExamFormData = z.infer<typeof updateExamSchema>;
export type Part1FormData = z.infer<typeof part1Schema>;
export type Part2FormData = z.infer<typeof part2Schema>;
export type Part3FormData = z.infer<typeof part3Schema>;