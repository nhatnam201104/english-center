import { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  addPartOneQuestion,
  addPartTwoQuestion,
  addPartThreeGroup,
  addPartFourGroup,
  addPartFiveQuestion,
  addPartSixGroup,
  addPartSevenGroup,
} from "../../../../services/entranceExamLR.service";
import type { ErrorApiResponse } from "../../../../types/api.type";

interface AddItemDialogProps {
  open: boolean;
  pNo: number;
  pId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const PART_NAMES: Record<number, string> = {
  1: "Part 1 – Photographs",
  2: "Part 2 – Question-Response",
  3: "Part 3 – Conversations",
  4: "Part 4 – Talks",
  5: "Part 5 – Incomplete Sentences",
  6: "Part 6 – Text Completion",
  7: "Part 7 – Reading Comprehension",
};

const FILE_INPUT_CLASS =
  "block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100";

const AddItemDialog = ({ open, pNo, pId, onClose, onSuccess }: AddItemDialogProps) => {
  const isGroupPart = [3, 4, 6, 7].includes(pNo);

  /* ── Individual question state (P1, P2, P5) ── */
  const [qIndex, setQIndex] = useState<number>(1);
  const [qQuestion, setQQuestion] = useState("");
  const [qAudioFile, setQAudioFile] = useState<File | null>(null);
  const [qImageFile, setQImageFile] = useState<File | null>(null);
  const [qAnswerA, setQAnswerA] = useState("");
  const [qAnswerB, setQAnswerB] = useState("");
  const [qAnswerC, setQAnswerC] = useState("");
  const [qAnswerD, setQAnswerD] = useState("");

  /* ── Group state (P3, P4, P6, P7) ── */
  const [gIndex, setGIndex] = useState<number>(1);
  const [gAudioFile, setGAudioFile] = useState<File | null>(null);
  const [gImageFile, setGImageFile] = useState<File | null>(null);
  const [gPassage, setGPassage] = useState("");
  const [gFromQ, setGFromQ] = useState<number>(1);
  const [gToQ, setGToQ] = useState<number>(3);
  const [gQuestions, setGQuestions] = useState<
    {
      index: number;
      question: string;
      answerA: string;
      answerB: string;
      answerC: string;
      answerD: string;
    }[]
  >([]);

  const [submitLoading, setSubmitLoading] = useState(false);

  const resetForm = () => {
    setQIndex(1);
    setQQuestion("");
    setQAudioFile(null);
    setQImageFile(null);
    setQAnswerA("");
    setQAnswerB("");
    setQAnswerC("");
    setQAnswerD("");
    setGIndex(1);
    setGAudioFile(null);
    setGImageFile(null);
    setGPassage("");
    setGFromQ(1);
    setGToQ(3);
    setGQuestions([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addMCRow = () => {
    setGQuestions((prev) => [
      ...prev,
      {
        index: prev.length + gFromQ,
        question: "",
        answerA: "",
        answerB: "",
        answerC: "",
        answerD: "",
      },
    ]);
  };

  const removeMCRow = (idx: number) => {
    setGQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateMCRow = (idx: number, field: string, value: string | number) => {
    setGQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q)),
    );
  };

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);

      if (pNo === 1) {
        if (!qAudioFile || !qImageFile) {
          alert("Audio và Image là bắt buộc cho Part 1");
          return;
        }
        const fd = new FormData();
        fd.append("index", String(qIndex));
        fd.append("audio", qAudioFile);
        fd.append("image", qImageFile);
        await addPartOneQuestion(pId, fd);
      } else if (pNo === 2) {
        if (!qAudioFile) {
          alert("Audio là bắt buộc cho Part 2");
          return;
        }
        const fd = new FormData();
        fd.append("index", String(qIndex));
        fd.append("audio", qAudioFile);
        await addPartTwoQuestion(pId, fd);
      } else if (pNo === 3 || pNo === 4) {
        if (!gAudioFile) {
          alert("Audio là bắt buộc cho Part " + pNo);
          return;
        }
        if (gQuestions.length === 0) {
          alert("Cần ít nhất 1 câu hỏi");
          return;
        }
        const fd = new FormData();
        fd.append("index", String(gIndex));
        fd.append("audio", gAudioFile);
        if (gImageFile) fd.append("image", gImageFile);
        fd.append("fromQuestionIndex", String(gFromQ));
        fd.append("toQuestionIndex", String(gToQ));
        fd.append("questions", JSON.stringify(gQuestions));
        if (pNo === 3) await addPartThreeGroup(pId, fd);
        else await addPartFourGroup(pId, fd);
      } else if (pNo === 5) {
        await addPartFiveQuestion(pId, {
          index: qIndex,
          question: qQuestion,
          answerA: qAnswerA,
          answerB: qAnswerB,
          answerC: qAnswerC,
          answerD: qAnswerD,
        });
      } else if (pNo === 6 || pNo === 7) {
        if (gQuestions.length === 0) {
          alert("Cần ít nhất 1 câu hỏi");
          return;
        }
        const fd = new FormData();
        fd.append("index", String(gIndex));
        if (gImageFile) fd.append("image", gImageFile);
        if (gPassage) fd.append("question", gPassage);
        fd.append("fromQuestionIndex", String(gFromQ));
        fd.append("toQuestionIndex", String(gToQ));
        fd.append("questions", JSON.stringify(gQuestions));
        if (pNo === 6) await addPartSixGroup(pId, fd);
        else await addPartSevenGroup(pId, fd);
      }

      handleClose();
      onSuccess();
      alert("Thêm thành công!");
    } catch (error) {
      const err = error as ErrorApiResponse;
      alert(err.message || "Thêm thất bại!");
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderIndividualForm = () => (
    <div className="space-y-4">
      <Input
        type="number"
        label="Số thứ tự câu hỏi"
        value={String(qIndex)}
        onChange={(e) => setQIndex(Number(e.target.value))}
      />
      {pNo === 5 && (
        <Textarea
          label="Nội dung câu hỏi"
          value={qQuestion}
          onChange={(e) => setQQuestion(e.target.value)}
          rows={2}
        />
      )}
      {(pNo === 1 || pNo === 2) && (
        <div>
          <Typography variant="small" className="font-semibold mb-1">
            Audio file *
          </Typography>
          <input
            type="file"
            accept=".mp3,.wav,.ogg,.m4a"
            onChange={(e) => setQAudioFile(e.target.files?.[0] || null)}
            className={FILE_INPUT_CLASS}
          />
        </div>
      )}
      {pNo === 1 && (
        <div>
          <Typography variant="small" className="font-semibold mb-1">
            Image file *
          </Typography>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.gif"
            onChange={(e) => setQImageFile(e.target.files?.[0] || null)}
            className={FILE_INPUT_CLASS}
          />
        </div>
      )}
      {pNo === 5 && (
        <>
          <Input
            label="Đáp án A"
            value={qAnswerA}
            onChange={(e) => setQAnswerA(e.target.value)}
          />
          <Input
            label="Đáp án B"
            value={qAnswerB}
            onChange={(e) => setQAnswerB(e.target.value)}
          />
          <Input
            label="Đáp án C"
            value={qAnswerC}
            onChange={(e) => setQAnswerC(e.target.value)}
          />
          <Input
            label="Đáp án D"
            value={qAnswerD}
            onChange={(e) => setQAnswerD(e.target.value)}
          />
        </>
      )}
    </div>
  );

  const renderGroupForm = () => (
    <div className="space-y-4">
      <Input
        type="number"
        label="Số thứ tự nhóm"
        value={String(gIndex)}
        onChange={(e) => setGIndex(Number(e.target.value))}
      />
      {(pNo === 3 || pNo === 4) && (
        <div>
          <Typography variant="small" className="font-semibold mb-1">
            Audio file *
          </Typography>
          <input
            type="file"
            accept=".mp3,.wav,.ogg,.m4a"
            onChange={(e) => setGAudioFile(e.target.files?.[0] || null)}
            className={FILE_INPUT_CLASS}
          />
        </div>
      )}
      <div>
        <Typography variant="small" className="font-semibold mb-1">
          Image file (tùy chọn)
        </Typography>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.gif"
          onChange={(e) => setGImageFile(e.target.files?.[0] || null)}
          className={FILE_INPUT_CLASS}
        />
      </div>
      {(pNo === 6 || pNo === 7) && (
        <Textarea
          label="Đoạn văn (passage)"
          value={gPassage}
          onChange={(e) => setGPassage(e.target.value)}
          rows={3}
        />
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          label="Câu bắt đầu (from)"
          value={String(gFromQ)}
          onChange={(e) => setGFromQ(Number(e.target.value))}
        />
        <Input
          type="number"
          label="Câu kết thúc (to)"
          value={String(gToQ)}
          onChange={(e) => setGToQ(Number(e.target.value))}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Typography variant="h6">Câu hỏi trắc nghiệm</Typography>
          <Button
            size="sm"
            variant="outlined"
            onClick={addMCRow}
            className="flex items-center gap-1"
          >
            <PlusIcon className="h-3 w-3" /> Thêm câu
          </Button>
        </div>
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {gQuestions.map((q, idx) => (
            <div key={idx} className="border rounded-lg p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <Input
                  type="number"
                  label="Index"
                  containerProps={{ className: "w-20" }}
                  value={String(q.index)}
                  onChange={(e) =>
                    updateMCRow(idx, "index", Number(e.target.value))
                  }
                />
                <IconButton
                  variant="text"
                  color="red"
                  size="sm"
                  onClick={() => removeMCRow(idx)}
                >
                  <TrashIcon className="h-4 w-4" />
                </IconButton>
              </div>
              <Input
                label="Câu hỏi"
                value={q.question}
                onChange={(e) => updateMCRow(idx, "question", e.target.value)}
                className="mb-2"
              />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input
                  label="A"
                  value={q.answerA}
                  onChange={(e) => updateMCRow(idx, "answerA", e.target.value)}
                />
                <Input
                  label="B"
                  value={q.answerB}
                  onChange={(e) => updateMCRow(idx, "answerB", e.target.value)}
                />
                <Input
                  label="C"
                  value={q.answerC}
                  onChange={(e) => updateMCRow(idx, "answerC", e.target.value)}
                />
                <Input
                  label="D"
                  value={q.answerD}
                  onChange={(e) => updateMCRow(idx, "answerD", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} handler={handleClose} size="lg">
      <DialogHeader>
        Thêm {isGroupPart ? "nhóm câu hỏi" : "câu hỏi"} – {PART_NAMES[pNo]}
      </DialogHeader>
      <DialogBody className="max-h-[65vh] overflow-y-auto">
        {isGroupPart ? renderGroupForm() : renderIndividualForm()}
      </DialogBody>
      <DialogFooter className="gap-2">
        <Button variant="text" onClick={handleClose} disabled={submitLoading}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} disabled={submitLoading} loading={submitLoading}>
          Thêm
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default AddItemDialog;
