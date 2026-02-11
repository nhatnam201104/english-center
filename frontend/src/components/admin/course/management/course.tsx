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
import type { Course } from "../../../../types/course/response";
import type { GetCourseRequest } from "../../../../types/course/request";
import {
  getAllCourses,
  deleteCourse,
} from "../../../../services/course.service";
import CourseFilter from "./course.filter";
import CourseTable from "./course.table";
import CoursePagination from "./course.pagination";

const CourseManagement = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);
      const params: GetCourseRequest = {
        page: currentPage,
        limit: 10,
      };
      if (search) params.search = search;
      if (type) params.type = type as "COURSE" | "TEST_PREPARATION";
      if (minPrice) params.minPrice = Number(minPrice);
      if (maxPrice) params.maxPrice = Number(maxPrice);

      const response = await getAllCourses(params);
      setCourses(response.data?.data || []);
      setTotalPages(response.data?.totalPages || 1);
      setTotalItems(response.data?.totalItems || 0);
    } catch (error) {
      console.error("Lỗi khi tải danh sách khóa học:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, type, minPrice, maxPrice]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) {
      try {
        const response = await deleteCourse(id);
        if (response.success) {
          alert("Xóa khóa học thành công!");
          loadCourses();
        } else {
          alert(response.message || "Xóa khóa học thất bại!");
        }
      } catch (error) {
        console.error("Lỗi khi xóa khóa học:", error);
        alert("Xóa khóa học thất bại!");
      }
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/courses/update/${id}`);
  };

  const handleManageTests = (courseId: number) => {
    navigate(`/admin/coursetest?courseId=${courseId}`);
  };

  const handleTeacherAssignmen = (courseId: number) => {
    navigate(`/admin/register-schedule/${courseId}`);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleTypeChange = (value: string) => {
    setType(value);
    setCurrentPage(1);
  };

  const handleMinPriceChange = (value: string) => {
    setMinPrice(value);
    setCurrentPage(1);
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setType("");
    setMinPrice("");
    setMaxPrice("");
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
                Quản Lý Khóa Học
              </Typography>
              <Typography
                variant="small"
                color="white"
                className="mt-1 opacity-90"
              >
                Tổng số: {totalItems} khóa học
              </Typography>
            </div>
            <Button
              size="lg"
              className="flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-50"
              onClick={() => navigate("/admin/courses/create")}
            >
              <PlusIcon className="h-5 w-5" />
              Thêm Khóa Học
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          <CourseFilter
            search={search}
            type={type}
            minPrice={minPrice}
            maxPrice={maxPrice}
            showFilter={showFilter}
            onSearchChange={handleSearchChange}
            onTypeChange={handleTypeChange}
            onMinPriceChange={handleMinPriceChange}
            onMaxPriceChange={handleMaxPriceChange}
            onToggleFilter={() => setShowFilter(!showFilter)}
            onClearFilters={clearFilters}
          />

          <CourseTable
            courses={courses}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onManageTests={handleManageTests}
            onAssignSchedule={handleTeacherAssignmen}
          />

          <CoursePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default CourseManagement;
