import { GripVertical } from "lucide-react";

const TeacherCard = ({ teacher, onDragStart }: any) => {
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

          {/* <p
            className={`text-[11px] mt-1 ${
              teacher.status === "Overlap"
                ? "text-red-500 flex gap-1 items-center"
                : "text-gray-400"
            }`}
          >
            {teacher.status === "Overlap" && (
              <AlertCircle className="w-3 h-3" />
            )}
            {teacher.title}
          </p> */}

          <div className="flex flex-wrap gap-1 mt-2">
            
            {teacher.days?.map((d: string) => (
              <span
                key={d}
                className="text-[9px] px-2 py-0.5 bg-red-50 text-red-800 rounded"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;