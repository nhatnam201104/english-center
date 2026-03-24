import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, IconButton, Tooltip, Chip } from "@material-tailwind/react";
import {
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import {
  linkStudentToParentService,
  unlinkStudentFromParentService,
} from "../../../../services/parent.service";
import { getAllStudentsService } from "../../../../services/student.service";
import { useDebounce } from "../../../../helpers/useDebounce";
import type { ParentResponse } from "../../../../types/parent/response";
import type { StudentResponse } from "../../../../types/student/response";

interface ParentTableProps {
  parents: ParentResponse[];
  loading: boolean;
  onDelete: (id: number) => void;
  onLinkedSuccess: () => void;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const TABLE_HEAD = ["Họ Tên", "Email", "Số Điện Thoại", "Số Học Sinh", "Thao Tác"];
const STUDENTS_PER_PAGE = 20;

const ParentTable = ({ parents, loading, onDelete, onLinkedSuccess }: ParentTableProps) => {
  const navigate = useNavigate();
  const [studentOptions, setStudentOptions] = useState<StudentResponse[]>([]);
  const [studentPage, setStudentPage] = useState(1);
  const [studentTotalPages, setStudentTotalPages] = useState(1);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingMoreStudents, setLoadingMoreStudents] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<ParentResponse | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [studentSearchKeyword, setStudentSearchKeyword] = useState("");
  const debouncedStudentSearchKeyword = useDebounce(studentSearchKeyword);
  const [linking, setLinking] = useState(false);
  const [unlinkingStudentId, setUnlinkingStudentId] = useState<number | null>(null);
  const [modalError, setModalError] = useState("");

  const linkedStudentIds = useMemo(
    () => new Set((selectedParent?.students || []).map((student) => student.id)),
    [selectedParent],
  );

  const fetchStudents = async (page: number, append: boolean) => {
    try {
      if (append) {
        setLoadingMoreStudents(true);
      } else {
        setLoadingStudents(true);
      }

      const response = await getAllStudentsService({
        page,
        limit: STUDENTS_PER_PAGE,
        search: debouncedStudentSearchKeyword.trim() || undefined,
      });

      const nextStudents = response.data?.data || [];

      setStudentOptions((prevStudents) => {
        if (!append) {
          return nextStudents;
        }

        const merged = [...prevStudents, ...nextStudents];
        const uniqueById = new Map<number, StudentResponse>();
        merged.forEach((student) => uniqueById.set(student.id, student));
        return Array.from(uniqueById.values());
      });
      setStudentPage(page);
      setStudentTotalPages(response.data?.totalPages || 1);
      setModalError("");
    } catch (error) {
      console.error("Lỗi khi tải danh sách học sinh:", error);
      setModalError("Không thể tải danh sách học sinh.");
    } finally {
      setLoadingStudents(false);
      setLoadingMoreStudents(false);
    }
  };

  useEffect(() => {
    if (!isModalOpen || !selectedParent) {
      return;
    }

    setStudentPage(1);
    setStudentTotalPages(1);
    fetchStudents(1, false);
  }, [isModalOpen, selectedParent?.id, debouncedStudentSearchKeyword]);

  const availableStudents = useMemo(() => {
    if (!selectedParent) {
      return [];
    }

    return studentOptions.filter((student) => !linkedStudentIds.has(student.id));
  }, [studentOptions, selectedParent, linkedStudentIds]);

  const filteredAvailableStudents = useMemo(() => {
    const keyword = studentSearchKeyword.trim().toLowerCase();
    if (!keyword) {
      return availableStudents;
    }

    return availableStudents.filter((student) => {
      return (
        student.fullname.toLowerCase().includes(keyword)
        || student.email.toLowerCase().includes(keyword)
        || student.phone.toLowerCase().includes(keyword)
      );
    });
  }, [availableStudents, studentSearchKeyword]);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    if (filteredAvailableStudents.length === 0) {
      setSelectedStudentId("");
      return;
    }

    const stillInFilteredList = filteredAvailableStudents.some(
      (student) => String(student.id) === selectedStudentId,
    );

    if (!stillInFilteredList) {
      setSelectedStudentId(String(filteredAvailableStudents[0].id));
    }
  }, [filteredAvailableStudents, isModalOpen, selectedStudentId]);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    if (availableStudents.length === 0) {
      setSelectedStudentId("");
      return;
    }

    const isStillAvailable = availableStudents.some(
      (student) => String(student.id) === selectedStudentId,
    );

    if (!isStillAvailable) {
      setSelectedStudentId(String(availableStudents[0].id));
    }
  }, [availableStudents, isModalOpen, selectedStudentId]);

  const handleOpenLinkModal = (parent: ParentResponse) => {
    const linkedStudentIds = new Set((parent.students || []).map((student) => student.id));
    const notLinkedStudents = studentOptions.filter((student) => !linkedStudentIds.has(student.id));

    setSelectedParent(parent);
    setSelectedStudentId(notLinkedStudents[0] ? String(notLinkedStudents[0].id) : "");
    setStudentSearchKeyword("");
    setModalError("");
    setStudentOptions([]);
    setStudentPage(1);
    setStudentTotalPages(1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedParent(null);
    setSelectedStudentId("");
    setStudentSearchKeyword("");
    setStudentOptions([]);
    setStudentPage(1);
    setStudentTotalPages(1);
    setModalError("");
    setUnlinkingStudentId(null);
    setLoadingStudents(false);
    setLoadingMoreStudents(false);
  };

  const handleLinkStudent = async () => {
    if (!selectedParent) {
      setModalError("Không tìm thấy phụ huynh để liên kết");
      return;
    }

    const studentId = Number(selectedStudentId);
    if (!studentId || Number.isNaN(studentId)) {
      setModalError("Vui lòng chọn học sinh");
      return;
    }

    try {
      setLinking(true);
      setModalError("");

      const response = await linkStudentToParentService(selectedParent.id, studentId);
      if (response.success) {
        const linkedStudent = studentOptions.find((student) => student.id === studentId);
        if (linkedStudent) {
          const nextSelectedParent: ParentResponse = {
            ...selectedParent,
            students: [...(selectedParent.students || []), linkedStudent],
          };
          setSelectedParent(nextSelectedParent);

          const linkedIds = new Set((nextSelectedParent.students || []).map((student) => student.id));
          const nextAvailable = studentOptions.find((student) => !linkedIds.has(student.id));
          setSelectedStudentId(nextAvailable ? String(nextAvailable.id) : "");
          setStudentSearchKeyword("");
        }

        alert("Liên kết học sinh thành công!");
        onLinkedSuccess();
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setModalError(apiError.response?.data?.message || "Liên kết học sinh thất bại!");
    } finally {
      setLinking(false);
    }
  };

  const handleUnlinkStudent = async (studentId: number) => {
    if (!selectedParent) {
      setModalError("Không tìm thấy phụ huynh để hủy liên kết");
      return;
    }

    if (!window.confirm("Bạn có chắc muốn hủy liên kết học sinh này?")) {
      return;
    }

    try {
      setUnlinkingStudentId(studentId);
      setModalError("");

      const response = await unlinkStudentFromParentService(selectedParent.id, studentId);
      if (response.success) {
        const nextStudents = (selectedParent.students || []).filter(
          (student) => student.id !== studentId,
        );
        const nextSelectedParent: ParentResponse = {
          ...selectedParent,
          students: nextStudents,
        };

        setSelectedParent(nextSelectedParent);

        if (!selectedStudentId) {
          setSelectedStudentId(String(studentId));
        }

        onLinkedSuccess();
        alert("Hủy liên kết học sinh thành công!");
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setModalError(apiError.response?.data?.message || "Hủy liên kết học sinh thất bại!");
    } finally {
      setUnlinkingStudentId(null);
    }
  };

  const handleStudentListScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;

    if (loadingStudents || loadingMoreStudents) {
      return;
    }

    if (studentPage >= studentTotalPages) {
      return;
    }

    const reachedBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 12;
    if (!reachedBottom) {
      return;
    }

    fetchStudents(studentPage + 1, true);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="border-b border-gray-300 bg-gray-50 p-4">
                  <Typography variant="small" className="font-bold leading-none text-gray-900">
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  <Typography>Đang tải...</Typography>
                </td>
              </tr>
            ) : parents.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  <Typography>Không có dữ liệu</Typography>
                </td>
              </tr>
            ) : (
              parents.map((parent) => (
                <tr key={parent.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <Typography variant="small" className="font-semibold">
                      {parent.fullname}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small">{parent.email}</Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small">{parent.phone}</Typography>
                  </td>
                  <td className="p-4">
                    <Chip
                      icon={<UserGroupIcon className="h-4 w-4" />}
                      value={`${parent.students?.length || 0} học sinh`}
                      color="purple"
                      size="sm"
                      className="w-fit"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Tooltip content="Liên kết học sinh">
                        <IconButton
                          variant="text"
                          color="green"
                          onClick={() => handleOpenLinkModal(parent)}
                        >
                          <UserPlusIcon className="h-5 w-5" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Chỉnh sửa">
                        <IconButton
                          variant="text"
                          color="blue"
                          onClick={() => navigate(`/admin/parents/update/${parent.id}`)}
                        >
                          <PencilIcon className="h-5 w-5" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Xóa">
                        <IconButton
                          variant="text"
                          color="red"
                          onClick={() => onDelete(parent.id)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedParent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <Typography variant="h6" className="text-gray-900">
              Liên kết học sinh cho phụ huynh
            </Typography>
            <Typography variant="small" className="mt-1 text-gray-600">
              Phụ huynh: {selectedParent.fullname}
            </Typography>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">Tìm học sinh để liên kết</label>
              <input
                type="text"
                value={studentSearchKeyword}
                onChange={(event) => setStudentSearchKeyword(event.target.value)}
                placeholder="Nhập tên, email hoặc số điện thoại..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition-colors focus:border-purple-500"
              />

              {loadingStudents ? (
                <div className="mt-2 rounded-lg border border-gray-200 px-3 py-4 text-center text-sm text-gray-500">
                  Đang tải danh sách học sinh...
                </div>
              ) : availableStudents.length === 0 ? (
                <Typography variant="small" className="mt-2 text-gray-500">
                  Không còn học sinh chưa liên kết.
                </Typography>
              ) : (
                <div
                  onScroll={handleStudentListScroll}
                  className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-gray-200"
                >
                  {filteredAvailableStudents.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Không tìm thấy học sinh phù hợp.
                    </div>
                  ) : (
                    filteredAvailableStudents.map((student) => {
                      const isSelected = String(student.id) === selectedStudentId;

                      return (
                        <button
                          key={student.id}
                          type="button"
                          onClick={() => setSelectedStudentId(String(student.id))}
                          className={`w-full border-b border-gray-100 px-3 py-2 text-left transition-colors last:border-b-0 ${isSelected ? "bg-purple-50" : "hover:bg-gray-50"}`}
                        >
                          <p className="text-sm font-medium text-gray-900">{student.fullname}</p>
                          <p className="text-xs text-gray-600">{student.phone} • {student.email}</p>
                        </button>
                      );
                    })
                  )}

                  {loadingMoreStudents ? (
                    <div className="px-3 py-2 text-center text-sm text-gray-500">
                      Đang tải thêm học sinh...
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <div className="mt-5 rounded-lg border border-gray-200 p-3">
              <Typography variant="small" className="font-semibold text-gray-800">
                Học sinh đã liên kết
              </Typography>

              {selectedParent.students && selectedParent.students.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {selectedParent.students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{student.fullname}</p>
                        <p className="text-xs text-gray-600">{student.phone}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUnlinkStudent(student.id)}
                        disabled={unlinkingStudentId === student.id}
                        className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {unlinkingStudentId === student.id ? "Đang hủy..." : "Hủy liên kết"}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <Typography variant="small" className="mt-2 text-gray-500">
                  Chưa có học sinh nào được liên kết.
                </Typography>
              )}
            </div>

            {modalError ? (
              <Typography variant="small" className="mt-3 text-red-500">
                {modalError}
              </Typography>
            ) : null}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={linking}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleLinkStudent}
                disabled={linking || availableStudents.length === 0}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
              >
                {linking ? "Đang liên kết..." : "Liên kết"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ParentTable;
