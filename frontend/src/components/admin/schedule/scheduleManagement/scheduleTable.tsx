import { useNavigate } from "react-router";
import type { ScheduleResponse } from "../../../../types/schedule/schedule.response";
import { EyeIcon } from "lucide-react";

interface ScheduleTableProps {
  schedules: ScheduleResponse[];
  loading: boolean;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({
  schedules,
  loading,
}) => {
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Chưa có đợt mở lớp nào
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left w-[150px]">Khóa học</th>
            <th className="px-6 py-3 text-left w-[100px]">Ngày bắt đầu</th>
            <th className="px-6 py-3 text-left w-[100px]">Ngày kết thúc</th>
            <th className="px-6 py-3 text-left w-[100px]">Giáo viên</th>
            <th className="px-6 py-3 text-left w-[100px]">Phòng học</th>
            <th className="px-6 py-3 text-left w-[50px]">Sĩ số</th>
            <th className="px-6 py-3 text-left w-[60px]">Số buổi</th>
            <th className="px-6 py-3 text-left w-[200px]">Buổi</th>
            <th className="px-6 py-3 text-left w-[100px]">Hành động</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {schedules.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                {s.course?.name}
              </td>
              <td className="px-6 py-4">
                {new Date(s.startTime).toLocaleDateString("vi-VN")}
              </td>
              <td className="px-6 py-4">
                {new Date(s.endTime).toLocaleDateString("vi-VN")}
              </td>
              <td className="px-6 py-4">
                {s.teacher?.fullname}
              </td>
              <td className="px-6 py-4">
                Phòng {s.classroomId}
              </td>
              <td className="px-6 py-4">
                {s.totalRegister}/{s.totalSlot}
              </td>
              <td className="px-6 py-4">
                {s.course?.totalSession ?? 0}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {s.sessions
                  .map(
                    (session) =>
                      `${session.day} (${session.startTime}–${session.endTime})`
                  )
                  .join(", ")}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => navigate(`/admin/schedules/${s.id}`)}
                  className="text-blue-600 hover:underline font-medium"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;

