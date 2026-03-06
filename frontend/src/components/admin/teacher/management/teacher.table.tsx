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
interface TeacherTableProps {
  teachers: TeacherResponse[];
  loading: boolean;
  onDelete: (id: number) => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const TABLE_HEAD = ["Avatar", "Họ Tên", "Email", "Số Điện Thoại", "Bằng Cấp", "Trạng Thái", "Thao Tác"];

const TeacherTable = ({ teachers, loading, onDelete }: TeacherTableProps) => {
  const navigate = useNavigate();

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
                  </div>
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
