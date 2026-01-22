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
  Switch,
} from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { createTeacherSchema, type CreateTeacherFormData } from "../../../../libs/validation/teacher.schema";
import { createTeacherService } from "../../../../services/teacher.service";

const TeacherCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTeacherFormData>({
    resolver: zodResolver(createTeacherSchema) as never,
    defaultValues: {
      isTeaching: true,
    },
  });

  const isTeaching = watch("isTeaching");

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

  const onSubmit = async (data: CreateTeacherFormData) => {
    try {
      setLoading(true);
      const response = await createTeacherService({
        fullname: data.fullname,
        email: data.email,
        password: data.password,
        phone: data.phone,
        degree: data.degree,
        isTeaching: data.isTeaching,
        avatar: data.avatar,
      });

      if (response.success) {
        alert("Tạo giáo viên thành công!");
        navigate("/admin/teachers");
      }
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      alert(apiError.message || "Tạo giáo viên thất bại!");
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
              onClick={() => navigate("/admin/teachers")}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div>
              <Typography variant="h4" color="white" className="font-bold">
                Thêm Giáo Viên Mới
              </Typography>
              <Typography variant="small" color="white" className="mt-1 opacity-90">
                Điền đầy đủ thông tin để tạo giáo viên
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
                  Avatar <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                {errors.avatar && (
                  <Typography variant="small" color="red" className="mt-1">
                    {errors.avatar.message}
                  </Typography>
                )}
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
                <Select
                  label="Bằng cấp"
                  onChange={(val) => setValue("degree", val || "")}
                  error={!!errors.degree}
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
                {loading ? "Đang tạo..." : "Tạo Giáo Viên"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default TeacherCreate;
