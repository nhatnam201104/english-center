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
import { speakingPart1Schema, type SpeakingPart1FormData } from "../../../../libs/validation/speaking.schema";
import { upsertSpeakingPart1 } from "../../../../services/speaking.service";
import type { SpeakingOneTwo } from "../../../../types/speaking/response";

interface Part1EditorProps {
  examId: number;
  index: number;
  initialData?: SpeakingOneTwo;
  onSave?: () => void;
}

const Part1Editor: React.FC<Part1EditorProps> = ({
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
  } = useForm<SpeakingPart1FormData>({
    resolver: zodResolver(speakingPart1Schema),
    defaultValues: {
      questionOne: initialData?.questionOne || "",
      questionTwo: initialData?.questionTwo || "",
    },
  });

  // Sync form values when initialData changes
  useEffect(() => {
    if (initialData?.questionOne) {
      setValue("questionOne", initialData.questionOne);
    }
    if (initialData?.questionTwo) {
      setValue("questionTwo", initialData.questionTwo);
    }
  }, [initialData?.questionOne, initialData?.questionTwo, setValue]);

  const onSubmit = async (data: SpeakingPart1FormData) => {
    try {
      setLoading(true);

      const response = await upsertSpeakingPart1(examId, {
        speakingExamId: examId,
        index: index,
        questionOne: data.questionOne,
        questionTwo: data.questionTwo,
      });

      if (response.success) {
        alert("Lưu Câu 1-2 thành công!");
        setSaved(true);
        onSave?.();
      }
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      console.error("Lỗi khi lưu Câu 1-2:", error);
      alert(apiError?.message || "Lưu Câu 1-2 thất bại!");
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
            Câu 1-2: Read a Text Aloud
          </Typography>
          <Typography variant="small" color="gray">
            Đọc văn bản thành tiếng
          </Typography>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Câu hỏi 1 <span className="text-red-500">*</span>
            </label>
            <Textarea
              {...register("questionOne")}
              error={!!errors.questionOne}
              rows={6}
              placeholder="Nhập đoạn văn bản cho câu hỏi 1..."
              className="w-full"
            />
            {errors.questionOne && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.questionOne.message}
              </Typography>
            )}
          </div>

          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Câu hỏi 2 <span className="text-red-500">*</span>
            </label>
            <Textarea
              {...register("questionTwo")}
              error={!!errors.questionTwo}
              rows={6}
              placeholder="Nhập đoạn văn bản cho câu hỏi 2..."
              className="w-full"
            />
            {errors.questionTwo && (
              <Typography variant="small" color="red" className="mt-1">
                {errors.questionTwo.message}
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

export default Part1Editor;