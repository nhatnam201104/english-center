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
import { createParentSchema, type CreateParentFormData } from "../../../../libs/validation/parent.schema";
import { createParentService } from "../../../../services/parent.service";

const ParentCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateParentFormData>({
    resolver: zodResolver(createParentSchema),
  });

  const onSubmit = async (data: CreateParentFormData) => {
    try {
      setLoading(true);
      const response = await createParentService(data);

      if (response.success) {
        alert("Tạo phụ huynh thành công!");
        navigate("/admin/parents");
      }
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      alert(apiError.response?.data?.message || "Tạo phụ huynh thất bại!");
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
          className="rounded-none bg-gradient-to-r from-purple-600 to-purple-400 p-6"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="text"
              className="text-white hover:bg-white/10"
              onClick={() => navigate("/admin/parents")}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div>
              <Typography variant="h4" color="white" className="font-bold">
                Thêm Phụ Huynh Mới
              </Typography>
              <Typography variant="small" color="white" className="mt-1 opacity-90">
                Điền đầy đủ thông tin để tạo phụ huynh
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
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outlined"
                onClick={() => navigate("/admin/parents")}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-purple-600"
                disabled={loading}
              >
                {loading ? "Đang tạo..." : "Tạo Phụ Huynh"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ParentCreate;
