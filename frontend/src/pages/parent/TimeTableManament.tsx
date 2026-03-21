import { Fragment, useEffect, useMemo, useState } from 'react';
import { CalendarDays, GraduationCap, MapPin, User } from 'lucide-react';
import { getStudentsByParentMeService } from '../../services/student.service';
import { getSchedulesByStudentId, type StudentScheduleByIdResponse } from '../../services/schedule.service';
import formatDate from '../../helpers/formatDate';
import { TIME_SLOTS_90, TIME_SLOTS_120 } from '../../types/schedule/slot-time.type';
import type { StudentResponse } from '../../types/student/response';

const dayLabelMap: Record<string, string> = {
  MONDAY: 'Thứ 2',
  TUESDAY: 'Thứ 3',
  WEDNESDAY: 'Thứ 4',
  THURSDAY: 'Thứ 5',
  FRIDAY: 'Thứ 6',
  SATURDAY: 'Thứ 7',
  SUNDAY: 'Chủ nhật',
};

const orderedDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const createSlotKey = (from: string, to: string) => `${from}-${to}`;

const TimeTableManament = () => {
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentSchedules, setStudentSchedules] = useState<StudentScheduleByIdResponse[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        const response = await getStudentsByParentMeService();
        const list = Array.isArray(response.data) ? response.data : [];
        setStudents(list);
        setSelectedStudentId(list[0]?.id ?? null);
      } catch (error) {
        console.error('Load students by parent failed:', error);
        setStudents([]);
        setSelectedStudentId(null);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (!selectedStudentId) {
      setStudentSchedules([]);
      return;
    }

    const fetchSchedules = async () => {
      try {
        setLoadingSchedules(true);
        const response = await getSchedulesByStudentId(selectedStudentId);
        const list = Array.isArray(response.data?.data) ? response.data.data : [];
        setStudentSchedules(list);
      } catch (error) {
        console.error(`Load schedules for student ${selectedStudentId} failed:`, error);
        setStudentSchedules([]);
      } finally {
        setLoadingSchedules(false);
      }
    };

    fetchSchedules();
  }, [selectedStudentId]);

  const selectedStudent = useMemo(
    () => students.find((student) => student.id === selectedStudentId) ?? null,
    [students, selectedStudentId],
  );

  const timetableEntries = useMemo(
    () => studentSchedules.flatMap((schedule) =>
      schedule.sessions.map((session) => ({
        key: `${schedule.id}-${session.id}`,
        slotKey: createSlotKey(session.startTime, session.endTime),
        day: session.day,
        startTime: session.startTime,
        endTime: session.endTime,
        courseName: schedule.course?.name || 'Khóa học',
        courseSkill: schedule.course?.courseSkill?.replace(/_/g, ' & ') || 'General',
        teacherName: schedule.teacher?.fullname || '--',
        classroomName: schedule.classroom?.name || '--',
        courseThumbnail: schedule.course?.thumbnail || 'https://placehold.co/600x400@2x.png',
        courseStartDate: schedule.startTime,
        courseEndDate: schedule.endTime,
      })),
    ),
    [studentSchedules],
  );

  const timeSlots = useMemo(() => {
    const slotMap = new Map<string, { key: string; label: string; from: string; to: string }>();

    for (const slot of [...TIME_SLOTS_90, ...TIME_SLOTS_120]) {
      slotMap.set(createSlotKey(slot.from, slot.to), {
        key: createSlotKey(slot.from, slot.to),
        label: slot.label,
        from: slot.from,
        to: slot.to,
      });
    }

    for (const entry of timetableEntries) {
      if (!slotMap.has(entry.slotKey)) {
        slotMap.set(entry.slotKey, {
          key: entry.slotKey,
          label: `${entry.startTime} - ${entry.endTime}`,
          from: entry.startTime,
          to: entry.endTime,
        });
      }
    }

    return [...slotMap.values()].sort((left, right) => {
      const startDiff = toMinutes(left.from) - toMinutes(right.from);
      if (startDiff !== 0) {
        return startDiff;
      }

      return toMinutes(left.to) - toMinutes(right.to);
    });
  }, [timetableEntries]);

  const timetableGrid = useMemo(() => {
    const grid = Object.fromEntries(
      orderedDays.map((day) => [day, {} as Record<string, Array<{
      key: string;
      day: string;
      startTime: string;
      endTime: string;
      courseName: string;
      courseSkill: string;
      teacherName: string;
      classroomName: string;
      courseThumbnail: string;
      courseStartDate: string;
      courseEndDate: string;
      }>>]),
    ) as Record<string, Record<string, Array<{
      key: string;
      day: string;
      startTime: string;
      endTime: string;
      courseName: string;
      courseSkill: string;
      teacherName: string;
      classroomName: string;
      courseThumbnail: string;
      courseStartDate: string;
      courseEndDate: string;
    }>>>;

    for (const entry of timetableEntries) {
      if (!grid[entry.day][entry.slotKey]) {
        grid[entry.day][entry.slotKey] = [];
      }

      grid[entry.day][entry.slotKey].push(entry);
    }

    for (const day of orderedDays) {
      for (const slot of Object.keys(grid[day])) {
        grid[day][slot].sort((left, right) => left.courseName.localeCompare(right.courseName));
      }
    }

    return grid;
  }, [timetableEntries]);

  const totalSessions = useMemo(
    () => timetableEntries.length,
    [timetableEntries],
  );

  const activeDaysCount = useMemo(
    () => orderedDays.filter((day) => timetableEntries.some((entry) => entry.day === day)).length,
    [timetableEntries],
  );

  return (
    <div className="bg-slate-50 p-8">
      <div className="mx-auto w-full max-w-none">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2 text-blue-700">
            <CalendarDays size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Time Table Management</h1>
            <p className="text-sm text-slate-500">Danh sách con để theo dõi lịch học.</p>
          </div>
        </div>

        {loadingStudents ? (
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
        ) : students.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
            Chưa có học sinh liên kết với tài khoản phụ huynh.
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Danh sách thành viên</h2>
              <div className="flex flex-wrap gap-4">
                {students.map((student) => {
                  const isActive = selectedStudentId === student.id;

                  return (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudentId(student.id)}
                      className={`flex items-center gap-3 rounded-xl px-6 py-3 transition-all ${
                        isActive
                          ? 'bg-[#1e3a8a] text-white shadow-lg shadow-blue-900/20'
                          : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                      }`}
                    >
                      <div className={`rounded-full p-2 ${isActive ? 'bg-white/20' : 'bg-slate-100 text-slate-700'}`}>
                        <User size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold leading-tight">{student.fullname}</p>
                        <p className={`text-xs ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>{student.email}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedStudent?.fullname ?? 'Thời khóa biểu học sinh'}</h2>
                </div>
              </div>

              {loadingSchedules ? (
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                  Đang tải thời khóa biểu...
                </div>
              ) : studentSchedules.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                  Học sinh này hiện chưa có lịch học.
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tổng khóa học</p>
                      <p className="mt-2 text-3xl font-black text-slate-900">{studentSchedules.length}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tổng ca học</p>
                      <p className="mt-2 text-3xl font-black text-slate-900">{totalSessions}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Số ngày có lớp</p>
                      <p className="mt-2 text-3xl font-black text-slate-900">{activeDaysCount}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="grid min-w-[1180px] grid-cols-[180px_repeat(7,minmax(0,1fr))] gap-3">
                      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                        <p className="text-sm font-bold text-slate-900">Khung giờ</p>
                      </div>

                      {orderedDays.map((day) => (
                        <div key={day} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center">
                          <p className="text-sm font-bold text-slate-900">{dayLabelMap[day]}</p>
                          <p className="text-xs text-slate-400">
                            {timetableEntries.filter((entry) => entry.day === day).length} ca học
                          </p>
                        </div>
                      ))}

                      {timeSlots.map((slot) => (
                        <Fragment key={slot.key}>
                          <div key={`slot-${slot.key}`} className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                            <p className="text-sm font-bold text-slate-900">{slot.label}</p>
                            <p className="mt-1 text-xs text-slate-400">{slot.from} đến {slot.to}</p>
                          </div>

                          {orderedDays.map((day) => {
                            const sessions = timetableGrid[day]?.[slot.key] ?? [];

                            return (
                              <div
                                key={`${day}-${slot.key}`}
                                className="min-h-[180px] rounded-2xl border border-slate-200 bg-white p-3"
                              >
                                {sessions.length === 0 ? (
                                  <div className="flex h-full min-h-[150px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 text-center text-xs text-slate-400">
                                    Trống
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    {sessions.map((session) => (
                                      <div key={session.key} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                        {/* <img
                                          src={session.courseThumbnail}
                                          alt={session.courseName}
                                          className="h-20 w-full object-cover"
                                        /> */}
                                        <div className="space-y-2 p-3">
                                          <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                                              {session.courseSkill}
                                            </p>
                                            <h3 className="mt-1 text-sm font-bold leading-5 text-slate-900">{session.courseName}</h3>
                                          </div>
                                          <div className="flex items-start gap-2 text-xs text-slate-600">
                                            <GraduationCap size={14} className="mt-0.5 text-slate-400" />
                                            <span>{session.teacherName}</span>
                                          </div>
                                          <div className="flex items-start gap-2 text-xs text-slate-600">
                                            <MapPin size={14} className="mt-0.5 text-slate-400" />
                                            <span>{session.classroomName}</span>
                                          </div>
                                          <p className="text-[11px] text-slate-400">
                                            {formatDate(session.courseStartDate)} - {formatDate(session.courseEndDate)}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTableManament;
