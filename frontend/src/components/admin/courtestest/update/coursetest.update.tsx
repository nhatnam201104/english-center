import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import type { UpdateCourseTestRequest } from "../../../../types/coursetest/request";
import type { CourseTest } from "../../../../types/coursetest/response";
import {
  getCoursetestById,
  updateCoursetest,
} from "../../../../services/coursetest.service";

const CoursetestUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [fileTestFile, setFileTestFile] = useState<File | null>(null);
  const [audioTestFile, setAudioTestFile] = useState<File | null>(null);
  const [originalData, setOriginalData] = useState<CourseTest | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateCourseTestRequest>();

  useEffect(() => {
    const loadCoursetest = async () => {
      if (!id) return;
      try {
        setLoadingData(true);
        const response = await getCoursetestById(Number(id));
        if (response.success && response.data) {
          const data = response.data;
          setValue("courseId", data.courseId);
          setValue("name", data.name);
          setValue("index", data.index);
          setOriginalData(data);
        }
      } catch {
        alert("Không thể tải thông tin bài kiểm tra!");
        navigate("/admin/coursetest");
      } finally {
        setLoadingData(false);
      }
    };

    loadCoursetest();
  }, [id, navigate, setValue]);

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

  const onSubmit = async (data: UpdateCourseTestRequest) => {
    if (!id) return;

    try {
      setLoading(true);

      // If there are new files, use FormData
      if (fileTestFile || audioTestFile) {
        const formData = new FormData();
        formData.append("id", id);
        if (data.courseId)
          formData.append("courseId", data.courseId.toString());
        if (data.name) formData.append("name", data.name);
        if (data.index !== undefined)
          formData.append("index", data.index.toString());
        if (fileTestFile) formData.append("fileTest", fileTestFile);
        if (audioTestFile) formData.append("audioTest", audioTestFile);

        const response = await updateCoursetest(
          formData as unknown as UpdateCourseTestRequest,
        );
        if (response.success) {
          alert("Cập nhật bài kiểm tra thành công!");
          navigate("/admin/coursetest");
        } else {
          alert(response.message || "Cập nhật bài kiểm tra thất bại!");
        }
      } else {
        // No new files, use regular request object
        const updateData: UpdateCourseTestRequest = {
          id: Number(id),
        };
        if (data.courseId) updateData.courseId = data.courseId;
        if (data.name) updateData.name = data.name;
        if (data.index !== undefined) updateData.index = data.index;

        const response = await updateCoursetest(updateData);
        if (response.success) {
          alert("Cập nhật bài kiểm tra thành công!");
          navigate("/admin/coursetest");
        } else {
          alert(response.message || "Cập nhật bài kiểm tra thất bại!");
        }
      }
    } catch (error: unknown) {
      const apiError = error as {
        message?: string;
      };
      console.error("Lỗi khi cập nhật bài kiểm tra:", error);
      alert(apiError?.message ?? "Cập nhật bài kiểm tra thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardBody>
            <Typography className="text-center">Đang tải...</Typography>
          </CardBody>
        </Card>
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
                Cập Nhật Bài Kiểm Tra
              </Typography>
              <Typography
                variant="small"
                color="white"
                className="mt-1 opacity-90"
              >
                Chỉnh sửa thông tin bài kiểm tra
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
                  File Đề (để trống nếu không muốn thay đổi)
                </label>
                <input
                  type="file"
                  onChange={handleFileTestChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                {originalData?.fileTest && !fileTestFile && (
                  <Typography variant="small" color="gray" className="mt-1">
                    File hiện tại:{" "}
                    <a
                      href={originalData.fileTest}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      Xem
                    </a>
                  </Typography>
                )}
                {fileTestFile && (
                  <Typography variant="small" color="gray" className="mt-1">
                    File mới: {fileTestFile.name}
                  </Typography>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  File Âm Thanh (để trống nếu không muốn thay đổi)
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioTestChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                {originalData?.audioTest && !audioTestFile && (
                  <Typography variant="small" color="gray" className="mt-1">
                    File hiện tại:{" "}
                    <a
                      href={originalData.audioTest}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      Xem
                    </a>
                  </Typography>
                )}
                {audioTestFile && (
                  <Typography variant="small" color="gray" className="mt-1">
                    File mới: {audioTestFile.name}
                  </Typography>
                )}
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
                {loading ? "Đang cập nhật..." : "Cập Nhật"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default CoursetestUpdate;
