import { z } from "zod";

export const createCourseTestSchema = z.object({
  courseId: z
    .number({
      message: "ID khóa học là bắt buộc",
    })
    .min(1, "ID khóa học phải lớn hơn 0"),
  name: z.string().min(1, "Tên bài kiểm tra là bắt buộc"),
  index: z
    .number({
      message: "Thứ tự bài kiểm tra phải là số",
    })
    .min(1, "Thứ tự bài kiểm tra phải lớn hơn 0"),
  fileTest: z
    .any()
    .refine((file) => file instanceof File || typeof file === "string", {
      message: "File bài kiểm tra là bắt buộc",
    }),
  audioTest: z
    .any()
    .optional()
    .refine(
      (file) =>
        file instanceof File ||
        typeof file === "string" ||
        file === null ||
        file === undefined,
      {
        message: "File âm thanh không hợp lệ",
      },
    ),
});

export const updateCourseTestSchema = z.object({
  courseId: z
    .number({
      message: "ID khóa học phải là số",
    })
    .min(1, "ID khóa học phải lớn hơn 0")
    .optional(),
  name: z
    .string()
    .min(1, "Tên bài kiểm tra là bắt buộc")
    .optional()
    .or(z.literal("")),
  index: z
    .number({
      message: "Thứ tự bài kiểm tra phải là số",
    })
    .min(1, "Thứ tự bài kiểm tra phải lớn hơn 0")
    .optional(),
  fileTest: z
    .any()
    .optional()
    .refine(
      (file) =>
        file instanceof File || typeof file === "string" || file === undefined,
      {
        message: "File bài kiểm tra không hợp lệ",
      },
    ),
  audioTest: z
    .any()
    .optional()
    .refine(
      (file) =>
        file instanceof File ||
        typeof file === "string" ||
        file === null ||
        file === undefined,
      {
        message: "File âm thanh không hợp lệ",
      },
    ),
});

export const createQuestionSchema = z
  .object({
    questionText: z
      .string()
      .min(1, "Nội dung câu hỏi là bắt buộc")
      .min(10, "Nội dung câu hỏi phải có ít nhất 10 ký tự"),
    type: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER", "ESSAY"], {
      message: "Loại câu hỏi không hợp lệ",
    }),
    options: z.array(z.string()).optional(),
    correctAnswer: z.string().min(1, "Đáp án đúng là bắt buộc"),
    points: z
      .number({
        message: "Điểm câu hỏi phải là số",
      })
      .min(1, "Điểm câu hỏi phải lớn hơn 0")
      .max(100, "Điểm câu hỏi không được vượt quá 100"),
    order: z
      .number({
        message: "Thứ tự câu hỏi phải là số",
      })
      .min(1, "Thứ tự câu hỏi phải lớn hơn 0"),
  })
  .refine(
    (data) => {
      // For MULTIPLE_CHOICE, options are required
      if (data.type === "MULTIPLE_CHOICE") {
        return (
          data.options !== undefined &&
          data.options.length >= 2 &&
          data.options.length <= 6
        );
      }
      return true;
    },
    {
      message: "Câu hỏi trắc nghiệm phải có từ 2 đến 6 phương án",
      path: ["options"],
    },
  )
  .refine(
    (data) => {
      // For TRUE_FALSE, options are not needed but correctAnswer must be 'true' or 'false'
      if (data.type === "TRUE_FALSE") {
        return ["true", "false"].includes(data.correctAnswer.toLowerCase());
      }
      return true;
    },
    {
      message: "Đáp án đúng phải là 'true' hoặc 'false'",
      path: ["correctAnswer"],
    },
  );

export const updateQuestionSchema = z
  .object({
    questionText: z
      .string()
      .min(1, "Nội dung câu hỏi là bắt buộc")
      .min(10, "Nội dung câu hỏi phải có ít nhất 10 ký tự")
      .optional()
      .or(z.literal("")),
    type: z
      .enum(["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER", "ESSAY"], {
        message: "Loại câu hỏi không hợp lệ",
      })
      .optional(),
    options: z.array(z.string()).optional(),
    correctAnswer: z
      .string()
      .min(1, "Đáp án đúng là bắt buộc")
      .optional()
      .or(z.literal("")),
    points: z
      .number({
        message: "Điểm câu hỏi phải là số",
      })
      .min(1, "Điểm câu hỏi phải lớn hơn 0")
      .max(100, "Điểm câu hỏi không được vượt quá 100")
      .optional(),
    order: z
      .number({
        message: "Thứ tự câu hỏi phải là số",
      })
      .min(1, "Thứ tự câu hỏi phải lớn hơn 0")
      .optional(),
  })
  .refine(
    (data) => {
      // For MULTIPLE_CHOICE, options validation
      if (data.type === "MULTIPLE_CHOICE" && data.options !== undefined) {
        return data.options.length >= 2 && data.options.length <= 6;
      }
      return true;
    },
    {
      message: "Câu hỏi trắc nghiệm phải có từ 2 đến 6 phương án",
      path: ["options"],
    },
  )
  .refine(
    (data) => {
      // For TRUE_FALSE, correctAnswer validation
      if (data.type === "TRUE_FALSE" && data.correctAnswer !== undefined) {
        return ["true", "false"].includes(data.correctAnswer.toLowerCase());
      }
      return true;
    },
    {
      message: "Đáp án đúng phải là 'true' hoặc 'false'",
      path: ["correctAnswer"],
    },
  );

export type CreateCourseTestFormData = z.infer<typeof createCourseTestSchema>;
export type UpdateCourseTestFormData = z.infer<typeof updateCourseTestSchema>;
export type CreateQuestionFormData = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionFormData = z.infer<typeof updateQuestionSchema>;
