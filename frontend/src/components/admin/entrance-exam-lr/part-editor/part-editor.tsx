import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Chip,
  IconButton,
} from "@material-tailwind/react";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  getListeningParts,
  getReadingParts,
  deletePartQuestion,
  deletePartGroup,
} from "../../../../services/entranceExamLR.service";
import type { ErrorApiResponse } from "../../../../types/api.type";
import type {
  PartOneDetail,
  PartTwoDetail,
  PartThreeDetail,
  PartFourDetail,
  PartFiveDetail,
  PartSixDetail,
  PartSevenDetail,
} from "../../../../types/entrance-exam-lr/response";
import QuestionList from "./question.list";
import GroupList from "./group.list";
import AddItemDialog from "./add-item.dialog";

type PartDetail =
  | PartOneDetail
  | PartTwoDetail
  | PartThreeDetail
  | PartFourDetail
  | PartFiveDetail
  | PartSixDetail
  | PartSevenDetail;

const PART_NAMES: Record<number, string> = {
  1: "Part 1 - Photographs",
  2: "Part 2 - Question-Response",
  3: "Part 3 - Conversations",
  4: "Part 4 - Talks",
  5: "Part 5 - Incomplete Sentences",
  6: "Part 6 - Text Completion",
  7: "Part 7 - Reading Comprehension",
};

const PartEditor = () => {
  const { type, id, partNo, partId } = useParams<{
    type: string;
    id: string;
    partNo: string;
    partId: string;
  }>();
  const navigate = useNavigate();
  const examId = Number(id);
  const pNo = Number(partNo);
  const pId = Number(partId);
  const isListening = type === "listening";
  const isGroupPart = [3, 4, 6, 7].includes(pNo);

  const [partData, setPartData] = useState<PartDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const loadPartData = useCallback(async () => {
    try {
      setLoading(true);
      if (isListening) {
        const res = await getListeningParts(examId);
        const data = res.data;
        if (pNo === 1) setPartData(data?.partOne ?? null);
        else if (pNo === 2) setPartData(data?.partTwo ?? null);
        else if (pNo === 3) setPartData(data?.partThree ?? null);
        else if (pNo === 4) setPartData(data?.partFour ?? null);
      } else {
        const res = await getReadingParts(examId);
        const data = res.data;
        if (pNo === 5) setPartData(data?.partFive ?? null);
        else if (pNo === 6) setPartData(data?.partSix ?? null);
        else if (pNo === 7) setPartData(data?.partSeven ?? null);
      }
    } catch (error) {
      console.error("Loi:", error);
    } finally {
      setLoading(false);
    }
  }, [examId, isListening, pNo]);

  useEffect(() => { loadPartData(); }, [loadPartData]);

  const handleDeleteQuestion = async (questionId: number) => {
    if (!window.confirm("Xoa cau hoi nay?")) return;
    try {
      await deletePartQuestion(pNo, questionId);
      loadPartData();
    } catch (error) {
      const err = error as ErrorApiResponse;
      alert(err.message || "Xoa that bai!");
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    if (!window.confirm("Xoa nhom cau hoi nay?")) return;
    try {
      await deletePartGroup(pNo, groupId);
      loadPartData();
    } catch (error) {
      const err = error as ErrorApiResponse;
      alert(err.message || "Xoa that bai!");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Typography>Dang tai...</Typography>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-xl border border-gray-200">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none bg-gradient-to-r from-blue-600 to-blue-400 p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <IconButton
                variant="text"
                color="white"
                onClick={() => navigate(`/admin/entrance-exam-lr/${type}/${examId}`)}
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </IconButton>
              <div>
                <Typography variant="h5" color="white" className="font-bold">
                  {PART_NAMES[pNo] || `Part ${pNo}`}
                </Typography>
                {partData && (
                  <div className="flex items-center gap-2 mt-1">
                    <Chip
                      value={`${partData.quantityQuestionDone}/${partData.totalQuestion} cau`}
                      color={partData.isDone ? "green" : "amber"}
                      size="sm"
                    />
                  </div>
                )}
              </div>
            </div>
            <Button
              size="lg"
              className="flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-50"
              onClick={() => setShowAddDialog(true)}
              disabled={partData?.isDone}
            >
              <PlusIcon className="h-5 w-5" />
              Them {isGroupPart ? "nhom" : "cau hoi"}
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          {partData && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <Typography variant="small" className="text-gray-700">
                <strong>Direction:</strong> {partData.direction}
              </Typography>
            </div>
          )}

          {partData && !isGroupPart && "questions" in partData && (
            <QuestionList
              partData={partData as PartOneDetail | PartTwoDetail | PartFiveDetail}
              onDelete={handleDeleteQuestion}
            />
          )}

          {partData && isGroupPart && "groups" in partData && (
            <GroupList
              partData={partData as PartThreeDetail | PartFourDetail | PartSixDetail | PartSevenDetail}
              onDelete={handleDeleteGroup}
            />
          )}
        </CardBody>
      </Card>

      <AddItemDialog
        open={showAddDialog}
        pNo={pNo}
        pId={pId}
        onClose={() => setShowAddDialog(false)}
        onSuccess={loadPartData}
      />
    </div>
  );
};

export default PartEditor;
