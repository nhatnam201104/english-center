import { body, param } from 'express-validator';

// Create Writing Exam
export const createWritingValidation = [
  body('name')
    .notEmpty()
    .withMessage('Tên đề thi không được để trống')
    .isString()
    .withMessage('Tên đề thi phải là chuỗi'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive phải là boolean'),
];

// Update Writing Exam
export const updateWritingValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID đề thi không được để trống')
    .isInt()
    .withMessage('ID đề thi phải là số nguyên'),
  body('name')
    .optional()
    .isString()
    .withMessage('Tên đề thi phải là chuỗi'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive phải là boolean'),
];

// Create/Update Part 1
export const part1Validation = [
  param('id')
    .notEmpty()
    .withMessage('ID đề thi không được để trống')
    .isInt()
    .withMessage('ID đề thi phải là số nguyên'),
  body('imageOne')
    .optional()
    .isString()
    .withMessage('Image One phải là chuỗi'),
  body('imageTwo')
    .optional()
    .isString()
    .withMessage('Image Two phải là chuỗi'),
  body('imageThree')
    .optional()
    .isString()
    .withMessage('Image Three phải là chuỗi'),
  body('imageFour')
    .optional()
    .isString()
    .withMessage('Image Four phải là chuỗi'),
  body('imageFive')
    .optional()
    .isString()
    .withMessage('Image Five phải là chuỗi'),
];

// Create/Update Part 2
export const part2Validation = [
  param('id')
    .notEmpty()
    .withMessage('ID đề thi không được để trống')
    .isInt()
    .withMessage('ID đề thi phải là số nguyên'),
  body('imageSix')
    .optional()
    .isString()
    .withMessage('Image Six phải là chuỗi'),
  body('imageSeven')
    .optional()
    .isString()
    .withMessage('Image Seven phải là chuỗi'),
];

// Create/Update Part 3
export const part3Validation = [
  param('id')
    .notEmpty()
    .withMessage('ID đề thi không được để trống')
    .isInt()
    .withMessage('ID đề thi phải là số nguyên'),
  body('questionEight')
    .notEmpty()
    .withMessage('Question Eight không được để trống')
    .isString()
    .withMessage('Question Eight phải là chuỗi'),
];

// Validate index parameter for delete
export const indexParamValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID đề thi không được để trống')
    .isInt()
    .withMessage('ID đề thi phải là số nguyên'),
  param('index')
    .notEmpty()
    .withMessage('Index không được để trống')
    .isInt({ min: 1 })
    .withMessage('Index phải là số nguyên lớn hơn 0'),
];