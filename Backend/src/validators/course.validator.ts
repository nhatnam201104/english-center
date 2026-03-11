import { body } from "express-validator";

export const createCourseValidation = [
  body("type")
    .trim()
    .notEmpty()
    .withMessage("Loại khóa học không được để trống")
    .isIn(["COURSE", "TEST_PREPARATION"])
    .withMessage("Loại khóa học phải là COURSE hoặc TEST_PREPARATION"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên khóa học không được để trống")
    .isLength({ min: 2, max: 200 })
    .withMessage("Tên khóa học phải từ 2-200 ký tự"),

  body("courseSkill")
    .trim()
    .notEmpty()
    .withMessage("Kỹ năng khóa học không được để trống")
    .isIn(["READING_LISTENING", "SPEAKING_WRITING"])
    .withMessage(
      "Kỹ năng khóa học phải là READING_LISTENING hoặc SPEAKING_WRITING",
    ),

  body("price")
    .notEmpty()
    .withMessage("Giá khóa học không được để trống")
    .isFloat({ min: 0 })
    .withMessage("Giá khóa học phải là số không âm"),

  body("sale")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Giảm giá phải từ 0-100"),

  body("totalSession")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Số buổi học phải là số nguyên không âm"),

  body("minBand")
    .if(body("type").equals("COURSE"))
    .notEmpty()
    .withMessage("Band tối thiểu là bắt buộc đối với loại COURSE")
    .isInt({ min: 0 })
    .withMessage("Band tối thiểu phải là số nguyên không âm"),

  body("maxBand")
    .if(body("type").equals("COURSE"))
    .notEmpty()
    .withMessage("Band tối đa là bắt buộc đối với loại COURSE")
    .isInt({ min: 0 })
    .withMessage("Band tối đa phải là số nguyên không âm")
    .custom((maxBand, { req }) => {
      if (req.body.minBand !== undefined && maxBand < req.body.minBand) {
        throw new Error("Band tối đa phải lớn hơn hoặc bằng band tối thiểu");
      }
      return true;
    }),

  body("minBand")
    .if(body("type").equals("TEST_PREPARATION"))
    .optional()
    .isInt({ min: 0, max: 990 })
    .withMessage("Band tối thiểu phải là số nguyên không âm"),

  body("maxBand")
    .if(body("type").equals("TEST_PREPARATION"))
    .optional()
    .isInt({ min: 0, max: 990 })
    .withMessage("Band tối đa phải là số nguyên không âm")
    .custom((maxBand, { req }) => {
      if (req.body.minBand !== undefined && maxBand < req.body.minBand) {
        throw new Error("Band tối đa phải lớn hơn hoặc bằng band tối thiểu");
      }
      return true;
    }),
];

export const updateCourseValidation = [
  body("type")
    .optional()
    .trim()
    .isIn(["COURSE", "TEST_PREPARATION"])
    .withMessage("Loại khóa học phải là COURSE hoặc TEST_PREPARATION"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Tên khóa học phải từ 2-200 ký tự"),

  body("courseSkill")
    .optional()
    .trim()
    .isIn(["READING_LISTENING", "SPEAKING_WRITING"])
    .withMessage(
      "Kỹ năng khóa học phải là READING_LISTENING hoặc SPEAKING_WRITING",
    ),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Giá khóa học phải là số không âm"),

  body("sale")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Giảm giá phải từ 0-100"),

  body("totalSession")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Số buổi học phải là số nguyên không âm"),

  body("minBand")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Band tối thiểu phải là số nguyên không âm"),

  body("maxBand")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Band tối đa phải là số nguyên không âm")
    .custom((maxBand, { req }) => {
      if (req.body.minBand !== undefined && maxBand < req.body.minBand) {
        throw new Error("Band tối đa phải lớn hơn hoặc bằng band tối thiểu");
      }
      return true;
    }),
];
