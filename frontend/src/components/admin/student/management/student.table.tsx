import { useNavigate } from "react-router-dom";
import { Typography, IconButton, Tooltip, Chip } from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { StudentResponse } from "../../../../types/student/response";

interface StudentTableProps {
  students: StudentResponse[];
  loading: boolean;
  onDelete: (id: number) => void;
}

const TABLE_HEAD = ["Họ Tên", "Email", "Số Điện Thoại", "CCCD", "Ngày Sinh", "Điểm RL", "Điểm SW", "Thao Tác"];

const StudentTable = ({ students, loading, onDelete }: StudentTableProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
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
              <td colSpan={8} className="p-4 text-center">
                <Typography>Đang tải...</Typography>
              </td>
            </tr>
          ) : students.length === 0 ? (
            <tr>
              <td colSpan={8} className="p-4 text-center">
                <Typography>Không có dữ liệu</Typography>
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <Typography variant="small" className="font-semibold">
                    {student.fullname}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small">{student.email}</Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small">{student.phone}</Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small">{student.cccd || "N/A"}</Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small">{formatDate(student.dob)}</Typography>
                </td>
                <td className="p-4">
                  <Chip value={student.scoreRl.toFixed(1)} color="blue" size="sm" className="w-fit" />
                </td>
                <td className="p-4">
                  <Chip value={student.scoreSw.toFixed(1)} color="purple" size="sm" className="w-fit" />
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Tooltip content="Chỉnh sửa">
                      <IconButton
                        variant="text"
                        color="blue"
                        onClick={() => navigate(`/admin/students/update/${student.id}`)}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip content="Xóa">
                      <IconButton
                        variant="text"
                        color="red"
                        onClick={() => onDelete(student.id)}
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

export default StudentTable;
