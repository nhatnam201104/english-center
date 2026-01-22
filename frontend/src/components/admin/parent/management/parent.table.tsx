import { useNavigate } from "react-router-dom";
import { Typography, IconButton, Tooltip, Chip } from "@material-tailwind/react";
import { PencilIcon, TrashIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import type { ParentResponse } from "../../../../types/parent/response";

interface ParentTableProps {
  parents: ParentResponse[];
  loading: boolean;
  onDelete: (id: number) => void;
}

const TABLE_HEAD = ["Họ Tên", "Email", "Số Điện Thoại", "Số Học Sinh", "Thao Tác"];

const ParentTable = ({ parents, loading, onDelete }: ParentTableProps) => {
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
  );
};

export default ParentTable;
