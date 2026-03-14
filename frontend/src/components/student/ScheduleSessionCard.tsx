import { MapPin, Clock, User } from 'lucide-react';
import { AttendanceButton } from './AttendanceButton';

interface ScheduleSessionCardProps {
  className: string;
  time: string;
  classroom: string;
  building: string;
  teacherName?: string;
  dayOfWeek: string;
  sessionId: number;
  onCheckIn: (sessionId: number, qrCode: string) => Promise<void>;
  isCheckedIn: boolean;
}

export const ScheduleSessionCard = ({
  className,
  time,
  classroom,
  building,
  teacherName,
  dayOfWeek,
  sessionId,
  onCheckIn,
  isCheckedIn,
}: ScheduleSessionCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      {/* Header - Course Name Row */}
      <div className="mb-3">
        <h4 className="font-semibold text-gray-800 text-sm">{className}</h4>
      </div>

      {/* Attendance Button Row */}
      <div className="mb-3 flex justify-end">
        <AttendanceButton
          classStartTime={time.split('-')[0].trim()}
          classEndTime={time.split('-')[1].trim()}
          dayOfWeek={dayOfWeek}
          sessionId={sessionId}
          onCheckIn={onCheckIn}
          isCheckedIn={isCheckedIn}
        />
      </div>

      {/* Time */}
      <div className="flex items-center gap-2 mb-2">
        <Clock className="text-blue-600" size={16} />
        <span className="text-sm text-gray-600">{time}</span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="text-blue-600" size={16} />
        <span className="text-sm text-gray-600">
          {classroom}, {building}
        </span>
      </div>

      {/* Teacher */}
      {teacherName && (
        <div className="flex items-center gap-2">
          <User className="text-blue-600" size={16} />
          <span className="text-sm text-gray-600">{teacherName}</span>
        </div>
      )}
    </div>
  );
};