import { useEffect, useState } from "react";
import { Info, Lock } from "lucide-react";

import { type TeacherResponse } from "../../../types/teacher/response";
import { getAllTeachersService } from "../../../services/teacher.service";
import { useParams } from "react-router";
import type { Course } from "../../../types/course/response";
import { getCourseById } from "../../../services/course.service";
import { createSchedule } from "../../../services/schedule.service";
import TeacherSidebar from "../../../components/admin/schedule/teacherAssignment/teacherSideBar";
import CourseInfo from "../../../components/admin/schedule/teacherAssignment/courseInfo";
import AssignDropZone from "../../../components/admin/schedule/teacherAssignment/assignDropZone";
import getCycleValue from "../../../helpers/getCycleValue";

const TeacherAssignment = () => {
  // const teachers = [
  //   { name: "Dr. Sarah Jenkins", title: "English Literature • 8y exp.", degree: "Ph.D.", status: "Available", days: ["Mon", "Wed", "Fri"] },
  //   { name: "Prof. Michael Chen", title: "Schedule Overlap", degree: "MA", status: "Overlap", days: ["Tue", "Thu"] },
  //   { name: "Marcus Thorne", title: "IELTS Expert • 5y exp.", degree: "MA", status: "Available", days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] },
  //   { name: "Elena Rodriguez", title: "Day Mismatch", degree: "Ph.D.", status: "Mismatch", days: ["Tue", "Sat"] },
  // ];
  const { id } = useParams();
  const courseId = Number(id);
  const [course, setCourse] = useState<Course | null>(null);
  const [dragTeacher, setDragTeacher] = useState<any>(null);
  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
  const [assignedTeacher, setAssignedTeacher] = useState<TeacherResponse | null>(null);
  const [isOver, setIsOver] = useState(false);
  const [assignmentData, setAssignmentData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);



  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const res = await getAllTeachersService();
        if (res.success && res.data) {
          setTeachers(res.data.data);
        }
      } catch (error) {
        console.error("Load teachers failed:", error);
      }
    }

    const loadCourse = async () => {
      if (!id) return;
      try {
        const response = await getCourseById(courseId);
        if (response.success && response.data) {
          setCourse(response.data);
        }
      } catch (error) {
        console.error("Load course failed:", error);
      }
    }
    loadCourse();
    loadTeachers();
    setApiError(null);
  }, [id]);

  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => {
        setApiError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [assignedTeacher, assignmentData, apiError]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);



  const handleSaveSchedule = async () => {
    if (
      !assignedTeacher ||
      !course ||
      !assignmentData.classroomId ||
      !assignmentData.startDate ||
      !assignmentData.fromTime ||
      !assignmentData.toTime ||
      !assignmentData.totalSessions ||
      !assignmentData.days
    ) {
      setApiError("Vui lòng nhập đầy đủ thông tin lịch học.");
      return;
    }


    setLoading(true);

    try {
      // Chuyển đổi chuỗi "246" hoặc "357" thành mảng sessions
      const daysMap: Record<string, string[]> = {
        "246": ["MONDAY", "WEDNESDAY", "FRIDAY"],
        "357": ["TUESDAY", "THURSDAY", "SATURDAY"],
      };

      const selectedDays = daysMap[assignmentData.days] || [];

      const sessions = selectedDays.map(day => ({
        day: day,
        startTime: assignmentData.fromTime,
        endTime: assignmentData.toTime
      }));

      // Calculator endDate = startDate + totalSessions
      const totalSessions = Number(assignmentData.totalSessions);
      const startDate = new Date(assignmentData.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (Math.ceil(totalSessions/3)*7 - getCycleValue(totalSessions)*2)-1);
      
      // Init payload
      const payload = {
        teacherId: assignedTeacher.id,
        classroomId: assignmentData.classroomId,
        coursesId: courseId,
        totalSlot: totalSessions,
        startTime: assignmentData.startDate,
        endTime: endDate.toISOString(),
        sessions: sessions
      };
      console.log(payload);

      const res = await createSchedule(payload);

      if (res.success) {
        setSuccessMessage("Phân công giáo viên thành công!");
        setApiError(null);
      } else {
        setApiError(res.message || "Có lỗi xảy ra khi lưu lịch học");
      }
    } catch (error: any) {
      const message = error.response?.data?.message ||
        error.message || "Có lỗi xảy ra khi lưu lịch học";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {successMessage && (
        <div
          className="fixed top-6 right-6 z-50 w-[400px] rounded-xl border border-green-200 bg-green-50
          px-5 py-4 text-green-700 shadow-xl flex gap-3"
        >
          <div className="flex-1">
            <p className="font-semibold text-sm">Thành công</p>
            <p className="text-xs mt-1">{successMessage}</p>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green-400 hover:text-green-600 text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {apiError && (
        <div className="fixed top-6 right-6 z-50 w-[400px] rounded-xl border border-red-200 bg-red-50
          px-5 py-4 text-red-700 shadow-xl flex gap-3">
          <div className="flex-1">
            <p className="font-semibold text-sm">Không thể phân công giáo viên</p>
            <p className="text-xs mt-1">{apiError}</p>
          </div>
          <button
            onClick={() => setApiError(null)}
            className="text-red-400 hover:text-red-600 text-sm"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex bg-gray-50 text-slate-700 overflow-y-auto">
        <TeacherSidebar
          teachers={teachers}
          onDragStart={setDragTeacher}
        />

        <main className="flex-1 p-3 bg-[#F8FAFC]">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800">
              Teacher Assignment
            </h1>
            <button
              onClick={handleSaveSchedule}
              disabled={!assignedTeacher || loading}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-sm
                ${!assignedTeacher || loading
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                }
              `}
            >
              {!assignedTeacher && <Lock size={18} />}
              {loading ? "Đang lưu..." : "Lưu lịch"}
            </button>
          </div>

          <section className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
            {/* Course Info Component*/}
            <CourseInfo course={course} onDataChange={setAssignmentData} />

            {/* Drop Zone Component */}
            <AssignDropZone
              assignedTeacher={assignedTeacher}
              isOver={isOver}
              onDragOver={(e: any) => {
                e.preventDefault();
                setIsOver(true);
              }}
              onDragLeave={() => setIsOver(false)}
              onDrop={() => {
                if (dragTeacher) setAssignedTeacher(dragTeacher);
                setDragTeacher(null);
                setIsOver(false);
              }}
              onRemove={() => setAssignedTeacher(null)}
            />
          </section>

          {/* Footer Validation Message */}
          <div className="mt-6 flex items-start gap-4 p-5 bg-blue-50/40 rounded-[24px] border border-blue-100/50 transition-all hover:bg-blue-50/60">
            <div className="bg-blue-500 rounded-full p-1 text-white shadow-sm">
              <Info className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h5 className="text-sm font-bold text-blue-900 mb-0.5 tracking-tight">Assignment Validation</h5>
              <p className="text-xs text-blue-700/70 leading-relaxed font-medium">
                The system will automatically check for teacher availability, travel time between rooms, and total weekly hours limit (40h/week) upon assignment.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default TeacherAssignment;