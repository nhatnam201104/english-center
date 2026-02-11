import { body } from "express-validator";
import type { ValidationChain } from "express-validator";

export const createScheduleValidation: ValidationChain[] = [
  body("teacherId")
    .isInt({ min: 1 })
    .withMessage("teacherId không hợp lệ"),

  body("classroomId")
    .isInt({ min: 1 })
    .withMessage("classroomId không hợp lệ"),

  body("coursesId")
    .isInt({ min: 1 })
    .withMessage("coursesId không hợp lệ"),

  body("totalSlot")
    .isInt({ min: 1 })
    .withMessage("totalSlot phải lớn hơn 0"),

  body("startTime")
    .isISO8601()
    .withMessage("startTime phải là ISO DateTime"),

  body("endTime")
    .isISO8601()
    .withMessage("endTime phải là ISO DateTime"),
];
