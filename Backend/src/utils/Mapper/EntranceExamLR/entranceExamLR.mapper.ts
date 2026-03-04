import {
  ListeningResponse,
  ReadingResponse,
  PartSummary,
  AnswerKeyItem,
} from "../../../DTOS/EntranceExamLR";
import {
  buildEntranceExamLRAudioUrl,
  buildEntranceExamLRImageUrl,
} from "../../fileUrl";

/* ─── helpers ─── */

const LISTENING_PART_META: Record<
  string,
  { partNo: number; partName: string }
> = {
  partOnes: { partNo: 1, partName: "Part 1 – Photographs" },
  partTwos: { partNo: 2, partName: "Part 2 – Question-Response" },
  partThrees: { partNo: 3, partName: "Part 3 – Conversations" },
  partFours: { partNo: 4, partName: "Part 4 – Talks" },
};

const READING_PART_META: Record<
  string,
  { partNo: number; partName: string }
> = {
  partFives: { partNo: 5, partName: "Part 5 – Incomplete Sentences" },
  partSixes: { partNo: 6, partName: "Part 6 – Text Completion" },
  partSevens: { partNo: 7, partName: "Part 7 – Reading Comprehension" },
};

const buildPartSummary = (
  part: any,
  partNo: number,
  partName: string,
): PartSummary => ({
  id: part.id,
  partNo,
  partName,
  direction: part.direction,
  totalQuestion: part.totalQuestion,
  quantityQuestionDone: part.quantityQuestionDone,
  isDone: part.isDone,
});

/* ─── Listening mapper ─── */

export const toListeningResponse = (exam: any): ListeningResponse => {
  const partsSummary: PartSummary[] = [];

  for (const [key, meta] of Object.entries(LISTENING_PART_META)) {
    const parts = exam[key] as any[] | undefined;
    if (parts && parts.length > 0) {
      // Each listening exam has exactly one of each part
      partsSummary.push(
        buildPartSummary(parts[0], meta.partNo, meta.partName),
      );
    }
  }

  partsSummary.sort((a, b) => a.partNo - b.partNo);

  return {
    id: exam.id,
    name: exam.name,
    direction: exam.direction,
    isDone: exam.isDone,
    isActive: exam.isActive,
    createdAt: exam.createdAt,
    updatedAt: exam.updatedAt,
    partsSummary,
    answerKeyCount: exam.trueAnswers?.length ?? 0,
  };
};

/* ─── Reading mapper ─── */

export const toReadingResponse = (exam: any): ReadingResponse => {
  const partsSummary: PartSummary[] = [];

  for (const [key, meta] of Object.entries(READING_PART_META)) {
    const parts = exam[key] as any[] | undefined;
    if (parts && parts.length > 0) {
      partsSummary.push(
        buildPartSummary(parts[0], meta.partNo, meta.partName),
      );
    }
  }

  partsSummary.sort((a, b) => a.partNo - b.partNo);

  return {
    id: exam.id,
    name: exam.name,
    direction: exam.direction,
    isDone: exam.isDone,
    isActive: exam.isActive,
    createdAt: exam.createdAt,
    updatedAt: exam.updatedAt,
    partsSummary,
    answerKeyCount: exam.trueAnswers?.length ?? 0,
  };
};

/* ─── Part detail mappers (attach file URLs) ─── */

/** Map Part 1 questions – attach audio + image URLs */
export const mapPartOneQuestions = (questions: any[]) =>
  questions.map((q: any) => ({
    id: q.id,
    index: q.index,
    question: q.question,
    audio: buildEntranceExamLRAudioUrl(q.audio),
    image: buildEntranceExamLRImageUrl(q.image),
    createdAt: q.createdAt,
  }));

/** Map Part 2 questions – attach audio URL */
export const mapPartTwoQuestions = (questions: any[]) =>
  questions.map((q: any) => ({
    id: q.id,
    index: q.index,
    question: q.question,
    audio: buildEntranceExamLRAudioUrl(q.audio),
    createdAt: q.createdAt,
  }));

/** Map Part 3/4 groups – attach audio + image URLs + nested questions */
export const mapListeningGroups = (groups: any[]) =>
  groups.map((g: any) => ({
    id: g.id,
    index: g.index,
    audio: buildEntranceExamLRAudioUrl(g.audio),
    image: g.image ? buildEntranceExamLRImageUrl(g.image) : null,
    fromQuestionIndex: g.fromQuestionIndex,
    toQuestionIndex: g.toQuestionIndex,
    createdAt: g.createdAt,
    questions: (g.questions ?? []).map((q: any) => ({
      id: q.id,
      index: q.index,
      question: q.question,
      answerA: q.answerA,
      answerB: q.answerB,
      answerC: q.answerC,
      answerD: q.answerD,
    })),
  }));

/** Map Part 5 questions (no media) */
export const mapPartFiveQuestions = (questions: any[]) =>
  questions.map((q: any) => ({
    id: q.id,
    index: q.index,
    question: q.question,
    answerA: q.answerA,
    answerB: q.answerB,
    answerC: q.answerC,
    answerD: q.answerD,
    createdAt: q.createdAt,
  }));

/** Map Part 6/7 groups – attach image URL + nested questions */
export const mapReadingGroups = (groups: any[]) =>
  groups.map((g: any) => ({
    id: g.id,
    index: g.index,
    question: g.question ?? null,
    image: g.image ? buildEntranceExamLRImageUrl(g.image) : null,
    fromQuestionIndex: g.fromQuestionIndex,
    toQuestionIndex: g.toQuestionIndex,
    createdAt: g.createdAt,
    questions: (g.questions ?? []).map((q: any) => ({
      id: q.id,
      index: q.index,
      question: q.question,
      answerA: q.answerA,
      answerB: q.answerB,
      answerC: q.answerC,
      answerD: q.answerD,
    })),
  }));

/** Map answer key items */
export const mapAnswerKeys = (answers: any[]): AnswerKeyItem[] =>
  answers
    .map((a: any) => ({ index: a.index, answer: a.answer }))
    .sort((a, b) => a.index - b.index);
