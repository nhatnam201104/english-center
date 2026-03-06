import { useState, useEffect } from "react";
import type { TeacherCourseStudentResponse } from "../../../types/teacher/teacher-portal.response";
import { getMyCourseStudentsService } from "../../../services/teacher-portal.service";

interface TeacherCourseStudentsProps {
  scheduleId: number;
}

const TeacherCourseStudents: React.FC<TeacherCourseStudentsProps> = ({
  scheduleId,
}) => {
  const [students, setStudents] = useState<TeacherCourseStudentResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const response = await getMyCourseStudentsService(scheduleId);
        const data = response.data;
        setStudents(Array.isArray(data) ? data : (data as unknown as { data: TeacherCourseStudentResponse[] })?.data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách học sinh:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [scheduleId]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="font-bold text-gray-800 text-lg">
          Danh sách học sinh ({students.length})
        </h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">Chưa có học sinh đăng ký khóa học này.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  STT
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Họ tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student, index) => (
                <tr
                  key={student.studentId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {student.fullname}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {student.phone}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherCourseStudents;
