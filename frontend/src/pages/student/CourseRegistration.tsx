import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Stepper,
  Step,
  Input,
  Switch,
  Checkbox,
  Chip,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import { getStudentMeService } from "../../services/student.service";
import {
  checkParent,
  createPaymentUrl,
  createStudentDraft,
  getStudentAvailableSchedules,
} from "../../services/enrollment.service";
import type { StudentResponse } from "../../types/student/response";
import type { AvailableSchedule } from "../../types/enrollment/response";
import type { ParentFormData } from "../../types/enrollment/request";
import { useStudentRegistrationStore } from "../../stores/student-registration.store";

const stepLabels = [
  "Thông tin học viên",
  "Chọn lịch học",
  "Xác nhận & Thanh toán",
];

const stepIndex: Record<string, number> = {
  "profile-parent": 0,
  "schedule-select": 1,
  checkout: 2,
  payment: 2,
};

const CourseRegistration = () => {
  const {
    step,
    parentData,
    selectedSchedule,
    scheduleFilterMonth,
    scheduleFilterTeacher,
    scheduleFilterAvailableOnly,
    setParentData,
    setSelectedSchedule,
    setDraft,
    setPayment,
    setStep,
    setScheduleFilter,
    resetScheduleFilters,
  } = useStudentRegistrationStore();

  const [student, setStudent] = useState<StudentResponse | null>(null);
  const [loadingStudent, setLoadingStudent] = useState(true);

  const [showParent, setShowParent] = useState(false);
  const [parentSearch, setParentSearch] = useState("");
  const [searchingParent, setSearchingParent] = useState(false);
  const [foundParent, setFoundParent] = useState<{
    parentId: number;
    fullname: string;
    phone: string;
  } | null>(null);

  const [newParentForm, setNewParentForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [schedules, setSchedules] = useState<AvailableSchedule[]>([]);
  const [blockedSkills, setBlockedSkills] = useState<string[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null,
  );

  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await getStudentMeService();
        if (res.data) {
          setStudent(res.data);
        }
      } catch (err) {
        toast.error((err as { message?: string }).message || "Không tải được thông tin học viên");
      } finally {
        setLoadingStudent(false);
      }
    };

    fetchStudent();
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (step !== "schedule-select" && step !== "checkout") return;

      setLoadingSchedules(true);
      try {
        const res = await getStudentAvailableSchedules();
        setSchedules(res.data?.schedules ?? []);
        setBlockedSkills(res.data?.blockedSkills ?? []);
      } catch (err) {
        toast.error((err as { message?: string }).message || "Lỗi tải danh sách lịch học");
      } finally {
        setLoadingSchedules(false);
      }
    };

    fetchSchedules();
  }, [step]);

  const monthOptions = useMemo(() => {
    const seen = new Set<string>();
    schedules.forEach((s) => {
      const d = new Date(s.startTime);
      seen.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    });
    return [...seen].sort();
  }, [schedules]);

  const teacherOptions = useMemo(() => {
    const seen = new Set<string>();
    schedules.forEach((s) => seen.add(s.teacher.fullname));
    return [...seen].sort();
  }, [schedules]);

  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      if (scheduleFilterAvailableOnly && s.available <= 0) return false;
      if (scheduleFilterMonth) {
        const d = new Date(s.startTime);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (key !== scheduleFilterMonth) return false;
      }
      if (scheduleFilterTeacher && s.teacher.fullname !== scheduleFilterTeacher) {
        return false;
      }
      return true;
    });
  }, [
    schedules,
    scheduleFilterAvailableOnly,
    scheduleFilterMonth,
    scheduleFilterTeacher,
  ]);

  const activeStep = stepIndex[step] ?? 0;

  const validateNewParent = () => {
    if (!newParentForm.fullname || newParentForm.fullname.trim().length < 2) {
      toast.error("Họ tên phụ huynh phải từ 2 ký tự");
      return false;
    }
    if (!newParentForm.email.match(/^\S+@\S+\.\S+$/)) {
      toast.error("Email phụ huynh không hợp lệ");
      return false;
    }
    if (!newParentForm.phone.match(/^0[3-9][0-9]{8}$/)) {
      toast.error("Số điện thoại phụ huynh không hợp lệ");
      return false;
    }
    if (newParentForm.password.length < 6) {
      toast.error("Mật khẩu phụ huynh phải có ít nhất 6 ký tự");
      return false;
    }
    if (newParentForm.password !== newParentForm.confirmPassword) {
      toast.error("Mật khẩu phụ huynh xác nhận không khớp");
      return false;
    }
    return true;
  };

  const handleSearchParent = async () => {
    if (!parentSearch.match(/^0[3-9][0-9]{8}$/)) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }

    setSearchingParent(true);
    try {
      const res = await checkParent(parentSearch);
      const data = res.data;
      if (data?.found && data.parentId) {
        setFoundParent({
          parentId: data.parentId,
          fullname: data.fullname || "",
          phone: data.phone || "",
        });
        toast.success("Tìm thấy phụ huynh trong hệ thống");
      } else {
        setFoundParent(null);
        toast.info("Không tìm thấy phụ huynh, vui lòng nhập thông tin mới");
      }
    } catch {
      setFoundParent(null);
    } finally {
      setSearchingParent(false);
    }
  };

  const handleContinueParentStep = () => {
    if (!showParent) {
      setParentData(null);
      return;
    }

    if (foundParent) {
      const payload: ParentFormData = {
        existingParentId: foundParent.parentId,
        fullname: foundParent.fullname,
        phone: foundParent.phone,
      };
      setParentData(payload);
      return;
    }

    if (!validateNewParent()) return;

    setParentData({
      fullname: newParentForm.fullname,
      email: newParentForm.email,
      phone: newParentForm.phone,
      password: newParentForm.password,
    });
  };

  const handleSelectSchedule = () => {
    const selected = schedules.find((s) => s.id === selectedScheduleId);
    if (!selected) {
      toast.error("Vui lòng chọn lịch học");
      return;
    }

    if (blockedSkills.includes(selected.course.courseSkill)) {
      toast.error(
        "Bạn đang có khóa học đang diễn ra, vui lòng học xong mới tiến hành đăng ký",
      );
      return;
    }

    setSelectedSchedule(selected);
  };

  const handlePayment = async () => {
    if (!selectedSchedule) return;

    setPaymentLoading(true);
    try {
      const draftRes = await createStudentDraft({
        scheduleId: selectedSchedule.id,
        parentData: parentData ?? undefined,
      });

      const draftData = draftRes.data;
      if (!draftData) {
        toast.error("Không thể tạo đơn đăng ký");
        return;
      }

      setDraft(draftData.draftId, draftData.expiresAt);

      const paymentRes = await createPaymentUrl({
        draftId: draftData.draftId,
        returnUrl: `${window.location.origin}/student/payment-result`,
      });

      if (!paymentRes.data?.paymentUrl) {
        toast.error("Không tạo được link thanh toán");
        return;
      }

      setPayment(paymentRes.data.txnRef);
      window.location.href = paymentRes.data.paymentUrl;
    } catch (err) {
      toast.error((err as { message?: string }).message || "Có lỗi xảy ra");
    } finally {
      setPaymentLoading(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatPrice = (price: number, sale: number) => {
    const final = Math.round(price * (1 - sale / 100));
    return final.toLocaleString("vi-VN") + "đ";
  };

  const formatMonthLabel = (ym: string) => {
    const [year, month] = ym.split("-");
    return `Tháng ${month}/${year}`;
  };

  if (loadingStudent) {
    return (
      <Card>
        <CardBody>
          <Typography>Đang tải thông tin học viên...</Typography>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h4">Đăng ký khóa học</Typography>
        <Typography color="gray" className="mt-1">
          Đăng ký lịch học mới và thanh toán qua VNPay
        </Typography>
      </div>

      <div className="pt-2">
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

      <div className="pt-8">
        {step === "profile-parent" && (
          <Card>
            <CardBody className="space-y-6">
              <Typography variant="h5">Thông tin học viên</Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <Typography color="gray" variant="small">Họ tên</Typography>
                  <Typography>{student?.fullname}</Typography>
                </div>
                <div>
                  <Typography color="gray" variant="small">Email</Typography>
                  <Typography>{student?.email}</Typography>
                </div>
                <div>
                  <Typography color="gray" variant="small">Số điện thoại</Typography>
                  <Typography>{student?.phone}</Typography>
                </div>
                <div>
                  <Typography color="gray" variant="small">CCCD</Typography>
                  <Typography>{student?.cccd || "Chưa cập nhật"}</Typography>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-3 mb-4">
                  <Switch
                    checked={showParent}
                    onChange={() => {
                      setShowParent(!showParent);
                      setFoundParent(null);
                    }}
                    crossOrigin=""
                  />
                  <Typography variant="h6">Liên kết phụ huynh</Typography>
                </div>

                {showParent && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        label="Tìm phụ huynh theo SĐT"
                        value={parentSearch}
                        onChange={(e) => setParentSearch(e.target.value)}
                        crossOrigin=""
                      />
                      <Button onClick={handleSearchParent} disabled={searchingParent}>
                        {searchingParent ? "Đang tìm..." : "Tìm kiếm"}
                      </Button>
                    </div>

                    {foundParent ? (
                      <div className="p-3 bg-green-50 border border-green-200 rounded">
                        <Typography variant="small" color="green">
                          Phụ huynh: {foundParent.fullname} - {foundParent.phone}
                        </Typography>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Họ tên phụ huynh"
                          value={newParentForm.fullname}
                          onChange={(e) =>
                            setNewParentForm((prev) => ({
                              ...prev,
                              fullname: e.target.value,
                            }))
                          }
                          crossOrigin=""
                        />
                        <Input
                          label="Email phụ huynh"
                          type="email"
                          value={newParentForm.email}
                          onChange={(e) =>
                            setNewParentForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          crossOrigin=""
                        />
                        <Input
                          label="SĐT phụ huynh"
                          value={newParentForm.phone}
                          onChange={(e) =>
                            setNewParentForm((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          crossOrigin=""
                        />
                        <Input
                          label="Mật khẩu phụ huynh"
                          type="password"
                          value={newParentForm.password}
                          onChange={(e) =>
                            setNewParentForm((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }))
                          }
                          crossOrigin=""
                        />
                        <Input
                          label="Xác nhận mật khẩu phụ huynh"
                          type="password"
                          value={newParentForm.confirmPassword}
                          onChange={(e) =>
                            setNewParentForm((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          crossOrigin=""
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={handleContinueParentStep} color="blue">
                  Tiếp tục chọn lịch học
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {step === "schedule-select" && (
          <Card>
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between">
                <Typography variant="h5">Chọn lịch học</Typography>
                <Button variant="text" size="sm" onClick={() => setStep("profile-parent")}>
                  Quay lại
                </Button>
              </div>

              {loadingSchedules ? (
                <Typography>Đang tải lịch học...</Typography>
              ) : (
                <>
                  {blockedSkills.length > 0 && (
                    <div className="p-3 rounded border border-amber-200 bg-amber-50">
                      <Typography color="amber" variant="small">
                        Bạn đang có khóa học đang diễn ra ở kỹ năng: {blockedSkills.join(", ")}. Không thể đăng ký thêm lịch cùng kỹ năng.
                      </Typography>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-4 flex flex-wrap gap-4 items-end">
                    <div className="w-48">
                      <label className="block text-xs text-gray-500 mb-1">Tháng bắt đầu</label>
                      <select
                        value={scheduleFilterMonth}
                        onChange={(e) => {
                          setScheduleFilter({ month: e.target.value || "" });
                          setSelectedScheduleId(null);
                        }}
                        className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="">Tất cả</option>
                        {monthOptions.map((m) => (
                          <option key={m} value={m}>
                            {formatMonthLabel(m)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-48">
                      <label className="block text-xs text-gray-500 mb-1">Giáo viên</label>
                      <select
                        value={scheduleFilterTeacher}
                        onChange={(e) => {
                          setScheduleFilter({ teacher: e.target.value || "" });
                          setSelectedScheduleId(null);
                        }}
                        className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="">Tất cả</option>
                        {teacherOptions.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center">
                      <Checkbox
                        id="student-available-only"
                        checked={scheduleFilterAvailableOnly}
                        onChange={(e) => {
                          setScheduleFilter({ availableOnly: e.target.checked });
                          setSelectedScheduleId(null);
                        }}
                        label="Chỉ hiển thị còn chỗ"
                        crossOrigin={undefined}
                      />
                    </div>

                    {(scheduleFilterMonth || scheduleFilterTeacher || scheduleFilterAvailableOnly) && (
                      <Button
                        variant="text"
                        size="sm"
                        color="gray"
                        onClick={() => {
                          resetScheduleFilters();
                          setSelectedScheduleId(null);
                        }}
                      >
                        Xóa bộ lọc
                      </Button>
                    )}
                  </div>

                  {filteredSchedules.length === 0 ? (
                    <Typography color="gray">Không có lịch học nào phù hợp.</Typography>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredSchedules.map((s) => {
                        const blockedBySkill = blockedSkills.includes(s.course.courseSkill);
                        const canSelect = s.available > 0 && !blockedBySkill;

                        return (
                          <div
                            key={s.id}
                            onClick={() => canSelect && setSelectedScheduleId(s.id)}
                            className={`border rounded-lg p-4 transition-all ${
                              selectedScheduleId === s.id
                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                : canSelect
                                  ? "border-gray-300 hover:border-blue-300 cursor-pointer"
                                  : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                            }`}
                          >
                            <Typography variant="h6" color="blue-gray">
                              {s.course.name}
                            </Typography>
                            <div className="mt-2 space-y-1">
                              <Typography variant="small" color="gray">
                                Kỹ năng: {s.course.courseSkill}
                              </Typography>
                              <Typography variant="small" color="gray">
                                Giáo viên: {s.teacher.fullname}
                              </Typography>
                              <Typography variant="small" color="gray">
                                Phòng: {s.classroom.name}
                              </Typography>
                              <Typography variant="small" color="gray">
                                Thời gian: {formatDate(s.startTime)} - {formatDate(s.endTime)}
                              </Typography>
                              <Typography variant="small" color="gray">
                                Số buổi: {s.course.totalSession}
                              </Typography>
                              <div className="flex items-center gap-2 mt-2">
                                <Typography variant="small" className="font-bold">
                                  Giá: {formatPrice(s.course.price, s.course.sale)}
                                </Typography>
                                {s.course.sale > 0 && (
                                  <Chip value={`-${s.course.sale}%`} size="sm" color="red" />
                                )}
                              </div>
                              <Chip
                                value={
                                  blockedBySkill
                                    ? "Đang học kỹ năng này"
                                    : s.available > 0
                                      ? `Còn ${s.available} chỗ`
                                      : "Hết chỗ"
                                }
                                size="sm"
                                color={blockedBySkill ? "amber" : s.available > 0 ? "green" : "red"}
                                className="mt-1 w-fit"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button color="blue" disabled={!selectedScheduleId} onClick={handleSelectSchedule}>
                      Xác nhận lịch học
                    </Button>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        )}

        {step === "checkout" && selectedSchedule && (
          <Card>
            <CardBody className="space-y-6">
              <div className="flex items-center justify-between">
                <Typography variant="h5">Xác nhận đăng ký</Typography>
                <Button variant="text" size="sm" onClick={() => setStep("schedule-select")}>
                  Quay lại
                </Button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <Typography variant="h6" className="mb-2">Thông tin học viên</Typography>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Typography variant="small" color="gray">Họ tên:</Typography>
                  <Typography variant="small">{student?.fullname}</Typography>
                  <Typography variant="small" color="gray">Email:</Typography>
                  <Typography variant="small">{student?.email}</Typography>
                  <Typography variant="small" color="gray">SĐT:</Typography>
                  <Typography variant="small">{student?.phone}</Typography>
                  <Typography variant="small" color="gray">CCCD:</Typography>
                  <Typography variant="small">{student?.cccd || "Chưa cập nhật"}</Typography>
                </div>
              </div>

              {parentData && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <Typography variant="h6" className="mb-2">Thông tin phụ huynh</Typography>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Typography variant="small" color="gray">Họ tên:</Typography>
                    <Typography variant="small">{parentData.fullname || "-"}</Typography>
                    <Typography variant="small" color="gray">SĐT:</Typography>
                    <Typography variant="small">{parentData.phone || "-"}</Typography>
                    {"existingParentId" in parentData && parentData.existingParentId && (
                      <>
                        <Typography variant="small" color="gray">Trạng thái:</Typography>
                        <Typography variant="small" color="green">Đã có trong hệ thống</Typography>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 rounded-lg p-4">
                <Typography variant="h6" className="mb-2">Thông tin lịch học</Typography>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Typography variant="small" color="gray">Khóa học:</Typography>
                  <Typography variant="small">{selectedSchedule.course.name}</Typography>
                  <Typography variant="small" color="gray">Kỹ năng:</Typography>
                  <Typography variant="small">{selectedSchedule.course.courseSkill}</Typography>
                  <Typography variant="small" color="gray">Giáo viên:</Typography>
                  <Typography variant="small">{selectedSchedule.teacher.fullname}</Typography>
                  <Typography variant="small" color="gray">Phòng học:</Typography>
                  <Typography variant="small">{selectedSchedule.classroom.name}</Typography>
                  <Typography variant="small" color="gray">Thời gian:</Typography>
                  <Typography variant="small">
                    {formatDate(selectedSchedule.startTime)} - {formatDate(selectedSchedule.endTime)}
                  </Typography>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <Typography variant="h6">Tổng thanh toán:</Typography>
                  <Typography variant="h5" color="blue">
                    {formatPrice(selectedSchedule.course.price, selectedSchedule.course.sale)}
                  </Typography>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  color="blue"
                  size="lg"
                  disabled={paymentLoading}
                  onClick={handlePayment}
                >
                  {paymentLoading ? "Đang xử lý..." : "Thanh toán qua VNPay"}
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CourseRegistration;
