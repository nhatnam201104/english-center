import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Spinner,
  Button,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  UserGroupIcon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import axiosInstance from "../../../configs/axios.config";

interface Course {
  id: number;
  name: string;
}

interface Student {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  cccd: string | null;
  createdAt: string;
  courses?: Course[];
}

interface StudentDetail {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  cccd: string | null;
  age: number | null;
  dob: string | null;
  courses: Course[];
  createdAt: string;
}

interface PaginationData {
  data: Student[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const AdmissionStudentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");

  const studentsRequestRef = useRef(0);
  const detailRequestRef = useRef(0);

  const fetchStudents = async (
    page = 1,
    overrides?: {
      search?: string;
      courseId?: string;
      startDate?: string;
      endDate?: string;
    }
  ) => {
    const requestId = ++studentsRequestRef.current;
    setLoading(true);

    try {
      const params: Record<string, string | number> = { page, limit: 10 };
      const effectiveSearch = overrides?.search ?? appliedSearchTerm;
      const effectiveCourseId = overrides?.courseId ?? selectedCourse;
      const effectiveStartDate = overrides?.startDate ?? startDate;
      const effectiveEndDate = overrides?.endDate ?? endDate;

      if (effectiveSearch.trim()) params.search = effectiveSearch.trim();
      if (effectiveCourseId) params.courseId = effectiveCourseId;
      if (effectiveStartDate) params.startDate = effectiveStartDate;
      if (effectiveEndDate) params.endDate = effectiveEndDate;

      const response = await axiosInstance.get<{ success: boolean; data: PaginationData }>(
        "/statistics/admission-students",
        { params }
      );

      if (requestId !== studentsRequestRef.current) return;

      setStudents(response.data.data.data);
      setPagination(response.data.data);
    } catch (error) {
      if (requestId !== studentsRequestRef.current) return;

      console.error("Error fetching students:", error);
      setStudents([]);
      setPagination(null);
    } finally {
      if (requestId !== studentsRequestRef.current) return;
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get<{ success: boolean; data: Course[] }>(
        "/statistics/courses"
      );
      setCourses(response.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchStudentDetail = async (id: number) => {
    const requestId = ++detailRequestRef.current;
    setIsLoadingDetail(true);
    setDetailError("");

    try {
      const response = await axiosInstance.get<{ success: boolean; data: StudentDetail }>(
        `/statistics/admission-students/${id}`
      );

      if (requestId !== detailRequestRef.current) return;
      setSelectedStudent(response.data.data);
    } catch (error) {
      if (requestId !== detailRequestRef.current) return;

      console.error("Error fetching student detail:", error);
      setSelectedStudent(null);
      setDetailError("Khong tim thay thong tin hoc sinh hoac du lieu da bi thay doi.");
    } finally {
      if (requestId !== detailRequestRef.current) return;
      setIsLoadingDetail(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage, appliedSearchTerm, selectedCourse, startDate, endDate]);

  const handleSearch = () => {
    const normalizedSearch = searchTerm.trim();
    setAppliedSearchTerm(normalizedSearch);

    if (currentPage !== 1) {
      setCurrentPage(1);
      return;
    }

    fetchStudents(1, { search: normalizedSearch });
  };

  const handleViewDetail = (student: Student) => {
    setSelectedStudent({
      id: student.id,
      fullname: student.fullname,
      email: student.email,
      phone: student.phone,
      cccd: student.cccd,
      age: null,
      dob: null,
      courses: student.courses || [],
      createdAt: student.createdAt,
    });
    setDetailError("");
    setIsModalOpen(true);
    fetchStudentDetail(student.id);
  };

  const handleCloseModal = () => {
    detailRequestRef.current += 1;
    setIsModalOpen(false);
    setSelectedStudent(null);
    setDetailError("");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const hasActiveFilters = Boolean(
    appliedSearchTerm.trim() || selectedCourse || startDate || endDate
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Quản lý học sinh</h1>
        <p className="mt-1 text-blue-100">Danh sách học sinh đã đăng ký tuyển sinh</p>
      </div>

      <Card className="shadow-sm">
        <CardBody>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div className="w-full">
              <div className="relative">
                <Input
                  label="Tìm kiếm (tên, email, SDT, CCCD)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 transition-colors hover:text-blue-800"
                  aria-label="Tìm kiếm"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="w-full">
              <div className="relative">
                <label
                  htmlFor="admission-course-filter"
                  className="pointer-events-none absolute left-3 -top-2.5 z-10 bg-white px-1 text-xs text-blue-gray-400"
                >
                  Khóa học
                </label>
                <select
                  id="admission-course-filter"
                  value={selectedCourse}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-[0.65rem] pr-10 text-sm text-blue-gray-700 outline-none transition-all focus:border-2 focus:border-gray-900"
                >
                  <option value="">Tất cả khóa học</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id.toString()}>
                      {course.name}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-gray-400" />
              </div>
            </div>

            <div className="w-full">
              <Input
                label="Từ ngày"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="w-full">
              <Input
                label="Đến y"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="flex w-full items-end">
              <Button
                variant="outlined"
                className="w-full border-blue-600 text-blue-600"
                onClick={() => {
                  setSearchTerm("");
                  setAppliedSearchTerm("");
                  setSelectedCourse("");
                  setStartDate("");
                  setEndDate("");
                  setCurrentPage(1);
                  fetchStudents(1, {
                    search: "",
                    courseId: "",
                    startDate: "",
                    endDate: "",
                  });
                }}
              >
                Xóa lọc
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardBody className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-100 p-3">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng học sinh</p>
              <p className="text-2xl font-bold text-gray-800">{pagination?.total || 0}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <Typography variant="h6" color="blue-gray">
            Danh sách học sinh
          </Typography>
        </div>
        <CardBody className="overflow-x-auto p-0">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner className="h-12 w-12 text-blue-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">STT</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Họ tên</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">SDT</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">CCCD</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Ngày đăng ký</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.length > 0 ? (
                    students.map((student, index) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">{(currentPage - 1) * 10 + index + 1}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{student.fullname}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{student.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{student.phone || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{student.cccd || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(student.createdAt)}</td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleViewDetail(student)}
                            title="Xem chi tiết học sinh"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        {hasActiveFilters
                          ? "Không tìm thấy học sinh phù hợp"
                          : "Chưa có dữ liệu học sinh"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 border-t border-gray-200 p-4">
              <Button
                variant="outlined"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="text-blue-600"
              >
                Truoc
              </Button>
              <span className="px-4 text-gray-600">
                Trang {currentPage} / {pagination.totalPages}
              </span>
              <Button
                variant="outlined"
                size="sm"
                disabled={currentPage === pagination.totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="text-blue-600"
              >
                Sau
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      <Dialog open={isModalOpen} handler={handleCloseModal} size="lg">
        <DialogHeader className="flex items-center justify-between">
          <Typography variant="h6" color="blue-gray">
            Chi tiết học sinh
          </Typography>
          <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </DialogHeader>
        <DialogBody divider>
          {isLoadingDetail ? (
            <div className="flex h-32 items-center justify-center">
              <Spinner className="h-8 w-8 text-blue-600" />
            </div>
          ) : selectedStudent ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Họ tên</p>
                  <p className="font-medium text-gray-800">{selectedStudent.fullname}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{selectedStudent.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="font-medium text-gray-800">{selectedStudent.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">CCCD</p>
                  <p className="font-medium text-gray-800">{selectedStudent.cccd || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày đăng ký</p>
                  <p className="font-medium text-gray-800">{formatDate(selectedStudent.createdAt)}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm text-gray-500">Khóa học đã đăng ký</p>
                {selectedStudent.courses && selectedStudent.courses.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.courses.map((course) => (
                      <span
                        key={course.id}
                        className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                      >
                        {course.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="italic text-gray-400">Chưa đăng ký khóa học nào</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              {detailError || "Khong tim thay thong tin hoc sinh"}
            </p>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleCloseModal}>
            Đóng
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default AdmissionStudentsPage;
