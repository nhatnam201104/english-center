import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Spinner,
} from "@material-tailwind/react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import {
  getPaymentReturn,
  getEnrollmentStatus,
} from "../../services/enrollment.service";
import type { EnrollmentStatusResponse } from "../../types/enrollment/response";

const StudentPaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<
    "loading" | "success" | "failed" | "processing"
  >("loading");
  const [enrollmentInfo, setEnrollmentInfo] =
    useState<EnrollmentStatusResponse | null>(null);

  const pollStatus = useCallback(async (txnRef: string) => {
    const maxAttempts = 6;
    const intervalMs = 2000;

    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      try {
        const res = await getEnrollmentStatus(txnRef);
        const data = res.data;

        if (data) {
          setEnrollmentInfo(data);

          if (data.status === "SUCCESS") {
            setStatus("success");
            return;
          }

          if (data.status === "FAILED" || data.status === "CANCELLED") {
            setStatus("failed");
            return;
          }
        }

        setStatus("processing");
      } catch {
        // ignore and retry
      }

      await new Promise<void>((resolve) => setTimeout(resolve, intervalMs));
    }

    setStatus("processing");
  }, []);

  useEffect(() => {
    const processReturn = async () => {
      const queryString = searchParams.toString();
      if (!queryString) {
        setStatus("failed");
        return;
      }

      try {
        const returnRes = await getPaymentReturn(queryString);
        const returnData = returnRes.data;
        const txnRef = returnData?.txnRef ?? searchParams.get("vnp_TxnRef");

        if (!txnRef) {
          setStatus("failed");
          return;
        }

        const responseCode =
          returnData?.responseCode ?? searchParams.get("vnp_ResponseCode");
        if (responseCode && responseCode !== "00") {
          setStatus("failed");
          return;
        }

        await pollStatus(txnRef);
      } catch {
        setStatus("failed");
      }
    };

    processReturn();
  }, [searchParams, pollStatus]);

  return (
    <div className="max-w-lg">
      <Card>
        <CardBody className="text-center space-y-6 py-12">
          {status === "loading" && (
            <>
              <Spinner className="h-12 w-12 mx-auto" />
              <Typography variant="h5">Đang xác thực thanh toán...</Typography>
            </>
          )}

          {status === "processing" && (
            <>
              <ClockIcon className="h-16 w-16 mx-auto text-amber-500" />
              <Typography variant="h5" color="amber">
                Đang xử lý thanh toán
              </Typography>
              <Typography color="gray">
                Thanh toán đang được xử lý. Vui lòng chờ trong giây lát...
              </Typography>
              <Spinner className="h-8 w-8 mx-auto" />
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircleIcon className="h-16 w-16 mx-auto text-green-500" />
              <Typography variant="h4" color="green">
                Thanh toán thành công!
              </Typography>
              <Typography color="gray">
                Bạn đã đăng ký khóa học thành công.
              </Typography>

              {enrollmentInfo && (
                <div className="bg-green-50 rounded-lg p-4 text-left space-y-2">
                  {enrollmentInfo.courseName && (
                    <div className="flex justify-between">
                      <Typography variant="small" color="gray">
                        Khóa học:
                      </Typography>
                      <Typography variant="small">
                        {enrollmentInfo.courseName}
                      </Typography>
                    </div>
                  )}
                  {enrollmentInfo.scheduleInfo && (
                    <div className="flex justify-between">
                      <Typography variant="small" color="gray">
                        Lịch học:
                      </Typography>
                      <Typography variant="small">
                        {enrollmentInfo.scheduleInfo}
                      </Typography>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <Typography variant="small" color="gray">
                      Mã giao dịch:
                    </Typography>
                    <Typography variant="small">{enrollmentInfo.txnRef}</Typography>
                  </div>
                </div>
              )}

              <Button color="blue" onClick={() => navigate("/student/courses")}>
                Xem khóa học của tôi
              </Button>
            </>
          )}

          {status === "failed" && (
            <>
              <XCircleIcon className="h-16 w-16 mx-auto text-red-500" />
              <Typography variant="h4" color="red">
                Thanh toán thất bại
              </Typography>
              <Typography color="gray">
                Giao dịch không thành công. Vui lòng thử lại.
              </Typography>

              <Button
                color="blue"
                onClick={() => navigate("/student/course-registration")}
              >
                Quay lại đăng ký
              </Button>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default StudentPaymentResult;
