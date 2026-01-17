import { body, ValidationChain } from "express-validator";

export const registerValidation: ValidationChain[] = [
  body("fullName")
    .notEmpty()
    .withMessage("Tên không được để trống")
    .isLength({ min: 3 })
    .withMessage("Tên không được ít hơn 3 ký tự"),
  body("roleId").isInt().withMessage("Invalid role "),
  body("phone")
    .isMobilePhone("vi-VN")
    .withMessage("Vui lòng nhập số điện thoại hợp lệ"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Mật khẩu phải có ít nhất 8 ký tự")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số"
    ),
];

export const loginValidation: ValidationChain[] = [
  body("phone")
    .isMobilePhone("vi-VN")
    .withMessage("Vui lòng nhập số điện thoại hợp lệ"),
  body("password").notEmpty().withMessage("Mật khẩu là bắt buộc"),
];
