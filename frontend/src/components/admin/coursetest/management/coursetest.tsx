import { useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import type { CourseTest } from "../../../../types/coursetest/response";
import type { GetCourseTestRequest } from "../../../../types/coursetest/request";
import {
  getAllCoursetests,
  deleteCoursetest,
} from "../../../../services/coursetest.service";
import CoursetestFilter from "./coursetest.filter";
import CoursetestTable from "./coursetest.table";
import CoursetestPagination from "./coursetest.pagination";

const CoursetestManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseIdParam = searchParams.get("courseId");

  const [coursetests, setCoursetests] = useState<CourseTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const courseId = courseIdParam ? parseInt(courseIdParam) : undefined;

  const loadCoursetests = useCallback(async () => {
    try {
      setLoading(true);
      const params: GetCourseTestRequest = {
        page: currentPage,
        limit: 10,
      };
      if (search) params.search = search;
      if (courseId) params.courseId = courseId;

      const response = await getAllCoursetests(params);
      setCoursetests(response.data?.data || []);
      setTotalPages(response.data?.totalPages || 1);
      setTotalItems(response.data?.totalItems || 0);
    } catch (error) {
      console.error("Lỗi khi tải danh sách bài kiểm tra:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, courseId]);

  useEffect(() => {
    loadCoursetests();
  }, [loadCoursetests]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài kiểm tra này không?")) {
      try {
        const response = await deleteCoursetest(id);
        if (response.success) {
          alert("Xóa bài kiểm tra thành công!");
          loadCoursetests();
        } else {
          alert(response.message || "Xóa bài kiểm tra thất bại!");
        }
      } catch (error) {
        console.error("Lỗi khi xóa bài kiểm tra:", error);
        alert("Xóa bài kiểm tra thất bại!");
      }
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/coursetest/update/${id}`);
  };

  const handleCreate = () => {
    if (courseId) {
      navigate(`/admin/coursetest/create?courseId=${courseId}`);
    } else {
      navigate(`/admin/coursetest/create`);
    }
  };

  const handleBackToCourses = () => {
    navigate("/admin/courses");
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch("");
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
                Quản Lý Bài Kiểm Tra
              </Typography>
              <Typography
                variant="small"
                color="white"
                className="mt-1 opacity-90"
              >
                Tổng số: {totalItems} bài kiểm tra
                {courseId && (
                  <span className="ml-2 text-yellow-200">
                    (Lọc theo khóa học ID: {courseId})
                  </span>
                )}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              {courseId && (
                <Button
                  size="sm"
                  variant="outlined"
                  className="bg-white/20 text-white border-white hover:bg-white/30"
                  onClick={handleBackToCourses}
                >
                  Quay lại Khóa Học
                </Button>
              )}
              <Button
                size="lg"
                className="flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-50"
                onClick={handleCreate}
              >
                <PlusIcon className="h-5 w-5" />
                Thêm Bài Kiểm Tra
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <CoursetestFilter
            search={search}
            showFilter={showFilter}
            onSearchChange={handleSearchChange}
            onToggleFilter={() => setShowFilter(!showFilter)}
            onClearFilters={clearFilters}
          />

          <CoursetestTable
            coursetests={coursetests}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <CoursetestPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default CoursetestManagement;
