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
import type { CreateClassroomRequest } from "../../../../types/classroom/request";
import { createClassroom } from "../../../../services/classroom.service";

const ClassroomCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClassroomRequest>();

  const onSubmit = async (data: CreateClassroomRequest) => {
    try {
      setLoading(true);
      const response = await createClassroom(data);
      if (response.success) {
        alert("Tạo lớp học thành công!");
        navigate("/admin/classrooms");
      } else {
        alert(response.message || "Tạo lớp học thất bại!");
      }
    } catch (error: unknown) {
      const apiError = error as {
        message?: string;
      };
      console.error("Lỗi khi tạo lớp học:", apiError);
      alert(apiError?.message || "Tạo lớp học thất bại!");
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
              onClick={() => navigate("/admin/classrooms")}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div>
              <Typography variant="h4" color="white" className="font-bold">
                Thêm Lớp Học Mới
              </Typography>
              <Typography
                variant="small"
                color="white"
                className="mt-1 opacity-90"
              >
                Điền đầy đủ thông tin để tạo lớp học
              </Typography>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Tên lớp học"
                  {...register("name", {
                    required: "Vui lòng nhập tên lớp học",
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
                <Input
                  label="Sức Chứa"
                  type="number"
                  {...register("maxSize", {
                    required: "Vui lòng nhập sức chứa",
                    valueAsNumber: true,
                  })}
                  error={!!errors.maxSize}
                  crossOrigin={undefined}
                />
                {errors.maxSize && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.maxSize.message}
                  </Typography>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outlined"
                onClick={() => navigate("/admin/classrooms")}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button type="submit" className="bg-blue-600" disabled={loading}>
                {loading ? "Đang tạo..." : "Tạo Lớp Học"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ClassroomCreate;
