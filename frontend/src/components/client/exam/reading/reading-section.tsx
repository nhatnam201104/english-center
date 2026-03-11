import { Typography, Button } from "@material-tailwind/react";
import { useState } from "react";
import type { ReadingPartData } from "../../../../types/entrance-exam/candidate.types";
import ReadingQuestion from "./reading-question";
import AnswerPalette from "../answer-palette";
import CountdownTimer from "../countdown-timer";

interface ReadingSectionProps {
  parts: ReadingPartData[];
  answers: Record<string, number>;
  readingTimeMinutes: number;
  onAnswer: (questionIndex: number, answerId: number) => void;
  onSubmit: () => void;
  onTimeUp: () => void;
  submitting: boolean;
}

const ReadingSection = ({
  parts,
  answers,
  readingTimeMinutes,
  onAnswer,
  onSubmit,
  onTimeUp,
  submitting,
}: ReadingSectionProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);

  const totalQuestions = parts.reduce((sum, part) => {
    if (part.type === "single" && part.questions) return sum + part.questions.length;
    if (part.type === "group" && part.groups)
      return sum + part.groups.reduce((gs, g) => gs + g.questions.length, 0);
    return sum;
  }, 0);

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Questions column */}
        <div className="flex-1 space-y-6">
        {parts.map((part) => {
          // Compute question range for this part
          const partQuestions: number[] = [];
          if (part.type === "single" && part.questions) {
            part.questions.forEach((q) => partQuestions.push(q.index));
          }
          if (part.type === "group" && part.groups) {
            part.groups.forEach((g) =>
              g.questions.forEach((q) => partQuestions.push(q.index)),
            );
          }
          const partFrom = partQuestions.length ? Math.min(...partQuestions) : null;
          const partTo = partQuestions.length ? Math.max(...partQuestions) : null;

          return (
            <div key={part.partNo}>
              {/* Part header */}
              <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-4 mb-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        Part {part.partNo}
                      </span>
                      <Typography variant="h6" className="font-bold text-blue-gray-800">
                        {part.partName}
                      </Typography>
                    </div>
                    {part.direction && (
                      <Typography variant="small" className="text-gray-500 italic">
                        {part.direction}
                      </Typography>
                    )}
                  </div>
                  {partFrom !== null && (
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full whitespace-nowrap">
                      Câu {partFrom} – {partTo}
                    </span>
                  )}
                </div>
              </div>

              {/* Single questions (Part 5) */}
              {part.type === "single" && part.questions && (
                <div className="space-y-3">
                  {part.questions.map((q) => (
                    <div
                      key={q.index}
                      id={`R-q-${q.index}`}
                      className={`bg-white rounded-xl border p-5 transition-shadow hover:shadow-md ${
                        answers[`R-${q.index}`] ? "border-emerald-200" : "border-gray-200"
                      }`}
                    >
                      <ReadingQuestion
                        question={q}
                        selectedAnswer={answers[`R-${q.index}`] ?? null}
                        onAnswer={onAnswer}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Group questions (Part 6, 7) */}
              {part.type === "group" && part.groups && (
                <div className="space-y-5">
                  {part.groups.map((g) => (
                    <div
                      key={g.index}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                    >
                      {/* Group title bar */}
                      <div className="flex items-center justify-between bg-gray-50 border-b px-4 py-2.5">
                        <span className="text-sm font-semibold text-gray-700">
                          Đoạn văn {g.index}
                        </span>
                        <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                          Câu {g.fromQuestionIndex} – {g.toQuestionIndex}
                        </span>
                      </div>

                      <div className="p-5 space-y-4">
                        {/* Image */}
                        {g.image && (
                          <div className="rounded-lg overflow-hidden border bg-gray-50">
                            <img
                              src={g.image}
                              alt={`Group ${g.index}`}
                              className="w-full max-h-72 object-contain"
                            />
                          </div>
                        )}

                        {/* Passage */}
                        {g.question && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 max-h-72 overflow-y-auto">
                            <Typography
                              variant="small"
                              className="text-gray-800 leading-relaxed whitespace-pre-wrap"
                            >
                              {g.question}
                            </Typography>
                          </div>
                        )}

                        {/* Questions */}
                        <div className="divide-y divide-gray-100">
                          {g.questions.map((q) => (
                            <div
                              key={q.index}
                              id={`R-q-${q.index}`}
                              className="py-4 first:pt-0 last:pb-0"
                            >
                              <ReadingQuestion
                                question={q}
                                selectedAnswer={answers[`R-${q.index}`] ?? null}
                                onAnswer={onAnswer}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Submit button */}
        <div className="flex justify-end pt-4 pb-8">
          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 normal-case text-base"
            onClick={onSubmit}
            loading={submitting}
          >
            Nộp bài thi ✓
          </Button>
        </div>
        </div>{/* end flex-1 */}

        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="sticky top-6 space-y-4">
            {/* Timer card */}
            <div className="bg-white rounded-xl border border-emerald-200 shadow-sm p-4 text-center">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">
                Thời gian còn lại
              </p>
              <CountdownTimer
                totalSeconds={readingTimeMinutes * 60}
                onExpire={onTimeUp}
              />
            </div>

            <AnswerPalette
              totalQuestions={totalQuestions}
              section="R"
              answers={answers}
              currentQuestion={currentQuestion}
              onJumpTo={setCurrentQuestion}
            />
          </div>
        </div>
      </div>{/* end flex row */}
    </div>
  );
};

export default ReadingSection;
