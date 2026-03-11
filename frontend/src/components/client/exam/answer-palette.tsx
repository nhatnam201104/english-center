import { Typography } from "@material-tailwind/react";

interface AnswerPaletteProps {
  totalQuestions: number;
  section: "L" | "R";
  answers: Record<string, number>;
  currentQuestion: number;
  onJumpTo: (questionIndex: number) => void;
  readOnly?: boolean;
}

const AnswerPalette = ({
  totalQuestions,
  section,
  answers,
  currentQuestion,
  onJumpTo,
  readOnly = false,
}: AnswerPaletteProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <Typography variant="h6" className="mb-3 text-blue-gray-800">
        {section === "L" ? "Listening" : "Reading"} — Bảng đáp án
      </Typography>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const qIndex = i + 1;
          const key = `${section}-${qIndex}`;
          const answered = key in answers;
          const isCurrent = qIndex === currentQuestion;

          return (
            <button
              key={qIndex}
              onClick={() => !readOnly && onJumpTo(qIndex)}
              disabled={readOnly}
              className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-200 ${
                readOnly ? "cursor-default" : "cursor-pointer"
              } ${
                isCurrent
                  ? "ring-2 ring-blue-500 bg-blue-500 text-white"
                  : answered
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-600" +
                    (readOnly ? "" : " hover:bg-gray-200")
              }`}
            >
              {qIndex}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-500 inline-block" />
          Đã trả lời
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-100 border inline-block" />
          Chưa trả lời
        </span>
      </div>
    </div>
  );
};

export default AnswerPalette;
