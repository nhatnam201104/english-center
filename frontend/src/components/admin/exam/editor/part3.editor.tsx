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
import { part3Schema, type Part3FormData } from "../../../../libs/validation/exam.schema";
import { upsertPart3 } from "../../../../services/exam.service";
import type { WritingEight } from "../../../../types/exam/response";

interface Part3EditorProps {
  examId: number;
  index: number;
  initialData?: WritingEight;
  onSave?: () => void;
}

const Part3Editor: React.FC<Part3EditorProps> = ({
  examId,
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
  } = useForm<Part3FormData>({
    resolver: zodResolver(part3Schema),
    defaultValues: {
      questionEight: initialData?.questionEight || "",
    },
  });

  // Sync form value when initialData changes
  useEffect(() => {
    if (initialData?.questionEight) {
      setValue("questionEight", initialData.questionEight);
    }
  }, [initialData?.questionEight, setValue]);

  const onSubmit = async (data: Part3FormData) => {
    try {
      setLoading(true);

      const response = await upsertPart3(examId, {
        writingExamId: examId,
        questionEight: data.questionEight,
      });

      if (response.success) {
        alert("Lưu Part 3 thành công!");
        setSaved(true);
        onSave?.();
      }
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      console.error("Lỗi khi lưu Part 3:", error);
      alert(apiError?.message || "Lưu Part 3 thất bại!");
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
            Câu 8: Write an Opinion Essay
          </Typography>
          <Typography variant="small" color="gray">
            Nhập chủ đề bài luận cho Câu 8
          </Typography>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Câu hỏi <span className="text-red-500">*</span>
            </label>
            <Textarea
              {...register("questionEight")}
              error={!!errors.questionEight}
              rows={10}
              placeholder="Nhập nội dung câu hỏi..."
              className="w-full"
            />
            {errors.questionEight && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.questionEight.message}
              </Typography>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 flex items-center gap-2"
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

export default Part3Editor;