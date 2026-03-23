import { body } from "express-validator";

export const createCourseTestValidation = [
  body("courseId")
    .notEmpty()
    .withMessage("ID khóa học không được để trống")
    .isInt({ min: 1 })
    .withMessage("ID khóa học phải là số nguyên dương"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên bài kiểm tra không được để trống")
    .isLength({ min: 2, max: 200 })
    .withMessage("Tên bài kiểm tra phải từ 2-200 ký tự"),
];

export const updateCourseTestValidation = [
  body("courseId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("ID khóa học phải là số nguyên dương"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Tên bài kiểm tra phải từ 2-200 ký tự"),

  body("index")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Thứ tự bài kiểm tra phải là số nguyên dương"),
];
