import { body } from "express-validator";

export const createClassroomValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên lớp học không được để trống")
    .isLength({ min: 2, max: 100 })
    .withMessage("Tên lớp học phải từ 2-100 ký tự"),

  body("maxSize")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Sức chứa tối đa phải là số nguyên không âm"),
];

export const updateClassroomValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Tên lớp học phải từ 2-100 ký tự"),

  body("maxSize")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Sức chứa tối đa phải là số nguyên không âm"),
];
