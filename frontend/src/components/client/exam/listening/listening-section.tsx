import { Typography, Spinner } from "@material-tailwind/react";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import type {
  ListeningPartData,
  ListeningQuestion,
  ListeningGroup,
} from "../../../../types/entrance-exam/candidate.types";
import SingleQuestionPlayer from "./single-question-player";
import GroupPlayer from "./group-player";
import AnswerPalette from "../answer-palette";
import AutoCountdown from "./auto-countdown";

/* ------------------------------------------------------------------ */
/*  Slide types:                                                       */
/*  - single/group: question slides (advance by audio countdown)      */
/*  - break: 15-second inter-part rest screen (auto-advances)         */
/* ------------------------------------------------------------------ */
type Slide =
  | { kind: "single"; partNo: number; partName: string; direction?: string; question: ListeningQuestion }
  | { kind: "group"; partNo: number; partName: string; direction?: string; group: ListeningGroup }
  | { kind: "break"; nextPartNo: number; nextPartName: string; nextDirection?: string };

const PART_BREAK_SECONDS = 15;

interface ListeningSectionProps {
  parts: ListeningPartData[];
  answers: Record<string, number>;
  onAnswer: (questionIndex: number, answerId: number) => void;
  onSubmit: () => Promise<void>;
  submitting: boolean;
}

const ListeningSection = ({
  parts,
  answers,
  onAnswer,
  onSubmit,
  submitting,
}: ListeningSectionProps) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [allSlidesFinished, setAllSlidesFinished] = useState(false);
  const autoSubmittedRef = useRef(false);

  // Auto-submit as soon as all slides are done — no manual button needed
  useEffect(() => {
    if (allSlidesFinished && !autoSubmittedRef.current && !submitting) {
      autoSubmittedRef.current = true;
      onSubmit();
    }
  }, [allSlidesFinished, submitting, onSubmit]);

  /* ---------- Build flat slide list from parts with inter-part breaks ---------- */
  const slides: Slide[] = useMemo(() => {
    const result: Slide[] = [];
    let lastPartNo: number | null = null;

    for (const part of parts) {
      // Insert 15s break slide between parts
      if (lastPartNo !== null && lastPartNo !== part.partNo) {
        result.push({
          kind: "break",
          nextPartNo: part.partNo,
          nextPartName: part.partName,
          nextDirection: part.direction,
        });
      }
      lastPartNo = part.partNo;

      if (part.type === "single" && part.questions) {
        for (const q of part.questions) {
          result.push({
            kind: "single",
            partNo: part.partNo,
            partName: part.partName,
            direction: part.direction,
            question: q,
          });
        }
      }
      if (part.type === "group" && part.groups) {
        for (const g of part.groups) {
          result.push({
            kind: "group",
            partNo: part.partNo,
            partName: part.partName,
            direction: part.direction,
            group: g,
          });
        }
      }
    }
    return result;
  }, [parts]);

  /* ---------- Total question count (for palette) — excludes break slides ---------- */
  const totalQuestions = useMemo(
    () =>
      slides.reduce((sum, s) => {
        if (s.kind === "single") return sum + 1;
        if (s.kind === "group") return sum + s.group.questions.length;
        return sum; // break slides don't count
      }, 0),
    [slides],
  );

  /* ---------- Current question index for palette highlight ---------- */
  const currentQuestionIndex = useMemo(() => {
    const slide = slides[currentSlideIndex];
    if (!slide) return 1;
    if (slide.kind === "single") return slide.question.index;
    if (slide.kind === "group") return slide.group.fromQuestionIndex;
    // break slide: peek at the next question slide's first index
    for (let i = currentSlideIndex + 1; i < slides.length; i++) {
      const s = slides[i];
      if (s.kind === "single") return s.question.index;
      if (s.kind === "group") return s.group.fromQuestionIndex;
    }
    return 1;
  }, [slides, currentSlideIndex]);

  /* ---------- Advance to next slide ---------- */
  const handleSlideFinished = useCallback(() => {
    setCurrentSlideIndex((prev) => {
      const next = prev + 1;
      if (next >= slides.length) {
        setAllSlidesFinished(true);
        return prev; // stay on last
      }
      return next;
    });
  }, [slides.length]);

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white">
          <Typography variant="h5" className="font-bold">
            LISTENING SECTION
          </Typography>
          <Typography variant="small" className="opacity-80">
            Nghe và chọn đáp án đúng — Câu hỏi sẽ tự động chuyển sau khi audio
            kết thúc
          </Typography>
        </div>

        {/* Progress bar */}
        <div className="bg-gray-100 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${((currentSlideIndex + (allSlidesFinished ? 1 : 0)) / slides.length) * 100}%`,
            }}
          />
        </div>

        {/* Part info — only for question slides */}
        {currentSlide && currentSlide.kind !== "break" && (
          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
            <Typography
              variant="h6"
              className="font-bold text-blue-gray-800"
            >
              Part {currentSlide.partNo}: {currentSlide.partName}
            </Typography>
            {currentSlide.direction && (
              <Typography
                variant="small"
                className="text-gray-600 mt-1 italic"
              >
                {currentSlide.direction}
              </Typography>
            )}
          </div>
        )}

        {/* Inter-part break slide */}
        {currentSlide?.kind === "break" && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-8 text-center space-y-4">
            <div className="text-4xl">☕</div>
            <Typography variant="h5" className="font-bold text-amber-800">
              Nghỉ giữa phần
            </Typography>
            <Typography className="text-amber-700">
              Sắp bắt đầu{" "}
              <span className="font-semibold">
                Part {currentSlide.nextPartNo}: {currentSlide.nextPartName}
              </span>
            </Typography>
            {currentSlide.nextDirection && (
              <Typography variant="small" className="text-amber-600 italic">
                {currentSlide.nextDirection}
              </Typography>
            )}
            <div className="flex flex-col items-center gap-2 pt-2">
              <Typography variant="small" className="text-gray-500">
                Tự động tiếp tục sau
              </Typography>
              <AutoCountdown
                seconds={PART_BREAK_SECONDS}
                onExpire={handleSlideFinished}
              />
            </div>
          </div>
        )}

        {/* Render current slide only */}
        {currentSlide?.kind === "single" && (
          <SingleQuestionPlayer
            key={`single-${currentSlide.question.index}`}
            question={currentSlide.question}
            selectedAnswer={answers[`L-${currentSlide.question.index}`] ?? null}
            onAnswer={onAnswer}
            onFinished={handleSlideFinished}
            isCurrent={true}
            answerCount={currentSlide.partNo === 2 ? 3 : 4}
          />
        )}

        {currentSlide?.kind === "group" && (
          <GroupPlayer
            key={`group-${currentSlide.group.index}`}
            group={currentSlide.group}
            answers={answers}
            onAnswer={onAnswer}
            onFinished={handleSlideFinished}
            isCurrent={true}
          />
        )}

        {/* Auto-submitting indicator — shown after all slides complete */}
        {allSlidesFinished && (
          <div className="flex items-center justify-center gap-3 py-8 text-green-700">
            <Spinner className="h-6 w-6" color="green" />
            <Typography className="font-medium">
              Đang nộp phần Listening và chuyển sang Reading...
            </Typography>
          </div>
        )}
      </div>

      {/* Sidebar — Answer palette (read-only in listening mode) */}
      <div className="lg:w-64 flex-shrink-0">
        <div className="sticky top-24">
          <AnswerPalette
            totalQuestions={totalQuestions}
            section="L"
            answers={answers}
            currentQuestion={currentQuestionIndex}
            onJumpTo={() => {}}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default ListeningSection;
