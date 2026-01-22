import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import type { TeacherResponse } from "../../../../types/teacher/response";
import type { GetTeacherRequest } from "../../../../types/teacher/request";
import {
  getAllTeachersService,
  deleteTeacherService,
} from "../../../../services/teacher.service";
import TeacherFilter from "./teacher.filter";
import TeacherTable from "./teacher.table";
import TeacherPagination from "./teacher.pagination";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const TeacherManagement = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [degree, setDegree] = useState<string>("");
  const [isTeaching, setIsTeaching] = useState<string>("");

  const loadTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const params: GetTeacherRequest = {
        page: currentPage,
        limit: 10,
      };
      if (search) params.search = search;
      if (degree) params.degree = degree;
      if (isTeaching) params.isTeaching = isTeaching === "true";

      const response = await getAllTeachersService(params);
      if (response.success && response.data) {
        setTeachers(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách giáo viên:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, degree, isTeaching]);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giáo viên này?")) {
      try {
        const response = await deleteTeacherService(id);
        if (response.success) {
          alert("Xóa giáo viên thành công!");
          loadTeachers();
        }
      } catch (error: unknown) {
        const apiError = error as ApiError;
        alert(apiError.response?.data?.message || "Xóa giáo viên thất bại!");
      }
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleDegreeChange = (value: string) => {
    setDegree(value);
    setCurrentPage(1);
  };

  const handleIsTeachingChange = (value: string) => {
    setIsTeaching(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setDegree("");
    setIsTeaching("");
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-xl border border-gray-200">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none bg-gradient-to-r from-blue-600 to-blue-400 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h4" color="white" className="font-bold">
                Quản Lý Giáo Viên
              </Typography>
              <Typography variant="small" color="white" className="mt-1 opacity-90">
                Tổng số: {totalItems} giáo viên
              </Typography>
            </div>
            <Button
              size="lg"
              className="flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-50"
              onClick={() => navigate("/admin/teachers/create")}
            >
              <PlusIcon className="h-5 w-5" />
              Thêm Giáo Viên
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          <TeacherFilter
            search={search}
            degree={degree}
            isTeaching={isTeaching}
            showFilter={showFilter}
            onSearchChange={handleSearchChange}
            onDegreeChange={handleDegreeChange}
            onIsTeachingChange={handleIsTeachingChange}
            onToggleFilter={() => setShowFilter(!showFilter)}
            onClearFilters={clearFilters}
          />

          <TeacherTable
            teachers={teachers}
            loading={loading}
            onDelete={handleDelete}
          />

          <TeacherPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default TeacherManagement;
