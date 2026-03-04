import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
  Button,
  Chip,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

interface PartCardProps {
  partNo: number;
  partName: string;
  totalQuestion: number;
  quantityQuestionDone: number;
  isDone: boolean;
  partId: number;
  type: string;
  examId: number;
  isOpen: boolean;
  onToggle: () => void;
}

const PartCard = ({
  partNo,
  partName,
  totalQuestion,
  quantityQuestionDone,
  isDone,
  partId,
  type,
  examId,
  isOpen,
  onToggle,
}: PartCardProps) => {
  const navigate = useNavigate();

  return (
    <Accordion open={isOpen}>
      <AccordionHeader
        onClick={onToggle}
        className={`border rounded-lg px-4 transition-all ${
          isDone ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between w-full pr-2">
          <div className="flex items-center gap-3">
            <Typography variant="h6">{partName}</Typography>
            <Chip
              value={`${quantityQuestionDone}/${totalQuestion}`}
              color={isDone ? "green" : "amber"}
              size="sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="gradient"
              color="blue"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                navigate(
                  `/admin/entrance-exam-lr/${type}/${examId}/part/${partNo}/${partId}`,
                );
              }}
            >
              Quản lý câu hỏi
            </Button>
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </AccordionHeader>
      <AccordionBody className="px-4 py-2">
        <Typography variant="small" className="text-gray-600">
          Tổng câu hỏi: {totalQuestion} | Đã thêm: {quantityQuestionDone} |
          Còn thiếu: {Math.max(0, totalQuestion - quantityQuestionDone)}
        </Typography>
      </AccordionBody>
    </Accordion>
  );
};

export default PartCard;
