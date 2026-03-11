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
          const isSelected = selectedAnswer === answerId;

          return (
            <button
              key={label}
              onClick={() => onAnswer(question.index, answerId)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border text-left text-sm transition-all duration-200 ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200"
                  : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
              }`}
            >
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isSelected
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {label}
              </span>
              <span className="text-gray-700">{answers[idx]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ReadingQuestion;
