import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../stores/auth.store';
import { getStudentSchedules } from '../../services/schedule.service';
import type { ScheduleResponse, ScheduleListResponse } from '../../types/schedule/schedule.response';

export const Schedule = () => {
  const { user } = useAuthStore();
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await getStudentSchedules(currentPage, 10);
        if (res.success && res.data) {
          setSchedules(res.data.data);
          setTotalPages(res.data.totalPages);
        }
      } catch (err: any) {
        console.error('Error fetching schedules:', err);
        setError('Không thể tải lịch học.');
        toast.error('Không thể tải lịch học', {
          position: 'top-right',
          autoClose: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [user, currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Lỗi</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">
            Lịch học chi tiết
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Tổng số lịch học: {schedules.length}
          </p>
        </div>

        <div className="p-6">
          {schedules.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chưa có lịch học nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">
                        {schedule.course.name}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <strong>Giáo viên:</strong> {schedule.teacher.fullname}
                        </p>
                        <p>
                          <strong>Phòng học:</strong> {schedule.classroom.name}
                        </p>
                        <p>
                          <strong>Thời gian:</strong>{' '}
                          {new Date(schedule.startTime).toLocaleString('vi-VN')} -{' '}
                          {new Date(schedule.endTime).toLocaleString('vi-VN')}
                        </p>
                        <p>
                          <strong>Số buổi:</strong> {schedule.totalSlot}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Đã đăng ký: {schedule.totalRegister}/{schedule.totalSlot}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};