import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type { TeacherCourseResponse } from "../../../types/teacher/teacher-portal.response";
import { getMyCourseDetailService } from "../../../services/teacher-portal.service";
import TeacherCourseInfo from "./teacher.course-info";
import TeacherCourseStudents from "./teacher.course-students";

const TeacherCourseDetail = () => {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<TeacherCourseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        <Typography variant="h6" className="text-red-500">
          {error || "Không tìm thấy khóa học"}
        </Typography>
        <button
          onClick={() => navigate("/teacher/courses")}
          className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Quay lại danh sách
        </button>
      </div>
    );
  }

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

      {/* Course Info */}
      <div className="space-y-6">
        <TeacherCourseInfo course={course} />
        <TeacherCourseStudents scheduleId={Number(scheduleId)} />
      </div>
    </div>
  );
};

export default TeacherCourseDetail;
