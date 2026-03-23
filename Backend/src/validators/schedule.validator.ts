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

  body("startTime")
    .isISO8601()
    .withMessage("startTime phải là ISO DateTime"),

  body("endTime")
    .isISO8601()
    .withMessage("endTime phải là ISO DateTime"),
];

export const updateScheduleValidation: ValidationChain[] = [
  body("teacherId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("teacherId không hợp lệ"),

  body("classroomId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("classroomId không hợp lệ"),

  body("startTime")
    .optional()
    .isISO8601()
    .withMessage("startTime phải là ISO DateTime"),

  body("endTime")
    .optional()
    .isISO8601()
    .withMessage("endTime phải là ISO DateTime"),

  body("sessions")
    .optional()
    .isArray({ min: 1 })
    .withMessage("sessions phải là mảng và có ít nhất 1 phần tử"),

  body("sessions.*.day")
    .optional()
    .isIn([
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ])
    .withMessage("day không hợp lệ"),

  body("sessions.*.startTime")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("sessions.startTime phải có định dạng HH:mm"),

  body("sessions.*.endTime")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("sessions.endTime phải có định dạng HH:mm"),
];
