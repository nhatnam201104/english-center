import { body, param, query } from "express-validator";

const parentDataValidation = [
  body("parentData")
    .optional()
    .isObject()
    .withMessage("Dữ liệu phụ huynh không hợp lệ"),

  body("parentData.existingParentId")
    .optional({ values: "falsy" })
    .isInt({ min: 1 })
    .withMessage("ID phụ huynh không hợp lệ"),

  body("parentData.fullname")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Họ tên phụ huynh phải từ 2-100 ký tự"),

  body("parentData.email")
    .optional({ values: "falsy" })
    .trim()
    .isEmail()
    .withMessage("Email phụ huynh không hợp lệ")
    .normalizeEmail(),

  body("parentData.phone")
    .optional({ values: "falsy" })
    .trim()
    .matches(/^(0[3-9][0-9]{8})$/)
    .withMessage("SĐT phụ huynh không hợp lệ"),

  body("parentData.password")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phụ huynh phải có ít nhất 6 ký tự"),

  body("parentData").custom((value) => {
    if (!value) return true;

    if (value.existingParentId) {
      return true;
    }

    const missingFields: string[] = [];
    if (!value.fullname) missingFields.push("fullname");
    if (!value.email) missingFields.push("email");
    if (!value.phone) missingFields.push("phone");
    if (!value.password) missingFields.push("password");

    if (missingFields.length > 0) {
      throw new Error(
        "Khi tạo phụ huynh mới, cần nhập đầy đủ: fullname, email, phone, password",
      );
    }

    return true;
  }),
];

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

  ...parentDataValidation,
];

export const createStudentDraftValidation = [
  body("scheduleId")
    .notEmpty()
    .withMessage("Lịch học không được để trống")
    .isInt({ min: 1 })
    .withMessage("Lịch học không hợp lệ"),

  ...parentDataValidation,
];

export const createPaymentUrlValidation = [
  body("draftId")
    .notEmpty()
    .withMessage("Draft ID không được để trống")
    .isInt({ min: 1 })
    .withMessage("Draft ID không hợp lệ"),

  body("returnUrl")
    .optional({ values: "falsy" })
    .isURL({
      require_protocol: true,
      require_tld: false,
      allow_underscores: true,
    })
    .withMessage("Return URL không hợp lệ"),
];

export const enrollmentStatusParam = [
  param("txnRef")
    .trim()
    .notEmpty()
    .withMessage("TxnRef không được để trống"),
];
