import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardBody,
  Button,
  Typography,
  Spinner,
  Textarea,
} from "@material-tailwind/react";
import { upsertSpeakingPart4 } from "../../../../services/speaking.service";
import type { SpeakingEightToTen } from "../../../../types/speaking/response";
import ImageUploadField from "../../../common/ImageUploadField";

interface Part4EditorProps {
  examId: number;
  index: number;
  initialData?: SpeakingEightToTen;
  onSave?: () => void;
}

const Part4Editor: React.FC<Part4EditorProps> = ({
  examId,
  index,
  initialData,
  onSave,
}) => {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [passage, setPassage] = useState(initialData?.passage || "");
  const [questionEight, setQuestionEight] = useState(initialData?.questionEight || "");
  const [questionNine, setQuestionNine] = useState(initialData?.questionNine || "");
  const [questionTen, setQuestionTen] = useState(initialData?.questionTen || "");

  const { handleSubmit } = useForm();

  // Sync state when initialData changes
  useEffect(() => {
    if (initialData) {
      setPassage(initialData.passage || "");
      setQuestionEight(initialData.questionEight || "");
      setQuestionNine(initialData.questionNine || "");
      setQuestionTen(initialData.questionTen || "");
    }
  }, [initialData]);

  const onSubmit = async () => {
    if (!passage.trim()) {
      alert("Vui lòng nhập bối cảnh");
      return;
    }
    if (!questionEight.trim()) {
      alert("Vui lòng nhập câu hỏi 8");
      return;
    }
    if (!questionNine.trim()) {
      alert("Vui lòng nhập câu hỏi 9");
      return;
    }
    if (!questionTen.trim()) {
      alert("Vui lòng nhập câu hỏi 10");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("speakingExamId", examId.toString());
      formData.append("index", index.toString());
      formData.append("passage", passage);
      formData.append("questionEight", questionEight);
      formData.append("questionNine", questionNine);
      formData.append("questionTen", questionTen);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await upsertSpeakingPart4(examId, formData);

      if (response.success) {
        alert("Lưu Câu 8-10 thành công!");
        setSaved(true);
        setImageFile(null);
        onSave?.();
      }
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      console.error("Lỗi khi lưu Câu 8-10:", error);
      alert(apiError?.message || "Lưu Câu 8-10 thất bại!");
      setSaved(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardBody>
        <div className="mb-6">
          <Typography variant="h5" color="blue-gray" className="font-bold mb-2">
            Câu 8-10: Respond to Questions using Information Provided
          </Typography>
          <Typography variant="small" color="gray">
            Trả lời câu hỏi dựa trên thông tin có sẵn (bảng biểu, lịch trình)
          </Typography>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Bối cảnh thông tin <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={passage}
                onChange={(e) => setPassage(e.target.value)}
                rows={6}
                placeholder="Nhập bối cảnh thông tin (bảng biểu, lịch_schedule)..."
                className="w-full"
              />
            </div>

            <div>
              <ImageUploadField
                label="Ảnh thông tin (optional)"
                fieldName="image"
                maxFiles={1}
                maxFileSize={5}
                accept="image/*"
                initialImages={initialData?.image ? [initialData.image] : []}
                onFilesChange={(_fieldName, files) => {
                  if (files.length > 0) {
                    setImageFile(files[0]);
                  }
                }}
              />
            </div>

            <div></div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Câu hỏi 8 <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={questionEight}
                onChange={(e) => setQuestionEight(e.target.value)}
                rows={4}
                placeholder="Nhập câu hỏi 8..."
                className="w-full"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Câu hỏi 9 <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={questionNine}
                onChange={(e) => setQuestionNine(e.target.value)}
                rows={4}
                placeholder="Nhập câu hỏi 9..."
                className="w-full"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Câu hỏi 10 <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={questionTen}
                onChange={(e) => setQuestionTen(e.target.value)}
                rows={4}
                placeholder="Nhập câu hỏi 10..."
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-purple-600 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Đang lưu...
                </>
              ) : (
                "Lưu Phần Này"
              )}
            </Button>
          </div>
        </form>

        {saved && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <Typography variant="small" color="green" className="font-semibold">
              ✓ Đã lưu thành công
            </Typography>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default Part4Editor;