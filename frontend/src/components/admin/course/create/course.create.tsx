import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  createCourseSchema,
  type CreateCourseFormData,
} from "../../../../libs/validation/course.schema";
import type { CreateCourseRequest } from "../../../../types/course/request";
import { createCourse } from "../../../../services/course.service";

const CourseCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateCourseFormData>({
    resolver: zodResolver(createCourseSchema) as never,
    defaultValues: {
      type: "COURSE",
      sale: 0,
      courseSkill: "READING_LISTENING",
      status: "PLANNING",
    },
  });

  const type = watch("type");
  const courseSkill = watch("courseSkill");
  const status = watch("status");

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh!");
        e.target.value = "";
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert("Kích thước ảnh không được vượt quá 5MB!");
        e.target.value = "";
        return;
      }

      setValue("thumbnail", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CreateCourseFormData) => {
    try {
      setLoading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("type", data.type);
      formData.append("price", data.price.toString());
      formData.append("sale", data.sale.toString());
      formData.append("status", data.status);

      if (data.totalSession !== undefined) {
        formData.append("totalSession", data.totalSession.toString());
      }
      if (data.minBand !== undefined) {
        formData.append("minBand", data.minBand.toString());
      }
      if (data.maxBand !== undefined) {
        formData.append("maxBand", data.maxBand.toString());
      }
      if (data.thumbnail instanceof File) {
        formData.append("thumbnail", data.thumbnail);
      }
      formData.append("courseSkill", data.courseSkill);

      const response = await createCourse(
        formData as unknown as CreateCourseRequest,
      );
      if (response.success) {
        alert("Tạo khóa học thành công!");
        navigate("/admin/courses");
      }
    } catch (error: unknown) {
      const apiError = error as {
        message?: string;
      };
      console.error("Lỗi khi tạo khóa học:", error);
      alert(apiError?.message ?? "Tạo khóa học thất bại!");
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
              onClick={() => navigate("/admin/courses")}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div>
              <Typography variant="h4" color="white" className="font-bold">
                Thêm Khóa Học Mới
              </Typography>
              <Typography
                variant="small"
                color="white"
                className="mt-1 opacity-90"
              >
                Điền đầy đủ thông tin để tạo khóa học
              </Typography>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Thumbnail Upload */}
            <div className="flex flex-col items-center gap-4">
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  className="w-64 h-48 rounded-lg object-cover border-4 border-blue-500"
                />
              )}
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Ảnh Thumbnail <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                {errors.thumbnail && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.thumbnail.message}
                  </Typography>
                )}
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Tên khóa học"
                  {...register("name", {
                    required: "Vui lòng nhập tên khóa học",
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
                <Select
                  label="Loại khóa học"
                  onChange={(val) =>
                    setValue(
                      "type",
                      (val || "COURSE") as "COURSE" | "TEST_PREPARATION",
                    )
                  }
                  value={type}
                >
                  <Option value="COURSE">Khóa học</Option>
                  <Option value="TEST_PREPARATION">Luyện thi</Option>
                </Select>
                {errors.type && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.type.message}
                  </Typography>
                )}
              </div>

              <div>
                <Select
                  label="Trạng thái"
                  onChange={(val) =>
                    setValue(
                      "status",
                      (val || "PLANNING") as
                        | "PLANNING"
                        | "ACTIVE"
                        | "INACTIVE",
                    )
                  }
                  value={status}
                >
                  <Option value="PLANNING">Lên kế hoạch</Option>
                  <Option value="ACTIVE">Đang hoạt động</Option>
                  <Option value="INACTIVE">Không hoạt động</Option>
                </Select>
                {errors.status && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.status.message}
                  </Typography>
                )}
              </div>

              <div>
                <Input
                  label="Giá (VND)"
                  type="number"
                  {...register("price", {
                    required: "Vui lòng nhập giá",
                    valueAsNumber: true,
                  })}
                  error={!!errors.price}
                  crossOrigin={undefined}
                />
                {errors.price && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.price.message}
                  </Typography>
                )}
              </div>

              <div>
                <Input
                  label="Giảm giá (%)"
                  type="number"
                  {...register("sale", {
                    valueAsNumber: true,
                    min: 0,
                    max: 100,
                  })}
                  crossOrigin={undefined}
                />
              </div>

              <div>
                <Input
                  label="Số buổi học"
                  type="number"
                  {...register("totalSession", {
                    valueAsNumber: true,
                  })}
                  crossOrigin={undefined}
                />
                {errors.totalSession && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.totalSession.message}
                  </Typography>
                )}
              </div>

              <div>
                <Input
                  label="Band tối thiểu"
                  type="number"
                  {...register("minBand", { valueAsNumber: true })}
                  error={!!errors.minBand}
                  crossOrigin={undefined}
                />
                {errors.minBand && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.minBand.message}
                  </Typography>
                )}
              </div>

              <div>
                <Input
                  label="Band tối đa"
                  type="number"
                  {...register("maxBand", { valueAsNumber: true })}
                  error={!!errors.maxBand}
                  crossOrigin={undefined}
                />
                {errors.maxBand && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.maxBand.message}
                  </Typography>
                )}
              </div>

              <div>
                <Select
                  label="Kỹ năng khóa học"
                  onChange={(val) =>
                    setValue(
                      "courseSkill",
                      (val || "READING_LISTENING") as
                        | "READING_LISTENING"
                        | "SPEAKING_WRITING",
                    )
                  }
                  value={courseSkill}
                >
                  <Option value="READING_LISTENING">Đọc & Nghe</Option>
                  <Option value="SPEAKING_WRITING">Nói & Viết</Option>
                </Select>
                {errors.courseSkill && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.courseSkill.message}
                  </Typography>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outlined"
                onClick={() => navigate("/admin/courses")}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button type="submit" className="bg-blue-600" disabled={loading}>
                {loading ? "Đang tạo..." : "Tạo Khóa Học"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default CourseCreate;
