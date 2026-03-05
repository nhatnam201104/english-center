import { z } from 'zod';

// FileValidator chung - kiểm tra định dạng và dung lượng ảnh
export const FileValidator = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.enum(['image/jpeg', 'image/jpg', 'image/png', 'image/gif']),
  size: z.number().max(5 * 1024 * 1024, 'File không được quá 5MB'),
  filename: z.string(),
  path: z.string(),
});

// Helper để validate file từ multer request
export const validateImageFile = (file: Express.Multer.File) => {
  return FileValidator.parse(file);
};

// Main Exam Schemas - UPDATED with .coerce()

export const createWritingExamSchema = z.object({
  name: z.string().min(1, 'Tên đề thi không được để trống'),
  isActive: z.coerce.boolean().optional().default(true),
});

export const updateWritingExamSchema = z.object({
  name: z.string().min(1, 'Tên đề thi không được để trống').optional(),
  isActive: z.coerce.boolean().optional(),
});

// Parameter Schemas - SIMPLIFIED with .coerce()

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive('ID phải là số nguyên dương'),
});

export const indexParamSchema = z.object({
  index: z.coerce.number().int().positive('Index phải là số nguyên dương'),
});

// Part 1 Schema (WritingOneToFive - 5 images)

export const createPart1Schema = z.object({
  index: z.coerce.number().int().positive('Index phải là số nguyên dương'),
  imageOne: z.string().min(1, 'Image One không được để trống'),
  imageTwo: z.string().min(1, 'Image Two không được để trống'),
  imageThree: z.string().min(1, 'Image Three không được để trống'),
  imageFour: z.string().min(1, 'Image Four không được để trống'),
  imageFive: z.string().min(1, 'Image Five không được để trống'),
});

export const updatePart1Schema = z.object({
  imageOne: z.string().min(1, 'Image One không được để trống').optional(),
  imageTwo: z.string().min(1, 'Image Two không được để trống').optional(),
  imageThree: z.string().min(1, 'Image Three không được để trống').optional(),
  imageFour: z.string().min(1, 'Image Four không được để trống').optional(),
  imageFive: z.string().min(1, 'Image Five không được để trống').optional(),
});

// Part 2 Schema (WritingSixSeven - 2 images)

export const createPart2Schema = z.object({
  index: z.coerce.number().int().positive('Index phải là số nguyên dương'),
  imageSix: z.string().min(1, 'Image Six không được để trống'),
  imageSeven: z.string().min(1, 'Image Seven không được để trống'),
});

export const updatePart2Schema = z.object({
  imageSix: z.string().min(1, 'Image Six không được để trống').optional(),
  imageSeven: z.string().min(1, 'Image Seven không được để trống').optional(),
});

// Part 3 Schema (WritingEight - essay question)

export const createPart3Schema = z.object({
  index: z.coerce.number().int().positive('Index phải là số nguyên dương'),
  questionEight: z.string().min(1, 'Chủ đề bài luận không được để trống'),
});

export const updatePart3Schema = z.object({
  questionEight: z.string().min(1, 'Chủ đề bài luận không được để trống').optional(),
});

// Export types
export type CreateWritingExamInput = z.infer<typeof createWritingExamSchema>;
export type UpdateWritingExamInput = z.infer<typeof updateWritingExamSchema>;
export type CreatePart1Input = z.infer<typeof createPart1Schema>;
export type UpdatePart1Input = z.infer<typeof updatePart1Schema>;
export type CreatePart2Input = z.infer<typeof createPart2Schema>;
export type UpdatePart2Input = z.infer<typeof updatePart2Schema>;
export type CreatePart3Input = z.infer<typeof createPart3Schema>;
export type UpdatePart3Input = z.infer<typeof updatePart3Schema>;
export type IdParamInput = z.infer<typeof idParamSchema>;
export type IndexParamInput = z.infer<typeof indexParamSchema>;