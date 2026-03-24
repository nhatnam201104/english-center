import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
  Switch,
} from "@material-tailwind/react";
import {
  candidateFormSchema,
  parentFormSchema,
  type CandidateFormValues,
  type ParentFormValues,
} from "../../../libs/validation/enrollment.schema";
import { useEnrollmentStore } from "../../../stores/enrollment.store";
import { checkParent } from "../../../services/enrollment.service";
import type { ParentFormData } from "../../../types/enrollment/request";
import { toast } from "react-toastify";

const StudentForm = () => {
  const { tokenData, setCandidateData, setParentData } =
    useEnrollmentStore();
  const [showParent, setShowParent] = useState(false);
  const [parentSearch, setParentSearch] = useState("");
  const [foundParent, setFoundParent] = useState<{
    parentId: number;
    fullname: string;
    phone: string;
  } | null>(null);
  const [searchingParent, setSearchingParent] = useState(false);

  const candidateForm = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateFormSchema) as never,
    defaultValues: {
      fullname: tokenData?.fullname ?? "",
      email: tokenData?.email ?? "",
      phone: tokenData?.phone ?? "",
      cccd: tokenData?.cccd ?? "",
      dob: "",
      password: "",
      confirmPassword: "",
    },
  });

  const parentForm = useForm<ParentFormValues>({
    resolver: zodResolver(parentFormSchema) as never,
  });

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
          fullname: data.fullname!,
          phone: data.phone!,
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

  const onSubmit = async (candidateValues: CandidateFormValues) => {
    const candidateData: Parameters<typeof setCandidateData>[0] = {
      fullname: candidateValues.fullname,
      email: candidateValues.email,
      phone: candidateValues.phone,
      cccd: candidateValues.cccd,
      dob: candidateValues.dob,
      password: candidateValues.password,
    };

    if (showParent) {
      if (foundParent) {
        setParentData({
          existingParentId: foundParent.parentId,
          fullname: foundParent.fullname,
          phone: foundParent.phone,
        });
      } else {
        const isValid = await parentForm.trigger();
        if (!isValid) return;
        const parentValues = parentForm.getValues();
        const parentData: ParentFormData = {
          fullname: parentValues.fullname,
          email: parentValues.email,
          phone: parentValues.phone,
          password: parentValues.password,
        };
        setParentData(parentData);
      }
    } else {
      setParentData(null);
    }

    setCandidateData(candidateData);
  };

  return (
    <Card>
      <CardBody className="space-y-6">
        <Typography variant="h5">Thông tin học viên</Typography>

        <form
          onSubmit={candidateForm.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Họ và tên"
                {...candidateForm.register("fullname")}
                error={!!candidateForm.formState.errors.fullname}
                crossOrigin=""
              />
              {candidateForm.formState.errors.fullname && (
                <Typography color="red" variant="small">
                  {candidateForm.formState.errors.fullname.message}
                </Typography>
              )}
            </div>

            <div>
              <Input
                label="Email"
                type="email"
                {...candidateForm.register("email")}
                error={!!candidateForm.formState.errors.email}
                crossOrigin=""
              />
              {candidateForm.formState.errors.email && (
                <Typography color="red" variant="small">
                  {candidateForm.formState.errors.email.message}
                </Typography>
              )}
            </div>

            <div>
              <Input
                label="Số điện thoại"
                {...candidateForm.register("phone")}
                error={!!candidateForm.formState.errors.phone}
                crossOrigin=""
              />
              {candidateForm.formState.errors.phone && (
                <Typography color="red" variant="small">
                  {candidateForm.formState.errors.phone.message}
                </Typography>
              )}
            </div>

            <div>
              <Input
                label="CCCD"
                {...candidateForm.register("cccd")}
                error={!!candidateForm.formState.errors.cccd}
                crossOrigin=""
              />
              {candidateForm.formState.errors.cccd && (
                <Typography color="red" variant="small">
                  {candidateForm.formState.errors.cccd.message}
                </Typography>
              )}
            </div>

            <div>
              <Input
                label="Ngày sinh"
                type="date"
                {...candidateForm.register("dob")}
                error={!!candidateForm.formState.errors.dob}
                crossOrigin=""
                min={(() => {
                  const currentYear = new Date().getFullYear();
                  const minYear = currentYear - 100;
                  return `${minYear}-01-01`;
                })()}
                max={(() => {
                  const currentYear = new Date().getFullYear();
                  const maxYear = currentYear - 13;
                  return `${maxYear}-12-31`;
                })()}
              />
              {candidateForm.formState.errors.dob && (
                <Typography color="red" variant="small">
                  {candidateForm.formState.errors.dob.message}
                </Typography>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Mật khẩu"
                type="password"
                {...candidateForm.register("password")}
                error={!!candidateForm.formState.errors.password}
                crossOrigin=""
              />
              {candidateForm.formState.errors.password && (
                <Typography color="red" variant="small">
                  {candidateForm.formState.errors.password.message}
                </Typography>
              )}
            </div>

            <div>
              <Input
                label="Xác nhận mật khẩu"
                type="password"
                {...candidateForm.register("confirmPassword")}
                error={!!candidateForm.formState.errors.confirmPassword}
                crossOrigin=""
              />
              {candidateForm.formState.errors.confirmPassword && (
                <Typography color="red" variant="small">
                  {candidateForm.formState.errors.confirmPassword.message}
                </Typography>
              )}
            </div>
          </div>

          {/* Parent Section */}
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
                {/* Search existing parent */}
                <div className="flex gap-2">
                  <Input
                    label="Tìm phụ huynh theo SĐT"
                    value={parentSearch}
                    onChange={(e) => setParentSearch(e.target.value)}
                    crossOrigin=""
                  />
                  <Button
                    onClick={handleSearchParent}
                    disabled={searchingParent}
                    size="sm"
                  >
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
                    <div>
                      <Input
                        label="Họ tên phụ huynh"
                        {...parentForm.register("fullname")}
                        error={!!parentForm.formState.errors.fullname}
                        crossOrigin=""
                      />
                      {parentForm.formState.errors.fullname && (
                        <Typography color="red" variant="small">
                          {parentForm.formState.errors.fullname.message}
                        </Typography>
                      )}
                    </div>
                    <div>
                      <Input
                        label="Email phụ huynh"
                        type="email"
                        {...parentForm.register("email")}
                        error={!!parentForm.formState.errors.email}
                        crossOrigin=""
                      />
                      {parentForm.formState.errors.email && (
                        <Typography color="red" variant="small">
                          {parentForm.formState.errors.email.message}
                        </Typography>
                      )}
                    </div>
                    <div>
                      <Input
                        label="SĐT phụ huynh"
                        {...parentForm.register("phone")}
                        error={!!parentForm.formState.errors.phone}
                        crossOrigin=""
                      />
                      {parentForm.formState.errors.phone && (
                        <Typography color="red" variant="small">
                          {parentForm.formState.errors.phone.message}
                        </Typography>
                      )}
                    </div>
                    <div>
                      <Input
                        label="Mật khẩu phụ huynh"
                        type="password"
                        {...parentForm.register("password")}
                        error={!!parentForm.formState.errors.password}
                        crossOrigin=""
                      />
                      {parentForm.formState.errors.password && (
                        <Typography color="red" variant="small">
                          {parentForm.formState.errors.password.message}
                        </Typography>
                      )}
                    </div>
                    <div>
                      <Input
                        label="Xác nhận mật khẩu phụ huynh"
                        type="password"
                        {...parentForm.register("confirmPassword")}
                        error={!!parentForm.formState.errors.confirmPassword}
                        crossOrigin=""
                      />
                      {parentForm.formState.errors.confirmPassword && (
                        <Typography color="red" variant="small">
                          {parentForm.formState.errors.confirmPassword.message}
                        </Typography>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" color="blue">
              Tiếp tục chọn lịch học
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default StudentForm;
