import { useState } from "react";
import { Typography, Chip, IconButton, Tooltip } from "@material-tailwind/react";
import { TrashIcon, MusicalNoteIcon, PhotoIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon } from "@heroicons/react/24/outline";
import type {
  PartThreeDetail,
  PartFourDetail,
  PartSixDetail,
  PartSevenDetail,
  MCQuestionResponse,
  ListeningGroupResponse,
  ReadingGroupResponse,
} from "../../../../types/entrance-exam-lr/response";
import GroupDetailDialog from "./group-detail.dialog";

type GroupItem = ListeningGroupResponse | ReadingGroupResponse;

interface GroupListProps {
  partData: PartThreeDetail | PartFourDetail | PartSixDetail | PartSevenDetail;
  onDelete: (id: number) => void;
}

const PAGE_SIZE = 3;

const GroupList = ({ partData, onDelete }: GroupListProps) => {
  const groups = partData.groups;
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<GroupItem | null>(null);

  if (groups.length === 0) {
    return (
      <Typography className="text-gray-500 text-center py-8">
        Chưa có nhóm câu hỏi nào
      </Typography>
    );
  }

  const totalPages = Math.ceil(groups.length / PAGE_SIZE);
  const paged = groups.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Tổng: <strong className="text-gray-800">{groups.length}</strong> nhóm câu hỏi
        </span>
        {totalPages > 1 && (
          <span>Trang {page}/{totalPages}</span>
        )}
      </div>

      {/* Group cards */}
      <div className="space-y-4">
        {paged.map((g) => (
          <div
            key={g.id}
            className="border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Group header */}
            <div className="flex items-center justify-between px-4 py-3 bg-blue-50 border-b border-blue-100">
              <div className="flex items-center gap-2 flex-wrap">
                <Chip value={`Nhóm #${g.index}`} size="sm" color="blue" />
                <Chip
                  value={`Câu ${g.fromQuestionIndex}${g.toQuestionIndex}`}
                  size="sm"
                  color="cyan"
                  variant="ghost"
                />
                {"audio" in g && g.audio && (
                  <Tooltip content="Có audio">
                    <span className="inline-flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      <MusicalNoteIcon className="h-3.5 w-3.5" />
                      Audio
                    </span>
                  </Tooltip>
                )}
                {g.image && (
                  <Tooltip content="Có hình ảnh">
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      <PhotoIcon className="h-3.5 w-3.5" />
                      Hình ảnh
                    </span>
                  </Tooltip>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Tooltip content="Xem chi tiết">
                  <IconButton
                    variant="text"
                    color="blue"
                    size="sm"
                    onClick={() => setPreview(g as GroupItem)}
                  >
                    <EyeIcon className="h-4 w-4" />
                  </IconButton>
                </Tooltip>
                <IconButton
                  variant="text"
                  color="red"
                  size="sm"
                  onClick={() => onDelete(g.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </IconButton>
              </div>
            </div>

            <div className="px-4 py-3 space-y-3">
              {/* Audio (Part 3 / Part 4) */}
              {"audio" in g && g.audio && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
                  <Typography variant="small" className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1.5">
                    Audio
                  </Typography>
                  <audio controls src={(g as ListeningGroupResponse).audio!} className="w-full h-9">
                    Trình duyệt không hỗ trợ audio.
                  </audio>
                </div>
              )}

              {/* Image */}
              {g.image && (
                <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img
                    src={g.image}
                    alt={`Nhóm #${g.index}`}
                    className="w-full max-h-56 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/600x200?text=Không+tải+được";
                    }}
                  />
                </div>
              )}

              {/* Passage (Part 6/7) */}
              {"question" in g && g.question && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <Typography variant="small" className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
                    Đoạn văn
                  </Typography>
                  <Typography variant="small" className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {g.question}
                  </Typography>
                </div>
              )}

              {/* MC Questions */}
              <div className="space-y-2">
                <Typography variant="small" className="font-semibold text-gray-600 text-xs uppercase tracking-wide">
                  Câu hỏi ({g.questions.length})
                </Typography>
                {(g.questions as MCQuestionResponse[]).map((q) => (
                  <div
                    key={q.id}
                    className="border rounded-lg p-3 bg-gray-50"
                  >
                    <Typography variant="small" className="font-medium text-gray-800 mb-2">
                      <span className="text-blue-600 font-bold">#{q.index}</span>{" "}
                      {q.question}
                    </Typography>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {[
                        { label: "A", value: q.answerA },
                        { label: "B", value: q.answerB },
                        { label: "C", value: q.answerC },
                        { label: "D", value: q.answerD },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="flex items-start gap-2 bg-white rounded-lg px-3 py-1.5 text-sm border border-gray-100"
                        >
                          <span className="font-semibold text-blue-600 w-4 shrink-0">{label}.</span>
                          <span className="text-gray-700">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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
      <GroupDetailDialog
        open={!!preview}
        group={preview}
        onClose={() => setPreview(null)}
      />
    </div>
  );
};

export default GroupList;
