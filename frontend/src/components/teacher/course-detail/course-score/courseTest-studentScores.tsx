import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  createScoreCourse,
  getScoreCourseByCourseTestAndStudent,
} from "../../../../services/score-course.service";
import { getMyCourseStudentsService } from "../../../../services/teacher-portal.service";
import type { TeacherCourseStudentResponse } from "../../../../types/teacher/teacher-portal.response";

interface StudentScoreRow extends TeacherCourseStudentResponse {
  score: number | null;
}

const CourseTestStudentScores = () => {
  const { scheduleId, courseTestId } = useParams<{
    scheduleId: string;
    courseTestId: string;
  }>();
  const navigate = useNavigate();

  const parsedScheduleId = useMemo(() => Number(scheduleId), [scheduleId]);
  const parsedCourseTestId = useMemo(() => Number(courseTestId), [courseTestId]);

  const [rows, setRows] = useState<StudentScoreRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [newScore, setNewScore] = useState("");
  const [creating, setCreating] = useState(false);
  const [modalError, setModalError] = useState("");

  const studentsWithoutScore = useMemo(
    () => rows.filter((student) => student.score === null),
    [rows],
  );

  useEffect(() => {
    const loadStudentScores = async () => {
      if (
        !parsedScheduleId ||
        Number.isNaN(parsedScheduleId) ||
        !parsedCourseTestId ||
        Number.isNaN(parsedCourseTestId)
      ) {
        setError("Tham số không hợp lệ");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const studentsRes = await getMyCourseStudentsService(parsedScheduleId);
        const students = Array.isArray(studentsRes.data)
          ? studentsRes.data
          : [];

        const mergedRows = await Promise.all(
          students.map(async (student) => {
            try {
              const scoreRes = await getScoreCourseByCourseTestAndStudent(
                parsedCourseTestId,
                student.studentId,
              );

              return {
                ...student,
                score: scoreRes.data?.score ?? null,
              };
            } catch {
              return {
                ...student,
                score: null,
              };
            }
          }),
        );

        setRows(mergedRows);
      } catch (err) {
        console.error("Lỗi khi tải điểm course test:", err);
        setError("Chưa có học viên nào tham gia bài kiểm tra này");
      } finally {
        setLoading(false);
      }
    };

    loadStudentScores();
  }, [parsedScheduleId, parsedCourseTestId]);

  const openAddModal = () => {
    if (studentsWithoutScore.length === 0) {
      return;
    }

    setSelectedStudentId(String(studentsWithoutScore[0].studentId));
    setNewScore("");
    setModalError("");
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setModalError("");
    setNewScore("");
  };

  const handleCreateScore = async () => {
    const studentId = Number(selectedStudentId);
    const parsedScore = Number(newScore);

    if (!studentId || Number.isNaN(studentId)) {
      setModalError("Vui lòng chọn học viên");
      return;
    }

    if (newScore.trim() === "") {
      setModalError("Vui lòng nhập điểm");
      return;
    }

    if (Number.isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100) {
      setModalError("Điểm phải trong khoảng từ 0 đến 100");
      return;
    }

    try {
      setCreating(true);
      setModalError("");

      await createScoreCourse(parsedCourseTestId, studentId, {
        score: parsedScore,
      });

      setRows((prevRows) =>
        prevRows.map((student) =>
          student.studentId === studentId
            ? {
                ...student,
                score: parsedScore,
              }
            : student,
        ),
      );

      closeAddModal();
    } catch (err) {
      console.error("Lỗi khi thêm điểm course test:", err);
      setModalError("Không thể thêm điểm. Vui lòng thử lại");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <button
          onClick={() => navigate(`/teacher/courses/${parsedScheduleId}`)}
          className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Quay lại khóa học
        </button>

        <Typography variant="h5" className="font-bold text-gray-800">
          Điểm Course Test của học viên
        </Typography>
        <Typography variant="small" className="mt-1 text-gray-500">
          Course test #{parsedCourseTestId}
        </Typography>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
          <Typography variant="h6" className="text-gray-800">
            Danh sách học viên ({rows.length})
          </Typography>
          <button
            type="button"
            onClick={openAddModal}
            disabled={studentsWithoutScore.length === 0}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Thêm điểm
          </button>
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
        ) : rows.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Typography variant="h6" className="text-gray-400">
              Khóa học chưa có học viên đăng ký
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
                    Họ và tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Số điện thoại
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Điểm
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((student, index) => (
                  <tr key={student.studentId} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {student.fullname}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{student.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{student.phone}</td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex rounded-lg px-3 py-1 text-sm font-semibold ${
                          student.score === null
                            ? "bg-gray-100 text-gray-500"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {student.score === null ? "Chưa có điểm" : student.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAddModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <Typography variant="h6" className="text-gray-800">
              Thêm Course Score
            </Typography>
            <Typography variant="small" className="mt-1 text-gray-500">
              Chọn học viên và nhập điểm cho course test này.
            </Typography>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Học viên</label>
                <select
                  value={selectedStudentId}
                  onChange={(event) => setSelectedStudentId(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-blue-500"
                >
                  {studentsWithoutScore.map((student) => (
                    <option key={student.studentId} value={student.studentId}>
                      {student.fullname} - {student.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Điểm</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step="0.1"
                  value={newScore}
                  onChange={(event) => setNewScore(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-blue-500"
                  placeholder="Nhập điểm từ 0 đến 100"
                />
              </div>

              {modalError ? <p className="text-sm text-red-500">{modalError}</p> : null}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeAddModal}
                disabled={creating}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleCreateScore}
                disabled={creating}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {creating ? "Đang thêm..." : "Thêm điểm"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CourseTestStudentScores;
