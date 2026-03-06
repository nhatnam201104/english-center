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
  Select,
  Option,
} from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type { UpdateCourseRequest as UpdateCourseRequestType } from "../../../../types/course/request";
import type { UpdateCourseFormData } from "../../../../libs/validation/course.schema";
import {
  getCourseById,
  updateCourse,
} from "../../../../services/course.service";

const CourseUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [newThumbnailFile, setNewThumbnailFile] = useState<File | undefined>(
    undefined,
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateCourseFormData>();

  const type = watch("type");
  const status = watch("status");
  const courseSkill = watch("courseSkill");

  const [originalStatus, setOriginalStatus] = useState<string>("");

  useEffect(() => {
    const loadCourse = async () => {
      if (!id) return;
      try {
        setLoadingData(true);
        const response = await getCourseById(Number(id));
        if (response.success && response.data) {
          setValue("name", response.data.name);
          setValue("type", response.data.type);
          setValue("price", response.data.price);
          setValue("sale", response.data.sale);
          setValue("status", response.data.status);
          setValue("minBand", response.data.minBand ?? undefined);
          setValue("maxBand", response.data.maxBand ?? undefined);
          setValue("courseSkill", response.data.courseSkill);
          setValue("totalSession", response.data.totalSession);
          setOriginalStatus(response.data.status);
          if (response.data.thumbnail) {
            setThumbnailPreview(response.data.thumbnail);
          }
        }
      } catch {
        alert("Không thể tải thông tin khóa học!");
        navigate("/admin/courses");
      } finally {
        setLoadingData(false);
      }
    };

    loadCourse();
  }, [id, navigate, setValue]);

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
      setNewThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: UpdateCourseFormData) => {
    if (!id) return;

    try {
      setLoading(true);

      // If there's a new thumbnail file, use FormData for file upload
      if (newThumbnailFile instanceof File) {
        const formData = new FormData();
        if (data.name) formData.append("name", data.name);
        if (data.type) formData.append("type", data.type);
        if (data.price !== undefined)
          formData.append("price", data.price.toString());
        if (data.sale !== undefined)
          formData.append("sale", data.sale.toString());
        if (data.status) formData.append("status", data.status);
        if (data.minBand !== undefined)
          formData.append("minBand", data.minBand.toString());
        if (data.maxBand !== undefined)
          formData.append("maxBand", data.maxBand.toString());
        if (data.courseSkill) formData.append("courseSkill", data.courseSkill);
        if (data.totalSession !== undefined)
          formData.append("totalSession", data.totalSession.toString());
        formData.append("thumbnail", newThumbnailFile);

        const response = await updateCourse(formData, Number(id));
        if (response.success) {
          alert("Cập nhật khóa học thành công!");
          navigate("/admin/courses");
        } else {
          alert(response.message || "Cập nhật khóa học thất bại!");
        }
      } else {
        // No new file, use regular request object
        const updateData: UpdateCourseRequestType = {
          id: Number(id),
        };
        if (data.name) updateData.name = data.name;
        if (data.type) updateData.type = data.type;
        if (data.price !== undefined) updateData.price = data.price;
        if (data.sale !== undefined) updateData.sale = data.sale;
        if (data.status) updateData.status = data.status;
        if (data.minBand !== undefined) updateData.minBand = data.minBand;
        if (data.maxBand !== undefined) updateData.maxBand = data.maxBand;
        if (data.courseSkill) updateData.courseSkill = data.courseSkill;
        if (data.totalSession !== undefined) updateData.totalSession = data.totalSession;

        const response = await updateCourse(updateData);
        if (response.success) {
          alert("Cập nhật khóa học thành công!");
          navigate("/admin/courses");
        } else {
          alert(response.message || "Cập nhật khóa học thất bại!");
        }
      }
    } catch (error: unknown) {
      const apiError = error as {
        message?: string;
      };
      console.error("Lỗi khi cập nhật khóa học:", error);
      alert(apiError?.message ?? "Cập nhật khóa học thất bại!");
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
              onClick={() => navigate("/admin/courses")}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div>
              <Typography variant="h4" color="white" className="font-bold">
                Cập Nhật Khóa Học
              </Typography>
              <Typography
                variant="small"
                color="white"
                className="mt-1 opacity-90"
              >
                Chỉnh sửa thông tin khóa học
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
                  Ảnh Thumbnail (để trống nếu không muốn thay đổi)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Tên khóa học"
                  {...register("name")}
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
              </div>

              <div>
                <Input
                  label="Giá (VND)"
                  type="number"
                  {...register("price", { valueAsNumber: true })}
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
                  {...register("totalSession", { valueAsNumber: true })}
                  error={!!errors.totalSession}
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
                      (val || "ALL") as
                        | "READING_LISTENING"
                        | "SPEAKING_WRITING"
                        | "ALL",
                    )
                  }
                  value={courseSkill}
                >
                  <Option value="READING_LISTENING">Đọc & Nghe</Option>
                  <Option value="SPEAKING_WRITING">Nói & Viết</Option>
                  <Option value="ALL">Tất cả</Option>
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
                {loading ? "Đang cập nhật..." : "Cập Nhật"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default CourseUpdate;
