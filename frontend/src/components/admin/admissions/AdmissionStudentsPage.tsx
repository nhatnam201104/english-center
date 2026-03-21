import { useState, useEffect } from "react";
import { Card, CardBody, Input, Spinner, Button, Typography } from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import axiosInstance from "../../../configs/axios.config";

interface Student {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  cccd: string | null;
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
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchStudents = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<{ success: boolean; data: PaginationData }>(
        "/statistics/admission-students",
        { params: { page, limit: 10, search: searchTerm } }
      );
      setStudents(response.data.data.data);
      setPagination(response.data.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchStudents(1);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Quản lý học sinh</h1>
        <p className="text-blue-100 mt-1">Danh sách học sinh đã đăng ký tuyển sinh</p>
      </div>

      {/* Search */}
      <Card className="shadow-sm">
        <CardBody className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              label="Tìm kiếm (tên, email, SĐT, CCCD)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              crossOrigin={undefined}
            />
          </div>
          <Button onClick={handleSearch} className="bg-blue-600">
            Tìm kiếm
          </Button>
        </CardBody>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardBody className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Tổng học sinh</p>
              <p className="text-2xl font-bold text-gray-800">
                {pagination?.total || 0}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Table */}
      <Card className="shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <Typography variant="h6" color="blue-gray">
            Danh sách học sinh
          </Typography>
        </div>
        <CardBody className="overflow-x-auto p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
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
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">SĐT</th>
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
                            onClick={() => console.log("View", student.id)}
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        Chưa có dữ liệu học sinh
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 p-4 border-t border-gray-200">
              <Button
                variant="outlined"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="text-blue-600"
              >
                Trước
              </Button>
              <span className="text-gray-600 px-4">
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
    </div>
  );
};

export default AdmissionStudentsPage;
