import { z } from "zod";

export const createCourseSchema = z
  .object({
    name: z.string().min(1, "Tên khóa học là bắt buộc"),
    type: z.enum(["COURSE", "TEST_PREPARATION"], {
      message: "Loại khóa học phải là Khóa học hoặc Luyện thi",
    }),
    price: z
      .number({
        message: "Giá là bắt buộc",
      })
      .min(0, "Giá phải lớn hơn 0"),
    sale: z
      .number({
        message: "Giảm giá phải là số",
      })
      .min(0, "Giảm giá phải lớn hơn hoặc bằng 0")
      .max(100, "Giảm giá không được vượt quá 100%")
      .default(0),
    thumbnail: z.instanceof(File, { message: "Ảnh thumbnail là bắt buộc" }),
    totalSession: z
      .number({
        message: "Số buổi học phải là số",
      })
      .min(1, "Số buổi học phải lớn hơn 0")
      .optional(),
    minBand: z
      .number({
        message: "Band tối thiểu phải là số",
      })
      .min(0, "Band tối thiểu phải lớn hơn hoặc bằng 0")
      .max(990, "Band tối thiểu phải nhỏ hơn hoặc bằng 990")
      .optional(),
    maxBand: z
      .number({
        message: "Band tối đa phải là số",
      })
      .min(0, "Band tối đa phải lớn hơn hoặc bằng 0")
      .max(990, "Band tối đa phải nhỏ hơn hoặc bằng 990")
      .optional(),
    courseSkill: z.enum(["READING_LISTENING", "SPEAKING_WRITING", "ALL"], {
      message: "Kỹ năng khóa học là bắt buộc",
    }),
    status: z.enum(["PLANNING", "ACTIVE", "INACTIVE"], {
      message: "Trạng thái là bắt buộc",
    }),
  })
  .refine(
    (data) => {
      // If type is COURSE, both minBand and maxBand are required
      if (data.type === "COURSE") {
        return data.minBand !== undefined && data.maxBand !== undefined;
      }
      return true;
    },
    {
      message: "Band tối thiểu và Band tối đa là bắt buộc cho Khóa học",
      path: ["minBand"],
    },
  )
  .refine(
    (data) => {
      // If type is COURSE, both minBand and maxBand are required
      if (data.type === "COURSE") {
        return data.minBand !== undefined && data.maxBand !== undefined;
      }
      return true;
    },
    {
      message: "Band tối thiểu và Band tối đa là bắt buộc cho Khóa học",
      path: ["maxBand"],
    },
  )
  .refine(
    (data) => {
      // maxBand must be >= minBand
      if (data.minBand !== undefined && data.maxBand !== undefined) {
        return data.maxBand >= data.minBand;
      }
      return true;
    },
    {
      message: "Band tối đa phải lớn hơn hoặc bằng Band tối thiểu",
      path: ["maxBand"],
    },
  );

export const updateCourseSchema = z
  .object({
    name: z
      .string()
      .min(1, "Tên khóa học là bắt buộc")
      .optional()
      .or(z.literal("")),
    type: z
      .enum(["COURSE", "TEST_PREPARATION"], {
        message: "Loại khóa học phải là Khóa học hoặc Luyện thi",
      })
      .optional(),
    price: z
      .number({
        message: "Giá phải là số",
      })
      .min(0, "Giá phải lớn hơn 0")
      .optional(),
    sale: z
      .number({
        message: "Giảm giá phải là số",
      })
      .min(0, "Giảm giá phải lớn hơn hoặc bằng 0")
      .max(100, "Giảm giá không được vượt quá 100%")
      .optional(),
    thumbnail: z.instanceof(File).optional().or(z.undefined()),
    totalSession: z
      .number({
        message: "Số buổi học phải là số",
      })
      .min(0, "Số buổi học phải lớn hơn hoặc bằng 0")
      .optional(),
    minBand: z
      .number({
        message: "Band tối thiểu phải là số",
      })
      .min(0, "Band tối thiểu phải lớn hơn hoặc bằng 0")
      .max(990, "Band tối thiểu phải nhỏ hơn hoặc bằng 990")
      .optional(),
    maxBand: z
      .number({
        message: "Band tối đa phải là số",
      })
      .min(0, "Band tối đa phải lớn hơn hoặc bằng 0")
      .max(990, "Band tối đa phải nhỏ hơn hoặc bằng 990")
      .optional(),
    status: z
      .enum(["PLANNING", "ACTIVE", "INACTIVE"], {
        message: "Trạng thái không hợp lệ",
      })
      .optional(),
    courseSkill: z
      .enum(["READING_LISTENING", "SPEAKING_WRITING", "ALL"], {
        message: "Kỹ năng khóa học không hợp lệ",
      })
      .optional(),
  })
  .refine(
    (data) => {
      // If type is COURSE, both minBand and maxBand are required
      if (data.type === "COURSE") {
        return data.minBand !== undefined && data.maxBand !== undefined;
      }
      return true;
    },
    {
      message: "Band tối thiểu và Band tối đa là bắt buộc cho Khóa học",
      path: ["minBand"],
    },
  )
  .refine(
    (data) => {
      // If type is COURSE, both minBand and maxBand are required
      if (data.type === "COURSE") {
        return data.minBand !== undefined && data.maxBand !== undefined;
      }
      return true;
    },
    {
      message: "Band tối thiểu và Band tối đa là bắt buộc cho Khóa học",
      path: ["maxBand"],
    },
  )
  .refine(
    (data) => {
      // maxBand must be >= minBand
      if (data.minBand !== undefined && data.maxBand !== undefined) {
        return data.maxBand >= data.minBand;
      }
      return true;
    },
    {
      message: "Band tối đa phải lớn hơn hoặc bằng Band tối thiểu",
      path: ["maxBand"],
    },
  );

export type CreateCourseFormData = z.infer<typeof createCourseSchema>;
export type UpdateCourseFormData = z.infer<typeof updateCourseSchema>;
