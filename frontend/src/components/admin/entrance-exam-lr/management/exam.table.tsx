import {
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { TrashIcon, EyeIcon, BoltIcon } from "@heroicons/react/24/outline";
import type { ListeningExam, ReadingExam } from "../../../../types/entrance-exam-lr/response";

interface ExamTableProps {
  exams: (ListeningExam | ReadingExam)[];
  loading: boolean;
  type: "listening" | "reading";
  onView: (id: number) => void;
  onActivate: (id: number) => void;
  onDelete: (id: number) => void;
}

const ExamTable = ({
  exams,
  loading,
  onView,
  onActivate,
  onDelete,
}: ExamTableProps) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[700px] table-auto text-left">
      <thead>
        <tr className="border-b border-gray-200 bg-gray-50">
          <th className="p-4 text-sm font-semibold text-gray-700">ID</th>
          <th className="p-4 text-sm font-semibold text-gray-700">Tên đề thi</th>
          <th className="p-4 text-sm font-semibold text-gray-700">Trạng thái</th>
          <th className="p-4 text-sm font-semibold text-gray-700">Hoàn thành</th>
          <th className="p-4 text-sm font-semibold text-gray-700 text-center">Parts</th>
          <th className="p-4 text-sm font-semibold text-gray-700 text-center">Đáp án</th>
          <th className="p-4 text-sm font-semibold text-gray-700">Ngày tạo</th>
          <th className="p-4 text-sm font-semibold text-gray-700 text-center">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={8} className="p-8 text-center text-gray-500">
              Đang tải...
            </td>
          </tr>
        ) : exams.length === 0 ? (
          <tr>
            <td colSpan={8} className="p-8 text-center text-gray-500">
              Không có đề thi nào
            </td>
          </tr>
        ) : (
          exams.map((exam) => (
            <tr
              key={exam.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="p-4 text-sm">{exam.id}</td>
              <td className="p-4">
                <Typography variant="small" className="font-semibold text-gray-800">
                  {exam.name}
                </Typography>
              </td>
              <td className="p-4">
                <Chip
                  value={exam.isActive ? "Active" : "Inactive"}
                  color={exam.isActive ? "green" : "gray"}
                  size="sm"
                />
              </td>
              <td className="p-4">
                <Chip
                  value={exam.isDone ? "Hoàn thành" : "Chưa xong"}
                  color={exam.isDone ? "blue" : "amber"}
                  size="sm"
                />
              </td>
              <td className="p-4 text-center">
                <div className="flex flex-wrap gap-1 justify-center">
                  {exam.partsSummary.map((p) => (
                    <Chip
                      key={p.partNo}
                      value={`P${p.partNo}: ${p.quantityQuestionDone}/${p.totalQuestion}`}
                      size="sm"
                      color={p.isDone ? "green" : "gray"}
                      variant="ghost"
                      className="text-xs"
                    />
                  ))}
                </div>
              </td>
              <td className="p-4 text-center text-sm">
                {exam.answerKeyCount > 0 ? (
                  <Chip
                    value={`${exam.answerKeyCount} keys`}
                    color="blue"
                    size="sm"
                    variant="ghost"
                  />
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="p-4 text-sm text-gray-600">
                {new Date(exam.createdAt).toLocaleDateString("vi-VN")}
              </td>
              <td className="p-4">
                <div className="flex items-center justify-center gap-1">
                  <Tooltip content="Xem chi tiết">
                    <IconButton
                      variant="text"
                      size="sm"
                      color="blue"
                      onClick={() => onView(exam.id)}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content={exam.isActive ? "Deactivate" : "Activate"}>
                    <IconButton
                      variant="text"
                      size="sm"
                      color={exam.isActive ? "amber" : "green"}
                      onClick={() => onActivate(exam.id)}
                    >
                      <BoltIcon className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content="Xóa">
                    <IconButton
                      variant="text"
                      size="sm"
                      color="red"
                      onClick={() => onDelete(exam.id)}
                      disabled={exam.isActive}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default ExamTable;
