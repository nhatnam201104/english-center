import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { CourseTest } from "../../../../types/coursetest/response";

interface CoursetestTableProps {
  coursetests: CourseTest[];
  loading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const CoursetestTable: React.FC<CoursetestTableProps> = ({
  coursetests,
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

  if (coursetests.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>Chưa có bài kiểm tra nào.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tên Bài Kiểm Tra
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Chỉ Số
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID Khóa Học
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              File Đề
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              File Âm Thanh
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày Tạo
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hành Động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {coursetests.map((coursetest) => (
            <tr
              key={coursetest.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {coursetest.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {coursetest.index}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {coursetest.courseId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {coursetest.fileTest ? (
                  <a
                    href={coursetest.fileTest}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    <span className="flex items-center gap-1">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.707.293H19a2 2 0 012 2v9a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z"
                        />
                      </svg>
                      File
                    </span>
                  </a>
                ) : (
                  <span className="text-gray-400">Không có</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {coursetest.audioTest ? (
                  <a
                    href={coursetest.audioTest}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    <span className="flex items-center gap-1">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891.777 1.336 1.707 1.707l4.707 4.707C19.777 21.336 19 21.336 19 21H6a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C12.336 11.336 12.5 11.664 12.5 12z"
                        />
                      </svg>
                      File
                    </span>
                  </a>
                ) : (
                  <span className="text-gray-400">Không có</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {new Date(coursetest.createdAt).toLocaleDateString("vi-VN")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onEdit(coursetest.id)}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                    title="Sửa"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(coursetest.id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                    title="Xóa"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoursetestTable;
