import { body, param, query } from "express-validator";

export const validateTokenParam = [
  param("token")
    .trim()
    .notEmpty()
    .withMessage("Token không được để trống")
    .isUUID()
    .withMessage("Token không hợp lệ"),
];

export const checkParentQuery = [
  query("phone")
    .trim()
    .notEmpty()
    .withMessage("Số điện thoại không được để trống")
    .matches(/^(0[3-9][0-9]{8})$/)
    .withMessage("Số điện thoại không hợp lệ"),
];

export const createDraftValidation = [
  body("token")
    .trim()
    .notEmpty()
    .withMessage("Token không được để trống")
    .isUUID()
    .withMessage("Token không hợp lệ"),

  body("candidateData.fullname")
    .trim()
    .notEmpty()
    .withMessage("Họ tên không được để trống")
    .isLength({ min: 2, max: 100 })
    .withMessage("Họ tên phải từ 2-100 ký tự"),

  body("candidateData.email")
    .trim()
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),

  body("candidateData.phone")
    .trim()
    .notEmpty()
    .withMessage("Số điện thoại không được để trống")
    .matches(/^(0[3-9][0-9]{8})$/)
    .withMessage("Số điện thoại không hợp lệ"),

  body("candidateData.cccd")
    .trim()
    .notEmpty()
    .withMessage("CCCD không được để trống")
    .matches(/^[0-9]{12}$/)
    .withMessage("CCCD phải gồm 12 chữ số"),

  body("candidateData.dob")
    .notEmpty()
    .withMessage("Ngày sinh không được để trống")
    .isISO8601()
    .withMessage("Ngày sinh không hợp lệ"),

  body("candidateData.password")
    .trim()
    .notEmpty()
    .withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),

  body("scheduleId")
    .notEmpty()
    .withMessage("Lịch học không được để trống")
    .isInt({ min: 1 })
    .withMessage("Lịch học không hợp lệ"),

  // Parent data is optional
  body("parentData.fullname")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Họ tên phụ huynh phải từ 2-100 ký tự"),

  body("parentData.email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Email phụ huynh không hợp lệ")
    .normalizeEmail(),

  body("parentData.phone")
    .optional()
    .trim()
    .matches(/^(0[3-9][0-9]{8})$/)
    .withMessage("SĐT phụ huynh không hợp lệ"),

  body("parentData.password")
    .optional()
    .trim()
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phụ huynh phải có ít nhất 6 ký tự"),
];

export const createPaymentUrlValidation = [
  body("draftId")
    .notEmpty()
    .withMessage("Draft ID không được để trống")
    .isInt({ min: 1 })
    .withMessage("Draft ID không hợp lệ"),
];

export const enrollmentStatusParam = [
  param("txnRef")
    .trim()
    .notEmpty()
    .withMessage("TxnRef không được để trống"),
];
