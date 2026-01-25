import { EntranceExamResponse } from "../../../DTOS/EntranceExam";

export const toEntranceExamResponse = (
  entranceExam: any,
): EntranceExamResponse => {
  return {
    id: entranceExam.id,
    name: entranceExam.name,
    type: entranceExam.type,
    audio: entranceExam.audio || undefined,
    createdAt: entranceExam.createdAt,
    updatedAt: entranceExam.updatedAt,
  };
};
