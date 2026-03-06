/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from "react";
import { Users, UserPlus, X, Search, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import type { StudentResponse } from "../../../../types/student/response";
import { getAllStudentsService } from "../../../../services/student.service";
import {
  getScheduleStudents,
  addStudentToSchedule,
  removeStudentFromSchedule,
} from "../../../../services/schedule.service";

interface Props {
  scheduleId: number;
  totalSlot: number;
}

const StudentManagement = ({ scheduleId, totalSlot }: Props) => {
  // ── enrolled list state ──────────────────────────────────────────
  const [enrolled, setEnrolled] = useState<StudentResponse[]>([]);
  const [enrolledTotal, setEnrolledTotal] = useState(0);
  const [enrolledPage, setEnrolledPage] = useState(1);
  const [enrolledPages, setEnrolledPages] = useState(1);
  const [enrolledLoading, setEnrolledLoading] = useState(false);

  // ── modal state ──────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [allStudents, setAllStudents] = useState<StudentResponse[]>([]);
  const [allTotal, setAllTotal] = useState(0);
  const [allPage, setAllPage] = useState(1);
  const [allPages, setAllPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [adding, setAdding] = useState<number | null>(null);
  const [removing, setRemoving] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── fetch enrolled ───────────────────────────────────────────────
  const fetchEnrolled = useCallback(async (page = 1) => {
    setEnrolledLoading(true);
    try {
      const res = await getScheduleStudents(scheduleId, { page, limit: 8 });
      if (res.success && res.data) {
        setEnrolled(res.data.data);
        setEnrolledTotal(res.data.totalItems);
        setEnrolledPages(res.data.totalPages);
        setEnrolledPage(page);
      }
    } catch {
      /* ignore */
    } finally {
      setEnrolledLoading(false);
    }
  }, [scheduleId]);

  useEffect(() => { fetchEnrolled(1); }, [fetchEnrolled]);

  // ── fetch all students for modal ─────────────────────────────────
  const fetchAll = useCallback(async (page = 1, q = debouncedSearch) => {
    setModalLoading(true);
    try {
      const res = await getAllStudentsService({ page, limit: 6, search: q || undefined });
      if (res.success && res.data) {
        setAllStudents(res.data.data);
        setAllTotal(res.data.pagination.totalItems);
        setAllPages(res.data.pagination.totalPages);
        setAllPage(page);
      }
    } catch {
      /* ignore */
    } finally {
      setModalLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (modalOpen) fetchAll(1, debouncedSearch);
  }, [modalOpen, debouncedSearch, fetchAll]);

  // debounce search input
  const handleSearchChange = (v: string) => {
    setSearch(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(v), 400);
  };

  // ── add student ──────────────────────────────────────────────────
  const handleAdd = async (studentId: number) => {
    setAdding(studentId);
    try {
      const res = await addStudentToSchedule(scheduleId, studentId);
      if (res.success) {
        await fetchEnrolled(enrolledPage);
        await fetchAll(allPage, debouncedSearch);
      } else {
        alert(res.message || "Thêm học sinh thất bại");
      }
    } catch (e: any) {
      alert(e?.response?.data?.message || "Thêm học sinh thất bại");
    } finally {
      setAdding(null);
    }
  };

  // ── remove student ───────────────────────────────────────────────
  const handleRemove = async (student: StudentResponse) => {
    const ok = confirm(`Bạn có chắc muốn xóa học sinh "${student.fullname}" khỏi lớp học này?`);
    if (!ok) return;
    setRemoving(student.id);
    try {
      const res = await removeStudentFromSchedule(scheduleId, student.id);
      if (res.success) {
        const newPage = enrolled.length === 1 && enrolledPage > 1 ? enrolledPage - 1 : enrolledPage;
        await fetchEnrolled(newPage);
      } else {
        alert(res.message || "Xóa học sinh thất bại");
      }
    } catch (e: any) {
      alert(e?.response?.data?.message || "Xóa học sinh thất bại");
    } finally {
      setRemoving(null);
    }
  };

  // is student already enrolled?
  const enrolledIds = new Set(enrolled.map((s) => s.id));

  return (
    <>
      {/* ── Main Card ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-slate-50">
          <div>
            <h2 className="font-bold text-slate-700">Quản lý học viên</h2>
            <p className="text-sm text-slate-400">
              {enrolledTotal}/{totalSlot} học viên đã đăng ký
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <UserPlus size={16} /> Thêm học viên
          </button>
        </div>

        {enrolledLoading ? (
          <div className="py-16 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : enrolled.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-center">
            <Users size={32} className="text-slate-200 mb-3" />
            <h3 className="text-base font-semibold text-slate-500">Chưa có học sinh nào trong lớp</h3>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left">Họ tên</th>
                  <th className="px-5 py-3 text-left">Email</th>
                  <th className="px-5 py-3 text-left">SĐT</th>
                  <th className="px-5 py-3 text-center">LR</th>
                  <th className="px-5 py-3 text-center">SW</th>
                  <th className="px-5 py-3 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {enrolled.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-800">{s.fullname}</td>
                    <td className="px-5 py-3 text-gray-500">{s.email}</td>
                    <td className="px-5 py-3 text-gray-500">{s.phone}</td>
                    <td className="px-5 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs">{s.scoreRl}</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-xs">{s.scoreSw}</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => handleRemove(s)}
                        disabled={removing === s.id}
                        className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
                        title="Xóa khỏi lớp"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* enrolled pagination */}
            {enrolledPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50 text-xs text-gray-500">
                <span>Trang {enrolledPage}/{enrolledPages} ({enrolledTotal} học sinh)</span>
                <div className="flex gap-1">
                  <button
                    disabled={enrolledPage <= 1}
                    onClick={() => fetchEnrolled(enrolledPage - 1)}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-40"
                  ><ChevronLeft size={14} /></button>
                  <button
                    disabled={enrolledPage >= enrolledPages}
                    onClick={() => fetchEnrolled(enrolledPage + 1)}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-40"
                  ><ChevronRight size={14} /></button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modal ─────────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh]">
            {/* modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-800 text-lg">Tìm & Thêm học viên</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Sĩ số hiện tại: {enrolledTotal}/{totalSlot}
                </p>
              </div>
              <button
                onClick={() => { setModalOpen(false); setSearch(""); setDebouncedSearch(""); }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* search bar */}
            <div className="px-6 py-3 border-b border-gray-50">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Tìm theo tên, email, số điện thoại..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
                {search && (
                  <button
                    onClick={() => handleSearchChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* student list */}
            <div className="flex-1 overflow-y-auto px-6 py-3">
              {modalLoading ? (
                <div className="py-12 flex justify-center">
                  <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600" />
                </div>
              ) : allStudents.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                  Không tìm thấy học sinh nào
                </div>
              ) : (
                <div className="space-y-2">
                  {allStudents.map((s) => {
                    const alreadyIn = enrolledIds.has(s.id);
                    const isFull = enrolledTotal >= totalSlot;
                    return (
                      <div
                        key={s.id}
                        className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate">{s.fullname}</p>
                          <p className="text-xs text-gray-400 truncate">{s.email} · {s.phone}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right text-xs">
                            <span className="text-blue-600 font-semibold">LR {s.scoreRl}</span>
                            <span className="text-gray-400 mx-1">·</span>
                            <span className="text-indigo-600 font-semibold">SW {s.scoreSw}</span>
                          </div>
                          {alreadyIn ? (
                            <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold whitespace-nowrap">
                              Đã thêm
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAdd(s.id)}
                              disabled={adding === s.id || isFull}
                              title={isFull ? "Lớp đã đủ sĩ số" : "Thêm vào lớp"}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {adding === s.id
                                ? <div className="h-3 w-3 border-b border-white rounded-full animate-spin" />
                                : <Plus size={13} />}
                              Thêm
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* modal pagination */}
            {allPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 text-xs text-gray-500">
                <span>Trang {allPage}/{allPages} ({allTotal} học sinh)</span>
                <div className="flex gap-1">
                  <button
                    disabled={allPage <= 1}
                    onClick={() => fetchAll(allPage - 1, debouncedSearch)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40"
                  ><ChevronLeft size={14} /></button>
                  <button
                    disabled={allPage >= allPages}
                    onClick={() => fetchAll(allPage + 1, debouncedSearch)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40"
                  ><ChevronRight size={14} /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StudentManagement;
