import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import {
  ArrowLeftIcon,
  DocumentIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import type { CreateCourseTestFormData } from "../../../../libs/validation/coursetest.schema";
import type { Course } from "../../../../types/course/response";
import { createCoursetest } from "../../../../services/coursetest.service";
import { getAllCourses } from "../../../../services/course.service";

const CoursetestCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseIdParam = searchParams.get("courseId");
  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateCourseTestFormData>();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoadingCourses(true);
        const response = await getAllCourses({ page: 1, limit: 100 });
        setCourses(response.data?.data || []);

        // Set courseId if coming from URL
        if (courseIdParam) {
          setValue("courseId", parseInt(courseIdParam));
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách khóa học:", error);
      } finally {
        setLoadingCourses(false);
      }
    };
    loadCourses();
  }, [courseIdParam, setValue]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: "fileTest" | "audioTest",
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue(fieldName, file);
    }
  };

  const onSubmit = async (data: CreateCourseTestFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("courseId", data.courseId.toString());
      formData.append("name", data.name);
      if (data.fileTest instanceof File) {
        formData.append("fileTest", data.fileTest);
      }
      if (data.audioTest instanceof File) {
        formData.append("audioTest", data.audioTest);
      }

      const response = await createCoursetest(formData);
      if (response.success) {
        alert("Tạo bài kiểm tra thành công!");
        if (courseIdParam) {
          navigate(`/admin/coursetest?courseId=${courseIdParam}`);
        } else {
          navigate("/admin/coursetest");
        }
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
              onClick={() => {
                if (courseIdParam) {
                  navigate(`/admin/coursetest?courseId=${courseIdParam}`);
                } else {
                  navigate("/admin/coursetest");
                }
              }}
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
            {/* Hide courseId field if coming from URL */}
            {!courseIdParam && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Khóa học <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("courseId", {
                    required: "Vui lòng chọn khóa học",
                    valueAsNumber: true,
                  })}
                  className="block w-full p-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  disabled={loadingCourses}
                >
                  <option value="">Chọn khóa học</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
                {errors.courseId && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.courseId.message}
                  </Typography>
                )}
              </div>
            )}
            {/* Hidden input for courseId when coming from URL */}
            {courseIdParam && (
              <input
                type="hidden"
                {...register("courseId", {
                  required: "Vui lòng chọn khóa học",
                  valueAsNumber: true,
                })}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="md:col-span-2">
                <div className="border border-gray-300 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File bài kiểm tra (PDF, DOCX, v.v.) *
                  </label>
                  <div className="flex items-center gap-4">
                    <DocumentIcon className="h-10 w-10 text-gray-400" />
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, "fileTest")}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {errors.fileTest && (
                    <Typography variant="small" color="red" className="mt-1">
                      {errors.fileTest.message?.toString()}
                    </Typography>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="border border-gray-300 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File âm thanh (MP3, WAV, v.v.) - Tùy chọn
                  </label>
                  <div className="flex items-center gap-4">
                    <MusicalNoteIcon className="h-10 w-10 text-gray-400" />
                    <input
                      type="file"
                      accept=".mp3,.wav,.m4a"
                      onChange={(e) => handleFileChange(e, "audioTest")}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {errors.audioTest && (
                    <Typography variant="small" color="red" className="mt-1">
                      {errors.audioTest.message?.toString()}
                    </Typography>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outlined"
                onClick={() => {
                  if (courseIdParam) {
                    navigate(`/admin/coursetest?courseId=${courseIdParam}`);
                  } else {
                    navigate("/admin/coursetest");
                  }
                }}
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