import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardBody,
  Button,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import ImageUploadField from "../../../../components/common/ImageUploadField";
import { part1Schema, type Part1FormData } from "../../../../libs/validation/exam.schema";
import { upsertPart1 } from "../../../../services/exam.service";
import type { WritingOneToFive } from "../../../../types/exam/response";

interface Part1EditorProps {
  examId: number;
  index: number;
  initialData?: WritingOneToFive;
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
  const [files, setFiles] = useState<Record<string, File[]>>({
    imageOne: [],
    imageTwo: [],
    imageThree: [],
    imageFour: [],
    imageFive: [],
  });

  const {
    setValue,
    trigger,
    formState: { errors },
  } = useForm<Part1FormData>({
    resolver: zodResolver(part1Schema),
  });

  const handleFilesChange = (fieldName: string, newFiles: File[]) => {
    setFiles((prev) => ({ ...prev, [fieldName]: newFiles }));
    const typedFieldName = fieldName as keyof Part1FormData;
    setValue(typedFieldName, newFiles[0]);
    trigger(typedFieldName);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Validation: Different rules for CREATE vs UPDATE
      if (!initialData) {
        // CREATE: All 5 images are required
        const requiredFields: (keyof typeof files)[] = [
          "imageOne",
          "imageTwo",
          "imageThree",
          "imageFour",
          "imageFive",
        ];

        for (const field of requiredFields) {
          if (!files[field] || files[field].length === 0) {
            alert(`Vui lòng tải lên ${field}`);
            return;
          }
        }
      } else {
        // UPDATE: At least one image must be provided for update
        const hasAnyNewImage = Object.values(files).some(
          (fileList) => fileList && fileList.length > 0
        );

        if (!hasAnyNewImage) {
          alert("Vui lòng chọn ít nhất 1 ảnh để cập nhật");
          return;
        }
      }

      // Create FormData (index is handled by database default value)
      const formData = new FormData();
      
      // Only append images that are actually uploaded
      if (files.imageOne.length > 0) {
        formData.append("imageOne", files.imageOne[0]);
      }
      if (files.imageTwo.length > 0) {
        formData.append("imageTwo", files.imageTwo[0]);
      }
      if (files.imageThree.length > 0) {
        formData.append("imageThree", files.imageThree[0]);
      }
      if (files.imageFour.length > 0) {
        formData.append("imageFour", files.imageFour[0]);
      }
      if (files.imageFive.length > 0) {
        formData.append("imageFive", files.imageFive[0]);
      }

      console.log("FormData chuẩn bị gửi:", {
        imageOne: files.imageOne[0],
        imageTwo: files.imageTwo[0],
        imageThree: files.imageThree[0],
        imageFour: files.imageFour[0],
        imageFive: files.imageFive[0],
      });

      const response = await upsertPart1(examId, formData);

      if (response.success) {
        alert("Lưu Part 1 thành công!");
        setSaved(true);
        onSave?.();
      }
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      console.error("Lỗi khi lưu Part 1:", error);
      alert(apiError?.message || "Lưu Part 1 thất bại!");
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
            Câu 1-5: Write a Sentence Based on a Picture
          </Typography>
          <Typography variant="small" color="gray">
            Tải lên 5 ảnh cho Câu 1-5
          </Typography>
        </div>

        <div className="space-y-6">
          <ImageUploadField
            label="Câu 1"
            fieldName="imageOne"
            maxFiles={1}
            initialImages={initialData?.imageOne ? [initialData.imageOne] : []}
            onFilesChange={handleFilesChange}
            errors={typeof errors.imageOne === 'string' ? errors.imageOne : undefined}
            disabled={loading}
          />

          <ImageUploadField
            label="Câu 2"
            fieldName="imageTwo"
            maxFiles={1}
            initialImages={initialData?.imageTwo ? [initialData.imageTwo] : []}
            onFilesChange={handleFilesChange}
            errors={typeof errors.imageTwo === 'string' ? errors.imageTwo : undefined}
            disabled={loading}
          />

          <ImageUploadField
            label="Câu 3"
            fieldName="imageThree"
            maxFiles={1}
            initialImages={initialData?.imageThree ? [initialData.imageThree] : []}
            onFilesChange={handleFilesChange}
            errors={typeof errors.imageThree === 'string' ? errors.imageThree : undefined}
            disabled={loading}
          />

          <ImageUploadField
            label="Câu 4"
            fieldName="imageFour"
            maxFiles={1}
            initialImages={initialData?.imageFour ? [initialData.imageFour] : []}
            onFilesChange={handleFilesChange}
            errors={typeof errors.imageFour === 'string' ? errors.imageFour : undefined}
            disabled={loading}
          />

          <ImageUploadField
            label="Câu 5"
            fieldName="imageFive"
            maxFiles={1}
            initialImages={initialData?.imageFive ? [initialData.imageFive] : []}
            onFilesChange={handleFilesChange}
            errors={typeof errors.imageFive === 'string' ? errors.imageFive : undefined}
            disabled={loading}
          />
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSave}
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