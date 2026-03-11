import { body } from "express-validator";

export const registerCandidateValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email không được để trống")
    .isEmail().withMessage("Email không hợp lệ"),
  body("fullname")
    .trim()
    .notEmpty().withMessage("Họ tên không được để trống")
    .isLength({ min: 2, max: 200 }).withMessage("Họ tên phải từ 2-200 ký tự"),
  body("phone")
    .trim()
    .notEmpty().withMessage("Số điện thoại không được để trống")
    .matches(/^(0[3-9][0-9]{8})$/).withMessage("Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)"),
  body("cccd")
    .trim()
    .notEmpty().withMessage("CCCD không được để trống")
    .matches(/^\d{12}$/).withMessage("CCCD phải là 12 chữ số"),
  body("examType")
    .notEmpty().withMessage("Loại bài thi không được để trống")
    .isIn(["READING_LISTENING", "SPEAKING_WRITING"]).withMessage("Loại bài thi không hợp lệ"),
];

export const saveAnswerValidation = [
  body("section")
    .notEmpty().withMessage("Section không được để trống")
    .isIn(["LISTENING", "READING"]).withMessage("Section không hợp lệ"),
  body("questionIndex")
    .notEmpty().withMessage("Câu hỏi không được để trống")
    .isInt({ min: 1 }).withMessage("questionIndex phải là số nguyên dương"),
  body("answerId")
    .notEmpty().withMessage("Đáp án không được để trống")
    .isInt({ min: 1, max: 4 }).withMessage("answerId phải từ 1-4 (A-D)"),
];

export const violationValidation = [
  body("eventType")
    .notEmpty().withMessage("eventType không được để trống")
    .isIn(["TAB_SWITCH", "FULLSCREEN_EXIT", "FOCUS_LOST"]).withMessage("eventType không hợp lệ"),
];
