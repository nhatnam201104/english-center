import { z } from "zod";

export const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "Số điện thoại không được để trống")
    .regex(
      /^(0[3-9][0-9]{8})$/,
      "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (10 số bắt đầu bằng 0)"
    ),
  password: z
    .string()
    .min(1, "Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(50, "Mật khẩu không được vượt quá 50 ký tự"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
