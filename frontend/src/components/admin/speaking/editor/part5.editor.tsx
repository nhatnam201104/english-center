import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardBody,
  Button,
  Typography,
  Spinner,
  Textarea,
} from "@material-tailwind/react";
import { speakingPart5Schema, type SpeakingPart5FormData } from "../../../../libs/validation/speaking.schema";
import { upsertSpeakingPart5 } from "../../../../services/speaking.service";
import type { SpeakingEleven } from "../../../../types/speaking/response";

interface Part5EditorProps {
  examId: number;
  index: number;
  initialData?: SpeakingEleven;
  onSave?: () => void;
}

const Part5Editor: React.FC<Part5EditorProps> = ({
  examId,
  index,
  initialData,
  onSave,
}) => {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SpeakingPart5FormData>({
    resolver: zodResolver(speakingPart5Schema),
    defaultValues: {
      question: initialData?.question || "",
    },
  });

  // Sync form value when initialData changes
  useEffect(() => {
    if (initialData?.question) {
      setValue("question", initialData.question);
    }
  }, [initialData?.question, setValue]);

  const onSubmit = async (data: SpeakingPart5FormData) => {
    try {
      setLoading(true);

      const response = await upsertSpeakingPart5(examId, {
        speakingExamId: examId,
        index: index,
        question: data.question,
      });

      if (response.success) {
        alert("Lưu Câu 11 thành công!");
        setSaved(true);
        onSave?.();
      }
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      console.error("Lỗi khi lưu Câu 11:", error);
      alert(apiError?.message || "Lưu Câu 11 thất bại!");
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
            Câu 11: Express an Opinion
          </Typography>
          <Typography variant="small" color="gray">
            Bày tỏ quan điểm cá nhân về một vấn đề xã hội hoặc công việc
          </Typography>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Chủ đề <span className="text-red-500">*</span>
            </label>
            <Textarea
              {...register("question")}
              error={!!errors.question}
              rows={10}
              placeholder="Nhập chủ đề nghị luận..."
              className="w-full"
            />
            {errors.question && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.question.message}
              </Typography>
            )}
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

export default Part5Editor;