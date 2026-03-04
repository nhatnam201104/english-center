import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Chip,
  Typography,
} from "@material-tailwind/react";
import {
  PhotoIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import type {
  PartOneQuestionResponse,
  PartTwoQuestionResponse,
  MCQuestionResponse,
} from "../../../../types/entrance-exam-lr/response";

type QuestionItem =
  | PartOneQuestionResponse
  | PartTwoQuestionResponse
  | MCQuestionResponse;

interface QuestionDetailDialogProps {
  open: boolean;
  question: QuestionItem | null;
  onClose: () => void;
}

const ANSWER_COLORS = ["blue", "green", "orange", "red"] as const;

const QuestionDetailDialog = ({
  open,
  question,
  onClose,
}: QuestionDetailDialogProps) => {
  if (!question) return null;

  const hasAudio = "audio" in question && question.audio;
  const hasImage = "image" in question && (question as PartOneQuestionResponse).image;
  const hasOptions = "answerA" in question;

  return (
    <Dialog open={open} handler={onClose} size="md">
      <DialogHeader className="flex items-center gap-2 border-b pb-3">
        <Chip value={`Câu #${question.index}`} color="blue" size="sm" />
        <Typography variant="h6" className="font-bold text-gray-800">
          Chi tiết câu hỏi
        </Typography>
      </DialogHeader>

      <DialogBody className="space-y-4 max-h-[70vh] overflow-y-auto">
        {/* ── Image (Part 1) ── */}
        {hasImage && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600">
              <PhotoIcon className="h-4 w-4 text-green-500" />
              Hình ảnh
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={(question as PartOneQuestionResponse).image!}
                alt={`Câu #${question.index}`}
                className="w-full max-h-80 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/400x240?text=Không+tải+được";
                }}
              />
            </div>
          </div>
        )}

        {/* ── Audio (Part 1 / Part 2) ── */}
        {hasAudio && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600">
              <SpeakerWaveIcon className="h-4 w-4 text-purple-500" />
              Audio
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
              <audio
                controls
                src={"audio" in question ? (question as PartOneQuestionResponse).audio! : undefined}
                className="w-full"
              >
                Trình duyệt không hỗ trợ audio.
              </audio>
            </div>
          </div>
        )}

        {/* ── Question text ── */}
        {question.question && (
          <div className="space-y-1">
            <div className="text-sm font-semibold text-gray-600">Câu hỏi</div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
              <Typography variant="paragraph" className="text-gray-800 leading-relaxed">
                {question.question}
              </Typography>
            </div>
          </div>
        )}

        {/* ── Answer options (Part 5 / MC) ── */}
        {hasOptions && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-600">Đáp án</div>
            <div className="grid grid-cols-1 gap-2">
              {(
                [
                  { label: "A", value: (question as MCQuestionResponse).answerA, color: ANSWER_COLORS[0] },
                  { label: "B", value: (question as MCQuestionResponse).answerB, color: ANSWER_COLORS[1] },
                  { label: "C", value: (question as MCQuestionResponse).answerC, color: ANSWER_COLORS[2] },
                  { label: "D", value: (question as MCQuestionResponse).answerD, color: ANSWER_COLORS[3] },
                ] as const
              ).map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 border rounded-xl px-4 py-2.5 bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-blue-600 w-5 shrink-0 mt-0.5">
                    {label}.
                  </span>
                  <Typography variant="small" className="text-gray-700 leading-relaxed">
                    {value}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── No content for Part 1/2 if no extra info ── */}
        {!hasImage && !hasAudio && !question.question && !hasOptions && (
          <Typography className="text-gray-400 text-center italic py-4">
            Chưa có thông tin chi tiết.
          </Typography>
        )}
      </DialogBody>

      <DialogFooter>
        <Button variant="text" onClick={onClose}>
          Đóng
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default QuestionDetailDialog;
