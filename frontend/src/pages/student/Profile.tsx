import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../stores/auth.store';
import { getStudentMeService, getStudentParentsService } from '../../services/student.service';
import type { StudentResponse } from '../../types/student/response';

interface ParentData {
  id: number;
  fullname: string;
  email: string;
  phone: string;
}

export const Profile = () => {
  const { user } = useAuthStore();
  const [studentData, setStudentData] = useState<StudentResponse | null>(null);
  const [parentsData, setParentsData] = useState<ParentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch student data - dùng /me endpoint
        const studentRes = await getStudentMeService();
        if (studentRes.success && studentRes.data) {
          setStudentData(studentRes.data);
        }

        // Fetch parent data
        const parentsRes = await getStudentParentsService();
        if (parentsRes.success && parentsRes.data) {
          setParentsData(parentsRes.data);
        }

      } catch (err: any) {
        console.error('Error fetching profile data:', err);
        setError('Không thể tải thông tin hồ sơ.');
        toast.error('Không thể tải thông tin hồ sơ', {
          position: 'top-right',
          autoClose: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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
      {/* Student Profile */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Thông tin cá nhân
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Mã sinh viên: {studentData?.id || user?.id || 'N/A'}
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Họ và tên</p>
                <p className="text-lg font-semibold text-gray-800">{studentData?.fullname || user?.fullname || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                <p className="text-lg font-semibold text-gray-800">{studentData?.phone || user?.phone || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg font-semibold text-gray-800">{studentData?.email || user?.email || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ngày sinh</p>
                <p className="text-lg font-semibold text-gray-800">
                  {studentData?.dob ? new Date(studentData.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">CCCD/CMND</p>
                <p className="text-lg font-semibold text-gray-800">{studentData?.cccd || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Điểm Reading/Listening</p>
                <p className="text-lg font-semibold text-gray-800">{studentData?.scoreRl || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Điểm Speaking/Writing</p>
                <p className="text-lg font-semibold text-gray-800">{studentData?.scoreSw || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Vai trò</p>
                <p className="text-lg font-semibold text-gray-800">{user?.role || 'STUDENT'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Parent Info */}
      {parentsData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              Thông tin phụ huynh
            </h2>
          </div>
          <div className="p-6">
            {parentsData.map((parent, index) => (
              <div key={parent.id} className={index > 0 ? "mt-6 pt-6 border-t border-gray-200" : ""}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Họ và tên phụ huynh</p>
                    <p className="text-lg font-semibold text-gray-800">{parent.fullname}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                    <p className="text-lg font-semibold text-gray-800">{parent.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg font-semibold text-gray-800">{parent.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};