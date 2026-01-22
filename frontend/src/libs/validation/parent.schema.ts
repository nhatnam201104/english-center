import { z } from "zod";

export const createParentSchema = z.object({
  fullname: z.string().min(1, "Họ tên là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  phone: z.string().regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 số"),
});

export const updateParentSchema = z.object({
  fullname: z.string().min(1, "Họ tên là bắt buộc").optional().or(z.literal("")),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").optional().or(z.literal("")),
  phone: z.string().regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 số").optional().or(z.literal("")),
});

export type CreateParentFormData = z.infer<typeof createParentSchema>;
export type UpdateParentFormData = z.infer<typeof updateParentSchema>;
