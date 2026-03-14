import React from "react";
import { type ScheduleResponse } from "../../types/schedule/schedule.response";
import ProgressBar from "./ProgressBar";


interface Props {
  schedule: ScheduleResponse;
}

const InstructorCard: React.FC<Props> = ({ schedule }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-md shadow-gray-200/60 hover:shadow-lg transition-shadow duration-300 p-5">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Info */}
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-sm text-gray-500">Giảng viên</h3>
            <h3 className="font-bold text-gray-800">{schedule.teacher.fullname}</h3>
          </div>
        </div>

        {/* Progress + Button */}
        <div className="flex flex-col md:flex-row items-center gap-4 flex-1 justify-end">
          <ProgressBar
            startDate={schedule.startTime}
            endDate={schedule.endTime}
            current={schedule.totalRegister}
            max={schedule.totalSlot}
            isLocked={schedule.totalRegister >= schedule.totalSlot}
          />
        </div>
      </div>

      <div className="mt-4 border-t pt-4">
        <h4 className="text-xs font-bold text-gray-700 uppercase">
          Thời khóa biểu hàng tuần
        </h4>

        <div className="grid md:grid-cols-3 gap-3">
          {
            schedule.sessions?.length === 0 && Array.isArray(schedule.sessions) ? (
              <div className="text-sm text-gray-500 col-span-full text-center py-4">
                Không có lịch học nào được thiết lập cho lịch này.
              </div>
            ) : (
           schedule?.sessions?.map((s, i) => (
            <div
              key={s.id ?? i}
              className="bg-gray-50 rounded-lg p-3 flex gap-2"
            >
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 rounded">
                {s.day}
              </span>
              <span className="text-sm text-gray-600">
                {s.startTime} - {s.endTime}
              </span>
            </div>
          )))
        }
        </div>

      </div>
    </div>
  );
};

export default InstructorCard;
