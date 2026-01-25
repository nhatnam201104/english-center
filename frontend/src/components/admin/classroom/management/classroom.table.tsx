import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Classroom } from "../../../../types/classroom/response";

interface ClassroomTableProps {
  classrooms: Classroom[];
  loading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ClassroomTable: React.FC<ClassroomTableProps> = ({
  classrooms,
  loading,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-200 border-t-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!Array.isArray(classrooms) || classrooms.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>Chưa có lớp học nào.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tên
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sức Chứa
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày Tạo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày Cập Nhật
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hành Động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.isArray(classrooms) &&
            classrooms.map((classroom) => (
              <tr
                key={classroom.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {classroom.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {classroom.maxSize ?? 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(classroom.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {classroom.updatedAt
                    ? new Date(classroom.updatedAt).toLocaleDateString("vi-VN")
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(classroom.id)}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                    title="Cập nhật"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(classroom.id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded transition-colors ml-2"
                    title="Xóa"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassroomTable;
