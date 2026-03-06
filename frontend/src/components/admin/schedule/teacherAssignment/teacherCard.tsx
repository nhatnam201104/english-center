import { GripVertical } from "lucide-react";

const DAY_246 = ["MONDAY", "WEDNESDAY", "FRIDAY"];
const DAY_357 = ["TUESDAY", "THURSDAY", "SATURDAY"];

const DAY_LABELS: Record<string, string> = {
  MONDAY: "T2",
  TUESDAY: "T3",
  WEDNESDAY: "T4",
  THURSDAY: "T5",
  FRIDAY: "T6",
  SATURDAY: "T7",
  SUNDAY: "CN",
};

const getDayColor = (day: string) => {
  if (DAY_246.includes(day)) return "bg-blue-50 text-blue-700";
  if (DAY_357.includes(day)) return "bg-green-50 text-green-700";
  return "bg-gray-50 text-gray-700";
};

const TeacherCard = ({ teacher, onDragStart }: any) => {
  const days: string[] = teacher.days || [];
  const has246 = DAY_246.every((d) => days.includes(d));
  const has357 = DAY_357.every((d) => days.includes(d));

  return (
    <div
      draggable
      onDragStart={() => onDragStart(teacher)}
      className="p-4 rounded-xl border bg-white hover:border-blue-200 shadow-sm cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-[1.02]"
    >
      <div className="flex gap-3">
        <GripVertical className="w-4 h-4 text-gray-300 mt-1" />

        <img
          src={
            teacher.avatar
              ? teacher.avatar.startsWith('http')
                ? teacher.avatar
                : `${import.meta.env.VITE_FILE_URL}/uploads/teachers/${teacher.avatar}`
              : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                teacher.fullname
              )}`
          }
          alt={teacher.fullname}
          className="w-10 h-10 rounded-full"
        />

        <div className="flex-1">
          <div className="flex justify-between">
            <h4 className="text-sm font-bold">{teacher.fullname}</h4>
            <span className="text-[10px] bg-blue-50 px-2 rounded">
              {teacher.degree}
            </span>
          </div>

          {/* Schedule group badges */}
          {(has246 || has357) && (
            <div className="flex gap-1 mt-1.5">
              {has246 && (
                <span className="text-[9px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-semibold">
                  2-4-6
                </span>
              )}
              {has357 && (
                <span className="text-[9px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-semibold">
                  3-5-7
                </span>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-1 mt-2">
            {days.map((d: string) => (
              <span
                key={d}
                className={`text-[9px] px-2 py-0.5 rounded ${getDayColor(d)}`}
              >
                {DAY_LABELS[d] || d}
              </span>
            ))}
            {days.length === 0 && (
              <span className="text-[9px] text-gray-400 italic">
                Chưa đăng ký lịch rảnh
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;