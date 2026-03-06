import { body } from "express-validator";

export const createStudentValidation = [
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Họ tên không được để trống")
    .isLength({ min: 2, max: 100 })
    .withMessage("Họ tên phải từ 2-100 ký tự"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Số điện thoại không được để trống")
    .isMobilePhone("vi-VN")
    .withMessage("Số điện thoại không hợp lệ"),

  body("dob")
    .notEmpty()
    .withMessage("Ngày sinh không được để trống")
    .isISO8601()
    .withMessage("Ngày sinh không hợp lệ"),

  body("cccd")
    .notEmpty()
    .withMessage("CCCD không được để trống")
    .trim()
    .matches(/^[0-9]{12}$/)
    .withMessage("CCCD phải có đúng 12 chữ số"),

  body("scoreRl")
    .optional()
    .isInt({ min: 0, max: 990 })
    .withMessage("Điểm Reading & Listening phải từ 0-990"),

  body("scoreSw")
    .optional()
    .isInt({ min: 0, max: 400 })
    .withMessage("Điểm Speaking & Writing phải từ 0-400"),
];

export const updateStudentValidation = [
  body("fullname")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Họ tên phải từ 2-100 ký tự"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),

  body("phone")
    .optional()
    .trim()
    .isMobilePhone("vi-VN")
    .withMessage("Số điện thoại không hợp lệ"),

  body("dob")
    .optional()
    .isISO8601()
    .withMessage("Ngày sinh không hợp lệ"),

  body("cccd")
    .optional()
    .trim()
    .isLength({ min: 9, max: 12 })
    .withMessage("CCCD phải có 9-12 ký tự"),

  body("scoreRl")
    .optional()
    .isInt({ min: 0, max: 990 })
    .withMessage("Điểm Reading & Listening phải từ 0-990"),

  body("scoreSw")
    .optional()
    .isInt({ min: 0, max: 400 })
    .withMessage("Điểm Speaking & Writing phải từ 0-400"),
];
