import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import { getCourseTestsByCourseId } from "../../../services/coursetest.service";
import type { CourseTest } from "../../../types/coursetest/response";

interface TeacherCourseScoresProps {
  courseId: number;
  scheduleId: number;
}

const TeacherCourseScores = ({
  courseId,
  scheduleId,
}: TeacherCourseScoresProps) => {
  const [courseTests, setCourseTests] = useState<CourseTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parsedCourseId = useMemo(() => Number(courseId), [courseId]);

  useEffect(() => {
    const loadCourseTests = async () => {
      if (!parsedCourseId || Number.isNaN(parsedCourseId)) {
        setError("Course ID không hợp lệ");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getCourseTestsByCourseId(parsedCourseId);
        const payload = response.data;
        const data = Array.isArray(payload)
          ? payload
          : (payload as { data?: CourseTest[] })?.data || [];

        setCourseTests(data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách course test:", err);
        setError("Không thể tải danh sách course test");
      } finally {
        setLoading(false);
      }
    };

    loadCourseTests();
  }, [parsedCourseId]);

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <Typography variant="h6" className="text-gray-800">
            Danh sách bài kiểm tra ({courseTests.length})
          </Typography>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="px-6 py-16 text-center">
            <Typography variant="h6" className="text-red-500">
              {error}
            </Typography>
          </div>
        ) : courseTests.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Typography variant="h6" className="text-gray-400">
              Chưa có bài kiểm tra nào
            </Typography>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Tên bài test
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Thứ tự
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Điểm học viên
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courseTests.map((test, index) => (
                  <tr key={test.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{test.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{test.index}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(test.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/teacher/courses/${scheduleId}/course-tests/${test.id}/scores`}
                        className="inline-flex rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                      >
                        Quản lý điểm
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCourseScores;
