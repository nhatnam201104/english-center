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
import { useDebounce } from "../../../../helpers/useDebounce";
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);


  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [degree, setDegree] = useState<string>("");
  const [isTeaching, setIsTeaching] = useState<string>("");

  const debouncedSearch = useDebounce(search);
  const debouncedDegree = useDebounce(degree);
  const debouncedIsTeaching = useDebounce(isTeaching);

  const loadTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const params: GetTeacherRequest = {
        page: currentPage,
        limit: 10,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (debouncedDegree) params.degree = debouncedDegree;
      if (debouncedIsTeaching) params.isTeaching = debouncedIsTeaching === "true";

      const response = await getAllTeachersService(params);
      if (response.success && response.data) {
        setTeachers(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách giáo viên:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, debouncedDegree, debouncedIsTeaching]);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  useEffect(() => {
    if (successMessage || apiError) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setApiError(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, apiError]);


  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giáo viên này?")) {
      try {
        const response = await deleteTeacherService(id);
        if (response.success) {
          setSuccessMessage("Xóa giáo viên thành công!");
          setApiError(null);
          loadTeachers();
        }
      } catch (error: unknown) {
        const err = error as ApiError;
        setApiError(err.response?.data?.message || "Xóa giáo viên thất bại!");
        setSuccessMessage(null);
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
    <>
      {successMessage && (
        <div
          className="fixed top-6 right-6 z-50 w-[400px] rounded-xl border border-green-200 bg-green-50
          px-5 py-4 text-green-700 shadow-xl flex gap-3"
        >
          <div className="flex-1">
            <p className="font-semibold text-sm">Thành công</p>
            <p className="text-xs mt-1">{successMessage}</p>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green-400 hover:text-green-600 text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {apiError && (
        <div className="fixed top-6 right-6 z-50 w-[400px] rounded-xl border border-red-200 bg-red-50
          px-5 py-4 text-red-700 shadow-xl flex gap-3">
          <div className="flex-1">
            <p className="font-semibold text-sm">Thất bại</p>
            <p className="text-xs mt-1">{apiError}</p>
          </div>
          <button
            onClick={() => setApiError(null)}
            className="text-red-400 hover:text-red-600 text-sm"
          >
            ✕
          </button>
        </div>
      )}
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
              onSuccess={setSuccessMessage}
              onError={setApiError}
            />

            <TeacherPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default TeacherManagement;
