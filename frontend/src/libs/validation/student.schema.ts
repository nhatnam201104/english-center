import { z } from "zod";

export const createStudentSchema = z.object({
  fullname: z.string().min(1, "Họ tên là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  phone: z.string().regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 số"),
  dob: z.string().optional().or(z.literal("")),
  cccd: z.string().regex(/^[0-9]{12}$/, "CCCD phải có 12 số").optional().or(z.literal("")),
  scoreRl: z.union([z.number().min(0, "Điểm phải >= 0").max(10, "Điểm phải <= 10"), z.nan()]).optional(),
  scoreSw: z.union([z.number().min(0, "Điểm phải >= 0").max(10, "Điểm phải <= 10"), z.nan()]).optional(),
});

export const updateStudentSchema = z.object({
  fullname: z.string().min(1, "Họ tên là bắt buộc").optional().or(z.literal("")),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").optional().or(z.literal("")),
  phone: z.string().regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 số").optional().or(z.literal("")),
  dob: z.string().optional().or(z.literal("")),
  cccd: z.string().regex(/^[0-9]{12}$/, "CCCD phải có 12 số").optional().or(z.literal("")),
  scoreRl: z.union([z.number().min(0, "Điểm phải >= 0").max(10, "Điểm phải <= 10"), z.nan()]).optional(),
  scoreSw: z.union([z.number().min(0, "Điểm phải >= 0").max(10, "Điểm phải <= 10"), z.nan()]).optional(),
});

export type CreateStudentFormData = z.infer<typeof createStudentSchema>;
export type UpdateStudentFormData = z.infer<typeof updateStudentSchema>;
