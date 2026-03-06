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
} from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { createStudentSchema, type CreateStudentFormData } from "../../../../libs/validation/student.schema";
import { createStudentService } from "../../../../services/student.service";

const StudentCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStudentFormData>({
    resolver: zodResolver(createStudentSchema) as never,
  });

  const onSubmit = async (data: CreateStudentFormData) => {
    try {
      setLoading(true);
      const response = await createStudentService(data);

      if (response.success) {
        alert("Tạo học sinh thành công!");
        navigate("/admin/students");
      }
    } catch (error: unknown) {
      const apiError = error as {
        response?: { data?: { message?: string | string[] } };
        message?: string;
      };
      const msg = apiError.response?.data?.message;
      const detail = Array.isArray(msg) ? msg.join("\n") : (msg ?? apiError.message ?? "Tạo học sinh thất bại!");
      alert(detail);
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
          className="rounded-none bg-gradient-to-r from-green-600 to-green-400 p-6"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="text"
              className="text-white hover:bg-white/10"
              onClick={() => navigate("/admin/students")}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div>
              <Typography variant="h4" color="white" className="font-bold">
                Thêm Học Sinh Mới
              </Typography>
              <Typography variant="small" color="white" className="mt-1 opacity-90">
                Điền đầy đủ thông tin để tạo học sinh
              </Typography>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Họ và tên"
                  {...register("fullname")}
                  error={!!errors.fullname}
                  crossOrigin={undefined}
                />
                {errors.fullname && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.fullname.message}
                  </Typography>
                )}
              </div>

              <div>
                <Input
                  label="Email"
                  type="email"
                  {...register("email")}
                  error={!!errors.email}
                  crossOrigin={undefined}
                />
                {errors.email && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.email.message}
                  </Typography>
                )}
              </div>

              <div>
                <Input
                  label="Số điện thoại"
                  {...register("phone")}
                  error={!!errors.phone}
                  crossOrigin={undefined}
                />
                {errors.phone && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.phone.message}
                  </Typography>
                )}
              </div>

              <div>
                <Input
                  label="Mật khẩu"
                  type="password"
                  {...register("password")}
                  error={!!errors.password}
                  crossOrigin={undefined}
                />
                {errors.password && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.password.message}
                  </Typography>
                )}
              </div>

              <div>
                <Input
                  label="Ngày sinh"
                  type="date"
                  {...register("dob")}
                  error={!!errors.dob}
                  crossOrigin={undefined}
                />
                {errors.dob && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.dob.message}
                  </Typography>
                )}
              </div>

              <div>
                <Input
                  label="CCCD (12 chữ số)"
                  {...register("cccd")}
                  error={!!errors.cccd}
                  crossOrigin={undefined}
                />
                {errors.cccd && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.cccd.message}
                  </Typography>
                )}
              </div>

              <div>
                <Input
                  label="Điểm Reading & Listening (0-990, tùy chọn)"
                  type="number"
                  min={0}
                  max={990}
                  step={5}
                  placeholder="Ví dụ: 650"
                  {...register("scoreRl", { valueAsNumber: true })}
                  error={!!errors.scoreRl}
                  crossOrigin={undefined}
                />
                {errors.scoreRl && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.scoreRl.message}
                  </Typography>
                )}
              </div>

              <div>
                <Input
                  label="Điểm Speaking & Writing (0-400, tùy chọn)"
                  type="number"
                  min={0}
                  max={400}
                  step={10}
                  placeholder="Ví dụ: 280"
                  {...register("scoreSw", { valueAsNumber: true })}
                  error={!!errors.scoreSw}
                  crossOrigin={undefined}
                />
                {errors.scoreSw && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.scoreSw.message}
                  </Typography>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outlined"
                onClick={() => navigate("/admin/students")}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-green-600"
                disabled={loading}
              >
                {loading ? "Đang tạo..." : "Tạo Học Sinh"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default StudentCreate;
