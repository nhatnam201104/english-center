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
import { updateParentSchema, type UpdateParentFormData } from "../../../../libs/validation/parent.schema";
import {
  getParentByIdService,
  updateParentService,
} from "../../../../services/parent.service";

const ParentUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateParentFormData>({
    resolver: zodResolver(updateParentSchema) as never,
  });

  useEffect(() => {
    const loadParent = async () => {
      if (!id) return;
      try {
        setLoadingData(true);
        const response = await getParentByIdService(Number(id));
        if (response.success && response.data) {
          const parent = response.data;
          setValue("fullname", parent.fullname);
          setValue("email", parent.email);
          setValue("phone", parent.phone);
        }
      } catch {
        alert("Không thể tải thông tin phụ huynh!");
        navigate("/admin/parents");
      } finally {
        setLoadingData(false);
      }
    };

    loadParent();
  }, [id, navigate, setValue]);

  const onSubmit = async (data: UpdateParentFormData) => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await updateParentService(Number(id), data);

      if (response.success) {
        alert("Cập nhật phụ huynh thành công!");
        navigate("/admin/parents");
      }
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      alert(apiError.response?.data?.message || "Cập nhật phụ huynh thất bại!");
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
                Cập Nhật Phụ Huynh
              </Typography>
              <Typography variant="small" color="white" className="mt-1 opacity-90">
                Chỉnh sửa thông tin phụ huynh
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
                {loading ? "Đang cập nhật..." : "Cập Nhật"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default ParentUpdate;
