import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type { TeacherCourseResponse } from "../../../types/teacher/teacher-portal.response";
import { getMyCourseDetailService } from "../../../services/teacher-portal.service";
import TeacherCourseInfo from "./teacher.course-info";
import TeacherCourseStudents from "./teacher.course-students";
import TeacherCourseAttendance from "./teacher.course-attendance";

type TabType = "info" | "students" | "attendance";

const TeacherCourseDetail = () => {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<TeacherCourseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("info");

  useEffect(() => {
    const loadCourseDetail = async () => {
      if (!scheduleId) return;
      try {
        setLoading(true);
        const response = await getMyCourseDetailService(Number(scheduleId));
        const data = response.data;
        setCourse((data as unknown as { data: TeacherCourseResponse })?.data || data as TeacherCourseResponse);
      } catch (err: unknown) {
        const error = err as { message?: string };
        setError(error.message || "Không thể tải thông tin khóa học");
      } finally {
        setLoading(false);
      }
    };

    loadCourseDetail();
  }, [scheduleId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 text-lg font-medium mb-4">
          {error || "Không tìm thấy khóa học"}
        </div>
        <button
          onClick={() => navigate("/teacher/courses")}
          className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Quay lại danh sách
        </button>
      </div>
    );
  }

  const tabs = [
    { id: "info" as TabType, label: "Thông tin khóa học" },
    { id: "students" as TabType, label: "Danh sách học sinh" },
    { id: "attendance" as TabType, label: "Quản lý điểm danh" },
  ];

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => navigate("/teacher/courses")}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        <span className="text-sm font-medium">Quay lại danh sách</span>
      </button>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "info" && <TeacherCourseInfo course={course} />}
        {activeTab === "students" && <TeacherCourseStudents scheduleId={Number(scheduleId)} />}
        {activeTab === "attendance" && (
          <TeacherCourseAttendance
            scheduleId={Number(scheduleId)}
            courseName={course.course.name}
          />
        )}
      </div>
    </div>
  );
};

export default TeacherCourseDetail;
