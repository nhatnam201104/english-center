import { EntranceExamListeningQuestionResponse } from "../../../DTOS/EntranceExamListeningQuestion";

export const toEntranceExamListeningQuestionResponse = (
  entranceExamListeningQuestion: any,
): EntranceExamListeningQuestionResponse => {
  return {
    id: entranceExamListeningQuestion.id,
    entranceExamId: entranceExamListeningQuestion.entranceExamId,
    index: entranceExamListeningQuestion.index,
    part: entranceExamListeningQuestion.part,
    question: entranceExamListeningQuestion.question,
    image: entranceExamListeningQuestion.image || undefined,
    createdAt: entranceExamListeningQuestion.createdAt,
  };
};
