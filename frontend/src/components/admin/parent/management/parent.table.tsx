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

const ParentTable = ({ parents, loading, onDelete, onLinkedSuccess }: ParentTableProps) => {
  const navigate = useNavigate();
  const [allStudents, setAllStudents] = useState<StudentResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<ParentResponse | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [linking, setLinking] = useState(false);
  const [unlinkingStudentId, setUnlinkingStudentId] = useState<number | null>(null);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await getAllStudentsService({ page: 1, limit: 500 });
        setAllStudents(response.data?.data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách học sinh:", error);
      }
    };

    loadStudents();
  }, []);

  const availableStudents = useMemo(() => {
    if (!selectedParent) {
      return [];
    }

    const linkedStudentIds = new Set((selectedParent.students || []).map((student) => student.id));
    return allStudents.filter((student) => !linkedStudentIds.has(student.id));
  }, [allStudents, selectedParent]);

  const handleOpenLinkModal = (parent: ParentResponse) => {
    const linkedStudentIds = new Set((parent.students || []).map((student) => student.id));
    const notLinkedStudents = allStudents.filter((student) => !linkedStudentIds.has(student.id));

    setSelectedParent(parent);
    setSelectedStudentId(notLinkedStudents[0] ? String(notLinkedStudents[0].id) : "");
    setModalError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedParent(null);
    setSelectedStudentId("");
    setModalError("");
    setUnlinkingStudentId(null);
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
        const linkedStudent = allStudents.find((student) => student.id === studentId);
        if (linkedStudent) {
          const nextSelectedParent: ParentResponse = {
            ...selectedParent,
            students: [...(selectedParent.students || []), linkedStudent],
          };
          setSelectedParent(nextSelectedParent);

          const linkedIds = new Set((nextSelectedParent.students || []).map((student) => student.id));
          const nextAvailable = allStudents.find((student) => !linkedIds.has(student.id));
          setSelectedStudentId(nextAvailable ? String(nextAvailable.id) : "");
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
              <label className="mb-1 block text-sm font-medium text-gray-700">Chọn học sinh</label>
              <select
                value={selectedStudentId}
                onChange={(event) => setSelectedStudentId(event.target.value)}
                disabled={availableStudents.length === 0}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none transition-colors focus:border-purple-500"
              >
                {availableStudents.length === 0 ? (
                  <option value="">Không còn học sinh chưa liên kết</option>
                ) : (
                  availableStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.fullname} - {student.phone}
                    </option>
                  ))
                )}
              </select>
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
