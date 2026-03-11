import { useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useEnrollmentStore } from "../../../../stores/enrollment.store";
import {
  createDraft,
  createPaymentUrl,
} from "../../../../services/enrollment.service";
import { toast } from "react-toastify";

const CheckoutSummary = () => {
  const {
    token,
    candidateData,
    parentData,
    selectedSchedule,
    setDraft,
    setPayment,
    setStep,
  } = useEnrollmentStore();
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number, sale: number) => {
    const final = Math.round(price * (1 - sale / 100));
    return final.toLocaleString("vi-VN") + "đ";
  };

  const handlePayment = async () => {
    if (!token || !candidateData || !selectedSchedule) return;

    setLoading(true);
    try {
      // 1. Create draft
      const draftRes = await createDraft({
        token,
        candidateData,
        parentData: parentData ?? undefined,
        scheduleId: selectedSchedule.id,
      });

      const draftData = draftRes.data;
      if (!draftData) {
        toast.error("Lỗi tạo đơn đăng ký");
        return;
      }
      setDraft(draftData.draftId, draftData.expiresAt);

      // 2. Create payment URL
      const paymentRes = await createPaymentUrl({
        draftId: draftData.draftId,
      });

      const paymentData = paymentRes.data;
      if (!paymentData) {
        toast.error("Lỗi tạo link thanh toán");
        return;
      }

      setPayment(paymentData.txnRef);

      // 3. Redirect to VNPay
      window.location.href = paymentData.paymentUrl;
    } catch (err: unknown) {
      toast.error((err as { message?: string }).message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedSchedule || !candidateData) return null;

  const course = selectedSchedule.course;

  return (
    <Card>
      <CardBody className="space-y-6">
        <div className="flex items-center justify-between">
          <Typography variant="h5">Xác nhận đăng ký</Typography>
          <Button
            variant="text"
            size="sm"
            onClick={() => setStep("schedule-select")}
          >
            Quay lại
          </Button>
        </div>

        {/* Student Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <Typography variant="h6" className="mb-2">
            Thông tin học viên
          </Typography>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Typography variant="small" color="gray">Họ tên:</Typography>
            <Typography variant="small">{candidateData.fullname}</Typography>
            <Typography variant="small" color="gray">Email:</Typography>
            <Typography variant="small">{candidateData.email}</Typography>
            <Typography variant="small" color="gray">SĐT:</Typography>
            <Typography variant="small">{candidateData.phone}</Typography>
            <Typography variant="small" color="gray">CCCD:</Typography>
            <Typography variant="small">{candidateData.cccd}</Typography>
          </div>
        </div>

        {/* Parent Info */}
        {parentData && (
          <div className="bg-gray-50 rounded-lg p-4">
            <Typography variant="h6" className="mb-2">
              Thông tin phụ huynh
            </Typography>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Typography variant="small" color="gray">Họ tên:</Typography>
              <Typography variant="small">{parentData.fullname}</Typography>
              <Typography variant="small" color="gray">SĐT:</Typography>
              <Typography variant="small">{parentData.phone}</Typography>
              {parentData.existingParentId && (
                <>
                  <Typography variant="small" color="gray">Trạng thái:</Typography>
                  <Typography variant="small" color="green">
                    Đã có trong hệ thống
                  </Typography>
                </>
              )}
            </div>
          </div>
        )}

        {/* Course Info */}
        <div className="bg-blue-50 rounded-lg p-4">
          <Typography variant="h6" className="mb-2">
            Thông tin khóa học
          </Typography>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Typography variant="small" color="gray">Khóa học:</Typography>
            <Typography variant="small">{course.name}</Typography>
            <Typography variant="small" color="gray">Giáo viên:</Typography>
            <Typography variant="small">
              {selectedSchedule.teacher.fullname}
            </Typography>
            <Typography variant="small" color="gray">Phòng học:</Typography>
            <Typography variant="small">
              {selectedSchedule.classroom.name}
            </Typography>
            <Typography variant="small" color="gray">Thời gian:</Typography>
            <Typography variant="small">
              {new Date(selectedSchedule.startTime).toLocaleDateString("vi-VN")}{" "}
              - {new Date(selectedSchedule.endTime).toLocaleDateString("vi-VN")}
            </Typography>
            <Typography variant="small" color="gray">Số buổi:</Typography>
            <Typography variant="small">{course.totalSession}</Typography>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <Typography variant="h6">Tổng thanh toán:</Typography>
            <Typography variant="h5" color="blue">
              {formatPrice(course.price, course.sale)}
            </Typography>
          </div>
          {course.sale > 0 && (
            <Typography variant="small" color="gray" className="text-right">
              Giá gốc:{" "}
              <span className="line-through">
                {course.price.toLocaleString("vi-VN")}đ
              </span>{" "}
              (Giảm {course.sale}%)
            </Typography>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handlePayment}
            color="blue"
            size="lg"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Thanh toán qua VNPay"}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default CheckoutSummary;
