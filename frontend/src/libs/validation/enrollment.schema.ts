import { z } from "zod";

export const candidateFormSchema = z.object({
  fullname: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự").max(100, "Họ tên tối đa 100 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().regex(/^0[3-9][0-9]{8}$/, "Số điện thoại không hợp lệ"),
  cccd: z.string().regex(/^[0-9]{12}$/, "CCCD phải gồm 12 chữ số"),
  dob: z.string().min(1, "Ngày sinh là bắt buộc"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export const parentFormSchema = z.object({
  fullname: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự").max(100, "Họ tên tối đa 100 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().regex(/^0[3-9][0-9]{8}$/, "Số điện thoại không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export type CandidateFormValues = z.infer<typeof candidateFormSchema>;
export type ParentFormValues = z.infer<typeof parentFormSchema>;
