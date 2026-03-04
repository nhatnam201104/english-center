import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Chip,
  Typography,
} from "@material-tailwind/react";
import { PhotoIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline";
import type {
  ListeningGroupResponse,
  ReadingGroupResponse,
  MCQuestionResponse,
} from "../../../../types/entrance-exam-lr/response";

type GroupItem = ListeningGroupResponse | ReadingGroupResponse;

interface GroupDetailDialogProps {
  open: boolean;
  group: GroupItem | null;
  onClose: () => void;
}

const GroupDetailDialog = ({ open, group, onClose }: GroupDetailDialogProps) => {
  if (!group) return null;

  const hasAudio = "audio" in group && group.audio;
  const hasPassage = "question" in group && group.question;

  return (
    <Dialog open={open} handler={onClose} size="lg">
      <DialogHeader className="flex items-center gap-2 border-b pb-3">
        <Chip value={`Nhóm #${group.index}`} color="blue" size="sm" />
        <Chip
          value={`Câu ${group.fromQuestionIndex}–${group.toQuestionIndex}`}
          color="cyan"
          variant="ghost"
          size="sm"
        />
        <Typography variant="h6" className="font-bold text-gray-800">
          Chi tiết nhóm câu hỏi
        </Typography>
      </DialogHeader>

      <DialogBody className="space-y-4 max-h-[70vh] overflow-y-auto">
        {/* ── Audio (Part 3 / Part 4) ── */}
        {hasAudio && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600">
              <SpeakerWaveIcon className="h-4 w-4 text-purple-500" />
              Audio
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
              <audio
                controls
                src={(group as ListeningGroupResponse).audio!}
                className="w-full"
              >
                Trình duyệt không hỗ trợ audio.
              </audio>
            </div>
          </div>
        )}

        {/* ── Image ── */}
        {group.image && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600">
              <PhotoIcon className="h-4 w-4 text-green-500" />
              Hình ảnh
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={group.image}
                alt={`Nhóm #${group.index}`}
                className="w-full max-h-72 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/400x240?text=Không+tải+được";
                }}
              />
            </div>
          </div>
        )}

        {/* ── Passage (Part 6 / Part 7) ── */}
        {hasPassage && (
          <div className="space-y-1">
            <div className="text-sm font-semibold text-gray-600">Đoạn văn</div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 max-h-52 overflow-y-auto">
              <Typography
                variant="small"
                className="text-gray-800 leading-relaxed whitespace-pre-wrap"
              >
                {(group as ReadingGroupResponse).question}
              </Typography>
            </div>
          </div>
        )}

        {/* ── MC Questions ── */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-gray-600">
            Câu hỏi trắc nghiệm ({group.questions.length})
          </div>
          {(group.questions as MCQuestionResponse[]).map((q) => (
            <div
              key={q.id}
              className="border rounded-xl bg-white overflow-hidden"
            >
              {/* Question header */}
              <div className="bg-blue-50 border-b border-blue-100 px-4 py-2.5">
                <Typography variant="small" className="font-semibold text-gray-800">
                  <span className="text-blue-600 font-bold">#{q.index}</span>{" "}
                  {q.question}
                </Typography>
              </div>
              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-3">
                {[
                  { label: "A", value: q.answerA },
                  { label: "B", value: q.answerB },
                  { label: "C", value: q.answerC },
                  { label: "D", value: q.answerD },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-1.5 text-sm border border-gray-100"
                  >
                    <span className="font-bold text-blue-600 w-4 shrink-0">{label}.</span>
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogBody>

      <DialogFooter>
        <Button variant="text" onClick={onClose}>
          Đóng
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default GroupDetailDialog;
