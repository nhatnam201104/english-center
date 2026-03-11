import { UserPlus } from "lucide-react"; 
const AssignDropZone = ({
  assignedTeacher,
  isOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemove,
}: any) => {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`mt-12 border-2 border-dashed rounded-[32px] p-16 flex flex-col items-center justify-center text-center transition-all duration-300 ${
        isOver
          ? "border-blue-400 bg-blue-100/50 scale-[1.01] shadow-inner"
          : "border-blue-100 bg-blue-50/20"
      }`}
    >
      {assignedTeacher ? (
        <div className="animate-in fade-in zoom-in duration-300">
          <img
            src={
              assignedTeacher.avatar
                ? assignedTeacher.avatar.startsWith("http")
                  ? assignedTeacher.avatar
                  : `${import.meta.env.VITE_FILE_URL}/uploads/teachers/${assignedTeacher.avatar}`
                : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(assignedTeacher.fullname)}`
            }
            className="w-20 h-20 rounded-full mb-4 mx-auto border-2 border-white shadow-md object-cover"
            alt="Teacher"
          />
          <h3 className="text-xl font-extrabold text-slate-800">{assignedTeacher.fullname}</h3>
          <p className="text-sm font-medium text-gray-400 mb-4">
            {assignedTeacher.phone}
          </p>

          <button
            onClick={onRemove}
            className="px-4 py-1.5 bg-red-50 text-red-500 rounded-full text-xs font-bold hover:bg-red-100 transition-colors"
          >
            Remove Assignment
          </button>
        </div>
      ) : (
        <>
          {/* Icon Circle */}
          <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mb-6">
            <UserPlus className="w-10 h-10 text-blue-600 opacity-80" />
          </div>

          {/* Text Content */}
          <h3 className="text-2xl font-black text-slate-800 mb-3">Assign a Teacher</h3>
          <p className="text-sm text-gray-400 max-w-[300px] leading-relaxed mb-8 font-medium">
            Drag and drop a teacher from the directory to assign them to this course schedule.
          </p>

          {/* Info Tags */}
          <div className="flex gap-3">
            <span className="px-5 py-2 bg-white rounded-full text-[13px] font-bold text-slate-700 shadow-sm border border-gray-50">
              Monday - Wednesday - Friday
            </span>
            <span className="px-5 py-2 bg-white rounded-full text-[13px] font-bold text-slate-700 shadow-sm border border-gray-50">
              14:00 - 16:00
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default AssignDropZone;