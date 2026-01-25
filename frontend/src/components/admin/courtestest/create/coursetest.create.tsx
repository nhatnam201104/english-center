import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type { CreateCourseTestRequest } from "../../../../types/courtestest/request";
import { createCoursetest } from "../../../../services/courtestest.service";

const CoursetestCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileTestFile, setFileTestFile] = useState<File | null>(null);
  const [audioTestFile, setAudioTestFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCourseTestRequest>();

  const handleFileTestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileTestFile(file);
    }
  };

  const handleAudioTestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioTestFile(file);
    }
  };

  const onSubmit = async (data: CreateCourseTestRequest) => {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("courseId", data.courseId.toString());
    formData.append("name", data.name);
    formData.append("index", data.index.toString());
    if (fileTestFile) {
      formData.append("fileTest", fileTestFile);
    }
    if (audioTestFile) {
      formData.append("audioTest", audioTestFile);
    }

    try {
      setLoading(true);
      const response = await createCoursetest(
        formData as unknown as CreateCourseTestRequest,
      );
      if (response.success) {
        alert("Tạo bài kiểm tra thành công!");
        navigate("/admin/coursetest");
      } else {
        alert(response.message || "Tạo bài kiểm tra thất bại!");
      }
    } catch (error: unknown) {
      const apiError = error as {
        message?: string;
      };
      console.error("Lỗi khi tạo bài kiểm tra:", error);
      alert(apiError?.message ?? "Tạo bài kiểm tra thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-xl border border-gray-200">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none bg-gradient-to-r from-blue-600 to-blue-400 p-6"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="text"
              className="text-white hover:bg-white/10"
              onClick={() => navigate("/admin/coursetest")}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div>
              <Typography variant="h4" color="white" className="font-bold">
                Thêm Bài Kiểm Tra Mới
              </Typography>
              <Typography
                variant="small"
                color="white"
                className="mt-1 opacity-90"
              >
                Điền đầy đủ thông tin để tạo bài kiểm tra
              </Typography>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="ID Khóa Học"
                  type="number"
                  {...register("courseId", {
                    required: "Vui lòng nhập ID khóa học",
                    valueAsNumber: true,
                  })}
                  error={!!errors.courseId}
                  crossOrigin={undefined}
                />
                {errors.courseId && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.courseId.message}
                  </Typography>
                )}
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Tên bài kiểm tra"
                  {...register("name", {
                    required: "Vui lòng nhập tên bài kiểm tra",
                  })}
                  error={!!errors.name}
                  crossOrigin={undefined}
                />
                {errors.name && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.name.message}
                  </Typography>
                )}
              </div>

              <div>
                <Input
                  label="Chỉ số"
                  type="number"
                  {...register("index", {
                    required: "Vui lòng nhập chỉ số",
                    valueAsNumber: true,
                  })}
                  error={!!errors.index}
                  crossOrigin={undefined}
                />
                {errors.index && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.index.message}
                  </Typography>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  File Đề *
                </label>
                <input
                  type="file"
                  onChange={handleFileTestChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                <Typography variant="small" color="gray" className="mt-1">
                  {fileTestFile ? fileTestFile.name : "Chưa chọn file"}
                </Typography>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  File Âm Thanh (Tùy chọn)
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioTestChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                <Typography variant="small" color="gray" className="mt-1">
                  {audioTestFile ? audioTestFile.name : "Chưa chọn file"}
                </Typography>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outlined"
                onClick={() => navigate("/admin/coursetest")}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button type="submit" className="bg-blue-600" disabled={loading}>
                {loading ? "Đang tạo..." : "Tạo Bài Kiểm Tra"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default CoursetestCreate;
