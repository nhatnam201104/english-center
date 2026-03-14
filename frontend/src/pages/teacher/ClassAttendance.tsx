import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';

interface AttendanceRecord {
  id: number;
  time: string;
  student: {
    id: number;
    user: {
      id: number;
      fullName: string;
      email: string;
    };
  };
}

interface AttendanceData {
  id: number;
  qrCode: string;
  totalAbsent: number;
  records: AttendanceRecord[];
  scheduleSession: {
    id: number;
    date: string;
    schedule: {
      id: number;
      startTime: string;
      endTime: string;
      totalRegister: number;
      courses: {
        id: number;
        name: string;
      };
    };
  };
}

const ClassAttendance = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [attendance, setAttendance] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [regenerating, setRegenerating] = useState(false);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<AttendanceData>(
        `http://localhost:3000/api/attendance/history/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAttendance(response.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải thông tin điểm danh');
      setLoading(false);
    }
  };

  const handleRegenerateQR = async () => {
    setRegenerating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3000/api/attendance/generate-qr/${sessionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchAttendance();
      setRegenerating(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tạo lại mã QR');
      setRegenerating(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    // Refresh attendance data every 30 seconds
    const interval = setInterval(fetchAttendance, 30000);
    return () => clearInterval(interval);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Lỗi</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!attendance) {
    return null;
  }

  const attendedCount = attendance.records.length;
  const totalCount = attendance.scheduleSession.schedule.totalRegister;
  const absentCount = attendance.totalAbsent;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Điểm Danh Lớp Học
          </h1>
          <p className="text-gray-600">
            {attendance.scheduleSession.schedule.courses.name}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(attendance.scheduleSession.date).toLocaleDateString('vi-VN')} |{' '}
            {attendance.scheduleSession.schedule.startTime} - {attendance.scheduleSession.schedule.endTime}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Code Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Mã QR Điểm Danh
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg flex items-center justify-center mb-4">
                <QRCodeSVG value={attendance.qrCode} size={256} level="H" />
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleRegenerateQR}
                  disabled={regenerating}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {regenerating ? 'Đang tạo...' : 'Tạo lại mã QR'}
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{attendedCount}</div>
                <div className="text-sm text-green-700">Đã điểm danh</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">{absentCount}</div>
                <div className="text-sm text-red-700">Vắng mặt</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{totalCount}</div>
                <div className="text-sm text-blue-700">Tổng số</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-yellow-600 mt-0.5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-yellow-800">
                  Mã QR có hiệu lực trong 30 phút từ khi tạo. Học viên chỉ có thể quét mã một lần.
                </p>
              </div>
            </div>
          </div>

          {/* Attendance List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Danh Sách Điểm Danh
            </h2>
            {attendance.records.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-500">Chưa có học viên điểm danh</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {attendance.records.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold">
                          {record.student.user.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {record.student.user.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.student.user.email}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {record.time}
                      </div>
                      <div className="text-xs text-green-600">Đã điểm danh</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <button
            onClick={fetchAttendance}
            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Làm mới danh sách
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Danh sách sẽ tự động cập nhật sau mỗi 30 giây
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClassAttendance;