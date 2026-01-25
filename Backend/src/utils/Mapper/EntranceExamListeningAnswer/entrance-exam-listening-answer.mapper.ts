import { EntranceExamListeningAnswerResponse } from "../../../DTOS/EntranceExamListeningAnswer";

export const toEntranceExamListeningAnswerResponse = (
  entranceExamListeningAnswer: any,
): EntranceExamListeningAnswerResponse => {
  return {
    id: entranceExamListeningAnswer.id,
    entranceExamListeningId:
      entranceExamListeningAnswer.entranceExamListeningId,
    part: entranceExamListeningAnswer.part,
    answer: entranceExamListeningAnswer.answer || undefined,
    isTrue: entranceExamListeningAnswer.isTrue,
    createdAt: entranceExamListeningAnswer.createdAt,
  };
};
