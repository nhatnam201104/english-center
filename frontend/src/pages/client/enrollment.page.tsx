import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Typography, Stepper, Step } from "@material-tailwind/react";
import { useEnrollmentStore } from "../../stores/enrollment.store";
import { validateToken } from "../../services/enrollment.service";
import StudentForm from "../../components/client/enrollment/StudentForm";
import ScheduleSelector from "../../components/client/enrollment/schedule/ScheduleSelector";
import CheckoutSummary from "../../components/client/enrollment/checkout/CheckoutSummary";
import { toast } from "react-toastify";

const stepLabels = ["Thông tin học viên", "Chọn lịch học", "Xác nhận & Thanh toán"];

const stepIndex: Record<string, number> = {
  "student-form": 0,
  "schedule-select": 1,
  checkout: 2,
  payment: 2,
};

const EnrollmentFlowPage = () => {
  const [searchParams] = useSearchParams();
  const { step, setToken, setTokenData, setStep } = useEnrollmentStore();
  const validatedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setStep("loading");
      return;
    }

    if (validatedTokenRef.current === tokenParam) return;
    validatedTokenRef.current = tokenParam;

    setToken(tokenParam);

    const validate = async () => {
      try {
        const res = await validateToken(tokenParam);
        if (res.data) {
          setTokenData(res.data);
        } else {
          toast.error("Token không hợp lệ");
        }
      } catch (err: unknown) {
        toast.error(
          (err as { message?: string }).message ||
            "Token không hợp lệ hoặc đã hết hạn",
        );
      }
    };

    validate();
  }, [searchParams, setStep, setToken, setTokenData]);

  const activeStep = stepIndex[step as string] ?? 0;

  if (step === "loading") {
    const hasToken = searchParams.get("token");
    if (!hasToken) {
      return (
        <div className="container mx-auto py-12 px-4 text-center">
          <Typography variant="h4" color="red">
            Không tìm thấy token đăng ký
          </Typography>
          <Typography color="gray" className="mt-2">
            Vui lòng sử dụng link đăng ký từ email kết quả thi đầu vào.
          </Typography>
        </div>
      );
    }
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <Typography>Đang xác thực token...</Typography>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Typography variant="h3" className="text-center mb-8">
        Đăng ký khóa học
      </Typography>

      {/* Stepper */}
      <div className="mb-8">
        <Stepper activeStep={activeStep}>
          {stepLabels.map((label, index) => (
            <Step key={index}>
              {index + 1}
              <div className="absolute -bottom-8 w-max text-center">
                <Typography
                  variant="small"
                  color={activeStep >= index ? "blue" : "gray"}
                >
                  {label}
                </Typography>
              </div>
            </Step>
          ))}
        </Stepper>
      </div>

      {/* Step Content */}
      <div className="mt-16">
        {step === "student-form" && <StudentForm />}
        {step === "schedule-select" && <ScheduleSelector />}
        {(step === "checkout" || step === "payment") && <CheckoutSummary />}
      </div>
    </div>
  );
};

export default EnrollmentFlowPage;
