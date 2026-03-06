import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import type { TeacherCourseResponse } from "../../../types/teacher/teacher-portal.response";
import { getMyCoursesService } from "../../../services/teacher-portal.service";
import TeacherCourseCard from "./teacher.courses.card";
import TeacherCoursesFilter from "./teacher.courses.filter";
import TeacherCoursesPagination from "./teacher.courses.pagination";

const TeacherCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<TeacherCourseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [status, setStatus] = useState("");
  const [scheduleType, setScheduleType] = useState("");

  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMyCoursesService({
        page: currentPage,
        limit: 9,
        status: status ? (status as "UPCOMING" | "ONGOING" | "FINISHED") : undefined,
        scheduleType: scheduleType ? (scheduleType as "246" | "357") : undefined,
      });

      const result = response.data;
      setCourses(result?.data || []);
      setTotalPages(result?.totalPages || 1);
      setTotalItems(result?.totalItems || 0);
    } catch (error) {
      console.error("Lỗi khi tải danh sách khóa học:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, status, scheduleType]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleViewDetail = (scheduleId: number) => {
    navigate(`/teacher/courses/${scheduleId}`);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handleScheduleTypeChange = (value: string) => {
    setScheduleType(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setStatus("");
    setScheduleType("");
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Typography variant="h4" className="font-bold text-gray-800">
          Khóa Học Của Tôi
        </Typography>
        <Typography variant="small" className="text-gray-500 mt-1">
          Tổng số: {totalItems} khóa học
        </Typography>
      </div>

      {/* Filters */}
      <TeacherCoursesFilter
        status={status}
        scheduleType={scheduleType}
        showFilter={showFilter}
        onStatusChange={handleStatusChange}
        onScheduleTypeChange={handleScheduleTypeChange}
        onToggleFilter={() => setShowFilter(!showFilter)}
        onClearFilters={clearFilters}
      />

      {/* Course Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20">
          <Typography variant="h6" className="text-gray-400">
            Không tìm thấy khóa học nào
          </Typography>
          <Typography variant="small" className="text-gray-400 mt-2">
            Bạn chưa được phân công giảng dạy khóa học nào.
          </Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <TeacherCourseCard
              key={course.id}
              course={course}
              onViewDetail={handleViewDetail}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <TeacherCoursesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default TeacherCourses;
