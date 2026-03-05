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
import { speakingPart3Schema, type SpeakingPart3FormData } from "../../../../libs/validation/speaking.schema";
import { upsertSpeakingPart3 } from "../../../../services/speaking.service";
import type { SpeakingFiveToSeven } from "../../../../types/speaking/response";

interface Part3EditorProps {
  examId: number;
  index: number;
  initialData?: SpeakingFiveToSeven;
  onSave?: () => void;
}

const Part3Editor: React.FC<Part3EditorProps> = ({
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
  } = useForm<SpeakingPart3FormData>({
    resolver: zodResolver(speakingPart3Schema),
    defaultValues: {
      passage: initialData?.passage || "",
      questionFive: initialData?.questionFive || "",
      questionSix: initialData?.questionSix || "",
      questionSeven: initialData?.questionSeven || "",
    },
  });

  // Sync form values when initialData changes
  useEffect(() => {
    if (initialData?.passage) {
      setValue("passage", initialData.passage);
    }
    if (initialData?.questionFive) {
      setValue("questionFive", initialData.questionFive);
    }
    if (initialData?.questionSix) {
      setValue("questionSix", initialData.questionSix);
    }
    if (initialData?.questionSeven) {
      setValue("questionSeven", initialData.questionSeven);
    }
  }, [initialData?.passage, initialData?.questionFive, initialData?.questionSix, initialData?.questionSeven, setValue]);

  const onSubmit = async (data: SpeakingPart3FormData) => {
    try {
      setLoading(true);

      const response = await upsertSpeakingPart3(examId, {
        speakingExamId: examId,
        index: index,
        passage: data.passage,
        questionFive: data.questionFive,
        questionSix: data.questionSix,
        questionSeven: data.questionSeven,
      });

      if (response.success) {
        alert("Lưu Câu 5-7 thành công!");
        setSaved(true);
        onSave?.();
      }
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      console.error("Lỗi khi lưu Câu 5-7:", error);
      alert(apiError?.message || "Lưu Câu 5-7 thất bại!");
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
            Câu 5-7: Respond to Questions
          </Typography>
          <Typography variant="small" color="gray">
            Trả lời các câu hỏi tình huống ngắn
          </Typography>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Bối cảnh tình huống <span className="text-red-500">*</span>
            </label>
            <Textarea
              {...register("passage")}
              error={!!errors.passage}
              rows={4}
              placeholder="Nhập bối cảnh tình huống..."
              className="w-full"
            />
            {errors.passage && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.passage.message}
              </Typography>
            )}
          </div>

          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Câu hỏi 5 <span className="text-red-500">*</span>
            </label>
            <Textarea
              {...register("questionFive")}
              error={!!errors.questionFive}
              rows={4}
              placeholder="Nhập câu hỏi 5..."
              className="w-full"
            />
            {errors.questionFive && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.questionFive.message}
              </Typography>
            )}
          </div>

          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Câu hỏi 6 <span className="text-red-500">*</span>
            </label>
            <Textarea
              {...register("questionSix")}
              error={!!errors.questionSix}
              rows={4}
              placeholder="Nhập câu hỏi 6..."
              className="w-full"
            />
            {errors.questionSix && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.questionSix.message}
              </Typography>
            )}
          </div>

          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Câu hỏi 7 <span className="text-red-500">*</span>
            </label>
            <Textarea
              {...register("questionSeven")}
              error={!!errors.questionSeven}
              rows={4}
              placeholder="Nhập câu hỏi 7..."
              className="w-full"
            />
            {errors.questionSeven && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.questionSeven.message}
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

export default Part3Editor;