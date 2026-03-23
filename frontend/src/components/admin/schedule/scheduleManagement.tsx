import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import type { ScheduleResponse } from "../../../types/schedule/schedule.response";
import { getAllSchedules } from "../../../services/schedule.service";
import SchedulePagination from "../../../components/course-detail/schedulePagination";
import ScheduleTable from "../../../components/admin/schedule/scheduleManagement/scheduleTable";


const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");

  const fetchSchedules = async (targetPage = page) => {
    try {
      setLoading(true);
      const res = await getAllSchedules(targetPage, limit);
      const nextSchedules = res.data?.data ?? [];
      const nextTotalItems = res.data?.totalItems ?? 0;
      const nextTotalPages = res.data?.totalPages ?? 0;

      // If deleting the last item of the last page, go back to a valid page automatically.
      if (nextSchedules.length === 0 && targetPage > 1 && nextTotalPages > 0) {
        const fallbackPage = Math.min(targetPage - 1, nextTotalPages);
        if (fallbackPage !== page) {
          setPage(fallbackPage);
        }
        return;
      }

      setSchedules(nextSchedules);
      setTotalItems(nextTotalItems);
      setTotalPages(nextTotalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules(page);
  }, [page]);

  const courseOptions = useMemo(() => {
    const names = schedules
      .map((schedule) => schedule.course?.name)
      .filter((name): name is string => Boolean(name));

    return Array.from(new Set(names));
  }, [schedules]);

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      const courseName = schedule.course?.name ?? "";
      const teacherName = schedule.teacher?.fullname ?? "";
      const classroomName = schedule.classroom?.name ?? "";

      const matchCourse = !selectedCourse || courseName === selectedCourse;
      const lowerKeyword = keyword.trim().toLowerCase();
      const matchKeyword =
        !lowerKeyword ||
        courseName.toLowerCase().includes(lowerKeyword) ||
        teacherName.toLowerCase().includes(lowerKeyword) ||
        classroomName.toLowerCase().includes(lowerKeyword);

      const scheduleStartDate = new Date(schedule.startTime)
        .toISOString()
        .slice(0, 10);
      const matchStartDate =
        !selectedStartDate || scheduleStartDate === selectedStartDate;

      return matchCourse && matchKeyword && matchStartDate;
    });
  }, [schedules, selectedCourse, keyword, selectedStartDate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-xl border border-gray-200">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none bg-gradient-to-r from-blue-600 to-blue-400 p-6"
        >
          <div>
            <Typography variant="h4" color="white" className="font-bold">
              Quản Lý đợt mở lớp học
            </Typography>
            <Typography variant="small" color="white" className="mt-1 opacity-90">
              Tổng số: {totalItems} đợt mở lớp
            </Typography>
          </div>
        </CardHeader>

        <CardBody>
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo khóa học, giáo viên, phòng học"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2">
              <label className="whitespace-nowrap text-sm font-semibold text-gray-600">Ngày bắt đầu</label>
              <input
                type="date"
                value={selectedStartDate}
                onChange={(e) => setSelectedStartDate(e.target.value)}
                className="w-full text-sm focus:outline-none"
              />
            </div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">Tất cả khóa học</option>
              {courseOptions.map((courseName) => (
                <option key={courseName} value={courseName}>
                  {courseName}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                setSelectedCourse("");
                setKeyword("");
                setSelectedStartDate("");
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Xóa bộ lọc
            </button>
          </div>

          <ScheduleTable
            schedules={filteredSchedules}
            loading={loading}
            onReload={() => fetchSchedules(page)}
          />
          <SchedulePagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default ScheduleManagement;
