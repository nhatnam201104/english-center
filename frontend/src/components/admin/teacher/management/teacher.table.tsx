import { useNavigate } from "react-router-dom";
import {
  Typography,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { TeacherResponse } from "../../../../types/teacher/response";
import { useState } from "react";
import { Calendar } from "lucide-react";
import { createTeacherFreeDayService, getTeacherFreeDayService } from "../../../../services/teacher-freeday.service";

interface TeacherTableProps {
  teachers: TeacherResponse[];
  loading: boolean;
  onDelete: (id: number) => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const WEEK_DAYS = [
  { label: "MON", value: "MONDAY" },
  { label: "TUE", value: "TUESDAY" },
  { label: "WED", value: "WEDNESDAY" },
  { label: "THU", value: "THURSDAY" },
  { label: "FRI", value: "FRIDAY" },
  { label: "SAT", value: "SATURDAY" },
  { label: "SUN", value: "SUNDAY" },
];

const TABLE_HEAD = ["Avatar", "Họ Tên", "Email", "Số Điện Thoại", "Bằng Cấp", "Trạng Thái", "Thao Tác"];

const TeacherTable = ({ teachers, loading, onDelete, onSuccess, onError, }: TeacherTableProps) => {
  const navigate = useNavigate();
  const [openTeacherId, setOpenTeacherId] = useState<number | null>(null);
  const [freeDays, setFreeDays] = useState<
    Record<number, { day: string }[]>
  >({});

  const toggleDay = (teacherId: number, day: string) => {
    setFreeDays((prev) => {
      const current = prev[teacherId] || [];
      const exists = current.some((d) => d.day === day);

      return {
        ...prev,
        [teacherId]: exists
          ? current.filter((d) => d.day !== day)
          : [...current, { day }],
      };
    });
  };

  const fetchTeacherFreeDays = async (teacherId: number) => {
    const res = await getTeacherFreeDayService(teacherId);
    if (!res.success || !res.data) return;
    const { day } = res.data;

    setFreeDays((prev) => ({
      ...prev,
      [teacherId]: day.map((d) => ({ day: d })),
    }));
  };

  const saveTeacherFreeDays = async (teacherId: number) => {
    try {
      const days = freeDays[teacherId] || [];

      await createTeacherFreeDayService(teacherId, {
        freeDays: days,
      });

      onSuccess("Cập nhật ngày rảnh giáo viên thành công!");
      onError("");
      setOpenTeacherId(null);

    } catch (error: any) {

      onError(
        error?.message ||
        error?.response?.data?.message ||
        "Không thể cập nhật ngày rảnh giáo viên!"
      );
      onSuccess("");
    }
  };

  return (
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
              <td colSpan={7} className="p-4 text-center">
                <Typography>Đang tải...</Typography>
              </td>
            </tr>
          ) : teachers.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-4 text-center">
                <Typography>Không có dữ liệu</Typography>
              </td>
            </tr>
          ) : (
            teachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <Avatar
                    src={teacher.avatar || "/default-avatar.png"}
                    alt={teacher.fullname}
                    size="md"
                  />
                </td>
                <td className="p-4">
                  <Typography variant="small" className="font-semibold">
                    {teacher.fullname}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small">{teacher.email}</Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small">{teacher.phone}</Typography>
                </td>
                <td className="p-4">
                  <Chip value={teacher.degree} color="blue" size="sm" className="w-fit" />
                </td>
                <td className="p-4">
                  <Chip
                    value={teacher.isTeaching ? "Đang dạy" : "Không dạy"}
                    color={teacher.isTeaching ? "green" : "gray"}
                    size="sm"
                    className="w-fit"
                  />
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Tooltip content="Chỉnh sửa">
                      <IconButton
                        variant="text"
                        color="blue"
                        onClick={() => navigate(`/admin/teachers/update/${teacher.id}`)}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip content="Xóa">
                      <IconButton
                        variant="text"
                        color="red"
                        onClick={() => onDelete(teacher.id)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip content="Ngày rảnh">
                      <IconButton
                        variant="text"
                        color="green"
                        onClick={async () => {
                          if (openTeacherId === teacher.id) {
                            setOpenTeacherId(null);
                            return;
                          }
                          setOpenTeacherId(teacher.id);
                          await fetchTeacherFreeDays(teacher.id);
                        }}
                      >

                        <Calendar size={20} className="text-green-500" />
                      </IconButton>

                    </Tooltip>
                  </div>
                  {openTeacherId === teacher.id && (
                    <div className="absolute z-20 mt-2 rounded-lg border bg-white p-2 shadow-lg">
                      <div className="grid grid-cols-4 grid-rows-2 gap-1">
                        {WEEK_DAYS.map((day) => {
                          const active =
                            freeDays[teacher.id]?.some((d) => d.day === day.value) || false;

                          const isSunday = day.value === "SUNDAY";

                          return (
                            <button
                              key={day.value}
                              onClick={() => toggleDay(teacher.id, day.value)}
                              className={`min-w-[42px] h-8 border text-xs font-semibold transition-all duration-150
                                ${isSunday ? "col-start-4 row-start-1" : ""}
                                ${active
                                  ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
                                  : "bg-white text-red-600 border-red-300 hover:bg-red-50"
                                }
                              `}
                            >
                              {day.label}
                            </button>
                          );
                        })}

                        {/* Nút Lưu */}
                        <button
                          className="col-start-4 row-start-2 h-8border border-blue-600 bg-blue-600 text-white
                            text-xs font-semibold hover:bg-blue-700 transition"
                          onClick={() => saveTeacherFreeDays(teacher.id)}
                        >
                          Lưu
                        </button>

                      </div>
                    </div>
                  )}

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherTable;
