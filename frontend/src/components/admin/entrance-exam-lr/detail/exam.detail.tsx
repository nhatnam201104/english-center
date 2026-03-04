import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import type {
  ListeningExam,
  ReadingExam,
  ListeningPartsResponse,
  ReadingPartsResponse,
  AnswerKeyItemResponse,
} from "../../../../types/entrance-exam-lr/response";
import type { AnswerKeyItem } from "../../../../types/entrance-exam-lr/request";

type PartListItem = {
  no: number;
  name: string;
  data: { id: number; totalQuestion: number; quantityQuestionDone: number; isDone: boolean };
};
import {
  getListeningById,
  getReadingById,
  updateListening,
  updateReading,
  getListeningParts,
  getReadingParts,
  getListeningAnswerKey,
  getReadingAnswerKey,
  saveListeningAnswerKey,
  saveReadingAnswerKey,
} from "../../../../services/entranceExamLR.service";
import type { ErrorApiResponse } from "../../../../types/api.type";
import ExamHeader from "./exam.header";
import PartCard from "./part.card";
import EditExamDialog from "./edit-exam.dialog";
import AnswerKeyDialog from "./answer.key.dialog";

const ExamDetail = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const examId = Number(id);
  const isListening = type === "listening";

  const [exam, setExam] = useState<ListeningExam | ReadingExam | null>(null);
  const [listeningParts, setListeningParts] = useState<ListeningPartsResponse | null>(null);
  const [readingParts, setReadingParts] = useState<ReadingPartsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [openParts, setOpenParts] = useState<number[]>([]);

  /*  Edit dialog state  */
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDirection, setEditDirection] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  /*  Answer key dialog state  */
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [answerKeys, setAnswerKeys] = useState<AnswerKeyItem[]>([]);
  const [answerKeyLoading, setAnswerKeyLoading] = useState(false);

  const loadExam = useCallback(async () => {
    try {
      setLoading(true);
      if (isListening) {
        const [examRes, partsRes] = await Promise.all([
          getListeningById(examId),
          getListeningParts(examId),
        ]);
        setExam(examRes.data || null);
        setListeningParts(partsRes.data || null);
      } else {
        const [examRes, partsRes] = await Promise.all([
          getReadingById(examId),
          getReadingParts(examId),
        ]);
        setExam(examRes.data || null);
        setReadingParts(partsRes.data || null);
      }
    } catch (error) {
      console.error("Loi:", error);
    } finally {
      setLoading(false);
    }
  }, [examId, isListening]);

  useEffect(() => { loadExam(); }, [loadExam]);

  const togglePart = (partNo: number) => {
    setOpenParts((prev) =>
      prev.includes(partNo) ? prev.filter((p) => p !== partNo) : [...prev, partNo],
    );
  };

  /*  Edit handlers  */
  const handleOpenEdit = () => {
    if (!exam) return;
    setEditName(exam.name);
    setEditDirection(exam.direction);
    setShowEdit(true);
  };

  const handleSaveEdit = async () => {
    try {
      setEditLoading(true);
      if (isListening) await updateListening(examId, { name: editName, direction: editDirection });
      else await updateReading(examId, { name: editName, direction: editDirection });
      setShowEdit(false);
      loadExam();
    } catch (error) {
      const err = error as ErrorApiResponse;
      alert(err.message || "Cap nhat that bai!");
    } finally {
      setEditLoading(false);
    }
  };

  /*  Answer key handlers  */
  const handleOpenAnswerKey = async () => {
    try {
      setAnswerKeyLoading(true);
      const res = isListening
        ? await getListeningAnswerKey(examId)
        : await getReadingAnswerKey(examId);
      const existing: AnswerKeyItemResponse[] = (res.data as unknown as AnswerKeyItemResponse[]) || [];
      const keyMap = new Map(existing.map((k) => [k.index, k.answer]));
      const keys: AnswerKeyItem[] = Array.from({ length: 100 }, (_, i) => ({
        index: i + 1,
        answer: keyMap.get(i + 1) || "",
      }));
      setAnswerKeys(keys);
      setShowAnswerKey(true);
    } catch (error) {
      console.error("Loi:", error);
    } finally {
      setAnswerKeyLoading(false);
    }
  };

  const handleSaveAnswerKey = async () => {
    try {
      setAnswerKeyLoading(true);
      const validAnswers = answerKeys.filter((k) => k.answer);
      if (isListening) await saveListeningAnswerKey(examId, { answers: validAnswers });
      else await saveReadingAnswerKey(examId, { answers: validAnswers });
      setShowAnswerKey(false);
      loadExam();
      alert("Luu dap an thanh cong!");
    } catch (error) {
      const err = error as ErrorApiResponse;
      alert(err.message || "Luu dap an that bai!");
    } finally {
      setAnswerKeyLoading(false);
    }
  };

  const updateAnswer = (index: number, answer: string) => {
    setAnswerKeys((prev) => prev.map((k) => (k.index === index ? { ...k, answer } : k)));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Typography>Dang tai...</Typography>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Typography>Khong tim thay de thi</Typography>
      </div>
    );
  }


  const partList = isListening && listeningParts
    ? [
        listeningParts.partOne   && { no: 1, name: "Part 1 - Photographs",      data: listeningParts.partOne },
        listeningParts.partTwo   && { no: 2, name: "Part 2 - Question-Response", data: listeningParts.partTwo },
        listeningParts.partThree && { no: 3, name: "Part 3 - Conversations",     data: listeningParts.partThree },
        listeningParts.partFour  && { no: 4, name: "Part 4 - Talks",             data: listeningParts.partFour },
      ].filter(Boolean)
    : !isListening && readingParts
    ? [
        readingParts.partFive  && { no: 5, name: "Part 5 - Incomplete Sentences",   data: readingParts.partFive },
        readingParts.partSix   && { no: 6, name: "Part 6 - Text Completion",        data: readingParts.partSix },
        readingParts.partSeven && { no: 7, name: "Part 7 - Reading Comprehension",  data: readingParts.partSeven },
      ].filter(Boolean)
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <ExamHeader
        exam={exam}
        isListening={isListening}
        onBack={() => navigate("/admin/entrance-exam-lr")}
        onEdit={handleOpenEdit}
        onAnswerKey={handleOpenAnswerKey}
      />

      <Card className="shadow-lg border border-gray-200 mt-6">
        <CardHeader floated={false} shadow={false} className="rounded-none p-4">
          <Typography variant="h5" className="font-bold">
            Cac Part
          </Typography>
        </CardHeader>
        <CardBody className="space-y-3">
          {(partList as PartListItem[]).map((p) => (
            <PartCard
              key={p.no}
              partNo={p.no}
              partName={p.name}
              totalQuestion={p.data.totalQuestion}
              quantityQuestionDone={p.data.quantityQuestionDone}
              isDone={p.data.isDone}
              partId={p.data.id}
              type={type || "listening"}
              examId={examId}
              isOpen={openParts.includes(p.no)}
              onToggle={() => togglePart(p.no)}
            />
          ))}
          {partList.length === 0 && (
            <Typography className="text-gray-500 text-center py-4">
              Chua co part nao
            </Typography>
          )}
        </CardBody>
      </Card>

      <EditExamDialog
        open={showEdit}
        name={editName}
        direction={editDirection}
        loading={editLoading}
        onChangeName={setEditName}
        onChangeDirection={setEditDirection}
        onClose={() => setShowEdit(false)}
        onSave={handleSaveEdit}
      />

      <AnswerKeyDialog
        open={showAnswerKey}
        isListening={isListening}
        answerKeys={answerKeys}
        loading={answerKeyLoading}
        onUpdateAnswer={updateAnswer}
        onClose={() => setShowAnswerKey(false)}
        onSave={handleSaveAnswerKey}
      />
    </div>
  );
};

export default ExamDetail;
