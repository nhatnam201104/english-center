import { body } from "express-validator";

export const createListeningValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên bài kiểm tra không được để trống")
    .isLength({ min: 3, max: 200 })
    .withMessage("Tên bài kiểm tra phải từ 3-200 ký tự"),

  body("direction")
    .trim()
    .notEmpty()
    .withMessage("Hướng dẫn không được để trống")
    .isLength({ max: 5000 })
    .withMessage("Hướng dẫn không được vượt quá 5000 ký tự"),
];

export const createReadingValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên bài kiểm tra không được để trống")
    .isLength({ min: 3, max: 200 })
    .withMessage("Tên bài kiểm tra phải từ 3-200 ký tự"),

  body("direction")
    .trim()
    .notEmpty()
    .withMessage("Hướng dẫn không được để trống")
    .isLength({ max: 5000 })
    .withMessage("Hướng dẫn không được vượt quá 5000 ký tự"),
];

export const updateLRValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Tên bài kiểm tra phải từ 3-200 ký tự"),

  body("direction")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Hướng dẫn không được vượt quá 5000 ký tự"),
];

export const answerKeyValidation = [
  body("answers")
    .isArray({ min: 1 })
    .withMessage("Danh sách đáp án không được trống"),

  body("answers.*.index")
    .isInt({ min: 1, max: 200 })
    .withMessage("Chỉ số câu hỏi phải là số nguyên từ 1-200")
    .toInt(),

  body("answers.*.answer")
    .trim()
    .notEmpty()
    .withMessage("Đáp án không được để trống")
    .isIn(["A", "B", "C", "D"])
    .withMessage("Đáp án phải là A, B, C hoặc D"),
];

export const createPartOneQuestionValidation = [
  body("index")
    .isInt({ min: 1 })
    .withMessage("Chỉ số câu hỏi phải là số nguyên dương"),
  // audio and image are validated in the controller via req.files (multer)
  // question is not required for Part 1 (only image + audio needed)
];

export const createPartTwoQuestionValidation = [
  body("index")
    .isInt({ min: 1 })
    .withMessage("Chỉ số câu hỏi phải là số nguyên dương"),
  // audio is validated in the controller via req.files (multer)
  // question uses schema default: "Mark your answer on your answer sheet."
];

export const createPartFiveQuestionValidation = [
  body("index")
    .isInt({ min: 1 })
    .withMessage("Chỉ số câu hỏi phải là số nguyên dương"),

  body("question")
    .trim()
    .notEmpty()
    .withMessage("Câu hỏi không được để trống"),

  body("answerA")
    .trim()
    .notEmpty()
    .withMessage("Đáp án A không được để trống"),

  body("answerB")
    .trim()
    .notEmpty()
    .withMessage("Đáp án B không được để trống"),

  body("answerC")
    .trim()
    .notEmpty()
    .withMessage("Đáp án C không được để trống"),

  body("answerD")
    .trim()
    .notEmpty()
    .withMessage("Đáp án D không được để trống"),
];

export const createGroupValidation = [
  body("index")
    .isInt({ min: 1 })
    .withMessage("Chỉ số nhóm phải là số nguyên dương"),

  body("fromQuestionIndex")
    .isInt({ min: 1 })
    .withMessage("Chỉ số câu hỏi bắt đầu phải là số nguyên dương"),

  body("toQuestionIndex")
    .isInt({ min: 1 })
    .withMessage("Chỉ số câu hỏi kết thúc phải là số nguyên dương")
    .custom((toQ, { req }) => {
      if (toQ <= req.body.fromQuestionIndex) {
        throw new Error(
          "Chỉ số kết thúc phải lớn hơn chỉ số bắt đầu",
        );
      }
      return true;
    }),

  body("questions")
    .customSanitizer((value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return value;
    })
    .isArray({ min: 1 })
    .withMessage("Danh sách câu hỏi không được trống"),

  body("questions.*.index")
    .isInt({ min: 1 })
    .withMessage("Chỉ số câu hỏi phải là số nguyên dương"),

  body("questions.*.question")
    .trim()
    .notEmpty()
    .withMessage("Câu hỏi không được để trống"),

  body("questions.*.answerA")
    .trim()
    .notEmpty()
    .withMessage("Đáp án A không được để trống"),

  body("questions.*.answerB")
    .trim()
    .notEmpty()
    .withMessage("Đáp án B không được để trống"),

  body("questions.*.answerC")
    .trim()
    .notEmpty()
    .withMessage("Đáp án C không được để trống"),

  body("questions.*.answerD")
    .trim()
    .notEmpty()
    .withMessage("Đáp án D không được để trống"),
];

export const updatePartDirectionValidation = [
  body("direction")
    .trim()
    .notEmpty()
    .withMessage("Hướng dẫn không được để trống")
    .isLength({ max: 5000 })
    .withMessage("Hướng dẫn không được vượt quá 5000 ký tự"),
];
