import { useEffect, useState } from 'react';
import { getGradesService, type GradeData } from '../../services/grade.service';
import { BookOpen, CheckCircle, XCircle, Clock } from 'lucide-react';

export const Grades = () => {
  const [grades, setGrades] = useState<GradeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchGrades = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getGradesService(page, 10);
      if (response.success && response.data) {
        setGrades(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);
        setCurrentPage(response.data.page);
      } else {
        setError('Không thể tải danh sách điểm');
      }
    } catch (err) {
      console.error('Error fetching grades:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades(1);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PASS':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
            <CheckCircle size={16} />
            Đạt
          </span>
        );
      case 'FAIL':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
            <XCircle size={16} />
            Không đạt
          </span>
        );
      case 'NOT_GRADED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
            <Clock size={16} />
            Chưa chấm
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Kết quả học tập
        </h1>
        <p className="text-gray-600">
          Xem điểm số và kết quả học tập của bạn
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchGrades(1)}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      ) : grades.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Chưa có điểm số
          </h3>
          <p className="text-gray-600">
            Bạn chưa có kết quả học tập nào được ghi nhận
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Tên khóa học
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Điểm chuyên cần
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Điểm thi
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Điểm tổng kết
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Kết quả
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Ngày chấm
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {grades.map((grade) => (
                  <tr key={grade.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {grade.courseName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                        {grade.participationScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold">
                        {grade.examScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg">
                        {grade.finalScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(grade.status)}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {formatDate(grade.gradedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Hiển thị {(currentPage - 1) * 10 + 1} -{' '}
                {Math.min(currentPage * 10, totalItems)} trên {totalItems} kết quả
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchGrades(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Trước
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => fetchGrades(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() => fetchGrades(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};