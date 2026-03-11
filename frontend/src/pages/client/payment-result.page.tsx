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

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<
    "loading" | "success" | "failed" | "processing"
  >("loading");
  const [enrollmentInfo, setEnrollmentInfo] =
    useState<EnrollmentStatusResponse | null>(null);

  const pollStatus = useCallback(
    async (txnRef: string) => {
      const maxAttempts = 5;
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
          // continue retrying
        }

        // Wait before next attempt
        await new Promise<void>((resolve) =>
          setTimeout(resolve, intervalMs),
        );
      }

      // Exhausted retries — leave as processing for manual refresh
      setStatus("processing");
    },
    [],
  );

  useEffect(() => {
    const processReturn = async () => {
      const queryString = searchParams.toString();
      if (!queryString) {
        setStatus("failed");
        return;
      }

      try {
        // 1. Call return handler (also finalizes payment server-side)
        const returnRes = await getPaymentReturn(queryString);
        const returnData = returnRes.data;

        // Extract txnRef from query params directly as a fallback
        const txnRef = returnData?.txnRef ?? searchParams.get("vnp_TxnRef");

        if (!txnRef) {
          setStatus("failed");
          return;
        }

        // 2. If signature or payment is invalid, still try to read DB status
        //    (handles bank cancel, user cancel, etc.)
        const responseCode = returnData?.responseCode ?? searchParams.get("vnp_ResponseCode");
        if (responseCode && responseCode !== "00") {
          // User cancelled or bank declined — DB was updated by return handler
          setStatus("failed");
          return;
        }

        // 3. Poll enrollment status (DB was already finalized by return handler)
        await pollStatus(txnRef);
      } catch {
        setStatus("failed");
      }
    };

    processReturn();
  }, [searchParams, pollStatus]);

  return (
    <div className="container mx-auto py-12 px-4 max-w-lg">
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
                  {enrollmentInfo.studentName && (
                    <div className="flex justify-between">
                      <Typography variant="small" color="gray">
                        Học viên:
                      </Typography>
                      <Typography variant="small">
                        {enrollmentInfo.studentName}
                      </Typography>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <Typography variant="small" color="gray">
                      Mã giao dịch:
                    </Typography>
                    <Typography variant="small">
                      {enrollmentInfo.txnRef}
                    </Typography>
                  </div>
                </div>
              )}

              <Typography variant="small" color="gray">
                Thông tin tài khoản đã được gửi qua email. Bạn có thể đăng nhập
                vào hệ thống.
              </Typography>

              <Button color="blue" onClick={() => navigate("/")}>
                Về trang chủ
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
                Giao dịch không thành công. Vui lòng thử lại hoặc liên hệ hỗ
                trợ.
              </Typography>

              {enrollmentInfo && (
                <div className="bg-red-50 rounded-lg p-4 text-left">
                  <Typography variant="small" color="gray">
                    Mã giao dịch: {enrollmentInfo.txnRef}
                  </Typography>
                </div>
              )}

              <Button color="blue" onClick={() => navigate("/")}>
                Về trang chủ
              </Button>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default PaymentResultPage;
