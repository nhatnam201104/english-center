import type { TeacherCourseResponse } from "../../../types/teacher/teacher-portal.response";

interface TeacherCourseInfoProps {
  course: TeacherCourseResponse;
}

const statusConfig = {
  UPCOMING: { label: "Sắp diễn ra", color: "bg-yellow-100 text-yellow-800" },
  ONGOING: { label: "Đang diễn ra", color: "bg-green-100 text-green-800" },
  FINISHED: { label: "Đã kết thúc", color: "bg-gray-100 text-gray-600" },
};

const dayLabelMap: Record<string, string> = {
  MONDAY: "Thứ 2",
  TUESDAY: "Thứ 3",
  WEDNESDAY: "Thứ 4",
  THURSDAY: "Thứ 5",
  FRIDAY: "Thứ 6",
  SATURDAY: "Thứ 7",
  SUNDAY: "Chủ nhật",
};

const TeacherCourseInfo: React.FC<TeacherCourseInfoProps> = ({ course }) => {
  const status = statusConfig[course.status];
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("vi-VN");

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {course.course.name}
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}
        >
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <span className="text-xs text-gray-500">Loại khóa học</span>
          <p className="font-semibold text-gray-800">
            {course.course.type === "COURSE" ? "Khóa học" : "Luyện thi"}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <span className="text-xs text-gray-500">Kỹ năng</span>
          <p className="font-semibold text-gray-800">
            {course.course.courseSkill === "READING_LISTENING"
              ? "Nghe & Đọc"
              : "Nói & Viết"}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <span className="text-xs text-gray-500">Sĩ số</span>
          <p className="font-semibold text-gray-800">
            {course.totalRegister} / {course.totalSlot} học viên
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <span className="text-xs text-gray-500">Bắt đầu</span>
          <p className="font-semibold text-gray-800">
            {formatDate(course.startTime)}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <span className="text-xs text-gray-500">Kết thúc</span>
          <p className="font-semibold text-gray-800">
            {formatDate(course.endTime)}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <span className="text-xs text-gray-500">Phòng học</span>
          <p className="font-semibold text-gray-800">
            Phòng #{course.classroomId}
          </p>
        </div>
      </div>

      {/* Sessions */}
      <div className="mt-6">
        <h3 className="font-semibold text-gray-700 mb-3">Lịch học hàng tuần</h3>
        <div className="flex flex-wrap gap-2">
          {course.sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm"
            >
              <span className="font-semibold">
                {dayLabelMap[session.day] || session.day}
              </span>
              <span className="text-blue-500">
                {session.startTime} - {session.endTime}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherCourseInfo;
