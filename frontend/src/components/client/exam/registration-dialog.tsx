import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import {
  examRegistrationSchema,
  type ExamRegistrationFormData,
} from "../../../libs/validation/examRegistration.schema";
import {
  registerCandidate,
  startAttempt,
} from "../../../services/entranceExam.candidate.service";
import { useExamStore } from "../../../stores/exam.store";

interface RegistrationDialogProps {
  open: boolean;
  onClose: () => void;
}

const RegistrationDialog = ({ open, onClose }: RegistrationDialogProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setRegistered, startAttempt: storeStartAttempt } = useExamStore();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ExamRegistrationFormData>({
    resolver: zodResolver(examRegistrationSchema) as never,
    defaultValues: {
      email: "",
      fullname: "",
      phone: "",
      cccd: "",
      examType: "READING_LISTENING",
    },
  });

  const onSubmit = async (data: ExamRegistrationFormData) => {
    setLoading(true);
    try {
      // Step 1: Register
      const regRes = await registerCandidate(data);
      if (!regRes.success || !regRes.data) {
        toast.error(regRes.message || "Đăng ký thất bại");
        return;
      }

      const admissionId = regRes.data.admissionId;
      setRegistered(admissionId);

      // Step 2: Start attempt
      const startRes = await startAttempt(admissionId);
      if (!startRes.success || !startRes.data) {
        toast.error(startRes.message || "Không thể bắt đầu bài thi");
        return;
      }

      storeStartAttempt(startRes.data.accessToken, startRes.data.expiresAt);
      toast.success("Đăng ký thành công! Đang chuyển đến bài thi...");
      reset();
      onClose();

      // Route based on exam type
      if (data.examType === "READING_LISTENING") {
        navigate(`/exam/${startRes.data.accessToken}`);
      } else if (data.examType === "SPEAKING_WRITING") {
        navigate(`/exam/sw/${startRes.data.accessToken}`);
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Đã có lỗi xảy ra. Vui lòng thử lại.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      onClose();
    }
  };

  return createPortal(
    <Dialog open={open} handler={handleClose} size="md" className="z-[10000]">
      <DialogHeader className="border-b pb-3">
        <Typography variant="h5" className="font-bold text-blue-gray-800">
          Đăng ký thi đầu vào TOEIC
        </Typography>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody className="pt-4 overflow-y-auto max-h-[70vh]">
          <div className="space-y-4">
            <Typography variant="small" color="gray" className="mb-2">
              Vui lòng điền đầy đủ thông tin để đăng ký thi đầu vào.
            </Typography>

            {/* Fullname */}
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

            {/* Email */}
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

            {/* Phone */}
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

            {/* CCCD */}
            <div>
              <Input
                label="Số CCCD (12 chữ số)"
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

            {/* Exam type selector */}
            <div>
              <Typography
                variant="small"
                className="font-medium text-blue-gray-700 mb-2"
              >
                Loại bài thi
              </Typography>
              <Controller
                name="examType"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        value: "READING_LISTENING" as const,
                        label: "Listening & Reading",
                        desc: "45 phút nghe + 75 phút đọc",
                        icon: "🎧",
                        disabled: false,
                      },
                      {
                        value: "SPEAKING_WRITING" as const,
                        label: "Speaking & Writing",
                        desc: "Nói & Viết ",
                        icon: "✏️",
                        disabled: false,
                      },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={opt.disabled}
                        onClick={() =>
                          !opt.disabled && field.onChange(opt.value)
                        }
                        className={`relative flex flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition-all duration-200
                          ${
                            opt.disabled
                              ? "cursor-not-allowed opacity-40 border-gray-200 bg-gray-50"
                              : field.value === opt.value
                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer"
                          }`}
                      >
                        <span className="text-xl">{opt.icon}</span>
                        <span className="text-sm font-semibold text-blue-gray-800">
                          {opt.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {opt.desc}
                        </span>
                        {field.value === opt.value && !opt.disabled && (
                          <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
                            <svg
                              className="h-2.5 w-2.5 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              />
              {errors.examType && (
                <Typography variant="small" color="red" className="mt-1">
                  {errors.examType.message}
                </Typography>
              )}
            </div>
          </div>
        </DialogBody>

        <DialogFooter className="border-t pt-3 gap-2">
          <Button
            variant="text"
            color="gray"
            onClick={handleClose}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-orange-600"
            loading={loading}
          >
            Đăng ký & Bắt đầu thi
          </Button>
        </DialogFooter>
      </form>
    </Dialog>,
    document.body,
  );
};

export default RegistrationDialog;
