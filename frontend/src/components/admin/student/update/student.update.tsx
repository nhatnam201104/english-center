import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { updateStudentSchema, type UpdateStudentFormData } from "../../../../libs/validation/student.schema";
import {
  getStudentByIdService,
  updateStudentService,
} from "../../../../services/student.service";

const StudentUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateStudentFormData>({
    resolver: zodResolver(updateStudentSchema) as never,
  });

  useEffect(() => {
    const loadStudent = async () => {
      if (!id) return;
      try {
        setLoadingData(true);
        const response = await getStudentByIdService(Number(id));
        if (response.success && response.data) {
          const student = response.data;
          setValue("fullname", student.fullname);
          setValue("email", student.email);
          setValue("phone", student.phone);
          if (student.dob) setValue("dob", student.dob.split("T")[0]);
          if (student.cccd) setValue("cccd", student.cccd);
          setValue("scoreRl", student.scoreRl);
          setValue("scoreSw", student.scoreSw);
        }
      } catch {
        alert("Không thể tải thông tin học sinh!");
        navigate("/admin/students");
      } finally {
        setLoadingData(false);
      }
    };

    loadStudent();
  }, [id, navigate, setValue]);

  const onSubmit = async (data: UpdateStudentFormData) => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await updateStudentService(Number(id), data);

      if (response.success) {
        alert("Cập nhật học sinh thành công!");
        navigate("/admin/students");
      }
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      alert(apiError.response?.data?.message || "Cập nhật học sinh thất bại!");
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
                Cập Nhật Học Sinh
              </Typography>
              <Typography variant="small" color="white" className="mt-1 opacity-90">
                Chỉnh sửa thông tin học sinh
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
                  label="Mật khẩu mới (để trống nếu không muốn thay đổi)"
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
                  label="CCCD"
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
                  label="Điểm Reading & Listening (0-10)"
                  type="number"
                  step="0.1"
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
                  label="Điểm Speaking & Writing (0-10)"
                  type="number"
                  step="0.1"
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
                {loading ? "Đang cập nhật..." : "Cập Nhật"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default StudentUpdate;
