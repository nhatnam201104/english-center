import { Request } from 'express';
import {
  createSpeakingExamSchema,
  updateSpeakingExamSchema,
  createSpeakingPart1Schema,
  updateSpeakingPart1Schema,
  createSpeakingPart2Schema,
  updateSpeakingPart2Schema,
  createSpeakingPart3Schema,
  updateSpeakingPart3Schema,
  createSpeakingPart4Schema,
  updateSpeakingPart4Schema,
  createSpeakingPart5Schema,
  updateSpeakingPart5Schema,
  idParamSchema,
  indexParamSchema,
} from './speaking.zod';

// Main Exam Validations
export const createSpeakingValidation = (req: Request, _res: any, next: any) => {
  const result = createSpeakingExamSchema.safeParse(req.body);
  if (!result.success) {
    return next({
      status: 400,
      message: result.error.issues[0].message,
      errors: result.error.issues,
    });
  }
  next();
};

export const updateSpeakingValidation = (req: Request, _res: any, next: any) => {
  const result = updateSpeakingExamSchema.safeParse(req.body);
  if (!result.success) {
    return next({
      status: 400,
      message: result.error.issues[0].message,
      errors: result.error.issues,
    });
  }
  next();
};

// Parameter Validations
export const idParamValidation = (req: Request, _res: any, next: any) => {
  const result = idParamSchema.safeParse(req.params);
  if (!result.success) {
    return next({
      status: 400,
      message: result.error.issues[0].message,
      errors: result.error.issues,
    });
  }
  next();
};

export const indexParamValidation = (req: Request, _res: any, next: any) => {
  const result = indexParamSchema.safeParse(req.params);
  if (!result.success) {
    return next({
      status: 400,
      message: result.error.issues[0].message,
      errors: result.error.issues,
    });
  }
  next();
};

// Part 1 Validations
export const speakingPart1Validation = (req: Request, _res: any, next: any) => {
  const schema = req.method === 'POST' ? createSpeakingPart1Schema : updateSpeakingPart1Schema;
  
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next({
      status: 400,
      message: result.error.issues[0].message,
      errors: result.error.issues,
    });
  }
  next();
};

// Part 2 Validations
export const speakingPart2Validation = (req: Request, _res: any, next: any) => {
  const schema = req.method === 'POST' ? createSpeakingPart2Schema : updateSpeakingPart2Schema;
  
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next({
      status: 400,
      message: result.error.issues[0].message,
      errors: result.error.issues,
    });
  }
  next();
};

// Part 3 Validations
export const speakingPart3Validation = (req: Request, _res: any, next: any) => {
  const schema = req.method === 'POST' ? createSpeakingPart3Schema : updateSpeakingPart3Schema;
  
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next({
      status: 400,
      message: result.error.issues[0].message,
      errors: result.error.issues,
    });
  }
  next();
};

// Part 4 Validations
export const speakingPart4Validation = (req: Request, _res: any, next: any) => {
  const schema = req.method === 'POST' ? createSpeakingPart4Schema : updateSpeakingPart4Schema;
  
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next({
      status: 400,
      message: result.error.issues[0].message,
      errors: result.error.issues,
    });
  }
  next();
};

// Part 5 Validations
export const speakingPart5Validation = (req: Request, _res: any, next: any) => {
  const schema = req.method === 'POST' ? createSpeakingPart5Schema : updateSpeakingPart5Schema;
  
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next({
      status: 400,
      message: result.error.issues[0].message,
      errors: result.error.issues,
    });
  }
  next();
};