import { z } from "zod";

/* ══════════════ Create Listening / Reading exam ══════════════ */

export const createExamSchema = z.object({
  name: z
    .string()
    .min(1, "Tên đề thi là bắt buộc")
    .max(255, "Tên đề thi tối đa 255 ký tự"),
  direction: z
    .string()
    .min(1, "Hướng dẫn là bắt buộc")
    .max(2000, "Hướng dẫn tối đa 2000 ký tự"),
});

export type CreateExamFormData = z.infer<typeof createExamSchema>;

/* ══════════════ Update exam ══════════════ */

export const updateExamSchema = z.object({
  name: z
    .string()
    .min(1, "Tên đề thi là bắt buộc")
    .max(255, "Tên đề thi tối đa 255 ký tự")
    .optional(),
  direction: z
    .string()
    .min(1, "Hướng dẫn là bắt buộc")
    .max(2000, "Hướng dẫn tối đa 2000 ký tự")
    .optional(),
});

export type UpdateExamFormData = z.infer<typeof updateExamSchema>;

/* ══════════════ Part 1 — add question (audio + image required) ══════════════ */

export const addPartOneQuestionSchema = z.object({
  index: z
    .number({ message: "Số thứ tự là bắt buộc" })
    .int()
    .min(1, "Số thứ tự phải >= 1"),
  question: z
    .string()
    .min(1, "Nội dung câu hỏi là bắt buộc"),
  audio: z.instanceof(File, { message: "File audio là bắt buộc" }),
  image: z.instanceof(File, { message: "File hình ảnh là bắt buộc" }),
});

export type AddPartOneQuestionFormData = z.infer<typeof addPartOneQuestionSchema>;

/* ══════════════ Part 2 — add question (audio required) ══════════════ */

export const addPartTwoQuestionSchema = z.object({
  index: z
    .number({ message: "Số thứ tự là bắt buộc" })
    .int()
    .min(1, "Số thứ tự phải >= 1"),
  question: z
    .string()
    .default("Mark your answer on your answer sheet."),
  audio: z.instanceof(File, { message: "File audio là bắt buộc" }),
});

export type AddPartTwoQuestionFormData = z.infer<typeof addPartTwoQuestionSchema>;

/* ══════════════ Part 5 — add question (MC, no media) ══════════════ */

export const addPartFiveQuestionSchema = z.object({
  index: z
    .number({ message: "Số thứ tự là bắt buộc" })
    .int()
    .min(1, "Số thứ tự phải >= 1"),
  question: z.string().min(1, "Nội dung câu hỏi là bắt buộc"),
  answerA: z.string().min(1, "Đáp án A là bắt buộc"),
  answerB: z.string().min(1, "Đáp án B là bắt buộc"),
  answerC: z.string().min(1, "Đáp án C là bắt buộc"),
  answerD: z.string().min(1, "Đáp án D là bắt buộc"),
});

export type AddPartFiveQuestionFormData = z.infer<typeof addPartFiveQuestionSchema>;

/* ══════════════ MC question sub-schema (for groups) ══════════════ */

export const mcQuestionSchema = z.object({
  index: z.number().int().min(1),
  question: z.string().min(1, "Nội dung câu hỏi là bắt buộc"),
  answerA: z.string().min(1, "Đáp án A là bắt buộc"),
  answerB: z.string().min(1, "Đáp án B là bắt buộc"),
  answerC: z.string().min(1, "Đáp án C là bắt buộc"),
  answerD: z.string().min(1, "Đáp án D là bắt buộc"),
});

/* ══════════════ Part 3/4 — add group (audio required) ══════════════ */

export const addListeningGroupSchema = z.object({
  index: z
    .number({ message: "Số thứ tự là bắt buộc" })
    .int()
    .min(1),
  audio: z.instanceof(File, { message: "File audio là bắt buộc" }),
  image: z.instanceof(File).optional(),
  fromQuestionIndex: z.number().int().min(1, "Câu bắt đầu là bắt buộc"),
  toQuestionIndex: z.number().int().min(1, "Câu kết thúc là bắt buộc"),
  questions: z
    .array(mcQuestionSchema)
    .min(1, "Cần ít nhất 1 câu hỏi"),
});

export type AddListeningGroupFormData = z.infer<typeof addListeningGroupSchema>;

/* ══════════════ Part 6/7 — add group (no audio) ══════════════ */

export const addReadingGroupSchema = z.object({
  index: z
    .number({ message: "Số thứ tự là bắt buộc" })
    .int()
    .min(1),
  question: z.string().optional(),
  image: z.instanceof(File).optional(),
  fromQuestionIndex: z.number().int().min(1, "Câu bắt đầu là bắt buộc"),
  toQuestionIndex: z.number().int().min(1, "Câu kết thúc là bắt buộc"),
  questions: z
    .array(mcQuestionSchema)
    .min(1, "Cần ít nhất 1 câu hỏi"),
});

export type AddReadingGroupFormData = z.infer<typeof addReadingGroupSchema>;

/* ══════════════ Answer Key ══════════════ */

export const answerKeyItemSchema = z.object({
  index: z.number().int().min(1),
  answer: z.enum(["A", "B", "C", "D"], {
    message: "Đáp án phải là A, B, C hoặc D",
  }),
});

export const answerKeySchema = z.object({
  answers: z
    .array(answerKeyItemSchema)
    .min(1, "Cần ít nhất 1 đáp án"),
});

export type AnswerKeyFormData = z.infer<typeof answerKeySchema>;
