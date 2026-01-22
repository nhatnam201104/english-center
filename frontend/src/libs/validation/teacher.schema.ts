import { z } from "zod";

export const createTeacherSchema = z.object({
  fullname: z.string().min(1, "Họ tên là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  phone: z.string().regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 số"),
  degree: z.string().min(1, "Bằng cấp là bắt buộc"),
  isTeaching: z.boolean().default(true),
  avatar: z.instanceof(File, { message: "Avatar là bắt buộc" }),
});

export const updateTeacherSchema = z.object({
  fullname: z.string().min(1, "Họ tên là bắt buộc").optional().or(z.literal("")),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").optional().or(z.literal("")),
  phone: z.string().regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 số").optional().or(z.literal("")),
  degree: z.string().min(1, "Bằng cấp là bắt buộc").optional().or(z.literal("")),
  isTeaching: z.boolean().optional(),
  avatar: z.instanceof(File).optional().or(z.undefined()),
});

export type CreateTeacherFormData = z.infer<typeof createTeacherSchema>;
export type UpdateTeacherFormData = z.infer<typeof updateTeacherSchema>;
