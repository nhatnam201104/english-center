import { Typography } from "@material-tailwind/react";
import type { ReadingQuestion as ReadingQuestionType } from "../../../../types/entrance-exam/candidate.types";

interface ReadingQuestionProps {
  question: ReadingQuestionType;
  selectedAnswer: number | null;
  onAnswer: (questionIndex: number, answerId: number) => void;
}

const LABELS = ["A", "B", "C", "D"] as const;

const ReadingQuestion = ({
  question,
  selectedAnswer,
  onAnswer,
}: ReadingQuestionProps) => {
  const answers = [
    question.answerA,
    question.answerB,
    question.answerC,
    question.answerD,
  ];

  return (
    <div className="space-y-3">
      <Typography className="text-gray-800 font-medium leading-relaxed">
        <span className="font-bold text-emerald-700">Câu {question.index}:</span>{" "}
        {question.question}
      </Typography>

      <div className="grid gap-2">
        {LABELS.map((label, idx) => {
          const answerId = idx + 1;
          const answerText = answers[idx];
          const isSelected = selectedAnswer === answerId;

          return (
            <label
              key={label}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border text-left text-sm transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200"
                  : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
              }`}
            >
              <input
                type="radio"
                name={`question-${question.index}`}
                value={answerId}
                checked={isSelected}
                onChange={() => onAnswer(question.index, answerId)}
                className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 focus:ring-emerald-500"
              />
              <span className="font-bold text-emerald-700 w-5">{label}</span>
              <span className={answerText ? 'text-gray-800' : 'text-gray-400 font-medium'}>
                {answerText || `(đáp án ${label})`}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default ReadingQuestion;
