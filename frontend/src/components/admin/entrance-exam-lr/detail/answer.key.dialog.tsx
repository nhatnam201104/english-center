import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import type { AnswerKeyItem } from "../../../../types/entrance-exam-lr/request";

interface AnswerKeyDialogProps {
  open: boolean;
  loading: boolean;
  isListening: boolean;
  answerKeys: AnswerKeyItem[];
  onClose: () => void;
  onSave: () => void;
  onUpdateAnswer: (index: number, answer: string) => void;
}

const AnswerKeyDialog = ({
  open,
  loading,
  isListening,
  answerKeys,
  onClose,
  onSave,
  onUpdateAnswer,
}: AnswerKeyDialogProps) => (
  <Dialog open={open} handler={onClose} size="xl">
    <DialogHeader>
      Đáp án – {isListening ? "Listening" : "Reading"}
    </DialogHeader>
    <DialogBody className="max-h-[60vh] overflow-y-auto">
      <div className="grid grid-cols-5 gap-3">
        {answerKeys.map((item) => (
          <div
            key={item.index}
            className="flex items-center gap-2 border rounded-lg p-2 bg-gray-50"
          >
            <Typography
              variant="small"
              className="font-bold w-8 text-center"
            >
              {item.index}
            </Typography>
            <select
              className="flex-1 border rounded px-2 py-1 text-sm"
              value={item.answer}
              onChange={(e) => onUpdateAnswer(item.index, e.target.value)}
            >
              <option value="">—</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
        ))}
      </div>
    </DialogBody>
    <DialogFooter className="gap-2">
      <Button variant="text" onClick={onClose} disabled={loading}>
        Hủy
      </Button>
      <Button
        color="green"
        onClick={onSave}
        disabled={loading}
        loading={loading}
      >
        Lưu đáp án
      </Button>
    </DialogFooter>
  </Dialog>
);

export default AnswerKeyDialog;
