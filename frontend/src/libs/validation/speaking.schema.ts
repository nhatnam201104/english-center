import { z } from "zod";

export const createSpeakingSchema = z.object({
  name: z.string().min(1, "Tên đề thi không được để trống").max(200, "Tên đề thi không quá 200 ký tự"),
  isActive: z.boolean().default(false),
});

export const speakingPart1Schema = z.object({
  questionOne: z.string().min(1, "Câu hỏi 1 không được để trống"),
  questionTwo: z.string().min(1, "Câu hỏi 2 không được để trống"),
});

export const speakingPart2Schema = z.object({
  imageThree: z.any().refine((file) => file instanceof File, "Vui lòng chọn file ảnh"),
  imageFour: z.any().refine((file) => file instanceof File, "Vui lòng chọn file ảnh"),
});

export const speakingPart3Schema = z.object({
  passage: z.string().min(1, "Bối cảnh không được để trống"),
  questionFive: z.string().min(1, "Câu hỏi 5 không được để trống"),
  questionSix: z.string().min(1, "Câu hỏi 6 không được để trống"),
  questionSeven: z.string().min(1, "Câu hỏi 7 không được để trống"),
});

export const speakingPart4Schema = z.object({
  passage: z.string().min(1, "Bối cảnh không được để trống"),
  questionEight: z.string().min(1, "Câu hỏi 8 không được để trống"),
  questionNine: z.string().min(1, "Câu hỏi 9 không được để trống"),
  questionTen: z.string().min(1, "Câu hỏi 10 không được để trống"),
});

export const speakingPart5Schema = z.object({
  question: z.string().min(1, "Chủ đề không được để trống"),
});

export type CreateSpeakingFormData = z.infer<typeof createSpeakingSchema>;
export type SpeakingPart1FormData = z.infer<typeof speakingPart1Schema>;
export type SpeakingPart3FormData = z.infer<typeof speakingPart3Schema>;
export type SpeakingPart5FormData = z.infer<typeof speakingPart5Schema>;