import React, { useEffect, useMemo, useState } from 'react';
import {
  User,
  Calendar,
  Headphones,
  MessageSquare,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { getStudentsByParentMeService } from '../../services/student.service';
import type { StudentResponse } from '../../types/student/response';
import formatDate from '../../helpers/formatDate';

const getRecentCourses = (student: StudentResponse): Array<{ name: string; skill: string; status: 'In Progress' | 'Completed' }> => {
  const now = Date.now();
  return (student.schedules || []).map((schedule) => {
    const endAt = new Date(schedule.endTime).getTime();
    return {
      name: schedule.course?.name || 'Khóa học',
      skill: schedule.course?.skill || '',
      status: endAt >= now ? 'In Progress' : 'Completed',
    };
  });
};

const isStudentActive = (student: StudentResponse): boolean => {
  return getRecentCourses(student).some((course) => course.status === 'In Progress');
};

const ChildrenManagement = () => {
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const response = await getStudentsByParentMeService();
        const list = Array.isArray(response.data) ? response.data : [];

        setStudents(list);
        setSelectedStudentId(list[0]?.id ?? null);
      } catch (error) {
        console.error('Load students by parent failed:', error);
        setStudents([]);
        setSelectedStudentId(null);
        setErrorMessage('Không thể tải danh sách học sinh. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const selectedStudent = useMemo(
    () => students.find((student) => student.id === selectedStudentId) || null,
    [students, selectedStudentId],
  );
  const selectedStudentRecentCourses = useMemo(
    () => (selectedStudent ? getRecentCourses(selectedStudent) : []),
    [selectedStudent],
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <h3 className="text-lg font-bold text-red-600">Đã xảy ra lỗi</h3>
          <p className="mt-2 text-sm text-slate-600">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (!selectedStudent || students.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h3 className="text-lg font-bold text-slate-800">Chưa có học sinh</h3>
          <p className="mt-2 text-sm text-slate-600">Hiện chưa có dữ liệu học sinh liên kết với tài khoản phụ huynh.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Danh sách thành viên</h2>
        <div className="flex gap-4">
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => setSelectedStudentId(student.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${selectedStudent.id === student.id
                  ? 'bg-[#1e3a8a] text-white shadow-lg shadow-blue-900/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                }`}
            >
              <div className={`p-2 rounded-full ${selectedStudent.id === student.id ? 'bg-white/20' : 'bg-slate-100'}`}>
                <User size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm leading-tight">{student.fullname}</p>
              </div>
              {selectedStudent.id === student.id && <CheckCircle2 size={16} className="ml-2 text-blue-300" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        {/* LEFT COLUMN: Profile Card */}
        <div className="w-full lg:w-[320px]">
          <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm p-6 h-full flex flex-col">
            {/* Avatar Section */}
            <div className="mb-4 flex justify-end">

              {isStudentActive(selectedStudent) && (
                <span className="bg-[#22c55e] text-white text-[10px] font-bold px-2 py-1 rounded-md tracking-tight uppercase shadow-sm">
                  Đang hoạt động
                </span>
              )}
            </div>

            {/* Name Section - Đã lược bỏ ID */}
            <div className="mb-8">
              <h1 className="text-2xl font-black text-slate-900 leading-tight">
                {selectedStudent.fullname}
              </h1>
            </div>

            {/* Info Section - Chỉ giữ Date of Birth và lấp đầy không gian */}
            <div className="space-y-6 pt-6 border-t border-slate-50 flex-grow">
              {selectedStudent.dob && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Calendar className="text-[#1e3a8a]" size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                      Date of Birth
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {formatDate(selectedStudent.dob)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User className="text-[#1e3a8a]" size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-sm font-bold text-slate-700 break-all">
                    {selectedStudent.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User className="text-[#1e3a8a]" size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                    Số điện thoại
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {selectedStudent.phone}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Exam + Courses */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Top: Exam Performance (Reduced height) */}
          <div className="flex flex-col flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Kết quả kì thi đầu vào</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
              <ScoreCard
                title="Reading & Listening"
                score={selectedStudent.scoreRl ?? 0}
                icon={<Headphones size={20} className="text-blue-900" />}
              />

              <ScoreCard
                title="Speaking & Writing"
                score={selectedStudent.scoreSw ?? 0}
                icon={<MessageSquare size={20} className="text-blue-900" />}
              />
            </div>
          </div>

          {/* Bottom: Recent Registered Courses */}
          <div className="flex flex-col flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Các khóa học đã đăng ký</h3>
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex-grow">
              <div className="max-h-[220px] space-y-4 overflow-y-auto pr-1">
                {selectedStudentRecentCourses.map((course, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <BookOpen size={20} className="text-[#1e3a8a]" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{course.name}</p>
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-tight">{course.skill}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${course.status === 'In Progress' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                      {course.status}
                    </span>
                  </div>
                ))}
                {selectedStudentRecentCourses.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500">
                    Học sinh chưa có khóa học đã đăng ký.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScoreCard = ({ title, score, icon }: {
  title: string; score: number; icon: React.ReactNode;
}) => (
  <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col items-center text-center h-full">
    <div className="bg-slate-50 p-3 rounded-full mb-4">
      {icon}
    </div>
    <h4 className="text-sm font-bold text-slate-800 mb-4">{title}</h4>

    <div className="mb-1">
      <span className="text-5xl font-black text-[#1e3a8a]">{score}</span>
    </div>

  </div>
);

export default ChildrenManagement;