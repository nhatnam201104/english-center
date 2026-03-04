import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import {
  ArrowLeftIcon,
  PencilIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import type { ListeningExam, ReadingExam } from "../../../../types/entrance-exam-lr/response";

interface ExamHeaderProps {
  exam: ListeningExam | ReadingExam;
  isListening: boolean;
  onBack: () => void;
  onEdit: () => void;
  onAnswerKey: () => void;
}

const ExamHeader = ({ exam, isListening, onBack, onEdit, onAnswerKey }: ExamHeaderProps) => (
  <Card className="shadow-xl border border-gray-200 mb-6">
    <CardHeader
      floated={false}
      shadow={false}
      className="rounded-none bg-gradient-to-r from-blue-600 to-blue-400 p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <IconButton variant="text" color="white" onClick={onBack}>
            <ArrowLeftIcon className="h-5 w-5" />
          </IconButton>
          <div>
            <Typography variant="h5" color="white" className="font-bold">
              {exam.name}
            </Typography>
            <div className="flex items-center gap-2 mt-1">
              <Chip
                value={isListening ? "Listening" : "Reading"}
                color="cyan"
                size="sm"
              />
              <Chip
                value={exam.isActive ? "Active" : "Inactive"}
                color={exam.isActive ? "green" : "gray"}
                size="sm"
              />
              <Chip
                value={exam.isDone ? "Hoàn thành" : "Chưa xong"}
                color={exam.isDone ? "blue" : "amber"}
                size="sm"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Tooltip content="Chỉnh sửa thông tin">
            <Button
              size="sm"
              className="flex items-center gap-1 bg-white text-blue-600"
              onClick={onEdit}
            >
              <PencilIcon className="h-4 w-4" />
              Sửa
            </Button>
          </Tooltip>
          <Tooltip content="Quản lý đáp án">
            <Button
              size="sm"
              className="flex items-center gap-1 bg-white text-green-600"
              onClick={onAnswerKey}
            >
              <DocumentTextIcon className="h-4 w-4" />
              Đáp án ({exam.answerKeyCount})
            </Button>
          </Tooltip>
        </div>
      </div>
    </CardHeader>
    <CardBody>
      <Typography variant="small" className="text-gray-600">
        <strong>Hướng dẫn:</strong> {exam.direction}
      </Typography>
    </CardBody>
  </Card>
);

export default ExamHeader;
