import React from "react";
import formatDate from "../../helpers/formatDate";

interface ProgressBarProps {
  startDate: string;
  endDate: string;
  current: number;
  max: number;
  isLocked: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  startDate,
  endDate,
  current,
  max,
  isLocked,
}) => {
  const percentage = (current / max) * 100;

  return (
    <div className="w-full flex-1">
      <div className="flex justify-between text-lg text-gray-800 mb-1">
        <span>Khóa học bắt đầu từ {formatDate(startDate)} đến {formatDate(endDate)}</span>
        <span className={isLocked ? "text-gray-400" : "text-blue-600 font-bold"}>
          {current}/{max} slots
        </span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${isLocked ? "bg-gray-400" : "bg-blue-500"}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
