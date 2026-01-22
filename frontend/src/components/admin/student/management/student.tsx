import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import type { StudentResponse } from "../../../../types/student/response";
import type { GetStudentRequest } from "../../../../types/student/request";
import {
  getAllStudentsService,
  deleteStudentService,
} from "../../../../services/student.service";
import StudentFilter from "./student.filter";
import StudentTable from "./student.table";
import StudentPagination from "./student.pagination";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const StudentManagement = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [search, setSearch] = useState("");
  const [minScoreRl, setMinScoreRl] = useState("");
  const [maxScoreRl, setMaxScoreRl] = useState("");
  const [minScoreSw, setMinScoreSw] = useState("");
  const [maxScoreSw, setMaxScoreSw] = useState("");

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params: GetStudentRequest = {
        page: currentPage,
        limit: 10,
      };
      if (search) params.search = search;
      if (minScoreRl) params.minScoreRl = Number(minScoreRl);
      if (maxScoreRl) params.maxScoreRl = Number(maxScoreRl);
      if (minScoreSw) params.minScoreSw = Number(minScoreSw);
      if (maxScoreSw) params.maxScoreSw = Number(maxScoreSw);

      const response = await getAllStudentsService(params);
      if (response.success && response.data) {
        setStudents(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
      }
    } catch (error: unknown) {
      console.error("Lỗi khi tải danh sách học sinh:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, minScoreRl, maxScoreRl, minScoreSw, maxScoreSw]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa học sinh này?")) {
      try {
        const response = await deleteStudentService(id);
        if (response.success) {
          alert("Xóa học sinh thành công!");
          loadStudents();
        }
      } catch (error: unknown) {
        const apiError = error as ApiError;
        alert(apiError.response?.data?.message || "Xóa học sinh thất bại!");
      }
    }
  };

  const clearFilters = () => {
    setSearch("");
    setMinScoreRl("");
    setMaxScoreRl("");
    setMinScoreSw("");
    setMaxScoreSw("");
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-xl border border-gray-200">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none bg-gradient-to-r from-green-600 to-green-400 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h4" color="white" className="font-bold">
                Quản Lý Học Sinh
              </Typography>
              <Typography variant="small" color="white" className="mt-1 opacity-90">
                Tổng số: {totalItems} học sinh
              </Typography>
            </div>
            <Button
              size="lg"
              className="flex items-center gap-2 bg-white text-green-600 hover:bg-gray-50"
              onClick={() => navigate("/admin/students/create")}
            >
              <PlusIcon className="h-5 w-5" />
              Thêm Học Sinh
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          <StudentFilter
            search={search}
            minScoreRl={minScoreRl}
            maxScoreRl={maxScoreRl}
            minScoreSw={minScoreSw}
            maxScoreSw={maxScoreSw}
            showFilter={showFilter}
            onSearchChange={handleSearchChange}
            onMinScoreRlChange={setMinScoreRl}
            onMaxScoreRlChange={setMaxScoreRl}
            onMinScoreSwChange={setMinScoreSw}
            onMaxScoreSwChange={setMaxScoreSw}
            onToggleFilter={() => setShowFilter(!showFilter)}
            onClearFilters={clearFilters}
          />

          <StudentTable
            students={students}
            loading={loading}
            onDelete={handleDelete}
          />

          <StudentPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default StudentManagement;
