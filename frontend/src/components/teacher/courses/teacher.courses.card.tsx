import type { TeacherCourseResponse } from "../../../types/teacher/teacher-portal.response";

interface TeacherCourseCardProps {
  course: TeacherCourseResponse;
  onViewDetail: (scheduleId: number) => void;
}

const statusConfig = {
  UPCOMING: { label: "Sắp diễn ra", color: "bg-yellow-100 text-yellow-800" },
  ONGOING: { label: "Đang diễn ra", color: "bg-green-100 text-green-800" },
  FINISHED: { label: "Đã kết thúc", color: "bg-gray-100 text-gray-600" },
};

const dayLabelMap: Record<string, string> = {
  MONDAY: "T2",
  TUESDAY: "T3",
  WEDNESDAY: "T4",
  THURSDAY: "T5",
  FRIDAY: "T6",
  SATURDAY: "T7",
  SUNDAY: "CN",
};

const TeacherCourseCard: React.FC<TeacherCourseCardProps> = ({
  course,
  onViewDetail,
}) => {
  const status = statusConfig[course.status];
  const sessionDays = course.sessions.map((s) => dayLabelMap[s.day] || s.day);
  const scheduleLabel = sessionDays.join(" - ");

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const timeSlot =
    course.sessions.length > 0
      ? `${course.sessions[0].startTime} - ${course.sessions[0].endTime}`
      : "";

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
      onClick={() => onViewDetail(course.id)}
    >
      {/* Header with status */}
      <div className="p-4 pb-3 border-b border-gray-100">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-800 text-base line-clamp-2 flex-1">
            {course.course.name}
          </h3>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${status.color}`}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Schedule badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Lịch học:</span>
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
            {scheduleLabel}
          </span>
          {timeSlot && (
            <span className="text-xs text-gray-500">{timeSlot}</span>
          )}
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500 text-xs">Sĩ số</span>
            <p className="font-semibold text-gray-800">
              {course.totalRegister}/{course.totalSlot}
            </p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Số buổi</span>
            <p className="font-semibold text-gray-800">
              {course.course.totalSession ?? 0}
            </p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Loại</span>
            <p className="font-semibold text-gray-800">
              {course.course.type === "COURSE" ? "Khóa học" : "Luyện thi"}
            </p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Bắt đầu</span>
            <p className="font-semibold text-gray-800">
              {formatDate(course.startTime)}
            </p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Kết thúc</span>
            <p className="font-semibold text-gray-800">
              {formatDate(course.endTime)}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <button className="w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
          Xem chi tiết →
        </button>
      </div>
    </div>
  );
};

export default TeacherCourseCard;
