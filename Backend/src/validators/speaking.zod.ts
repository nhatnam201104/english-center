import { z } from 'zod';

// FileValidator (reuse from writing.zod.ts)
export const FileValidator = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.enum(['image/jpeg', 'image/jpg', 'image/png', 'image/gif']),
  size: z.number().max(5 * 1024 * 1024, 'File không được quá 5MB'),
  filename: z.string(),
  path: z.string(),
});

// Main Exam Schemas

export const createSpeakingExamSchema = z.object({
  name: z.string().min(1, 'Tên đề thi không được để trống'),
  isActive: z.coerce.boolean().optional().default(true),
});

export const updateSpeakingExamSchema = z.object({
  name: z.string().min(1, 'Tên đề thi không được để trống').optional(),
  isActive: z.coerce.boolean().optional(),
});

// Parameter Schemas

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive('ID phải là số nguyên dương'),
});

export const indexParamSchema = z.object({
  index: z.coerce.number().int().positive('Index phải là số nguyên dương'),
});

// Part 1 (SpeakingOneTwo) - 2 questions (Read a Text Aloud)
export const createSpeakingPart1Schema = z.object({
  index: z.coerce.number().int().positive('Index phải là số nguyên dương'),
  questionOne: z.string().min(1, 'Question One không được để trống'),
  questionTwo: z.string().min(1, 'Question Two không được để trống'),
});

export const updateSpeakingPart1Schema = z.object({
  questionOne: z.string().min(1, 'Question One không được để trống').optional(),
  questionTwo: z.string().min(1, 'Question Two không được để trống').optional(),
});

// Part 2 (SpeakingThreeFour) - 2 images (Describe a Picture)
export const createSpeakingPart2Schema = z.object({
  index: z.coerce.number().int().positive('Index phải là số nguyên dương'),
  imageThree: z.string().min(1, 'Image Three không được để trống'),
  imageFour: z.string().min(1, 'Image Four không được để trống'),
});

export const updateSpeakingPart2Schema = z.object({
  imageThree: z.string().min(1, 'Image Three không được để trống').optional(),
  imageFour: z.string().min(1, 'Image Four không được để trống').optional(),
});

// Part 3 (SpeakingFiveToSeven) - 3 questions with passage (Respond to Questions)
export const createSpeakingPart3Schema = z.object({
  index: z.coerce.number().int().positive('Index phải là số nguyên dương'),
  passage: z.string().min(1, 'Passage không được để trống'),
  questionFive: z.string().min(1, 'Question Five không được để trống'),
  questionSix: z.string().min(1, 'Question Six không được để trống'),
  questionSeven: z.string().min(1, 'Question Seven không được để trống'),
});

export const updateSpeakingPart3Schema = z.object({
  passage: z.string().min(1, 'Passage không được để trống').optional(),
  questionFive: z.string().min(1, 'Question Five không được để trống').optional(),
  questionSix: z.string().min(1, 'Question Six không được để trống').optional(),
  questionSeven: z.string().min(1, 'Question Seven không được để trống').optional(),
});

// Part 4 (SpeakingEightToTen) - 3 questions with passage + optional image (Respond to Questions using Information Provided)
export const createSpeakingPart4Schema = z.object({
  index: z.coerce.number().int().positive('Index phải là số nguyên dương'),
  passage: z.string().min(1, 'Passage không được để trống'),
  questionEight: z.string().min(1, 'Question Eight không được để trống'),
  questionNine: z.string().min(1, 'Question Nine không được để trống'),
  questionTen: z.string().min(1, 'Question Ten không được để trống'),
  image: z.string().optional(),
});

export const updateSpeakingPart4Schema = z.object({
  passage: z.string().min(1, 'Passage không được để trống').optional(),
  questionEight: z.string().min(1, 'Question Eight không được để trống').optional(),
  questionNine: z.string().min(1, 'Question Nine không được để trống').optional(),
  questionTen: z.string().min(1, 'Question Ten không được để trống').optional(),
  image: z.string().optional(),
});

// Part 5 (SpeakingEleven) - 1 opinion question (Express an Opinion)
export const createSpeakingPart5Schema = z.object({
  index: z.coerce.number().int().positive('Index phải là số nguyên dương'),
  question: z.string().min(1, 'Question không được để trống'),
});

export const updateSpeakingPart5Schema = z.object({
  question: z.string().min(1, 'Question không được để trống').optional(),
});

// Export types
export type CreateSpeakingExamInput = z.infer<typeof createSpeakingExamSchema>;
export type UpdateSpeakingExamInput = z.infer<typeof updateSpeakingExamSchema>;
export type CreateSpeakingPart1Input = z.infer<typeof createSpeakingPart1Schema>;
export type UpdateSpeakingPart1Input = z.infer<typeof updateSpeakingPart1Schema>;
export type CreateSpeakingPart2Input = z.infer<typeof createSpeakingPart2Schema>;
export type UpdateSpeakingPart2Input = z.infer<typeof updateSpeakingPart2Schema>;
export type CreateSpeakingPart3Input = z.infer<typeof createSpeakingPart3Schema>;
export type UpdateSpeakingPart3Input = z.infer<typeof updateSpeakingPart3Schema>;
export type CreateSpeakingPart4Input = z.infer<typeof createSpeakingPart4Schema>;
export type UpdateSpeakingPart4Input = z.infer<typeof updateSpeakingPart4Schema>;
export type CreateSpeakingPart5Input = z.infer<typeof createSpeakingPart5Schema>;
export type UpdateSpeakingPart5Input = z.infer<typeof updateSpeakingPart5Schema>;
export type IdParamInput = z.infer<typeof idParamSchema>;
export type IndexParamInput = z.infer<typeof indexParamSchema>;