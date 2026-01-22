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
  Select,
  Option,
  Switch,
} from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { updateTeacherSchema, type UpdateTeacherFormData } from "../../../../libs/validation/teacher.schema";
import {
  getTeacherByIdService,
  updateTeacherService,
} from "../../../../services/teacher.service";

const TeacherUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateTeacherFormData>({
    resolver: zodResolver(updateTeacherSchema) as never,
  });

  const isTeaching = watch("isTeaching");

  useEffect(() => {
    const loadTeacher = async () => {
      if (!id) return;
      try {
        setLoadingData(true);
        const response = await getTeacherByIdService(Number(id));
        if (response.success && response.data) {
          const teacher = response.data;
          setValue("fullname", teacher.fullname);
          setValue("email", teacher.email);
          setValue("phone", teacher.phone);
          setValue("degree", teacher.degree);
          setValue("isTeaching", teacher.isTeaching);
          if (teacher.avatar) {
            setAvatarPreview(teacher.avatar);
          }
        }
      } catch {
        alert("Không thể tải thông tin giáo viên!");
        navigate("/admin/teachers");
      } finally {
        setLoadingData(false);
      }
    };

    loadTeacher();
  }, [id, navigate, setValue]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("avatar", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: UpdateTeacherFormData) => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await updateTeacherService(Number(id), data);

      if (response.success) {
        alert("Cập nhật giáo viên thành công!");
        navigate("/admin/teachers");
      }
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      alert(apiError.response?.data?.message || "Cập nhật giáo viên thất bại!");
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
              onClick={() => navigate("/admin/teachers")}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div>
              <Typography variant="h4" color="white" className="font-bold">
                Cập Nhật Giáo Viên
              </Typography>
              <Typography variant="small" color="white" className="mt-1 opacity-90">
                Chỉnh sửa thông tin giáo viên
              </Typography>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                />
              )}
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Avatar (để trống nếu không muốn thay đổi)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
              </div>
            </div>

            {/* Form Grid */}
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
                <Select
                  label="Bằng cấp"
                  onChange={(val) => setValue("degree", val || "")}
                  error={!!errors.degree}
                  value={watch("degree")}
                >
                  <Option value="Cử nhân">Cử nhân</Option>
                  <Option value="Thạc sĩ">Thạc sĩ</Option>
                  <Option value="Tiến sĩ">Tiến sĩ</Option>
                </Select>
                {errors.degree && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.degree.message}
                  </Typography>
                )}
              </div>

              <div className="flex items-center gap-4">
                <Typography variant="small" className="font-medium">
                  Đang giảng dạy
                </Typography>
                <Switch
                  checked={isTeaching}
                  onChange={(e) => setValue("isTeaching", e.target.checked)}
                  crossOrigin={undefined}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outlined"
                onClick={() => navigate("/admin/teachers")}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-blue-600"
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

export default TeacherUpdate;
