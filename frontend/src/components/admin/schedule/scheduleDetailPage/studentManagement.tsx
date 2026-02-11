import { Users, Download, UserPlus } from "lucide-react";

const StudentManagement = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 flex justify-between items-center border-b border-slate-50">
        <div>
          <h2 className="font-bold text-slate-700">Quản lý học viên</h2>
          <p className="text-sm text-slate-400">
            Quản lý việc đăng ký và điểm danh cho khóa học này.
          </p>
        </div>

        <button className="text-blue-600 text-sm font-bold flex items-center gap-2">
          <Download size={16} /> Tải danh sách học viên
        </button>

        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
          <UserPlus size={18} /> Quản lý học viên
        </button>
      </div>

      <div className="py-20 flex flex-col items-center text-center">
        <Users size={32} className="text-slate-200 mb-4" />
        <h3 className="text-lg font-bold text-slate-700">
          Chưa có học sinh nào đăng ký.
        </h3>
      </div>
    </div>
  );
};

export default StudentManagement;
