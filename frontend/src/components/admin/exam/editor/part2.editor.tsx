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
import { part2Schema, type Part2FormData } from "../../../../libs/validation/exam.schema";
import { upsertPart2 } from "../../../../services/exam.service";
import type { WritingSixSeven } from "../../../../types/exam/response";

interface Part2EditorProps {
  examId: number;
  index: number;
  initialData?: WritingSixSeven;
  onSave?: () => void;
}

const Part2Editor: React.FC<Part2EditorProps> = ({
  examId,
  initialData,
  onSave,
}) => {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [files, setFiles] = useState<Record<string, File[]>>({
    imageSix: [],
    imageSeven: [],
  });

  const {
    setValue,
    trigger,
    formState: { errors },
  } = useForm<Part2FormData>({
    resolver: zodResolver(part2Schema),
  });

  const handleFilesChange = (fieldName: string, newFiles: File[]) => {
    setFiles((prev) => ({ ...prev, [fieldName]: newFiles }));
    const typedFieldName = fieldName as keyof Part2FormData;
    setValue(typedFieldName, newFiles[0]);
    trigger(typedFieldName);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Validation: Different rules for CREATE vs UPDATE
      if (!initialData) {
        // CREATE: Both images are required
        const requiredFields: (keyof typeof files)[] = ["imageSix", "imageSeven"];

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
      if (files.imageSix.length > 0) {
        formData.append("imageSix", files.imageSix[0]);
      }
      if (files.imageSeven.length > 0) {
        formData.append("imageSeven", files.imageSeven[0]);
      }

      const response = await upsertPart2(examId, formData);

      if (response.success) {
        alert("Lưu Part 2 thành công!");
        setSaved(true);
        onSave?.();
      }
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      console.error("Lỗi khi lưu Part 2:", error);
      alert(apiError?.message || "Lưu Part 2 thất bại!");
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
            Câu 6-7: Respond to a Written Request
          </Typography>
          <Typography variant="small" color="gray">
            Tải lên 2 ảnh cho Câu 6-7
          </Typography>
        </div>

        <div className="space-y-6">
          <ImageUploadField
            label="Câu 6"
            fieldName="imageSix"
            maxFiles={1}
            initialImages={initialData?.imageSix ? [initialData.imageSix] : []}
            onFilesChange={handleFilesChange}
            errors={typeof errors.imageSix === 'string' ? errors.imageSix : undefined}
            disabled={loading}
          />

          <ImageUploadField
            label="Câu 7"
            fieldName="imageSeven"
            maxFiles={1}
            initialImages={initialData?.imageSeven ? [initialData.imageSeven] : []}
            onFilesChange={handleFilesChange}
            errors={typeof errors.imageSeven === 'string' ? errors.imageSeven : undefined}
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

export default Part2Editor;