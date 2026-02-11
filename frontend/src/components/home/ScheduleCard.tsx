import { CalendarDays, Percent, Users } from "lucide-react";
import formatPrice from "../../helpers/formatPrice";
import { useNavigate } from "react-router";
import type { ScheduleResponse } from "../../types/schedule/schedule.response";
import formatDate from "../../helpers/formatDate";

const ScheduleCard: React.FC<{ schedule: ScheduleResponse }> = ({ schedule }) => {
  const navigate = useNavigate();
  const { course } = schedule;
  const discountedPrice = course.price - (course.price * course.sale) / 100;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-300 flex flex-col hover:shadow-2xl hover:-translate-y-2">
      {/* --- Image Section --- */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={`${import.meta.env.VITE_FILE_URL}/uploads/courses/${course.thumbnail}`}
          alt={course.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute inset-x-0 top-4 flex justify-between px-4 pointer-events-none">

          {/* Target Band */}
          {course.maxBand && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full 
            bg-gradient-to-r from-blue-600 to-indigo-600 
            text-white shadow-lg backdrop-blur-md">
              <span className="text-xs font-bold tracking-wide">TARGET</span>
              <span className="text-sm font-black">{course.maxBand}+</span>
            </div>
          )}

          {/* Sale Badge */}
          {course.sale > 0 && (
            <div className="px-3 py-1.5 rounded-full 
              bg-white/90 backdrop-blur-md 
              border border-red-200 shadow-lg 
              flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-red-500" />
              <span className="text-xs font-extrabold text-red-600">
                -{course.sale}%
              </span>
            </div>
          )}

        </div>

      </div>

      {/* --- Content Body --- */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category/Skill */}
        <p className="text-blue-600 text-sm font-black tracking-wider mb-2">
          {course.courseSkill?.replace('_', ' & ') || "TOEIC COURSE"}
        </p>

        <h3 className="text-lg font-bold text-gray-800 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {course.name}
        </h3>

        {/* Schedule Grid Info */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl mb-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-gray-500">
              <CalendarDays className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-wide">
                Khai giảng
              </span>
            </div>
            <span className="text-base font-semibold text-gray-700">
              {formatDate(schedule.startTime)}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 border-l border-gray-200 pl-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-wide">
                Sĩ số
              </span>
            </div>
            <span className="text-base font-semibold text-gray-700">
              {schedule.totalRegister}/{schedule.totalSlot}
              <span className="ml-1 text-xs text-gray-600 font-normal">
                học viên
              </span>
            </span>
          </div>
        </div>


        {/* Price Section */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            {course.sale > 0 && (
              <span className="text-red-200 text-sm line-through font-medium">
                {formatPrice(course.price)}
              </span>
            )}
            <span className="text-2xl font-extrabold text-red-600 tracking-tight">
              {formatPrice(discountedPrice)}
            </span>
          </div>


          <button
            onClick={() => navigate(`/course/${course.id}`)}
            className="bg-blue-50 text-blue-600 p-3 rounded-xl 
                      group-hover:bg-blue-600 group-hover:text-white 
                      transition-all duration-300"
          >
            Xem khóa học
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;