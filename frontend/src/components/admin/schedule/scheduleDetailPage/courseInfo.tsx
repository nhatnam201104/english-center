import { BookOpen, Tag } from "lucide-react";
import type { ScheduleResponse } from "../../../../types/schedule/schedule.response";

interface CourseInfoProps {
  schedule: ScheduleResponse;
}

const normalizeLabel = (value?: string) => {
  if (!value) return "N/A";

  if (value === "READING_LISTENING") return "Reading - Listening";
  if (value === "SPEAKING_WRITING") return "Speaking - Writing";
  if (value === "TEST_PREPARATION") return "Luyện thi";
  if (value === "COURSE") return "Khóa học";

  return value;
};

const CourseInfo = ({ schedule }: CourseInfoProps) => {
  return (
    <div className="md:col-span-3 bg-white rounded-xl border border-slate-100 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
        Thông tin khóa học
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg bg-blue-50 px-4 py-3">
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm mb-1">
            <BookOpen size={16} />
            Tên khóa học
          </div>
          <p className="text-slate-800 font-medium">{schedule.course?.name || "N/A"}</p>
        </div>

        <div className="rounded-lg bg-indigo-50 px-4 py-3">
          <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm mb-1">
            <Tag size={16} />
            Loại khóa
          </div>
          <p className="text-slate-800 font-medium">{normalizeLabel(schedule.course?.type)}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseInfo;
