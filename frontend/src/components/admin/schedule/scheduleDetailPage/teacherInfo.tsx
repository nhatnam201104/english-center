import { Users, Mail } from "lucide-react";
import type { TeacherResponse } from "../../../../types/teacher/response";

const TeacherInfo = ({ teacher }: { teacher: TeacherResponse }) => {
  const avatar =
    teacher.avatar
      ? teacher.avatar.startsWith("http")
        ? teacher.avatar
        : `${import.meta.env.VITE_FILE_URL}/uploads/teachers/${teacher.avatar}`
      : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          teacher.fullname
        )}`;

  return (
    <div className="md:col-span-3 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-6 font-bold text-slate-700">
        <div className="bg-blue-600 p-1 rounded text-white">
          <Users size={16} />
        </div>
        <h2>Giáo viên được phân công</h2>
      </div>

      <div className="flex gap-6 items-start">
        <img
          src={avatar}
          alt={teacher.fullname}
          className="w-56 h-72 rounded-xl object-cover"
        />

        <div className="flex-1">
          <h3 className="text-2xl font-bold">{teacher.fullname}</h3>
          <p className="text-slate-400 text-sm flex items-center gap-1">
            <Mail size={14} />
            {teacher.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherInfo;
