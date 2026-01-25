import { EntranceExamReadingQuestionResponse } from "../../../DTOS/EntranceExamReadingQuestion";

export const toEntranceExamReadingQuestionResponse = (
  entranceExamReadingQuestion: any,
): EntranceExamReadingQuestionResponse => {
  return {
    id: entranceExamReadingQuestion.id,
    entranceExamId: entranceExamReadingQuestion.entranceExamId,
    index: entranceExamReadingQuestion.index,
    part: entranceExamReadingQuestion.part,
    question: entranceExamReadingQuestion.question,
    image: entranceExamReadingQuestion.image || undefined,
    createdAt: entranceExamReadingQuestion.createdAt,
  };
};
