import { EntranceExamResponse } from "../../../DTOS/EntranceExam";

export const toEntranceExamResponse = (
  entranceExam: any,
): EntranceExamResponse => {
  return {
    admissionId: entranceExam.admissionId,
    status: entranceExam.status,
    type: entranceExam.type,
    expiresAt: entranceExam.expiresAt,
    totalListening: entranceExam.totalListening,
    totalReading: entranceExam.totalReading,
    entranceScore: entranceExam.entranceScore,
    isDone: entranceExam.isDone,
  };
};
