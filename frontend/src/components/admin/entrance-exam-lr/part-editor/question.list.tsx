import { useState } from "react";
import { Typography, Chip, IconButton, Tooltip } from "@material-tailwind/react";
import { TrashIcon, MusicalNoteIcon, PhotoIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon } from "@heroicons/react/24/outline";
import type {
  PartOneDetail,
  PartTwoDetail,
  PartFiveDetail,
  PartOneQuestionResponse,
  PartTwoQuestionResponse,
  MCQuestionResponse,
} from "../../../../types/entrance-exam-lr/response";
import QuestionDetailDialog from "./question-detail.dialog";

type QuestionItem = PartOneQuestionResponse | PartTwoQuestionResponse | MCQuestionResponse;

interface QuestionListProps {
  partData: PartOneDetail | PartTwoDetail | PartFiveDetail;
  onDelete: (id: number) => void;
}

const PAGE_SIZE = 5;

const QuestionList = ({ partData, onDelete }: QuestionListProps) => {
  const questions = partData.questions;
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<QuestionItem | null>(null);

  if (questions.length === 0) {
    return (
      <Typography className="text-gray-500 text-center py-8">
        Chưa có câu hỏi nào
      </Typography>
    );
  }

  const totalPages = Math.ceil(questions.length / PAGE_SIZE);
  const paged = questions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Tổng: <strong className="text-gray-800">{questions.length}</strong> câu hỏi
        </span>
        {totalPages > 1 && (
          <span>
            Trang {page}/{totalPages}
          </span>
        )}
      </div>

      {/* Question cards */}
      <div className="space-y-3">
        {paged.map((q) => (
          <div
            key={q.id}
            className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {/* Header row */}
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Chip value={`Câu #${q.index}`} size="sm" color="blue" />
                  {"audio" in q && q.audio && (
                    <Tooltip content="Có audio">
                      <span className="inline-flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                        <MusicalNoteIcon className="h-3.5 w-3.5" />
                        Audio
                      </span>
                    </Tooltip>
                  )}
                  {"image" in q && (q as { image: string | null }).image && (
                    <Tooltip content="Có hình ảnh">
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        <PhotoIcon className="h-3.5 w-3.5" />
                        Hình ảnh
                      </span>
                    </Tooltip>
                  )}
                </div>

                {/* Question text */}
                {q.question && (
                  <Typography variant="small" className="text-gray-800 font-medium mb-2">
                    {q.question}
                  </Typography>
                )}

                {/* Answer options */}
                {"answerA" in q && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
                    {[
                      { label: "A", value: q.answerA },
                      { label: "B", value: q.answerB },
                      { label: "C", value: q.answerC },
                      { label: "D", value: q.answerD },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-1.5 text-sm"
                      >
                        <span className="font-semibold text-blue-600 w-4 shrink-0">{label}.</span>
                        <span className="text-gray-700">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <Tooltip content="Xem chi tiết">
                  <IconButton
                    variant="text"
                    color="blue"
                    size="sm"
                    onClick={() => setPreview(q as QuestionItem)}
                  >
                    <EyeIcon className="h-4 w-4" />
                  </IconButton>
                </Tooltip>
                <IconButton
                  variant="text"
                  color="red"
                  size="sm"
                  onClick={() => onDelete(q.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </IconButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <IconButton
            variant="text"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </IconButton>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <IconButton
            variant="text"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </IconButton>
        </div>
      )}
      <QuestionDetailDialog
        open={!!preview}
        question={preview}
        onClose={() => setPreview(null)}
      />
    </div>
  );
};

export default QuestionList;
